"use client"
import ModalEditar from '@/app/components/ModalEditar';
import useCategorias from '@/app/hooks/useCategorias';
import useProductos from '@/app/hooks/useProductos';
import { CategoriasDTO } from '@/app/models/CategoriasDTO';
import { ProductosDTO } from '@/app/models/ProductsDTO';
import React, { useEffect, useState } from 'react'
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';

const Productos = () => {

  const [formData, setFormData] = useState({
    "id_prod": 0,
    "nombre": "",
    "categoria": "",
    "estado": "",
    "habilitado": 1 // ✅ Cambiar a 1 por defecto
  });

  const [listProducts, setListProducts] = useState<ProductosDTO[]>([]);
  const [isLoading, setIsLoading] = useState(false); // ✅ Agregar loading state

  const { handleCreateProductos, handleGetProductos, handleUpdateProductos, handleDeshabilitarProducto, handleHabilitarProducto } = useProductos();

  // Función para recargar la lista de productos
  const recargarProductos = async () => {
    try {
      setIsLoading(true);
      const data = await handleGetProductos();
      if (data) setListProducts(data);
    } catch (error) {
      toast.error('Error al cargar productos', {
        position: "top-right",
      });
      console.error('Error al recargar productos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    recargarProductos();
  }, []);

  const [IsOpen, setIsOpen] = useState(false);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>();

  // ✅ Corregir el manejo del modal
  const handleMostrarModal = (producto: ProductosDTO) => {
    setProductoSeleccionado(producto);
    setFormData({
      id_prod: producto.id_prod,
      nombre: producto.nombre,
      categoria: producto.categoria ?? "",
      estado: producto.estado,
      habilitado: producto.habilitado ?? 1 // ✅ Mantener como number
    });
    console.log(producto.id_prod)
    setIsOpen(true);
  };

  const [listCategorias, setListCategorias] = useState<CategoriasDTO[]>([]);
  const { handleListCategorias } = useCategorias();

  //Listando todas las categorías
  useEffect(() => {
    const fetchingData = async () => {
      try {
        const responseCategorias = await handleListCategorias();
        setListCategorias(responseCategorias)
      } catch (error) {
        toast.error('Error al cargar categorías', {
          position: "top-right",
        });
        console.error('Error al cargar categorías:', error);
      }
    }
    fetchingData();
  }, [])

  // ✅ Función CORREGIDA para manejar la habilitación/deshabilitación
  const handleToggleHabilitado = async (producto: ProductosDTO) => {
    try {
      setIsLoading(true);
      let resultado;
      
      if (producto.habilitado === 1) {
        // Si está habilitado (1), lo deshabilitamos (0)
        resultado = await handleDeshabilitarProducto(producto.id_prod);
        if (resultado) {
          toast.success('Producto deshabilitado exitosamente', {
            position: "top-right",
          });
        }
      } else {
        // Si está deshabilitado (0), lo habilitamos (1)
        resultado = await handleHabilitarProducto(producto.id_prod);
        if (resultado) {
          toast.success('Producto habilitado exitosamente', {
            position: "top-right",
          });
        }
      }

      // Solo actualizar el estado local si la operación fue exitosa
      if (resultado) {
        setListProducts(prevProducts =>
          prevProducts.map(p =>
            p.id_prod === producto.id_prod
              ? { ...p, habilitado: p.habilitado === 1 ? 0 : 1 }
              : p
          )
        );
      }

    } catch (error) {
      toast.error(`Error al ${producto.habilitado === 1 ? 'deshabilitar' : 'habilitar'} producto`, {
        position: "top-right",
      });
      console.error('Error en toggle habilitado:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Función mejorada para crear productos con validación
  const handleCrearProducto = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validaciones
    if (!formData.nombre.trim()) {
      toast.error('El nombre del producto es requerido', {
        position: "top-right",
      });
      return;
    }
    
    if (!formData.categoria) {
      toast.error('La categoría es requerida', {
        position: "top-right",
      });
      return;
    }
    
    if (!formData.estado) {
      toast.error('El estado es requerido', {
        position: "top-right",
      });
      return;
    }

    try {
      setIsLoading(true);
      const resultado = await handleCreateProductos(formData);
      
      if (resultado) {
        // Limpiar el formulario
        setFormData({
          id_prod: 0,
          nombre: "",
          categoria: "",
          estado: "",
          habilitado: 1
        });
        // Recargar la lista
        await recargarProductos();
        toast.success('Producto creado exitosamente', {
          position: "top-right",
        });
      }

    } catch (error) {
      toast.error('Error al crear producto', {
        position: "top-right",
      });
      console.error('Error al crear producto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Función mejorada para actualizar productos
  const handleActualizarProducto = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // Validaciones
    if (!formData.nombre.trim()) {
      toast.error('El nombre del producto es requerido', {
        position: "top-right",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const resultado = await handleUpdateProductos(formData);
      
      if (resultado) {
        setIsOpen(false);
        await recargarProductos();
        toast.success('Producto actualizado exitosamente', {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error('Error al actualizar producto', {
        position: "top-right",
      });
      console.error('Error al actualizar producto:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className='px-4 py-6 max-w-7xl mx-auto space-y-8'>
        <h2 className='text-3xl font-bold text-gray-900'>Productos</h2>

        {/* SECCIÓN PARA EL FORMULARIO */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">Registrar Nuevo Producto</h3>
          {/* ✅ Formulario corregido */}
          <form className='space-y-6' onSubmit={handleCrearProducto}>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              <div className='space-y-2'>
                <label className="block text-sm font-medium text-gray-700">
                  Nombre del producto <span className="text-red-500">*</span>
                </label>
                <input
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  placeholder="Ingrese el nombre del producto"
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
                  required
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
                <label className="block text-sm font-medium text-gray-700">
                  Estado <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.estado}
                  onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white'
                  required
                >
                  <option value="">Seleccione un estado</option>
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>
            </div>

            {/* ✅ Botón dentro del formulario */}
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-3 rounded-lg transition-colors duration-200 font-medium ${
                isLoading
                  ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isLoading ? 'REGISTRANDO...' : 'REGISTRAR'}
            </button>
          </form>
        </div>

        {/* SECCIÓN PARA LAS TABLAS */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className='px-6 py-4 text-left text-sm font-medium text-gray-700'>#ID</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Nombre</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Categoría</th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Estado</th>
                  <th className="px-6 py-4 text-center text-sm font-medium text-gray-700">Acciones</th>
                  <th className='px-6 py-4 text-center text-sm font-medium text-gray-700'>Habilitar/Deshabilitar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {listProducts.length > 0 ? (
                  listProducts.map((producto) => (
                    <tr key={producto.id_prod} className="hover:bg-gray-50 transition-colors">
                      <td className='px-6 py-4 text-sm text-gray-900'>{producto.id_prod}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{producto.nombre}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {producto.categoria}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${producto.estado === '1' || producto.estado === "1"
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
                            disabled={isLoading}
                          >
                            Editar
                          </button>
                          <button 
                            className="px-3 py-1.5 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                            disabled={isLoading}
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-center'>
                        {producto.habilitado === 1 ? (
                          <MdCheckBox
                            className={`text-center text-2xl transition-colors ${
                              isLoading 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-green-500 cursor-pointer hover:text-green-700'
                            }`}
                            title="Producto habilitado - Click para deshabilitar"
                            onClick={() => !isLoading && handleToggleHabilitado(producto)}
                          />
                        ) : (
                          <MdCheckBoxOutlineBlank
                            className={`text-center text-2xl transition-colors ${
                              isLoading 
                                ? 'text-gray-400 cursor-not-allowed' 
                                : 'text-gray-400 cursor-pointer hover:text-blue-600'
                            }`}
                            title="Producto deshabilitado - Click para habilitar"
                            onClick={() => !isLoading && handleToggleHabilitado(producto)}
                          />
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-6 py-12 text-center text-gray-500" colSpan={6}>
                      {isLoading ? 'Cargando productos...' : 'No hay productos disponibles.'}
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
            <form className='space-y-6' onSubmit={handleActualizarProducto}>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='space-y-2'>
                  <label className="block text-sm font-medium text-gray-700">
                    Nombre del producto <span className="text-red-500">*</span>
                  </label>
                  <input
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors'
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    required
                  />
                </div>

                <div className='space-y-2'>
                  <label className="block text-sm font-medium text-gray-700">
                    Categoría <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="categoria"
                    value={formData.categoria}
                    onChange={(e) => setFormData(prev => ({ ...prev, categoria: e.target.value }))}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white'
                    required
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
                  <label className="block text-sm font-medium text-gray-700">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.estado}
                    onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                    className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white'
                    required
                  >
                    <option value="">Seleccione un estado</option>
                    <option value="1">Activo</option>
                    <option value="0">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className='px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-3 rounded-lg transition-colors font-medium ${
                    isLoading
                      ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isLoading ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                </button>
              </div>
            </form>
          </div>
        </ModalEditar>
      </section>
      
      {/* ToastContainer para mostrar las notificaciones */}
      <ToastContainer />
    </>
  )
}

export default Productos