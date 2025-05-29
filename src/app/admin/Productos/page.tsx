"use client"
import useProductos from '@/app/hooks/useProductos';
import { ProductosDTO } from '@/app/models/ProductsDTO';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Productos = () => {
  const [formData, setFormData] = useState({
    "id_prod": 0,
    "nombre": "",
    "descripcion": "",
    "categoria": "",
    "referencia": "",
    "estado": "",
    "tipo": ""
  });

  const [listProducts, setListProducts] = useState<ProductosDTO[]>([]);


  //Hooks para los productos
  const { handleCreateProductos, handleGetProductos } = useProductos();

  useEffect(() => {
    const fetchData = async () => {
      const data = await handleGetProductos();
      if (data) setListProducts(data);
    };

    fetchData();
  }, [])

  return (
    <section className='grid grid-cols gap-2 px-4 py-6'>
      <h2 className='text-2xl'>Productos</h2>
      {/* SECCIÓN PARA EL FORMULARIO */}
      <div>
        <form className='grid grid-cols-2 gap-2' onSubmit={() => handleCreateProductos(formData)}>
          <div className='flex flex-col'>
            <label htmlFor="">Ingresa el nombre: </label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text" name="nombre" id=""
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor="">Ingresa la categoría</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text" name="categoria" id=""
              onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
            />
          </div>
          <div className='flex flex-col'>
            <label htmlFor="">Ingrese la referencia</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text" name="referencia" id=""
              onChange={(e) => setFormData(prev => ({ ...prev, referencia: e.target.value }))}
            />
          </div>

          <div className='flex flex-col'>
            <label>Ingrese el estado</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
              className='px-2 py-2 border border-blue-700 outline rounded-md mb-2'
            >
              <option value="">Seleccione un estado: </option>
              <option value="1">Activo</option>
              <option value="0">Inactivo</option>
            </select>          </div>

          <div className='flex flex-col'>
            <label>Ingrese el Tipo</label>
            <select
              value={formData.tipo}
              onChange={(e) => setFormData(prev => ({ ...prev, tipo: e.target.value }))}
              className='px-2 py-2 border border-blue-700 outline rounded-md mb-2'
            >
              <option value="">Seleccione el tipo: </option>
              <option value="1">Ingreso</option>
              <option value="2">Salida</option>
            </select>
          </div>
        </form>
        <button className='bg-blue-900 text-white px-4 block py-2 w-[200px] mt-4 rounded-md cursor-pointer' onClick={() => handleCreateProductos(formData)}>REGISTRAR</button>
      </div>
      {/* SECCIÓN PARA LAS TABLAS */}
      <table className='min-w-full border border-gray-200 shadow-sm rounded-md overflow-hidden mt-2'>
        <thead className='bg-gray-100 text-gray-700 text-left'>
          <tr>
            <th className='px-4 py-2 border-b'>Nombre</th>
            <th className='px-4 py-2 border-b'>Categoria</th>
            <th className='px-4 py-2 border-b'>Referencia</th>
            <th className='px-4 py-2 border-b'>Tipo</th>
            <th className='px-4 py-2 border-b'>Acciones</th>
          </tr>
        </thead>
        <tbody className='text-sm text-gray-800'>
          {listProducts.length > 0 ? (
            listProducts.map((producto) => (
              <tr key={producto.id_prod} className='hover:bg-gray-50 transition-colors'>
                <td className='px-4 py-2 border-b'>{producto.nombre}</td>
                <td className='px-4 py-2 border-b'>{producto.categoria}</td>
                <td className='px-4 py-2 border-b'>{producto.referencia}</td>
                <td className='px-4 py-2 border-b'>{producto.tipo}</td>
                <td className='px-4 py-2 border-b'>
                  <Link className='px-2 py-2' href={`/admin/Productos/${producto.id_prod}/editar`}>
                    Editar
                  </Link>
                  <Link className='px-2 py-2' href={`/admin/Productos/${producto.id_prod}/eliminar`}>
                    Eliminar
                  </Link>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className='px-4 py-2 border-b text-center' colSpan={5}>
                No hay productos disponibles.
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </section>
  )
}

export default Productos