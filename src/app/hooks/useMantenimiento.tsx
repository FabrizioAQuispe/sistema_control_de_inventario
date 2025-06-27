import React, { useState } from 'react';
import { MantenimientoDTO } from '../models/MantenimientoDTO';
import { API_PROD } from '../models/variables';
import { useApiRequest } from '../utils/AuthUtils';
import { ListaMovimientosDTO } from '../models/ListaMovimientosDTO';
import { MantenimientoFiltroDTO } from '../models/MantenimientoFiltroDTO';
import { toast } from 'react-toastify';

const useMantenimiento = () => {
  // Estado local para almacenar la lista de mantenimientos
  const [mantenimientos, setMantenimientos] = useState<MantenimientoDTO[]>([]);
  
  // Hook reutilizable con manejo automático de errores, reintentos y auth
  const { makeRequest, loading, error, reset } = useApiRequest();

  const handleBuscarNombre = async (nombre: string) => {
    try {
      // Validación básica
      if (!nombre || !nombre.trim()) {
        toast.warning('Por favor ingrese un nombre para buscar', {
          position: "top-right",
        });
        console.warn("Nombre vacío para búsqueda");
        return [];
      }

      // Toast de inicio de búsqueda
      const searchToast = toast.loading('Buscando productos...', {
        position: "top-right",
      });

      const url = `${API_PROD}/api/Mantenimiento/buscar_nombre?nombre=${encodeURIComponent(nombre.trim())}`;
      const lista = await makeRequest(url);

      // Actualizar toast de carga
      toast.dismiss(searchToast);

      if (!lista || !Array.isArray(lista)) {
        toast.warning('No se encontraron productos con ese nombre', {
          position: "top-right",
        });
        console.warn("Respuesta de búsqueda no es un array válido");
        return [];
      }

      // Mapear y filtrar los datos
      const soloNombres = lista.map((item: any) => ({
        nombre: item.nombre,
        id_prod: item.id_prod
      })).filter(item => item.nombre && item.id_prod);

      if (soloNombres.length === 0) {
        toast.info('No se encontraron productos válidos', {
          position: "top-right",
        });
      } else {
        toast.success(`Se encontraron ${soloNombres.length} producto${soloNombres.length !== 1 ? 's' : ''}`, {
          position: "top-right",
          autoClose: 3000,
        });
      }

      console.log('Nombres encontrados:', soloNombres);
      return soloNombres;
    } catch (error) {
      console.error("Error al buscar nombre:", error);
      toast.error('Error al buscar productos. Intente nuevamente.', {
        position: "top-right",
      });
      return [];
    }
  };

  const handleCrearMantenimiento = async (mantenimientoInput: MantenimientoDTO) => {
    try {
      // Validación básica
      if (!mantenimientoInput) {
        toast.error('Los datos del mantenimiento son requeridos', {
          position: "top-right",
        });
        throw new Error('Los datos del mantenimiento son requeridos');
      }

      // Validaciones específicas
      if (!mantenimientoInput.nombre?.trim()) {
        toast.error('El nombre del producto es requerido', {
          position: "top-right",
        });
        throw new Error('El nombre del producto es requerido');
      }

      if (!mantenimientoInput.cantidad || mantenimientoInput.cantidad <= 0) {
        toast.error('La cantidad debe ser mayor a cero', {
          position: "top-right",
        });
        throw new Error('La cantidad debe ser mayor a cero');
      }

      // Toast de proceso
      const createToast = toast.loading('Creando seguimiento de mantenimiento...', {
        position: "top-right",
      });

      const data = await makeRequest(`${API_PROD}/api/Mantenimiento/crear_seguimiento`, {
        method: "POST",
        body: JSON.stringify(mantenimientoInput)
      });

      // Actualizar toast
      toast.dismiss(createToast);

      console.log('Mantenimiento creado:', data);
      
      if (data) {
        toast.success(`Seguimiento creado exitosamente para "${mantenimientoInput.nombre}"`, {
          position: "top-right",
          autoClose: 5000,
        });
      }

      return data;
    } catch (error:any) {
      console.error("Error al crear mantenimiento:", error);
      if (!error.message.includes('son requeridos') && !error.message.includes('mayor a cero')) {
        toast.error('Error al crear el seguimiento. Intente nuevamente.', {
          position: "top-right",
        });
      }
      throw error;
    }
  };

  const handleListarMantenimiento = async (): Promise<MantenimientoFiltroDTO[]> => {
    try {
      // Toast de carga
      const listToast = toast.loading('Cargando seguimientos...', {
        position: "top-right",
      });

      const listarMantenimiento = await makeRequest(`${API_PROD}/api/Mantenimiento/buscar_seguimiento`);

      // Actualizar toast
      toast.dismiss(listToast);

      console.log('Mantenimientos obtenidos:', listarMantenimiento);

      if (listarMantenimiento && Array.isArray(listarMantenimiento)) {
        setMantenimientos(listarMantenimiento);
        
        if (listarMantenimiento.length === 0) {
          toast.info('No hay seguimientos registrados', {
            position: "top-right",
          });
        } else {
          toast.success(`Se cargaron ${listarMantenimiento.length} seguimiento${listarMantenimiento.length !== 1 ? 's' : ''}`, {
            position: "top-right",
            autoClose: 3000,
          });
        }
        
        return listarMantenimiento;
      } else {
        setMantenimientos([]);
        toast.warning('No se pudieron cargar los seguimientos', {
          position: "top-right",
        });
        return [];
      }
    } catch (error) {
      console.error("Error al listar mantenimiento:", error);
      setMantenimientos([]);
      toast.error('Error al cargar los seguimientos. Intente nuevamente.', {
        position: "top-right",
      });
      return [];
    }
  };

  const handleEditarMantenimiento = async (mantenimientoId: string | number, mantenimientoInput: Partial<MantenimientoDTO>) => {
    try {
      // Validación básica
      if (!mantenimientoId) {
        toast.error('ID del mantenimiento es requerido', {
          position: "top-right",
        });
        throw new Error('ID del mantenimiento es requerido');
      }

      if (!mantenimientoInput) {
        toast.error('Los datos del mantenimiento son requeridos', {
          position: "top-right",
        });
        throw new Error('Los datos del mantenimiento son requeridos');
      }

      // Validar cantidad si está presente
      if (mantenimientoInput.cantidad !== undefined && mantenimientoInput.cantidad <= 0) {
        toast.error('La cantidad debe ser mayor a cero', {
          position: "top-right",
        });
        throw new Error('La cantidad debe ser mayor a cero');
      }

      // Toast de proceso
      const editToast = toast.loading('Actualizando seguimiento...', {
        position: "top-right",
      });

      const data = await makeRequest(`${API_PROD}/api/Mantenimiento/editar_seguimiento/${mantenimientoId}`, {
        method: "PUT",
        body: JSON.stringify(mantenimientoInput)
      });

      // Actualizar toast
      toast.dismiss(editToast);

      console.log('Mantenimiento editado:', data);
      
      if (data) {
        // Actualizar el item en la lista local
        setMantenimientos(prev => 
          prev.map(item => 
            item.nombre === mantenimientoId ? { ...item, ...data } : item
          )
        );

        toast.success('Seguimiento actualizado exitosamente', {
          position: "top-right",
          autoClose: 4000,
        });
      }
      
      return data;
    } catch (error:any) {
      console.error("Error al editar mantenimiento:", error);
      if (!error.message.includes('requerido') && !error.message.includes('mayor a cero')) {
        toast.error('Error al actualizar el seguimiento. Intente nuevamente.', {
          position: "top-right",
        });
      }
      throw error;
    }
  };

  const handleEliminarMantenimiento = async (mantenimientoId: string | number) => {
    try {
      if (!mantenimientoId) {
        toast.error('ID del mantenimiento es requerido', {
          position: "top-right",
        });
        throw new Error('ID del mantenimiento es requerido');
      }

      // Confirmar eliminación
      const confirmar = window.confirm('¿Está seguro de que desea eliminar este seguimiento?');
      if (!confirmar) {
        toast.info('Eliminación cancelada', {
          position: "top-right",
          autoClose: 2000,
        });
        return null;
      }

      // Toast de proceso
      const deleteToast = toast.loading('Eliminando seguimiento...', {
        position: "top-right",
      });

      const data = await makeRequest(`${API_PROD}/api/Mantenimiento/eliminar_seguimiento/${mantenimientoId}`, {
        method: "DELETE"
      });

      // Actualizar toast
      toast.dismiss(deleteToast);

      console.log('Mantenimiento eliminado:', data);
      
      if (data !== null) {
        // Eliminar el item de la lista local
        setMantenimientos(prev => prev.filter(item => item.nombre !== mantenimientoId));
        
        toast.success('Seguimiento eliminado exitosamente', {
          position: "top-right",
          autoClose: 4000,
        });
      }
      
      return data;
    } catch (error:any) {
      console.error("Error al eliminar mantenimiento:", error);
      if (!error.message.includes('requerido')) {
        toast.error('Error al eliminar el seguimiento. Intente nuevamente.', {
          position: "top-right",
        });
      }
      throw error;
    }
  };

  const handleFiltrarMantenimientos = async (filtros: {
    nombre?: string;
    fecha?: string;
    estado?: string;
    tipo?: string;
  }) => {
    try {
      // Validar que al menos un filtro esté presente
      const tienesFiltros = Object.values(filtros).some(valor => valor?.trim());
      if (!tienesFiltros) {
        toast.warning('Por favor ingrese al menos un criterio de búsqueda', {
          position: "top-right",
        });
        return [];
      }

      const params = new URLSearchParams();
      
      if (filtros.nombre?.trim()) params.append('nombre', filtros.nombre.trim());
      if (filtros.fecha?.trim()) params.append('fecha', filtros.fecha.trim());
      if (filtros.estado?.trim()) params.append('estado', filtros.estado.trim());
      if (filtros.tipo?.trim()) params.append('tipo', filtros.tipo.trim());

      // Toast de proceso
      const filterToast = toast.loading('Filtrando seguimientos...', {
        position: "top-right",
      });

      const url = `${API_PROD}/api/Mantenimiento/filtrar_seguimiento?${params.toString()}`;
      const data = await makeRequest(url);
      
      // Actualizar toast
      toast.dismiss(filterToast);
      
      console.log('Mantenimientos filtrados:', data);
      
      if (data && Array.isArray(data)) {
        setMantenimientos(data);
        
        if (data.length === 0) {
          toast.info('No se encontraron seguimientos con los filtros aplicados', {
            position: "top-right",
          });
        } else {
          toast.success(`Se encontraron ${data.length} seguimiento${data.length !== 1 ? 's' : ''} que coinciden con los filtros`, {
            position: "top-right",
            autoClose: 4000,
          });
        }
      } else {
        setMantenimientos([]);
        toast.warning('No se pudieron filtrar los seguimientos', {
          position: "top-right",
        });
      }
      
      return data;
    } catch (error:any) {
      console.error("Error al filtrar mantenimientos:", error);
      toast.error('Error al filtrar seguimientos. Intente nuevamente.', {
        position: "top-right",
      });
      throw error;
    }
  };

  // Función helper para resetear el estado del hook
  const resetState = () => {
    setMantenimientos([]);
    reset();
    toast.info('Estado del hook reiniciado', {
      position: "top-right",
      autoClose: 2000,
    });
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