import React, { useEffect, useState } from 'react'
import useMovimientos from '../hooks/useMovimientos'
import { MovimientosDTO } from '../models/MovimientosDTO';
import Cookies from 'js-cookie';
import ObtenerCookies from '../models/ObtenerCookies';


const Table = () => {

  const [movimientos, setMovimientos] = useState<MovimientosDTO[]>();

  const {cookieParse} = ObtenerCookies();

  const handleGetMovimientos = async () => {
    try {

      const response = await fetch(`http://localhost:5270/api/Mantenimiento/listar_movimientos`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization" : `Bearer ${cookieParse[0].token}`
        },
        method: "GET",
      });
      if (!response.ok) {
        console.error("ERROR SERVER OK MOVIMIENTOS SERVER")
      }

      const dataList = await response.json();
      console.log(dataList);

      setMovimientos(dataList);
    } catch (error: any) {
      console.error("ERROR SERVER GET MOVIMIENTOS: " + error);
    }
  }

  useEffect(() => {
    handleGetMovimientos();
  }, [])

  return (
    <table className="min-w-full border border-gray-200 divide-y divide-gray-300">
      <thead className="bg-gray-800 text-white">
        <tr>
          <th className="px-4 py-2 text-left">NOMBRE</th>
          <th className="px-4 py-2 text-left">FECHA</th>
          <th className="px-4 py-2 text-left">REFERENCIA</th>
          <th className="px-4 py-2 text-left">INGRESO</th>
          <th className="px-4 py-2 text-left">SALIDA</th>
          <th className="px-4 py-2 text-left">STOCK</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {movimientos?.map((item, index) => (
          <tr
            key={index}
            className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
          >
            <td className="px-4 py-2">{item.nombre}</td>
            <td className="px-4 py-2">{item.fecha}</td>
            <td className="px-4 py-2">{item.referencia}</td>
            <td className="px-4 py-2">{item.ingresos}</td>
            <td className="px-4 py-2">{item.salidas}</td>
            <td className="px-4 py-2">{item.stock}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Table