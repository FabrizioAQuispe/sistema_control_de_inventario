import Link from 'next/link'
import React from 'react'

const Productos = () => {
  return (
    <section className='grid grid-cols gap-2 px-4 py-6'>
      <h2 className='text-2xl'>Productos</h2>
      {/* SECCIÓN PARA EL FORMULARIO */}
      <div>
        <form className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col'>
            <label htmlFor="">Ingresa el nombre: </label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text" name="nombre" id="" />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="">Ingresa la descripcion</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text" name="descripcion" id="" />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="">Ingresa la categoría</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text" name="categoria" id="" />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="">Ingrese la referencia</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text" name="referencia" id="" />
          </div>
        </form>
        <button className='bg-blue-900 text-white px-4 block py-2 w-[200px] mt-4 rounded-md cursor-pointer'>REGISTRAR</button>
      </div>
      {/* SECCIÓN PARA LAS TABLAS */}
      <table className='min-w-full border border-gray-200 shadow-sm rounded-md overflow-hidden mt-2'>
        <thead className='bg-gray-100 text-gray-700 text-left'>
          <tr>
            <th className='px-4 py-2 border-b'>Nombre</th>
            <th className='px-4 py-2 border-b'>Descripcion</th>
            <th className='px-4 py-2 border-b'>Categoria</th>
            <th className='px-4 py-2 border-b'>Referencia</th>
            <th className='px-4 py-2 border-b'>Acciones</th>
          </tr>
        </thead>
        <tbody className='text-sm text-gray-800'>
          <tr className='hover:bg-gray-50 transition-colors'>
            <td className='px-4 py-2 border-b'>Ejemplo de Nombre</td>
            <td className='px-4 py-2 border-b'>Ejemplo de Descripcion</td>
            <td className='px-4 py-2 border-b'>Ejemplo de Categoría</td>
            <td className='px-4 py-2 border-b'>Ejemplo de Referencia</td>
            <td className='px-4 py-2 border-b'>
              <Link className='px-2 py-2' href={'/admin/Productos'}>Editar</Link>
              <Link className='px-2 py-2' href={'/admin/Productos'}>Eliminar</Link>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default Productos