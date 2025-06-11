"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getCookie, setCookie, deleteCookie } from 'cookies-next';
import { LoginInput } from '../models/LoginInputDTO';
import { API_PROD } from '../models/variables';

// Tipos
interface User {
  id?: string;
  email?: string;
  name?: string;
  token?: string;
  [key: string]: any; // Permite propiedades adicionales
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  handleLogin: (loginInput: LoginInput) => Promise<any>;
  logout: () => void;
  updateUser: (userData: User) => void;
  checkAuthStatus: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | null>(null);

// Hook personalizado para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Provider del contexto
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar si hay un usuario autenticado al cargar la aplicación
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const userData = getCookie("data");
      if (userData && typeof userData === 'string') {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Error al verificar el estado de autenticación:", error);
      // Si hay error al parsear, limpiar la cookie
      deleteCookie("data");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (loginInput: LoginInput) => {
    try {
      console.log("Enviando login request:", loginInput); // Debug
      
      const response = await fetch(`${API_PROD}/auth/users`, {
        headers: {
          "Content-Type": "application/json"
        },
        method: "POST",
        body: JSON.stringify(loginInput)
      });

      console.log("Response status:", response.status); // Debug

      const dataResponse = await response.json();
      console.log("Response data:", dataResponse); // Debug

      if (!response.ok) {
        // Si el servidor responde con error, lanzar excepción con el mensaje del servidor
        const errorMessage = dataResponse.message || dataResponse.error || `Error HTTP: ${response.status}`;
        throw new Error(errorMessage);
      }

      // Login exitoso - actualizar el estado
      if (dataResponse) {
        // Ser más flexible con la estructura de respuesta
        const userData = dataResponse.user || dataResponse.data || dataResponse;
        
        console.log("UserData to save:", userData); // Debug
        
        // Guardar los datos sin importar la estructura exacta
        setUser(userData);
        setIsAuthenticated(true);
        setCookie("data", JSON.stringify(userData));
      }
      
      return dataResponse;
    } catch (error: any) {
      console.error("ERROR SERVER HANDLE LOGIN:", error);
      
      // Si es un error de red o fetch
      if (error.name === 'TypeError' || error.message.includes('fetch')) {
        throw new Error("Error de conexión. Verifica tu internet");
      }
      
      // Re-lanzar el error para que el componente pueda manejarlo
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    deleteCookie("data");
    window.location.href = '/';
  };

  const updateUser = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    setCookie("data", JSON.stringify(userData));
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    handleLogin,
    logout,
    updateUser,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};