// hooks/useMovimientos.ts
import { useState } from 'react';
import { ListaMovimientosDTO } from '../models/ListaMovimientosDTO';
import { API_PROD } from '../models/variables';
import { useApiRequest } from '../utils/AuthUtils';
import { MovimientosDTO } from '../models/MovimientosDTO';

const useMovimientos = () => {
  const [movimientos, setMovimientos] = useState<ListaMovimientosDTO[]>([]);
  // Hook reutilizable con manejo automático de errores, reintentos y auth
  const { makeRequest, loading, error, reset } = useApiRequest();


const handleGetMovimientos = async (): Promise<MovimientosDTO[]> => {
  try {
    const dataResponse = await makeRequest(`${API_PROD}/api/Mantenimiento/listar_movimientos`);

    if (dataResponse && Array.isArray(dataResponse)) {
      return dataResponse;
    }

    return []; // en caso de que no sea un array
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    return [];
  }
};

const handleFiltrarMovimientos = async (
  nombre: string,
  fecha: string,
  referencia: string
): Promise<MovimientosDTO[]> => {
  try {
    const params = new URLSearchParams();
    if (nombre?.trim()) params.append('nombre', nombre.trim());
    if (fecha?.trim()) params.append('fecha', fecha.trim());
    if (referencia?.trim()) params.append('referencia', referencia.trim());

    const url = `${API_PROD}/api/Mantenimiento/filtrar_movimiento?${params.toString()}`;
    const data = await makeRequest(url);

    console.log('Movimientos filtrados:', data);

    if (data && Array.isArray(data)) {
      setMovimientos(data);
      return data;
    } else {
      setMovimientos([]);
      return [];
    }
  } catch (error) {
    console.error("Error al filtrar movimientos:", error);
    setMovimientos([]);
    return [];
  }
};
  // Función para limpiar filtros y obtener todos los movimientos
  const handleClearFilters = async () => {
    try {
      return await handleGetMovimientos();
    } catch (error) {
      console.error("Error al limpiar filtros:", error);
      throw error;
    }
  };

  // Función para buscar por un solo criterio
  const handleSearchMovimientos = async (searchTerm: string, searchType: 'nombre' | 'fecha' | 'referencia') => {
    try {
      if (!searchTerm?.trim()) {
        return await handleGetMovimientos();
      }

      const params: Record<string, string> = {};
      params[searchType] = searchTerm.trim();

      return await handleFiltrarMovimientos(
        params.nombre || '',
        params.fecha || '',
        params.referencia || ''
      );
    } catch (error) {
      console.error(`Error al buscar por ${searchType}:`, error);
      throw error;
    }
  };

  // Función para actualizar un movimiento específico en la lista
  const handleUpdateMovimiento = (updatedMovimiento: ListaMovimientosDTO) => {
    setMovimientos(prev => 
      prev.map(mov => 
        mov.nombre === updatedMovimiento.nombre ? updatedMovimiento : mov
      )
    );
  };

  // Función para agregar un nuevo movimiento a la lista
  const handleAddMovimiento = (newMovimiento: ListaMovimientosDTO) => {
    setMovimientos(prev => [newMovimiento, ...prev]);
  };

  // Función para eliminar un movimiento de la lista
  const handleRemoveMovimiento = (movimientoId: string | number) => {
    setMovimientos(prev => prev.filter(mov => mov.nombre !== movimientoId));
  };

  // Función helper para resetear el estado del hook
  const resetState = () => {
    setMovimientos([]);
    reset();
  };

  // Función para obtener estadísticas básicas
  const getMovimientosStats = () => {
    return {
      total: movimientos.length,
      isEmpty: movimientos.length === 0,
      hasData: movimientos.length > 0
    };
  };

  return {
    // Estado
    movimientos,
    setMovimientos,
    
    // Funciones principales
    handleGetMovimientos,
    handleFiltrarMovimientos,
    
    // Funciones auxiliares
    handleClearFilters,
    handleSearchMovimientos,
    handleUpdateMovimiento,
    handleAddMovimiento,
    handleRemoveMovimiento,
    
    // Estados del hook
    loading,
    error,
    
    // Utilidades
    resetState,
    getMovimientosStats
  };
};

export default useMovimientos;