// Table.tsx - Versión con tabla HTML tradicional
import React from 'react';
import { MovimientosDTO } from '../models/MovimientosDTO';
import {cookieParse} from '../provider/CookiesData';

interface Props {
  movimientos: MovimientosDTO[];
}

const Table = ({ movimientos }: Props) => {
  
  return (
    // ✅ Wrapper con altura limitada
    <div className="max-h-[calc(70vh-100px)] border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm overflow-y-auto">
      <div className="overflow-y-auto max-h-full">
        <table 
          id="movimientos-table"
          className="min-w-full divide-y divide-gray-200"
        >
          <thead className="bg-gray-800 text-white sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">FECHA</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">NOMBRE</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">INGRESO</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">SALIDA</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">STOCK</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">REFERENCIA</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {movimientos.length > 0 ? (
              movimientos.map((item, index) => (
                <tr 
                  key={index} 
                  className={`hover:bg-gray-50 transition-colors ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  }`}
                >
                  <td className="px-4 py-3 text-sm text-gray-600">{item.fecha}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.nombre}</td>
                  <td className="px-4 py-3 text-sm text-green-600 font-medium">{item.ingresos || '-'}</td>
                  <td className="px-4 py-3 text-sm text-red-600 font-medium">{item.salidas || '-'}</td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-bold">{item.stock}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.referencia || '-'}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-20 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <svg className="w-12 h-12 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <p>No hay movimientos disponibles</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;