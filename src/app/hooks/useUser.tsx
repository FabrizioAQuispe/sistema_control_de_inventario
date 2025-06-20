import React from 'react'
import { LoginInput } from '../models/LoginInputDTO'
import { API_PROD } from '../models/variables';
import Cookies from 'js-cookie';
import { RegisterDTO } from '../models/RegisterDTO';


interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
  data?: any;
}

const useUser = () => {

    const cookieProfile = typeof window !== 'undefined' ? Cookies.get("data") : null;
    const cookieParse = cookieProfile ? JSON.parse(cookieProfile) : [];

const handleLogin = async (loginInput: LoginInput): Promise<LoginResponse> => {
  try {
    // Validar entrada
    if (!loginInput.email || !loginInput.password) {
      throw new Error('Email y contraseña son requeridos');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 segundos timeout

    const response = await fetch(`${API_PROD}/auth/users`, {
      headers: {
        "Content-Type": "application/json",
        // Agregar headers adicionales si es necesario
        "Accept": "application/json",
      },
      method: "POST",
      body: JSON.stringify(loginInput),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Manejo de errores HTTP más detallado
    if (!response.ok) {
      let errorMessage = 'Error en el servidor';
      
      switch (response.status) {
        case 400:
          errorMessage = 'Datos inválidos. Verifica tu email y contraseña.';
          break;
        case 401:
          errorMessage = 'Credenciales incorrectas.';
          break;
        case 403:
          errorMessage = 'Acceso denegado.';
          break;
        case 404:
          errorMessage = 'Servicio no encontrado.';
          break;
        case 422:
          errorMessage = 'Formato de datos incorrecto.';
          break;
        case 429:
          errorMessage = 'Demasiados intentos. Intenta más tarde.';
          break;
        case 500:
          errorMessage = 'Error interno del servidor.';
          break;
        case 502:
        case 503:
        case 504:
          errorMessage = 'Servicio temporalmente no disponible.';
          break;
        default:
          errorMessage = `Error del servidor (${response.status})`;
      }

      console.error(`ERROR RESPONSE HANDLE LOGIN: ${response.status} - ${response.statusText}`);
      
      // Intentar obtener mensaje de error del servidor
      try {
        const errorData = await response.json();
        if (errorData.message) {
          errorMessage = errorData.message;
        }
      } catch (parseError) {
        console.error('Error parsing error response:', parseError);
      }

      throw new Error(errorMessage);
    }

    // Verificar si la respuesta es JSON válido
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Respuesta del servidor inválida');
    }

    const dataResponse = await response.json();

    // Validar estructura de respuesta
    if (!dataResponse) {
      throw new Error('Respuesta vacía del servidor');
    }

    // Normalizar respuesta para diferentes formatos de API
    const normalizedResponse: LoginResponse = {
      success: dataResponse.success ?? (dataResponse.token ? true : false),
      message: dataResponse.message,
      token: dataResponse.token || dataResponse.accessToken,
      user: dataResponse.user || dataResponse.data?.user,
      data: dataResponse.data || dataResponse
    };

    // Guardar token en localStorage si está presente
    if (normalizedResponse.token) {
      try {
        localStorage.setItem('authToken', normalizedResponse.token);
        localStorage.setItem('user', JSON.stringify(normalizedResponse.user));
      } catch (storageError) {
        console.warn('No se pudo guardar en localStorage:', storageError);
      }
    }

    console.log('Login exitoso:', normalizedResponse);
    return normalizedResponse;

  } catch (error: any) {
    console.error("ERROR SERVER HANDLE LOGIN:", error);

    // Manejo específico de errores de red
    if (error.name === 'AbortError') {
      throw new Error('Tiempo de espera agotado. Verifica tu conexión.');
    }
    
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Error de conexión. Verifica tu conexión a internet.');
    }

    // Re-lanzar el error para que sea manejado por el componente
    throw error;
  }
};

    const handleRegister = async (registerInput:RegisterDTO) => {
        try{
            const response = await fetch(`${API_PROD}/auth/register`,{
                headers:{
                    "Content-Type" : "application/json"
                },
                method: "POST",
                body:JSON.stringify(registerInput)
            });

            if(!response.ok){
                console.error("ERROOR RESPONSE HANDLE REGISTER");
            }

            const dataResponse = await response.json();
            return dataResponse;
        }catch(error:any){
            console.error("ERROR SERVER API HANDLE REGISTER: " + error);
            throw error;
        }
    }



    return {
        handleLogin,
        handleRegister,
    }
}

export default useUser