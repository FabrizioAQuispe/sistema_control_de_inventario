// hooks/useMovimientos.ts
import { useState } from 'react';
import { ListaMovimientosDTO } from '../models/ListaMovimientosDTO';
import ObtenerCookies from '../models/ObtenerCookies';


const useMovimientos = () => {
    const [movimientos, setMovimientos] = useState<ListaMovimientosDTO[]>([]);
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

    return {
        movimientos,
        handleGetMovimientos
    };
};

export default useMovimientos;
