"use client"
import Link from "next/link";
import useUser from "./hooks/useUser";
import { useState } from "react";
import { setCookie } from "cookies-next";

export default function Home() {

  const {handleLogin} = useUser();

  const [formData,setFormData] = useState({
    email:"",
    password:""
  });

  const handleFetchData = async () => {
    try {
      const dataResponse = await handleLogin(formData);
      if (!dataResponse) {
        window.location.href = '/'
      }
      setCookie("data",dataResponse);
      window.location.href = '/admin'
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
    }
  };

  return (
<main className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-900 to-blue-700 p-4">
  <div className="bg-blue-950 bg-opacity-90 rounded-lg shadow-lg flex flex-col gap-6 w-full max-w-md p-8">
    <h2 className="text-white text-3xl font-semibold text-center mb-4">Sistema Control de Inventario</h2>
    
    <label htmlFor="email" className="text-white font-medium">Correo electrónico</label>
    <input
      type="email"
      name="email"
      id="email"
      placeholder="ejemplo@correo.com"
      onChange={(e) => setFormData(prev => ({...prev,email: e.target.value}))}
      className="px-4 py-2 rounded-md border border-gray-600 bg-blue-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <label htmlFor="password" className="text-white font-medium">Contraseña</label>
    <input
      type="password"
      name="password"
      id="password"
      placeholder="••••••••"
      onChange={(e) => setFormData(prev => ({...prev,password: e.target.value}))}
      className="px-4 py-2 rounded-md border border-gray-600 bg-blue-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />

    <Link
      href="/admin"
      className="mt-6 bg-blue-700 hover:bg-blue-800 transition-colors text-white font-semibold text-center rounded-md py-3"
      onClick={(e) => {
        e.preventDefault();
        handleFetchData();
      }}
    >
      Ingresar
    </Link>
  </div>
</main>


  );
}
