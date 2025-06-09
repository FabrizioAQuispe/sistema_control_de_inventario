// Table.tsx
import React from 'react';
import { MovimientosDTO } from '../models/MovimientosDTO';

interface Props {
  movimientos: MovimientosDTO[];
}

const Table = ({ movimientos }: Props) => {
  return (
    <table className="min-w-full border border-gray-200 divide-y divide-gray-300">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="px-4 py-2 text-left">FECHA</th>
          <th className="px-4 py-2 text-left">NOMBRE</th>
          <th className="px-4 py-2 text-left">INGRESO</th>
          <th className="px-4 py-2 text-left">SALIDA</th>
          <th className="px-4 py-2 text-left">STOCK</th>
          <th className="px-4 py-2 text-left">REFERENCIA</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {movimientos.map((item, index) => (
          <tr key={index} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
            <td className="px-4 py-2">{item.fecha}</td>
            <td className="px-4 py-2">{item.nombre}</td>
            <td className="px-4 py-2">{item.ingresos}</td>
            <td className="px-4 py-2">{item.salidas}</td>
            <td className="px-4 py-2">{item.stock}</td>
            <td className="px-4 py-2">{item.referencia}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
