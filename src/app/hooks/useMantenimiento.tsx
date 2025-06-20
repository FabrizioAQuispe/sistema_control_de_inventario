import React, { useState } from 'react';
import { MantenimientoDTO } from '../models/MantenimientoDTO';
import { API_PROD } from '../models/variables';
import { useApiRequest } from '../utils/AuthUtils';
import { ListaMovimientosDTO } from '../models/ListaMovimientosDTO';
import { MantenimientoFiltroDTO } from '../models/MantenimientoFiltroDTO';

const useMantenimiento = () => {
  // Estado local para almacenar la lista de mantenimientos
  const [mantenimientos, setMantenimientos] = useState<MantenimientoDTO[]>([]);
  
  // Hook reutilizable con manejo automático de errores, reintentos y auth
  const { makeRequest, loading, error, reset } = useApiRequest();

  const handleBuscarNombre = async (nombre: string) => {
    try {
      // Validación básica
      if (!nombre || !nombre.trim()) {
        console.warn("Nombre vacío para búsqueda");
        return [];
      }

      const url = `${API_PROD}/api/Mantenimiento/buscar_nombre?nombre=${encodeURIComponent(nombre.trim())}`;
      const lista = await makeRequest(url);

      if (!lista || !Array.isArray(lista)) {
        console.warn("Respuesta de búsqueda no es un array válido");
        return [];
      }

      // Mapear y filtrar los datos
      const soloNombres = lista.map((item: any) => ({
        nombre: item.nombre,
        id_prod: item.id_prod
      })).filter(item => item.nombre && item.id_prod); // Filtrar items válidos

      console.log('Nombres encontrados:', soloNombres);
      return soloNombres;
    } catch (error) {
      console.error("Error al buscar nombre:", error);
      return []; // Retornar array vacío en caso de error
    }
  };

  const handleCrearMantenimiento = async (mantenimientoInput: MantenimientoDTO) => {
    try {
      // Validación básica
      if (!mantenimientoInput) {
        throw new Error('Los datos del mantenimiento son requeridos');
      }

      const data = await makeRequest(`${API_PROD}/api/Mantenimiento/crear_seguimiento`, {
        method: "POST",
        body: JSON.stringify(mantenimientoInput)
      });

      console.log('Mantenimiento creado:', data);
      

      return data;
    } catch (error) {
      console.error("Error al crear mantenimiento:", error);
      throw error; // Re-lanzar para que el componente pueda manejarlo
    }
  };

const handleListarMantenimiento = async (): Promise<MantenimientoFiltroDTO[]> => {
  try {
    const listarMantenimiento = await makeRequest(`${API_PROD}/api/Mantenimiento/buscar_seguimiento`);

    console.log('Mantenimientos obtenidos:', listarMantenimiento);

    if (listarMantenimiento && Array.isArray(listarMantenimiento)) {
      setMantenimientos(listarMantenimiento);
      return listarMantenimiento;
    } else {
      setMantenimientos([]);
      return [];
    }
  } catch (error) {
    console.error("Error al listar mantenimiento:", error);
    setMantenimientos([]);
    return []; // Devuelve arreglo vacío si falla
  }
};

  const handleEditarMantenimiento = async (mantenimientoId: string | number, mantenimientoInput: Partial<MantenimientoDTO>) => {
    try {
      // Validación básica
      if (!mantenimientoId) {
        throw new Error('ID del mantenimiento es requerido');
      }

      if (!mantenimientoInput) {
        throw new Error('Los datos del mantenimiento son requeridos');
      }

      // URL corregida para editar mantenimiento específico
      const data = await makeRequest(`${API_PROD}/api/Mantenimiento/editar_seguimiento/${mantenimientoId}`, {
        method: "PUT",
        body: JSON.stringify(mantenimientoInput)
      });

      console.log('Mantenimiento editado:', data);
      
      // Actualizar el item en la lista local
      if (data) {
        setMantenimientos(prev => 
          prev.map(item => 
            item.nombre === mantenimientoId ? { ...item, ...data } : item
          )
        );
      }
      
      return data;
    } catch (error) {
      console.error("Error al editar mantenimiento:", error);
      throw error;
    }
  };

  // Función para eliminar un mantenimiento
  const handleEliminarMantenimiento = async (mantenimientoId: string | number) => {
    try {
      if (!mantenimientoId) {
        throw new Error('ID del mantenimiento es requerido');
      }

      const data = await makeRequest(`${API_PROD}/api/Mantenimiento/eliminar_seguimiento/${mantenimientoId}`, {
        method: "DELETE"
      });

      console.log('Mantenimiento eliminado:', data);
      
      // Eliminar el item de la lista local
      setMantenimientos(prev => prev.filter(item => item.nombre !== mantenimientoId));
      
      return data;
    } catch (error) {
      console.error("Error al eliminar mantenimiento:", error);
      throw error;
    }
  };

  // Función para buscar mantenimientos por múltiples criterios
  const handleFiltrarMantenimientos = async (filtros: {
    nombre?: string;
    fecha?: string;
    estado?: string;
    tipo?: string;
  }) => {
    try {
      const params = new URLSearchParams();
      
      if (filtros.nombre?.trim()) params.append('nombre', filtros.nombre.trim());
      if (filtros.fecha?.trim()) params.append('fecha', filtros.fecha.trim());
      if (filtros.estado?.trim()) params.append('estado', filtros.estado.trim());
      if (filtros.tipo?.trim()) params.append('tipo', filtros.tipo.trim());

      const url = `${API_PROD}/api/Mantenimiento/filtrar_seguimiento?${params.toString()}`;
      const data = await makeRequest(url);
      
      console.log('Mantenimientos filtrados:', data);
      
      if (data && Array.isArray(data)) {
        setMantenimientos(data);
      } else {
        setMantenimientos([]);
      }
      
      return data;
    } catch (error) {
      console.error("Error al filtrar mantenimientos:", error);
      throw error;
    }
  };


  // Función helper para resetear el estado del hook
  const resetState = () => {
    setMantenimientos([]);
    reset();
  };

  // Función para obtener estadísticas de mantenimientos
  const getMantenimientosStats = () => {
    const total = mantenimientos.length;

    return {
      total,
      isEmpty: total === 0,
      hasData: total > 0
    };
  };

  return {
    // Estado
    mantenimientos,
    setMantenimientos,
    
    // Funciones principales (las que ya tenías)
    handleBuscarNombre,
    handleCrearMantenimiento,
    handleListarMantenimiento,
    handleEditarMantenimiento,
    
    // Funciones nuevas
    handleEliminarMantenimiento,
    handleFiltrarMantenimientos,
    
    // Estados del hook
    loading,
    error,
    
    // Utilidades
    resetState,
    getMantenimientosStats
  };
};

export default useMantenimiento;