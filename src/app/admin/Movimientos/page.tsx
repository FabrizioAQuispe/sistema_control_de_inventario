'use client';
import React, { useEffect, useState } from 'react';
import { FaFileExcel, FaSearch, FaTable } from 'react-icons/fa';
import useMovimientos from '@/app/hooks/useMovimientos';
import Table from '@/app/components/Table';
import { MovimientosDTO } from '@/app/models/MovimientosDTO';
import useReportes from '@/app/hooks/useReportes';

const Movimientos = () => {
  const [filtros, setFiltros] = useState({ nombre: '', fecha_inicial: '', fecha_final: '' });
  const [resultados, setResultados] = useState<MovimientosDTO[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const { handleGetMovimientos, handleFiltrarMovimientos } = useMovimientos();
  const { ExportReport, ExportTableToExcel } = useReportes();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await handleFiltrarMovimientos(filtros.nombre, filtros.fecha_inicial, filtros.fecha_final);
    if (data) {
      setResultados(data);
    }
  };

  // Método 1: Exportar desde los datos (más limpio)
  const handleExportExcel = async () => {
    if (resultados.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    setIsExporting(true);
    
    try {
      // Generar nombre del archivo basado en los filtros
      let fileName = 'movimientos_reporte';
      
      if (filtros.fecha_inicial || filtros.fecha_final) {
        const fechaInicio = filtros.fecha_inicial ? 
          new Date(filtros.fecha_inicial).toLocaleDateString('es-PE').replace(/\//g, '-') : 
          'inicio';
        const fechaFin = filtros.fecha_final ? 
          new Date(filtros.fecha_final).toLocaleDateString('es-PE').replace(/\//g, '-') : 
          'fin';
        fileName = `movimientos_${fechaInicio}_${fechaFin}`;
      }
      
      if (filtros.nombre) {
        fileName += `_${filtros.nombre.replace(/\s+/g, '_')}`;
      }

      const result = ExportReport(resultados, fileName);
      
      if (result.success) {
        console.log('✅ Exportación exitosa');
        alert('Archivo Excel descargado exitosamente');
      } else {
        console.error('❌ Error en la exportación:', result.message);
        alert('Error al exportar el archivo. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Error inesperado al generar el reporte.');
    } finally {
      setIsExporting(false);
    }
  };

  // Método 2: Exportar desde la tabla HTML (mantiene formato visual)
  const handleExportTableHTML = async () => {
    if (resultados.length === 0) {
      alert('No hay datos para exportar');
      return;
    }

    setIsExporting(true);
    
    try {
      let fileName = 'tabla_movimientos';
      
      if (filtros.fecha_inicial || filtros.fecha_final) {
        const fechaInicio = filtros.fecha_inicial ? 
          new Date(filtros.fecha_inicial).toLocaleDateString('es-PE').replace(/\//g, '-') : 
          'inicio';
        const fechaFin = filtros.fecha_final ? 
          new Date(filtros.fecha_final).toLocaleDateString('es-PE').replace(/\//g, '-') : 
          'fin';
        fileName = `tabla_movimientos_${fechaInicio}_${fechaFin}`;
      }
      
      if (filtros.nombre) {
        fileName += `_${filtros.nombre.replace(/\s+/g, '_')}`;
      }

      const result = ExportTableToExcel('movimientos-table', fileName);
      
      if (result.success) {
        console.log('✅ Exportación de tabla exitosa');
        alert('Tabla Excel descargada exitosamente');
      } else {
        console.error('❌ Error en la exportación de tabla:', result.message);
        alert('Error al exportar la tabla. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Error inesperado al generar el reporte de tabla.');
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const fetchingData = async () => {
      const responseData = await handleGetMovimientos();
      setResultados(responseData);
    };
    fetchingData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-5">Movimientos</h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Inicial:</label>
          <input
            type="datetime-local"
            name="fecha_inicial"
            value={filtros.fecha_inicial}
            onChange={handleChange}
            className="w-full border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fecha Final:</label>
          <input
            type="datetime-local"
            name="fecha_final"
            value={filtros.fecha_final}
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
      </form>

      <div className='flex gap-2 mb-4'>
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-slate-600 text-white px-4 py-2 rounded hover:bg-slate-700 transition"
        >
          <FaSearch />
          Buscar
        </button>        

        <button
          type='button'
          onClick={handleExportTableHTML}
          disabled={isExporting || resultados.length === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded transition ${
            isExporting || resultados.length === 0
              ? 'bg-gray-400 cursor-not-allowed text-gray-600'
              : 'bg-blue-700 text-white hover:bg-blue-800'
          }`}
        >
          <FaTable className={isExporting ? 'animate-spin' : ''} />
          {isExporting ? 'Exportando...' : 'Exportar Tabla'}
        </button>
      </div>

      {/* Información de los resultados */}
      <div className="mb-4 text-sm text-gray-600">
        {resultados.length > 0 ? (
          <p>Mostrando {resultados.length} movimiento{resultados.length !== 1 ? 's' : ''}</p>
        ) : (
          <p>No hay movimientos para mostrar</p>
        )}
      </div>

      <div className="mt-6">
        <Table movimientos={resultados}/>
      </div>
    </div>
  );
};

export default Movimientos;