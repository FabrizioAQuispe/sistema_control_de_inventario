"use client"

import useMantenimiento from '@/app/hooks/useMantenimiento'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MantenimientoDTO } from '@/app/models/MantenimientoDTO'
import { MantenimientoFiltroDTO } from '@/app/models/MantenimientoFiltroDTO'
import ModalEditar from '@/app/components/ModalEditar'
import { API_PROD } from '@/app/models/variables'
import ObtenerCookies from '@/app/models/ObtenerCookies'
import { ProductosDTO } from '@/app/models/ProductsDTO'
import { UpdateProductosDTO } from '@/app/models/UpdateProductosDTO'
import Cookies from 'js-cookie';

const Mantenimiento = () => {
  const cookieProfile = typeof window !== 'undefined' ? Cookies.get("data") : null;
  const cookieParse = cookieProfile ? JSON.parse(cookieProfile) : [];
  const token = cookieParse && cookieParse[0] ? cookieParse[0].token : null;
  const nombre_usuario = cookieParse && cookieParse[0] ? cookieParse[0].nombre_usuario : null;

  const { handleBuscarNombre, handleCrearMantenimiento, handleListarMantenimiento } = useMantenimiento();

  const [nombreInput, setNombreInput] = useState('');
  const [sugerencias, setSugerencias] = useState<{ nombre: string; id_prod: number }[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>();
  const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);


  const [formData, setFormData] = useState({
    id_prod: 0,
    id_tipo: "",
    nombre: '',
    fecha: '',
    cantidad: 0,
    referencia: '',
    usuario_master: nombre_usuario
  });

  const [updateData, setUpdateData] = useState({
    id_mant: 0,
    nombre: '',
    fecha: '',
    cantidad: 0,
    referencia: '',
  });

  const [mantenimiento, setMantenimiento] = useState<MantenimientoFiltroDTO[]>([]);

      useEffect(() => {
    const cookieProfile = Cookies.get("data");
    if (cookieProfile) {
      try {
        const parsed = JSON.parse(cookieProfile);
        setNombreUsuario(nombre_usuario);
      } catch {
        setNombreUsuario('Invitado');
      }
    } else {
      setNombreUsuario('Invitado');
    }
  }, []);
  // Buscar al escribir
  const handleChangeNombre = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    setNombreInput(valor);

    if (valor.trim().length >= 2) {
      const resultados = await handleBuscarNombre(valor);
      if (resultados && Array.isArray(resultados)) {
        setSugerencias(resultados);
      } else {
        setSugerencias([]);
      }
    } else {
      setSugerencias([]);
    }
  };

  // Al seleccionar sugerencia
  const handleSelectSugerencia = (producto: { nombre: string; id_prod: number }) => {
    setNombreInput(producto.nombre);
    setFormData(prev => ({
      ...prev,
      nombre: producto.nombre,
      id_prod: producto.id_prod
    }));
    setSugerencias([]);
  };

  // Obtener data
  useEffect(() => {
    const fetchData = async () => {
      const dataMantenimiento = await handleListarMantenimiento();
      if (dataMantenimiento) setMantenimiento(dataMantenimiento)
    }
    fetchData();
  }, []);




  //ESTADO PARA ABRIR LOS MODALES
  const [IsOpen, setIsOpen] = useState(false);

  const handleMostrarModal = (producto: UpdateProductosDTO) => {
    setProductoSeleccionado(producto);
    setUpdateData({
      id_mant: Number(producto.id_mant),
      nombre: producto.nombre,
      fecha: producto.fecha,
      cantidad: Number(producto.cantidad),
      referencia: producto.referencia,
    });
    console.log(producto)
    setIsOpen(true);
  };



  const handleEditarMantenimiento = async () => {
    try {
      const response = await fetch(`${API_PROD}/api/Mantenimiento/actualizar_mantenimiento`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        method: "PUT",
        body: JSON.stringify(updateData)
      });
      if (!response.ok) {
        console.error("ERROR SERVER NOT RESPONSES");
      }

      const dataUpdated = await response.json();
      return dataUpdated;

    } catch (error) {
      console.error("ERROR SERVER EDITAR MANTENIMIENTO: " + error);
    }
  }

  const handleDeleteMantenimiento = async (id_mant: number) => {
    try {
      alert("¿ESTÁ SEGURO DE ELIMINAR EL ITEM?");
      const response = await fetch(`${API_PROD}/api/Mantenimiento/eliminar_seguimiento/${id_mant}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("ERROR SERVER RESPONSE");
      }

      const dataDelete = await response.json();
      console.log(dataDelete)
      return dataDelete;
    } catch (error) {
      console.error("ERROR SERVER RESPONSE: " + error);
    }
  }

  return (
    <section className='max-w-7xl mx-auto px-4 py-6 space-y-6'>
      <h2 className='text-3xl font-bold text-gray-900'>Movimientos</h2>

      {/* FORMULARIO */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Agregar Nuevo Movimiento</h3>
        <form
          className='grid grid-cols-1 md:grid-cols-2 gap-4'
          onSubmit={(e) => {
            e.preventDefault();
            handleCrearMantenimiento(formData);
          }}
        >
          {/* Input con autocompletado */}
          <div className='flex flex-col relative'>
            <label htmlFor="nombre" className='text-sm font-medium text-gray-700 mb-1'>
              Nombre del producto
            </label>
            <input
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
              type="text"
              id="nombre"
              value={nombreInput}
              onChange={handleChangeNombre}
              autoComplete="off"
              placeholder="Buscar producto..."
            />
            {sugerencias.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto w-full top-full mt-1">
                {sugerencias.map((item, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                    onClick={() => handleSelectSugerencia(item)}
                  >
                    {item.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Cantidad */}
          <div className='flex flex-col'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              Cantidad
            </label>
            <input
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
              type="number"
              min="1"
              placeholder="0"
              onChange={(e) => setFormData(prev => ({ ...prev, cantidad: Number(e.target.value) }))}
            />
          </div>

          {/* Fecha */}
          <div className='flex flex-col'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              Fecha
            </label>
            <input
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
              type="date"
              onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
            />
          </div>

          {/* Referencia */}
          <div className='flex flex-col'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              Referencia
            </label>
            <input
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
              type="text"
              placeholder="Referencia del movimiento"
              onChange={(e) => setFormData(prev => ({ ...prev, referencia: e.target.value }))}
            />
          </div>

          {/* Tipo */}
          <div className='flex flex-col'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              Tipo de movimiento
            </label>
            <select
              value={formData.id_tipo}
              onChange={(e) => setFormData(prev => ({ ...prev, id_tipo: e.target.value }))}
              className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
            >
              <option value="">Seleccione el tipo</option>
              <option value="1">Ingreso</option>
              <option value="2">Salida</option>
            </select>
          </div>

          {/* Creado por */}
          <div className='flex flex-col'>
            <label className='text-sm font-medium text-gray-700 mb-1'>
              Creado por
            </label>
            <input
              className='px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed'
              type="text"
              value={nombre_usuario}
              disabled
            />
          </div>

          {/* Botón submit */}
          <div className='md:col-span-2'>
            <button
              type="submit"
              className='w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              Agregar Movimiento
            </button>
          </div>
        </form>
      </div>

      {/* TABLA CON SCROLL VERTICAL */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="max-h-[500px] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referencia
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mantenimiento.length > 0 ? (
                mantenimiento.map((item, index) => (
                  <tr key={item.id_mant || index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-900">{item.nombre}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.cantidad}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.categoria}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.referencia}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{item.fecha}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${item.tipo === 1 || item.id_tipo === 1
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                        }`}>
                        {item.tipo}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleMostrarModal(item)}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDeleteMantenimiento(item.id_mant)}
                          className="text-red-600 hover:text-red-800 font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-8 text-center text-gray-500" colSpan={7}>
                    <div className="flex flex-col items-center">
                      <svg className="w-12 h-12 text-gray-300 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      No hay movimientos disponibles
                    </div>
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
          <h1 className='text-2xl font-bold text-gray-900 text-center mb-6'>
            Editar Movimiento
          </h1>

          <form
            className='grid grid-cols-1 md:grid-cols-2 gap-4'
            onSubmit={(e) => {
              e.preventDefault();
              handleEditarMantenimiento();
            }}
          >
            {/* Input con autocompletado */}
            <div className='flex flex-col relative'>
              <label htmlFor="nombre-edit" className='text-sm font-medium text-gray-700 mb-1'>
                Nombre del producto
              </label>
              <input
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                type="text"
                id="nombre-edit"
                value={updateData.nombre}
                onChange={handleChangeNombre}
                autoComplete="off"
              />
              {sugerencias.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-40 overflow-y-auto w-full top-full mt-1">
                  {sugerencias.map((item, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100 last:border-b-0"
                      onClick={() => handleSelectSugerencia(item)}
                    >
                      {item.nombre}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Cantidad */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                Cantidad
              </label>
              <input
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                type="number"
                value={updateData.cantidad}
                onChange={(e) => setUpdateData(prev => ({ ...prev, cantidad: Number(e.target.value) }))}
              />
            </div>

            {/* Fecha */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                Fecha
              </label>
              <input
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                type="date"
                value={updateData.fecha}
                onChange={(e) => setUpdateData(prev => ({ ...prev, fecha: e.target.value }))}
              />
            </div>

            {/* Referencia */}
            <div className='flex flex-col'>
              <label className='text-sm font-medium text-gray-700 mb-1'>
                Referencia
              </label>
              <input
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                type="text"
                value={updateData.referencia}
                onChange={(e) => setUpdateData(prev => ({ ...prev, referencia: e.target.value }))}
              />
            </div>

            {/* Botón de guardar */}
            <div className="md:col-span-2">
              <button
                type="submit"
                className='w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </ModalEditar>
    </section>)
}

export default Mantenimiento;