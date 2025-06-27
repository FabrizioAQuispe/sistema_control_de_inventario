"use client";
import ObtenerCookies from '@/app/models/ObtenerCookies'
import React, { useEffect, useState } from 'react'
import Cookies from 'js-cookie';
import { ProductosDTO } from '@/app/models/ProductsDTO';
import { MovimientosDTO } from '@/app/models/MovimientosDTO';
import useProductos from '@/app/hooks/useProductos';

const Index = () => {

  const cookieProfile = typeof window !== 'undefined' ? Cookies.get("data") : null;
  const cookieParse = cookieProfile ? JSON.parse(cookieProfile) : [];


  const [ingresos, setIngresos] = useState<any[]>([]);
  const [salidas, setSalidas] = useState<any[]>([]);
  const [totales, setTotaltes] = useState<any[]>([]);

  const { handleListarIngresos, handleListarSalidas, handleListarStockTotal } = useProductos();

    const [nombreUsuario, setNombreUsuario] = useState<string | null>(null);

    useEffect(() => {
    const cookieProfile = Cookies.get("data");
    if (cookieProfile) {
      try {
        const parsed = JSON.parse(cookieProfile);
        setNombreUsuario(parsed[0]?.nombre_usuario ?? 'Invitado');
      } catch {
        setNombreUsuario('Invitado');
      }
    } else {
      setNombreUsuario('Invitado');
    }
  }, []);

  useEffect(() => {
    const fetchingDataSalidas = async () => {
      const responseSalidas = await handleListarSalidas();
      setSalidas(responseSalidas);
    }

    const fetchingDataIngresos = async () => {
      const responseIngresos = await handleListarIngresos();
      setIngresos(responseIngresos);
    }

    const fetchinDataStockTotal = async () => {
      const responseStoclTotal = await handleListarStockTotal();
      setTotaltes(responseStoclTotal);
    }

    fetchingDataSalidas();
    fetchingDataIngresos();
    fetchinDataStockTotal();
  }, [])


  return (
    <div className="flex   bg-gray-100">
      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard de {nombreUsuario}</h1>
          <p className="text-gray-600">Resumen general del inventario</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Ingresos */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              {
                salidas.map((item: any) => (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ingresos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {salidas.reduce((total, item) => total + Number(item.salidas), 0)}
                    </p>
                  </div>
                ))
              }
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4zM18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Salidas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              {
                ingresos.map((item: any) => (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Salidas</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {ingresos.reduce((total, item) => total + Number(item.ingresos), 0)}
                    </p>
                  </div>
                ))
              }
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

          </div>

          {/* Stock */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              {
                totales.map((item: any) => (
                  <div>
                    <p className="text-sm font-medium text-gray-600">Stock</p>
                    <p className='text-2xl font-bold text-gray-900'>
                      {totales.reduce((total, item) => total + Number(item.stock_total), 0)}

                    </p>
                  </div>
                ))
              }
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-blue-600 font-medium">Normal</span>
            </div>
          </div>


        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Movimientos Hoy */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Movimientos Hoy</p>
                <p className="text-2xl font-bold text-green-600">12</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-green-600 font-medium">Actividad normal</span>
            </div>
          </div>

          {/* Alertas Activas */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Alertas Activas</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM4.266 7.566l5.196-5.196A2 2 0 0111.074 2h5.852a2 2 0 011.414.586l2.074 2.074a2 2 0 01.586 1.414v5.852a2 2 0 01-.586 1.414l-5.196 5.196a2 2 0 01-2.828 0l-5.196-5.196a2 2 0 010-2.828z" />
                </svg>
              </div>
            </div>
            <div className="mt-4">
              <span className="text-sm text-red-600 font-medium">Revisar urgente</span>
            </div>
          </div>
        </div>

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Movements */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Movimientos Recientes</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Entrada - Laptop HP</p>
                    <p className="text-xs text-gray-500">Hace 2 horas</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-600">+5</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Salida - Mouse Logitech</p>
                    <p className="text-xs text-gray-500">Hace 4 horas</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-red-600">-2</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Entrada - Teclado</p>
                    <p className="text-xs text-gray-500">Ayer</p>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-600">+10</span>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Productos Más Movidos</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Laptop HP Pavilion</p>
                    <p className="text-xs text-gray-500">Stock: 15</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">25 mov.</p>
                  <p className="text-xs text-green-600">+15%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mouse Logitech</p>
                    <p className="text-xs text-gray-500">Stock: 8</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">20 mov.</p>
                  <p className="text-xs text-red-600">-5%</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Teclado Mecánico</p>
                    <p className="text-xs text-gray-500">Stock: 12</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900">18 mov.</p>
                  <p className="text-xs text-green-600">+8%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
