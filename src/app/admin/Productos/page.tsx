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

<div className=" ">
  <div className="">
    <label htmlFor="">Categoria: </label>
    <select 
      name="categoria" 
      id="categoria"
      value={formData.categoria}
      onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
      className="w-full px-4 py-3 text-gray-700 bg-gray-50 border border-gray-200 rounded-md appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-blue-500 transition-all duration-200"
    >
      <option value="">Seleccione una categoria: </option>
      {
        listCategorias.map((item) => (
          <option key={item.nombre} value={item.nombre}>
            {item.nombre}
          </option>
        ))
      }
    </select>
  </div>
</div>

          {/* <div className='flex flex-col'>
            <label htmlFor="">Ingresa la categoría</label>
            <select name="categoria" id="categoria">
              <option value="">-- Selecciona una categoría --</option>
              {
                listCategorias.map((item) => (
                  <option key={item.nombre} value={item.nombre}>{item.nombre}</option>
                ))
              }
            </select>

          </div> */}


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


        </form>
        <button className='bg-blue-900 text-white px-4 block py-2 w-[200px] mt-4 rounded-md cursor-pointer' onClick={() => handleCreateProductos(formData)}>REGISTRAR</button>
      </div>
      {/* SECCIÓN PARA LAS TABLAS */}
      <div className="max-h-96 overflow-y-auto rounded-md border border-gray-200">
        <table className="min-w-full shadow-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Categoria</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {listProducts.length > 0 ? (
              listProducts.map((producto) => (
                <tr key={producto.id_prod} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 border-b">{producto.nombre}</td>
                  <td className="px-4 py-2 border-b">{producto.categoria}</td>
                  <td className="px-4 py-2 border-b">
                    <Link className="px-2 py-2" href={`/admin/Productos/`} onClick={() => handleMostrarModal(producto)}>
                      Editar
                    </Link>
                    <Link className="px-2 py-2" href={`/admin/Productos/`}>
                      Eliminar
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-2 border-b text-center" colSpan={3}>
                  No hay productos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>


      <ModalEditar isOpen={IsOpen} onClose={() => setIsOpen(false)}>
        <h1 className='text-2xl text-center'>Modal de Edición</h1>
        <form className='grid grid-cols-2 gap-2 mt-4' onSubmit={() => handleUpdateProductos(formData)}>
          <div className='flex flex-col'>
            <label htmlFor="">Ingresa el nombre: </label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text" name="nombre" id=""
              value={formData.nombre}
              onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            />
          </div>

          <div className='flex flex-col'>
            <label htmlFor="">Ingresa la categoría</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text" name="categoria" id=""
              value={formData.categoria}
              onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
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
            </select>
          </div>


          <button className='bg-blue-900 text-white px-4 block py-2 w-full mt-4 rounded-md cursor-pointer col-span-2'

            onClick={() => handleUpdateProductos(formData)}>EDITAR</button>

        </form>
      </ModalEditar>
    </section>
  )
}

export default Productos