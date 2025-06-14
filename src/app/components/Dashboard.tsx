"use client"
import Link from 'next/link'
import React from 'react'
import { deleteCookie } from 'cookies-next'
import { SlLogout } from "react-icons/sl";
import { IoHomeOutline } from "react-icons/io5";
import { FaBoxOpen } from "react-icons/fa";
import { SiGoogleearthengine } from "react-icons/si";
import { MdRemoveRedEye } from "react-icons/md";
import { cookieParse } from '../provider/CookiesData';


export const Dashboard = () => {
    const nombre = cookieParse[0].nombre_usuario;
    
    return (
<nav className='bg-gradient-to-b from-slate-900 to-slate-800 w-[280px] h-screen flex flex-col shadow-2xl border-r border-slate-700'>
    {/* Header */}
    <div className='px-6 py-8 border-b border-slate-700'>
        <div className='flex items-center gap-3 mb-4'>
            <div className='w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center'>
                <FaBoxOpen className='text-white text-lg'/>
            </div>
            <div>
                <h2 className='text-lg font-bold text-white'>Control de</h2>
                <h2 className='text-lg font-bold text-blue-400'>Inventario</h2>
            </div>
        </div>
        
        {/* User Profile */}
        <div className='bg-slate-800/50 rounded-lg p-3 border border-slate-600'>
            <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center'>
                    <span className='text-white text-sm font-semibold'>
                        {nombre?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                </div>
                <div>
                    <p className='text-xs text-slate-400'>Bienvenido</p>
                    <p className='text-sm font-medium text-white truncate max-w-[140px]'>{nombre}</p>
                </div>
            </div>
        </div>
    </div>

    {/* Navigation Links */}
    <div className='flex-1 px-4 py-6'>
        <div className='space-y-2'>
            <Link 
                className='group flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600' 
                href={'/admin/Inicio'}
            >
                <IoHomeOutline className='text-lg group-hover:text-blue-400 transition-colors'/>
                <span className='font-medium'>Inicio</span>
            </Link>

            <Link 
                className='group flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600' 
                href={'/admin/Productos'}
            >
                <FaBoxOpen className='text-lg group-hover:text-blue-400 transition-colors'/>
                <span className='font-medium'>Productos</span>
            </Link>

            <Link 
                className='group flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600' 
                href={'/admin/Mantenimiento'}
            >
                <SiGoogleearthengine className='text-lg group-hover:text-blue-400 transition-colors'/>
                <span className='font-medium'>Mantenimiento</span>
            </Link>

            <Link 
                className='group flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600' 
                href={'/admin/Movimientos'}
            >
                <MdRemoveRedEye className='text-lg group-hover:text-blue-400 transition-colors'/>
                <span className='font-medium'>Movimientos</span>
            </Link>
        </div>
    </div>

    {/* Logout Button */}
    <div className='px-4 pb-6 border-t border-slate-700 pt-4'>
        <button 
            className='group w-full flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-red-600/20 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/30'
            onClick={() => {
                deleteCookie("data");
                window.location.href = '/';
            }}
        >
            <SlLogout className='text-lg group-hover:text-red-400 transition-colors'/>
            <span className='font-medium'>Cerrar Sesión</span>
        </button>
    </div>
</nav>
    )
}
