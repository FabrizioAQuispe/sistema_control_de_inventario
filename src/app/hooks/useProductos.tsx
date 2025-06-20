import React from 'react';
import { ProductosDTO } from '../models/ProductsDTO';
import { API_PROD } from '../models/variables';
import { useApiRequest } from '@/app/utils/AuthUtils';

const useProductos = () => {
  const { makeRequest, loading, error, reset } = useApiRequest();

  const handleGetProductos = async (): Promise<ProductosDTO[]> => {
    try {
      const response = await makeRequest(`${API_PROD}/listar_productos`);
      return response as ProductosDTO[];
    } catch (error) {
      console.error("Error al obtener productos:", error);
      return []; 
    }
  };

  const handleCreateProductos = async (productosInput: ProductosDTO) => {
    try {
      if (!productosInput) {
        throw new Error('Los datos del producto son requeridos');
      }

      const data = await makeRequest(`${API_PROD}/crear_productos`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productosInput)
      });

      console.log('Producto creado:', data);
      return data;
    } catch (error) {
      console.error("Error al crear producto:", error);
      throw error;
    }
  };

  const handleUpdateProductos = async (productosInput: ProductosDTO) => {
    try {
      if (!productosInput) {
        throw new Error('Los datos del producto son requeridos');
      }

      const data = await makeRequest(`${API_PROD}/editar_productos`, {
        method: "PUT",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productosInput)
      });

      console.log('Producto actualizado:', data);
      return data;
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  };

  const handleListarSalidas = async () => {
    try {
      const response = await makeRequest(`${API_PROD}/api/Dashboard/Listar_Salidas`);
      
      // Manejo similar para extraer los datos correctos
      return response as [];
    } catch (error) {
      console.error("Error al listar salidas:", error);
      return []; // Retornar array vacío en caso de error
    }
  };

  const handleListarIngresos = async () => {
    try {
      const response = await makeRequest(`${API_PROD}/api/Dashboard/Listar_Ingresos`);
      return response as [];
    } catch (error) {
      console.error("Error al listar ingresos:", error);
      return [];
    }
  };

  const handleListarStockTotal = async () => {
    try {
      const response = await makeRequest(`${API_PROD}/api/Dashboard/Listar_Stock_Total`);
      
      // Para stock total, podría ser un número o un objeto
      return response as any;
    } catch (error) {
      console.error("Error al listar stock total:", error);
      return 0;
    }
  };

  const handleDeleteProducto = async (productoId: string | number) => {
    try {
      if (!productoId) {
        throw new Error('ID del producto es requerido');
      }

      const data = await makeRequest(`${API_PROD}/eliminar_productos/${productoId}`, {
        method: "DELETE"
      });

      console.log('Producto eliminado:', data);
      return data;
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  };

  const resetState = () => {
    reset();
  };

  return {
    handleGetProductos,
    handleCreateProductos,
    handleUpdateProductos,
    handleListarIngresos,
    handleListarSalidas,
    handleListarStockTotal,
    handleDeleteProducto,
    loading,
    error,
    resetState
  };
};

export default useProductos;