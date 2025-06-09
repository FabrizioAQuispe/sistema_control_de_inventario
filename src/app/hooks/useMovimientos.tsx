// hooks/useMovimientos.ts
import { useState } from 'react';
import { ListaMovimientosDTO } from '../models/ListaMovimientosDTO';
import ObtenerCookies from '../models/ObtenerCookies';
import { API_PROD } from '../models/variables';


const useMovimientos = () => {
    const [movimientos, setMovimientos] = useState<ListaMovimientosDTO[]>([]);
    const { cookieParse } = ObtenerCookies();


    const handleGetMovimientos = async () => {
        try {
            const response = await fetch(`${API_PROD}/api/Mantenimiento/listar_movimientos`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cookieParse[0].token}`
                },
                method: "GET",
            });

            if (!response.ok) {
                console.error("ERROR RESPONSE OKEY API");
                return;
            }

            const dataResponse = await response.json();
            console.log(dataResponse);
            return dataResponse;
        } catch (error: any) {
            console.error("ERROR SERVER RESPONSE: " + error);
        }
    };

    const handleFiltrarMovimientos = async (nombre:string,fecha:string,referencia:string) => {
        try{
            const response = await fetch(`${API_PROD}/api/Mantenimiento/filtrar_movimiento?nombre=${nombre}&fecha=${fecha}&referencia=${referencia}`,{
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${cookieParse[0].token}`
                },
                method: "GET"
            });

            if(!response.ok){
                console.error('ERROR AL FILTRAR LOS MOVIMIENTOS');
            }

            const data = await response.json();
            return data;
        }catch(error: any){
            console.error("ERROR SERVER RESPONSE: " + error);
        }
    }

    return {
        movimientos,
        handleGetMovimientos,
        handleFiltrarMovimientos
    };
};

export default useMovimientos;
