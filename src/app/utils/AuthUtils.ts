// utils/authUtils.ts
import { useState } from "react";
import Cookies from 'js-cookie';

// ============= INTERFACES =============
export interface AuthTokenData {
  token: string;
  user?: any;
  expiresAt?: string;
}

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiRequestOptions {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
}

// ============= AUTH UTILITIES =============

/**
 * Obtiene el token de autenticación desde localStorage o cookies
 * Prioriza localStorage por ser más moderno y persistente
 */
export const getAuthToken = (): string | null => {
  try {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') {
      return null;
    }

    // Priorizar localStorage (más moderno y persistente)
    const localToken = localStorage.getItem('token');
    if (localToken) {
      return localToken;
    }

    // Fallback a cookies
    const cookieData = Cookies.get("data");
    if (cookieData) {
      const parsedData = JSON.parse(cookieData);
      return parsedData[0]?.token || parsedData.token || null;
    }

    return null;
  } catch (error) {
    console.error('Error obteniendo token:', error);
    return null;
  }
};

/**
 * Obtiene los datos completos del usuario autenticado
 */
export const getAuthUser = (): any | null => {
  try {
    if (typeof window === 'undefined') {
      return null;
    }

    // Desde localStorage
    const localUser = localStorage.getItem('user');
    if (localUser) {
      return JSON.parse(localUser);
    }

    // Desde cookies
    const cookieData = Cookies.get("data");
    if (cookieData) {
      const parsedData = JSON.parse(cookieData);
      return parsedData[0]?.user || parsedData.user || null;
    }

    return null;
  } catch (error) {
    console.error('Error obteniendo usuario:', error);
    return null;
  }
};

/**
 * Genera headers de autenticación con token automático
 */
export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    "Accept": "application/json",
    ...(token && { "Authorization": `Bearer ${token}` })
  };
};

/**
 * Verifica si el usuario está autenticado
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Limpia todos los datos de autenticación
 */
export const clearAuth = (): void => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      Cookies.remove('data');
    }
  } catch (error) {
    console.error('Error limpiando autenticación:', error);
  }
};

/**
 * Guarda los datos de autenticación en localStorage y cookies
 */
export const saveAuth = (token: string, user?: any): void => {
  try {
    if (typeof window !== 'undefined') {
      // Guardar en localStorage
      localStorage.setItem('authToken', token);
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
      }

      // Guardar en cookies para compatibilidad
      const cookieData = [{
        token,
        user: user || null
      }];
      Cookies.set('data', JSON.stringify(cookieData), { 
        expires: 7, // 7 días
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict'
      });
    }
  } catch (error) {
    console.error('Error guardando autenticación:', error);
  }
};

/**
 * Verifica si el token está próximo a expirar
 * @param minutesThreshold Minutos antes de la expiración para considerar "próximo"
 */
export const isTokenExpiringSoon = (minutesThreshold: number = 10): boolean => {
  try {
    const token = getAuthToken();
    if (!token) return true;

    // Decodificar JWT para obtener exp (si es JWT)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return false;

    const payload = JSON.parse(atob(tokenParts[1]));
    if (!payload.exp) return false;

    const expirationTime = payload.exp * 1000; // Convertir a millisegundos
    const currentTime = Date.now();
    const thresholdTime = minutesThreshold * 60 * 1000;

    return (expirationTime - currentTime) <= thresholdTime;
  } catch (error) {
    console.error('Error verificando expiración del token:', error);
    return true;
  }
};

// ============= API REQUEST HOOK =============

/**
 * Hook para realizar peticiones HTTP con manejo automático de autenticación,
 * errores, reintentos y timeouts
 */
export const useApiRequest = <T>(options: UseApiRequestOptions = {}) => {
  const { timeout = 10000, retries = 1, retryDelay = 1000 } = options;
  
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null
  });

  const makeRequest = async (
    url: string,
    config: RequestInit = {},
    customTimeout?: number
  ): Promise<T | null> => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    let attempt = 0;
    const maxAttempts = retries + 1;

    while (attempt < maxAttempts) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), customTimeout || timeout);

        const response = await fetch(url, {
          ...config,
          headers: {
            ...getAuthHeaders(),
            ...config.headers
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorMessage = `Error del servidor (${response.status})`;
          
          switch (response.status) {
            case 400:
              errorMessage = 'Solicitud inválida';
              break;
            case 401:
              errorMessage = 'No autorizado. Por favor inicia sesión nuevamente.';
              clearAuth(); // Limpiar token inválido
              // Opcional: redirigir al login
              if (typeof window !== 'undefined') {
                window.location.href = '/';
              }
              break;
            case 403:
              errorMessage = 'Acceso denegado';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 422:
              errorMessage = 'Datos inválidos';
              break;
            case 429:
              errorMessage = 'Demasiadas solicitudes. Intenta más tarde.';
              break;
            case 500:
              errorMessage = 'Error interno del servidor';
              break;
            case 502:
            case 503:
            case 504:
              errorMessage = 'Servicio temporalmente no disponible';
              break;
          }

          // Intentar obtener mensaje del servidor
          try {
            const errorData = await response.json();
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            console.warn('No se pudo parsear error del servidor');
          }

          throw new Error(errorMessage);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Respuesta del servidor inválida');
        }

        const data = await response.json();
        setState({ data, loading: false, error: null });
        return data;

      } catch (error: any) {
        attempt++;
        console.error(`Intento ${attempt} falló:`, error);

        if (error.name === 'AbortError') {
          const timeoutError = 'Tiempo de espera agotado';
          setState({ data: null, loading: false, error: timeoutError });
          throw new Error(timeoutError);
        }

        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          const networkError = 'Error de conexión. Verifica tu conexión a internet.';
          setState({ data: null, loading: false, error: networkError });
          throw new Error(networkError);
        }

        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
        } else {
          setState({ data: null, loading: false, error: error.message });
          throw error;
        }
      }
    }

    return null;
  };

  /**
   * Resetea el estado del hook
   */
  const reset = () => {
    setState({
      data: null,
      loading: false,
      error: null
    });
  };

  return { 
    ...state, 
    makeRequest,
    reset
  };
};

// ============= HELPER FUNCTIONS =============

/**
 * Función helper para peticiones GET simples
 */
export const apiGet = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
    method: 'GET'
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Función helper para peticiones POST simples
 */
export const apiPost = async <T>(url: string, data: any): Promise<T> => {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
    method: 'POST',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Función helper para peticiones PUT simples
 */
export const apiPut = async <T>(url: string, data: any): Promise<T> => {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
    method: 'PUT',
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Función helper para peticiones DELETE simples
 */
export const apiDelete = async <T>(url: string): Promise<T> => {
  const response = await fetch(url, {
    headers: getAuthHeaders(),
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};