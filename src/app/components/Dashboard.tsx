"use client"
import { deleteCookie } from 'cookies-next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaBoxOpen } from 'react-icons/fa';
import { IoHomeOutline } from 'react-icons/io5';
import { MdRemoveRedEye } from 'react-icons/md';
import { SiGoogleearthengine } from 'react-icons/si';
import { SlLogout } from 'react-icons/sl';
import { cookieParse } from '../provider/CookiesData';
import useProductos from '../hooks/useProductos';

const Dashboard = () => {
    const [isOpen, setIsOpen] = useState(false);
    const nombre = cookieParse[0].nombre_usuario;


  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='lg:hidden fixed top-4 left-4 z-50 p-2 bg-slate-800 text-white rounded-lg shadow-lg border border-slate-600'
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40'
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Navigation */}
      <nav className={`
        bg-gradient-to-b from-slate-900 to-slate-800 h-screen flex flex-col shadow-2xl border-r border-slate-700
        fixed lg:static top-0 left-0 z-40
        w-[280px] lg:w-[280px]
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
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
              onClick={() => setIsOpen(false)}
            >
              <IoHomeOutline className='text-lg group-hover:text-blue-400 transition-colors'/>
              <span className='font-medium'>Inicio</span>
            </Link>

            <Link 
              className='group flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600' 
              href={'/admin/Productos'}
              onClick={() => setIsOpen(false)}
            >
              <FaBoxOpen className='text-lg group-hover:text-blue-400 transition-colors'/>
              <span className='font-medium'>Productos</span>
            </Link>

            <Link 
              className='group flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600' 
              href={'/admin/Mantenimiento'}
              onClick={() => setIsOpen(false)}
            >
              <SiGoogleearthengine className='text-lg group-hover:text-blue-400 transition-colors'/>
              <span className='font-medium'>Mantenimiento</span>
            </Link>

            <Link 
              className='group flex items-center gap-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 border border-transparent hover:border-slate-600' 
              href={'/admin/Movimientos'}
              onClick={() => setIsOpen(false)}
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
    </>
  );
};

export default Dashboard;