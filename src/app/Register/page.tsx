"use client";
import React, { useState } from 'react'
import useUser from '../hooks/useUser'

const Register = () => {

  const [formRegister, setFormRegister] = useState({
    usuario_id: 0,
    nombre_usuario: "",
    email: "",
    password: "",
    rol_id: 0
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { handleRegister } = useUser();

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const { name, value } = e.target;
  setFormRegister(prev => ({
    ...prev,
    [name]: value
  }));
}

  return (

      <div className="min-h-screen bg-background flex items-center justify-center p-4" style={{ backgroundColor: 'hsl(0 0% 98%)' }}>
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold tracking-tight mb-2" style={{ color: 'hsl(0 0% 3.9%)' }}>
              Crea una cuenta
            </h1>

          </div>

          {/* Form Container */}
          <div className="border rounded-lg p-6 bg-card shadow-sm" style={{
            backgroundColor: 'hsl(0 0% 100%)',
            borderColor: 'hsl(0 0% 89.8%)'
          }}>
            <div className="space-y-4">
              {/* Username Field */}
              <div className="space-y-2">
                <label
                  htmlFor="nombre_usuario"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  style={{ color: 'hsl(0 0% 3.9%)' }}
                >
                  Nombre de Usuario
                </label>
                <input
                  id="nombre_usuario"
                  name="nombre_usuario"
                  type="text"
                  placeholder="Enter your username"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: 'hsl(0 0% 100%)',
                    borderColor: 'hsl(0 0% 89.8%)',
                    color: 'hsl(0 0% 3.9%)'
                  }}
                  value={formRegister.nombre_usuario}
                  onChange={handleChange}
                />
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  style={{ color: 'hsl(0 0% 3.9%)' }}
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="name@example.com"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: 'hsl(0 0% 100%)',
                    borderColor: 'hsl(0 0% 89.8%)',
                    color: 'hsl(0 0% 3.9%)'
                  }}
                  value={formRegister.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  style={{ color: 'hsl(0 0% 3.9%)' }}
                >
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: 'hsl(0 0% 100%)',
                    borderColor: 'hsl(0 0% 89.8%)',
                    color: 'hsl(0 0% 3.9%)'
                  }}
                  value={formRegister.password}
                  onChange={handleChange}
                />
              </div>

              {/* Role Field */}
              <div className="space-y-2">
                <label
                  htmlFor="rol_id"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  style={{ color: 'hsl(0 0% 3.9%)' }}
                >
                  Role
                </label>
                <select
                  id="rol_id"
                  name="rol_id"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  style={{
                    backgroundColor: 'hsl(0 0% 100%)',
                    borderColor: 'hsl(0 0% 89.8%)',
                    color: 'hsl(0 0% 3.9%)'
                  }}
                  value={formRegister.rol_id}
                  onChange={handleChange}
                >
                  <option value="">Select a role</option>
                  <option value="1">Administrator</option>
                  <option value="2">User</option>
                  <option value="3">Moderator</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full"
                style={{
                  backgroundColor: 'hsl(0 0% 9%)',
                  color: 'hsl(0 0% 98%)'
                }}
                onClick={() => handleRegister(formRegister)}
              > 
                Crear Cuenta
              </button>

            </div>

            {/* Login Link */}
            <div className="mt-6 text-center text-sm">
              <span style={{ color: 'hsl(0 0% 45.1%)' }}>
                ¿Tienes una cuenta?{' '}
              </span>
              <a
                href="/"
                className="underline underline-offset-4 hover:text-primary"
                style={{ color: 'hsl(0 0% 9%)' }}
              >
                Inciar Sessión
              </a>
            </div>
          </div>
        </div>
      </div>

    )
  }

  export default Register