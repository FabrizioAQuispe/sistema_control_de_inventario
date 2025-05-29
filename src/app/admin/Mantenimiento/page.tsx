import Link from 'next/link'
import React from 'react'

const Mantenimiento = () => {
  return (
    <section className='grid grid-cols gap-2 px-4 py-6'>
      <h2 className='text-2xl'>Mantenimiento</h2>
      {/* SECCIÓN PARA EL FORMULARIO */}
      <div>
        <form action="" className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col'>
            <label htmlFor="">Ingrese el nombre: </label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text" name="" id="" />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="">Ingrese la cantidad</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text" name="" id="" />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="">Ingrese la fecha de ingreso</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="date" name="" id="" />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="">Ingrese la cantidad</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="number" name="" id="" />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="">Ingrese el estado</label>
            <select name="" id="">
              <option value="">Seleccione un estado: </option>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>
          </div>
          <button className='bg-blue-900 text-white'>AGREGAR</button>
        </form>
      </div>

      {/* SECCIÓN PARA LAS TABLAS */}
            <table className='min-w-full border border-gray-200 shadow-sm rounded-md overflow-hidden mt-2'>
        <thead className='bg-gray-100 text-gray-700 text-left'>
          <tr>
            <th className='px-4 py-2 border-b'>Nombre</th>
            <th className='px-4 py-2 border-b'>Descripcion</th>
            <th className='px-4 py-2 border-b'>Cantidad</th>
            <th className='px-4 py-2 border-b'>Categoria</th>
            <th className='px-4 py-2 border-b'>Referencia</th>
            <th className='px-4 py-2 border-b'>Tipo I/S</th>
            <th className='px-4 py-2 border-b'>Acciones</th>
          </tr>
        </thead>
        <tbody className='text-sm text-gray-800'>
          <tr className='hover:bg-gray-50 transition-colors'>
            <td className='px-4 py-2 border-b'>Ejemplo de Nombre</td>
            <td className='px-4 py-2 border-b'>Ejemplo de Descripcion</td>
            <td className='px-4 py-2 border-b'>20</td>
            <td className='px-4 py-2 border-b'>Ejemplo de Categoría</td>
            <td className='px-4 py-2 border-b'>Ejemplo de Referencia</td>
            <td className='px-4 py-2 border-b'>Ingreso</td>
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

export default Mantenimiento