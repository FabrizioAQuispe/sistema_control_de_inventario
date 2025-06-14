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
  const token = cookieParse[0]?.token || "";

  const { handleBuscarNombre, handleCrearMantenimiento, handleListarMantenimiento } = useMantenimiento();

  const [nombreInput, setNombreInput] = useState('');
  const [sugerencias, setSugerencias] = useState<{ nombre: string; id_prod: number }[]>([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState<any>();


  const [formData, setFormData] = useState({
    id_prod: 0,
    id_tipo: "",
    nombre: '',
    fecha: '',
    cantidad: 0,
    referencia: '',
    usuario_master: cookieParse[0].nombre_usuario
  });

  const [updateData, setUpdateData] = useState({
    id_mant: 0,
    nombre: '',
    fecha: '',
    cantidad: 0,
    referencia: '',
  });

  const [mantenimiento, setMantenimiento] = useState<MantenimientoFiltroDTO[]>([]);

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
    <section className='grid grid-cols gap-2 px-4 py-6'>
      <h2 className='text-2xl'>Movimientos</h2>

      {/* FORMULARIO */}
      <div>
        <form className='grid grid-cols-2 gap-2' onSubmit={(e) => {
          e.preventDefault();
          handleCrearMantenimiento(formData);
        }}>
          {/* Input con autocompletado */}
          <div className='flex flex-col relative'>
            <label htmlFor="nombre">Ingrese el nombre: </label>
            <input
              className='px-2 py-2 border border-blue-700 outline rounded-md mb-2'
              type="text"
              id="nombre"
              value={nombreInput}
              onChange={handleChangeNombre}
              autoComplete="off"
            />
            {sugerencias.length > 0 && (
              <ul className="absolute bg-white border border-gray-300 rounded-md z-10 max-h-40 overflow-y-auto w-full top-full mt-1">
                {sugerencias.map((item, index) => (
                  <li
                    key={index}
                    className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                    onClick={() => handleSelectSugerencia(item)}
                  >
                    {item.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Otros campos */}
          <div className='flex flex-col'>
            <label>Ingrese la cantidad</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text"
              onChange={(e) => setFormData(prev => ({ ...prev, cantidad: Number(e.target.value) }))}
            />
          </div>

          <div className='flex flex-col'>
            <label>Ingrese la fecha</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="date"
              onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
            />
          </div>

          <div className='flex flex-col'>
            <label>Ingrese la referencia</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text"
              onChange={(e) => setFormData(prev => ({ ...prev, referencia: (e.target.value) }))}
            />
          </div>

          <div className='flex flex-col'>
            <label>Ingrese el Tipo</label>
            <select
              value={Number(formData.id_tipo)}
              onChange={(e) => setFormData(prev => ({ ...prev, id_tipo: (e.target.value) }))}
              className='px-2 py-2 border border-blue-700 outline rounded-md mb-2'
            >
              <option value="">Seleccione el tipo: </option>
              <option value="1">Ingreso</option>
              <option value="2">Salida</option>
            </select>
          </div>


          <div className='flex flex-col'>
            <label>Creado Por: </label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text"
            value={cookieParse[0].nombre_usuario}
            />
          </div>

          <button type="submit" className='bg-blue-900 text-white px-4 py-2 rounded-md mt-2'>
            AGREGAR
          </button>
        </form>
      </div>

      {/* CONTENEDOR CON SCROLL VERTICAL */}
      <div className="max-h-[500px] overflow-y-auto rounded-md border border-gray-200 mt-2">
        <table className="min-w-full shadow-sm">
          <thead className="bg-gray-100 text-gray-700 text-left">
            <tr>
              <th className="px-4 py-2 border-b">Nombre</th>
              <th className="px-4 py-2 border-b">Cantidad</th>
              <th className="px-4 py-2 border-b">Categoria</th>
              <th className="px-4 py-2 border-b">Referencia</th>
              <th className="px-4 py-2 border-b">Fecha</th>
              <th className="px-4 py-2 border-b">Tipo I/S</th>
              <th className="px-4 py-2 border-b">Acciones</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-800">
            {mantenimiento.length > 0 ? (
              mantenimiento.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2 border-b">{item.nombre}</td>
                  <td className="px-4 py-2 border-b">{item.cantidad}</td>
                  <td className="px-4 py-2 border-b">{item.categoria}</td>
                  <td className="px-4 py-2 border-b">{item.referencia}</td>
                  <td className="px-4 py-2 border-b">{item.fecha}</td>
                  <td className="px-4 py-2 border-b">{item.tipo}</td>
                  <td className="px-4 py-2 border-b">
                    <Link className="px-2 py-2" href="/admin/Mantenimiento" onClick={() => handleMostrarModal(item)}>Editar</Link>
                    <Link
                      onClick={() => handleDeleteMantenimiento(item.id_mant)}
                      className="px-2 py-2" href={`/admin/Mantenimiento/`
                      }>Eliminar</Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-2 border-b text-center" colSpan={7}>
                  No hay productos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ModalEditar isOpen={IsOpen} onClose={() => setIsOpen(false)}>
        <h1 className='text-2xl text-center'>Edición de Mantenimiento</h1>
        <div className='mt-4'>
          <form className='grid grid-cols-2 gap-2' onSubmit={(e) => {
            e.preventDefault();
            handleEditarMantenimiento();
          }}>
            {/* Input con autocompletado */}
            <div className='flex flex-col relative'>
              <label htmlFor="nombre">Ingrese el nombre: </label>
              <input
                className='px-2 py-2 border border-blue-700 outline rounded-md mb-2'
                type="text"
                id="nombre"
                value={updateData.nombre}
                onChange={handleChangeNombre}
                autoComplete="off"
              />
              {sugerencias.length > 0 && (
                <ul className="absolute bg-white border border-gray-300 rounded-md z-10 max-h-40 overflow-y-auto w-full top-full mt-1">
                  {sugerencias.map((item, index) => (
                    <li
                      key={index}
                      className="px-3 py-2 hover:bg-blue-100 cursor-pointer"
                      onClick={() => handleSelectSugerencia(item)}
                    >
                      {item.nombre}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Otros campos - CORREGIDOS */}
            <div className='flex flex-col'>
              <label>Ingrese la cantidad</label>
              <input
                className='px-2 py-2 border border-blue-700 outline rounded-md mb-2'
                type="number"
                value={updateData.cantidad}
                onChange={(e) => setUpdateData(prev => ({ ...prev, cantidad: Number(e.target.value) }))}
              />
            </div>

            <div className='flex flex-col'>
              <label>Ingrese la fecha</label>
              <input
                className='px-2 py-2 border border-blue-700 outline rounded-md mb-2'
                type="date"
                value={updateData.fecha}
                onChange={(e) => setUpdateData(prev => ({ ...prev, fecha: e.target.value }))}
              />
            </div>

            <div className='flex flex-col'>
              <label>Ingrese la referencia</label>
              <input
                className='px-2 py-2 border border-blue-700 outline rounded-md mb-2'
                type="text"
                value={updateData.referencia}
                onChange={(e) => setUpdateData(prev => ({ ...prev, referencia: e.target.value }))}
              />
            </div>

            <button
              onClick={handleEditarMantenimiento}
              type="submit" className='bg-blue-900 text-white px-4 py-2 rounded-md mt-2 col-span-2 w-full'>
              EDITAR
            </button>
          </form>
        </div>
      </ModalEditar>
    </section>
  )
}

export default Mantenimiento;
