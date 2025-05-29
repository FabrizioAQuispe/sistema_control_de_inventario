"use client"
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex justify-center items-center text-white">
      <div className="bg-blue-950 flex flex-col gap-4 justify-center w-[750px] px-4 py-6">
        <h2 className="text-center text-2xl">Sistema Control de Inventario</h2>
        <label htmlFor="">Ingresa tu correo: </label>
        <input type="text" name="email" id="" />
        <label htmlFor="">Ingresa tu contraseña: </label>
        <input type="password" name="password" id="" />
        <Link href={'/admin'} className="bg-blue-700 text-white px-4 py-2 text-center">
          Ingresar
        </Link>
      </div>
    </main>
  );
}
