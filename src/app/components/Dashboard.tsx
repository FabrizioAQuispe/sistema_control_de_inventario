import Link from 'next/link'
import React from 'react'

export const Dashboard = () => {
    return (
        <nav className='bg-blue-700 w-[200px] h-screen px-5 py-10'>
            <h2 className='text-2xl text-white text-center mb-6'>Control de Inventario</h2>
            <ul className='space-y-2'>
                <li><Link className='px-2 py-2 block text-white hover:bg-indigo-800 rounded-md' href={'/admin'}>Inicio</Link></li>
                <li><Link className='px-2 py-2 block text-white hover:bg-indigo-800 rounded-md' href={'/admin/Productos'}>Productos</Link></li>
                <li><Link className='px-2 py-2 block text-white hover:bg-indigo-800 rounded-md' href={'/admin/Mantenimiento'}>Mantenimiento</Link></li>
                <li><Link className='px-2 py-2 block text-white hover:bg-indigo-800 rounded-md' href={'/admin/Movimientos'}>Movimientos</Link></li>
                <li><Link className='px-2 py-2 block text-white hover:bg-indigo-800 rounded-md' href={'/'}>Cerrar Sessión</Link></li>
            </ul>
        </nav>
    )
}
