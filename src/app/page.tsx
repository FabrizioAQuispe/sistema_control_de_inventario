"use client"
import Link from "next/link";
import { useAuth } from "@/app/provider/ContextProvider"; // Ajusta la ruta según tu estructura
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { handleLogin, isLoading } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [loginLoading, setLoginLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchData = async () => {
    // Validación básica
    if (!formData.email || !formData.password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoginLoading(true);
    setError(null);

    try {
      const dataResponse = await handleLogin(formData);
      
      // Verificar si el login fue exitoso
      if (dataResponse) {
        // Dar un pequeño delay para que el estado se actualice
        setTimeout(() => {
          router.push('/admin/Inicio');
        }, 100);
      } else {
        setError("Credenciales inválidas");
      }
      
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      setError(error.message || "Error al iniciar sesión. Verifica tus credenciales.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFetchData();
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-4">
      <div className="bg-blue-950 bg-opacity-90 rounded-lg shadow-lg flex flex-col gap-6 w-full max-w-md p-8">
        <h2 className="text-white text-3xl font-semibold text-center mb-4">
          Sistema Control de Inventario
        </h2>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="email" className="text-white font-medium block mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="ejemplo@correo.com"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({...prev, email: e.target.value}))}
              disabled={loginLoading}
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-blue-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="text-white font-medium block mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({...prev, password: e.target.value}))}
              disabled={loginLoading}
              className="w-full px-4 py-2 rounded-md border border-gray-600 bg-blue-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              required
            />
          </div>

          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-200 px-4 py-2 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loginLoading || isLoading}
            className="mt-6 bg-blue-700 hover:bg-blue-800 transition-colors text-white font-semibold text-center rounded-md py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loginLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Ingresando...
              </>
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </main>
  );
}