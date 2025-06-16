"use client"
import ModalEditar from '@/app/components/ModalEditar';
import useCategorias from '@/app/hooks/useCategorias';
import useProductos from '@/app/hooks/useProductos';
import { CategoriasDTO } from '@/app/models/CategoriasDTO';
import { ProductosDTO } from '@/app/models/ProductsDTO';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Productos = () => {

  const [formData, setFormData] = useState({
    "id_prod": 0,
    "nombre": "",
    "categoria": "",
    "estado": ""
  });

  const [listProducts, setListProducts] = useState<ProductosDTO[]>([]);

  const { handleCreateProductos, handleGetProductos, handleUpdateProductos } = useProductos();

  useEffect(() => {

    const fetchData = async () => {
      const data = await handleGetProductos();
      if (data) setListProducts(data);
    };


    fetchData();
  }, []);

  const [IsOpen, setIsOpen] = useState(false);

  const [productoSeleccionado, setProductoSeleccionado] = useState<any>();

  const handleMostrarModal = (producto: ProductosDTO) => {
    setProductoSeleccionado(producto);
    setFormData({
      id_prod: producto.id_prod,
      nombre: producto.nombre,
      categoria: producto.categoria ?? "",
      estado: producto.estado
    });
    console.log(producto.id_prod)
    setIsOpen(true);
  };

  const [listCategorias, setListCategorias] = useState<CategoriasDTO[]>([]);
  const { handleListCategorias } = useCategorias();

  //Listando todas las categorías
  useEffect(() => {
    const fetchingData = async () => {
      const responseCategorias = await handleListCategorias();
      setListCategorias(responseCategorias)
    }
    fetchingData();
  }, [])


  return (
<section className='px-4 py-6 max-w-7xl mx-auto space-y-8'>
  <h2 className='text-3xl font-bold text-gray-900'>Productos</h2>
  
  {/* SECCIÓN PARA EL FORMULARIO */}
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
    <h3 className="text-xl font-semibold text-gray-900 mb-6">Registrar Nuevo Producto</h3>
    <form className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' onSubmit={() => handleCreateProductos(formData)}>
      <div className='space-y-2'>
        <label className="block text-sm font-medium text-gray-700">Nombre del producto</label>
        <input 
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
          type="text" 
          name="nombre"
          placeholder="Ingrese el nombre del producto"
          onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Categoría</label>
        <select 
          name="categoria" 
          value={formData.categoria}
          onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
        >
          <option value="">Seleccione una categoría</option>
          {listCategorias.map((item) => (
            <option key={item.nombre} value={item.nombre}>
              {item.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className='space-y-2'>
        <label className="block text-sm font-medium text-gray-700">Estado</label>
        <select
          value={formData.estado}
          onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
          className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white'
        >
          <option value="">Seleccione un estado</option>
          <option value="1">Activo</option>
          <option value="0">Inactivo</option>
        </select>
      </div>
    </form>
    
    <button 
      className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg mt-6 transition-colors duration-200 font-medium' 
      onClick={() => handleCreateProductos(formData)}
    >
      REGISTRAR
    </button>
  </div>

  {/* SECCIÓN PARA LAS TABLAS */}
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
    <div className="max-h-96 overflow-y-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50 sticky top-0">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Nombre</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Categoría</th>
            <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Estado</th>
            <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {listProducts.length > 0 ? (
            listProducts.map((producto) => (
              <tr key={producto.id_prod} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900">{producto.nombre}</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {producto.categoria}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    producto.estado === '1' || producto.estado === "1"
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {producto.estado === '1' || producto.estado === "1" ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors" 
                      onClick={() => handleMostrarModal(producto)}
                    >
                      Editar
                    </button>
                    <button className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors">
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="px-6 py-12 text-center text-gray-500" colSpan={4}>
                No hay productos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* MODAL DE EDICIÓN */}
  <ModalEditar isOpen={IsOpen} onClose={() => setIsOpen(false)}>
    <div className="p-6">
      <h1 className='text-2xl font-bold text-gray-900 text-center mb-6'>Editar Producto</h1>
      <form className='grid grid-cols-1 md:grid-cols-2 gap-6' onSubmit={() => handleUpdateProductos(formData)}>
        <div className='space-y-2'>
          <label className="block text-sm font-medium text-gray-700">Nombre del producto</label>
          <input 
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors' 
            type="text" 
            name="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
          />
        </div>

        <div className='space-y-2'>
          <label className="block text-sm font-medium text-gray-700">Categoría</label>
          <select
            name="categoria"
            value={formData.categoria}
            onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white'
          >
            <option value="">Seleccione una categoría</option>
            {listCategorias.map((item) => (
              <option key={item.nombre} value={item.nombre}>
                {item.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className='space-y-2 md:col-span-2'>
          <label className="block text-sm font-medium text-gray-700">Estado</label>
          <select
            value={formData.estado}
            onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white'
          >
            <option value="">Seleccione un estado</option>
            <option value="1">Activo</option>
            <option value="0">Inactivo</option>
          </select>
        </div>

        <div className="md:col-span-2 flex gap-3 justify-end mt-4">
          <button 
            type="button"
            onClick={() => setIsOpen(false)}
            className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
          >
            Cancelar
          </button>
          <button 
            className='px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium'
            onClick={() => handleUpdateProductos(formData)}
          >
            GUARDAR CAMBIOS
          </button>
        </div>
      </form>
    </div>
  </ModalEditar>
</section>  )
}

export default Productos