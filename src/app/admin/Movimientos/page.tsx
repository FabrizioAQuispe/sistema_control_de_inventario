'use client';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import useMovimientos from '@/app/hooks/useMovimientos';
import Table from '@/app/components/Table';
import { MovimientosDTO } from '@/app/models/MovimientosDTO';

const Movimientos = () => {
  const [filtros, setFiltros] = useState({ nombre: '', referencia: '', fecha: '' });
  const [resultados, setResultados] = useState<MovimientosDTO[]>([]);
  const { handleGetMovimientos, handleFiltrarMovimientos } = useMovimientos();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await handleFiltrarMovimientos(filtros.nombre, filtros.fecha, filtros.referencia);
    if (data) {
      setResultados(data);
    }
  };


  useEffect(() => {
    const fetchingData = async () => {
      const responseData = await handleGetMovimientos();
      setResultados(responseData)
    }
    fetchingData
  },[])
  return (
    <div className="p-4">
      <h1 className="text-2xl mb-5">Movimientos</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha:</label>
          <input
            type="datetime"
            name="fecha"
            value={filtros.fecha}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nombre:</label>
          <input
            type="text"
            name="nombre"
            value={filtros.nombre}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" ? handleSubmit(e) : null}

            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Referencia:</label>
          <input
            type="text"
            name="referencia"
            value={filtros.referencia}
            onChange={handleChange}
            onKeyDown={(e) => e.key === "Enter" ? handleSubmit(e) : null}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      </form>
      <div className='flex gap-2'>

        <button
          type="submit"
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700 transition"
        >
          <FaSearch />
          Buscar
        </button>

      </div>
      <div className="mt-6">
        <Table movimientos={resultados} />
      </div>
    </div>
  );
};

export default Movimientos;
