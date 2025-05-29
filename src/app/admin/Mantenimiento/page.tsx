"use client"
import useMantenimiento from '@/app/hooks/useMantenimiento'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { MantenimientoDTO } from '@/app/models/MantenimientoDTO'
import { MantenimientoFiltroDTO } from '@/app/models/MantenimientoFiltroDTO'

const Mantenimiento = () => {
  const { handleBuscarNombre, handleCrearMantenimiento, handleListarMantenimiento } = useMantenimiento();

  const [nombreInput, setNombreInput] = useState('');
  const [sugerencias, setSugerencias] = useState<{ nombre: string; id_prod: number }[]>([]);

  const [formData, setFormData] = useState({
    id_prod: 0,
    nombre: '',
    tipo: '',
    fecha_ingreso: '',
    cantidad: '',
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

  return (
    <section className='grid grid-cols gap-2 px-4 py-6'>
      <h2 className='text-2xl'>Mantenimiento</h2>

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
              onChange={(e) => setFormData(prev => ({ ...prev, cantidad: e.target.value }))}
            />
          </div>

          <div className='flex flex-col'>
            <label>Ingrese la fecha de ingreso</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="date"
              onChange={(e) => setFormData(prev => ({ ...prev, fecha_ingreso: e.target.value }))}
            />
          </div>

          <div className='flex flex-col'>
            <label>Ingrese la referencia</label>
            <input className='px-2 py-2 border border-blue-700 outline rounded-md mb-2' type="text"
              onChange={(e) => setFormData(prev => ({ ...prev, referencia: e.target.value }))}
            />
          </div>

          <button type="submit" className='bg-blue-900 text-white px-4 py-2 rounded-md mt-2'>
            AGREGAR
          </button>
        </form>
      </div>

      {/* TABLA DE RESULTADOS */}
      <table className='min-w-full border border-gray-200 shadow-sm rounded-md overflow-hidden mt-2'>
        <thead className='bg-gray-100 text-gray-700 text-left'>
          <tr>
            <th className='px-4 py-2 border-b'>Nombre</th>
            <th className='px-4 py-2 border-b'>Cantidad</th>
            <th className='px-4 py-2 border-b'>Categoria</th>
            <th className='px-4 py-2 border-b'>Referencia</th>
            <th className='px-4 py-2 border-b'>Fecha de Ingreso</th>
            <th className='px-4 py-2 border-b'>Tipo I/S</th>
            <th className='px-4 py-2 border-b'>Acciones</th>
          </tr>
        </thead>
        <tbody className='text-sm text-gray-800'>
          {mantenimiento.map((item, index) => (
            <tr key={index} className='hover:bg-gray-50 transition-colors'>
              <td className='px-4 py-2 border-b'>{item.nombre}</td>
              <td className='px-4 py-2 border-b'>{item.cantidad}</td>
              <td className='px-4 py-2 border-b'>{item.categoria}</td>
              <td className='px-4 py-2 border-b'>{item.referencia}</td>
              <td className='px-4 py-2 border-b'>{item.fecha_ingreso}</td>
              <td className='px-4 py-2 border-b'>{item.tipo}</td>
              <td className='px-4 py-2 border-b'>
                <Link className='px-2 py-2' href={'/admin/Productos'}>Editar</Link>
                <Link className='px-2 py-2' href={'/admin/Productos'}>Eliminar</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  )
}

export default Mantenimiento;
