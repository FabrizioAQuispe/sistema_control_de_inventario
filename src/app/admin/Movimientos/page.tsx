'use client';
import React, { useEffect, useState } from 'react';
import { FaFileExcel, FaSearch, FaTable } from 'react-icons/fa';
import useMovimientos from '@/app/hooks/useMovimientos';
import Table from '@/app/components/Table';
import { MovimientosDTO } from '@/app/models/MovimientosDTO';
import useReportes from '@/app/hooks/useReportes';
import { toast, ToastContainer } from 'react-toastify';

const Movimientos = () => {
  const [filtros, setFiltros] = useState({ nombre: '', fecha_inicial: '', fecha_final: '', usuario_creado: '' });
  const [resultados, setResultados] = useState<MovimientosDTO[]>([]);
  const [isExporting, setIsExporting] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const { handleGetMovimientos, handleFiltrarMovimientos } = useMovimientos();
  const { ExportTableToExcel } = useReportes();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFiltros((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación básica de fechas
    if (filtros.fecha_inicial && filtros.fecha_final) {
      const fechaInicial = new Date(filtros.fecha_inicial);
      const fechaFinal = new Date(filtros.fecha_final);
      
      if (fechaInicial > fechaFinal) {
        toast.error('La fecha inicial no puede ser mayor que la fecha final', {
          position: "top-right",
        });
        return;
      }
    }

    setIsSearching(true);
    
    try {
      const data = await handleFiltrarMovimientos(filtros.nombre, filtros.fecha_inicial, filtros.fecha_final);
      
      if (data) {
        console.log(data);
        setResultados(data);
        
        if (data.length === 0) {
          toast.info('No se encontraron movimientos con los filtros aplicados', {
            position: "top-right",
          });
        } else {
          toast.success(`Se encontraron ${data.length} movimiento${data.length !== 1 ? 's' : ''}`, {
            position: "top-right",
          });
        }
      } else {
        toast.warning('No se pudieron obtener los datos', {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error('Error al buscar movimientos:', error);
      toast.error('Error al buscar movimientos. Intenta nuevamente.', {
        position: "top-right",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const handleExportTableHTML = async () => {
    if (resultados.length === 0) {
      toast.warning('No hay datos para exportar', {
        position: "top-right",
      });
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

      // Toast de inicio de exportación
      toast.info('Iniciando exportación...', {
        position: "top-right",
        autoClose: 2000,
      });

      const result = ExportTableToExcel('movimientos-table', fileName);
      
      if (result.success) {
        console.log('✅ Exportación de tabla exitosa');
        toast.success(`Archivo Excel "${fileName}.xlsx" descargado exitosamente`, {
          position: "top-right",
          autoClose: 5000,
        });
      } else {
        console.error('❌ Error en la exportación de tabla:', result.message);
        toast.error(`Error al exportar: ${result.message || 'Error desconocido'}`, {
          position: "top-right",
        });
      }
    } catch (error:any) {
      console.error('Error inesperado:', error);
      toast.error('Error inesperado al generar el reporte. Contacta al administrador.', {
        position: "top-right",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({ nombre: '', fecha_inicial: '', fecha_final: '', usuario_creado: '' });
    toast.info('Filtros limpiados', {
      position: "top-right",
      autoClose: 2000,
    });
  };

  useEffect(() => {
    const fetchingData = async () => {
      try {
        const responseData = await handleGetMovimientos();
        if (responseData) {
          setResultados(responseData);
          toast.success(`Cargados ${responseData.length} movimientos`, {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.warning('No se pudieron cargar los movimientos', {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error('Error al cargar movimientos:', error);
        toast.error('Error al cargar los datos iniciales', {
          position: "top-right",
        });
      }
    };
    fetchingData();
  }, []);

  return (
    <>
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
              className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Fecha Final:</label>
            <input
              type="datetime-local"
              name="fecha_final"
              value={filtros.fecha_final}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              placeholder="Buscar por nombre..."
              className="w-full border px-2 py-1 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </form>

        <div className='flex gap-2 mb-4'>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSearching}
            className={`flex items-center gap-2 px-4 py-2 rounded transition ${
              isSearching
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-slate-600 text-white hover:bg-slate-700'
            }`}
          >
            <FaSearch className={isSearching ? 'animate-spin' : ''} />
            {isSearching ? 'Buscando...' : 'Buscar'}
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

          <button
            type="button"
            onClick={limpiarFiltros}
            className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Limpiar Filtros
          </button>
        </div>

        {/* Información de los resultados */}
        <div className="mb-4 text-sm text-gray-600">
          {resultados.length > 0 ? (
            <p className="flex items-center gap-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {resultados.length} movimiento{resultados.length !== 1 ? 's' : ''}
              </span>
              {(filtros.nombre || filtros.fecha_inicial || filtros.fecha_final) && (
                <span className="text-gray-500">con filtros aplicados</span>
              )}
            </p>
          ) : (
            <p className="text-gray-500">No hay movimientos para mostrar</p>
          )}
        </div>

        <div className="mt-6">
          <Table movimientos={resultados} />
        </div>
      </div>
      
      {/* ToastContainer para mostrar las notificaciones */}
      <ToastContainer />
    </>
  );
};

export default Movimientos;