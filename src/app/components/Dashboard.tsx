"use client"
import Link from 'next/link'
import React from 'react'
import { deleteCookie } from 'cookies-next'
import { SlLogout } from "react-icons/sl";
import { IoHomeOutline } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";
import { SiGoogleearthengine } from "react-icons/si";
import { MdRemoveRedEye } from "react-icons/md";




export const Dashboard = () => {
    return (
        <nav className='bg-blue-700 w-[300px] h-screen px-5 py-10'>
            <h2 className='text-2xl text-white text-center mb-6'>Sistema de Control de Inventario</h2>
            <ul className='space-y-2'>
                <li><Link className='flex items-center gap-2 px-2 py-2  text-white hover:bg-indigo-800 rounded-md' href={'/admin/Inicio'}><IoHomeOutline/> Inicio</Link></li>
                <li><Link className='flex items-center gap-2 px-2 py-2  text-white hover:bg-indigo-800 rounded-md' href={'/admin/Productos'}> <FaBoxOpen/> Productos</Link></li>
                <li><Link className='flex items-center gap-2 px-2 py-2  text-white hover:bg-indigo-800 rounded-md' href={'/admin/Mantenimiento'}><SiGoogleearthengine/> Mantenimiento</Link></li>
                <li><Link className='flex items-center gap-2 px-2 py-2  text-white hover:bg-indigo-800 rounded-md' href={'/admin/Movimientos'}><MdRemoveRedEye/> Movimientos</Link></li>
                <li><a 
                className='flex gap-2 items-center px-2 py-2  text-white mt-130 text-3xl text-center hover:bg-red-800 rounded-md cursor-pointer'
                onClick={() => {
                    deleteCookie("data")
                    window.location.href = '/'
                }}
                > <SlLogout/> Cerrar Sessión</a></li>
            </ul>
        </nav>
    )
}
