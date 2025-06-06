import React from 'react'
import { MantenimientoDTO } from '../models/MantenimientoDTO';
import ObtenerCookies from '../models/ObtenerCookies';

const useMantenimiento = () => {

    const {cookieParse} = ObtenerCookies();

    const handleBuscarNombre = async (nombre: string) => {
        try {
            const response = await fetch(
                `http://localhost:5270/api/Mantenimiento/buscar_nombre?nombre=${encodeURIComponent(nombre)}`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: "GET"
                }
            );

            if (!response.ok) {
                console.error("ERROR RESPONSE API BUSCAR NOMBRE");
                return [];
            }

            const lista = await response.json();

            const soloNombres = lista.map((item: any) => ({
                nombre: item.nombre,
                id_prod: item.id_prod
            })); return soloNombres;
        } catch (error: any) {
            console.error("ERROR BUSCAR NOMBRE: " + error);
            return [];
        }
    };

    const handleCrearMantenimiento = async (mantenimientoInput: MantenimientoDTO) => {
        try {
            const response = await fetch('http://localhost:5270/api/Mantenimiento/crear_seguimiento', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${cookieParse[0].token}`

                },
                method: "POST",
                body: JSON.stringify(mantenimientoInput)
            });
            if (!response.ok) {
                console.error("ERROR RESPONSE API CREAR MANTENIMENTO");
            }
            const data = await response.json();
            console.log(data);
            return data;
        } catch (error: any) {
            console.error("ERROR SERVER CREAR MANTENIMIENTO: " + error);
        }
    }

    const handleListarMantenimiento = async () => {
        try {
            const response = await fetch('http://localhost:5270/api/Mantenimiento/buscar_seguimiento', {
                headers: {
                    "Content-Type": "application/json",
                                        "Authorization": `Bearer ${cookieParse[0].token}`

                },
                method: "GET"
            });
            if (!response.ok) {
                console.error("ERROR RESPONSE API LISTAR MANTENIMIENTO");
            }

            const listarMantenimiento = await response.json();
            console.log(listarMantenimiento);
            return listarMantenimiento
        } catch (error: any) {
            console.error("ERROR SERVER LISTAR MANTENIMIENTO: " + error);
        }
    }

    const handleEditarMantenimiento = async () => {
        try {
            const response = await fetch(`http://localhost:5270/editar_productos`, {
                headers: {
                    "Content-Type": "application/json"
                },
            });

            if (!response.ok) {
                console.error("ERROR RESPONSE SERVER API");
            }

            const dataResponse = await response.json();
            return dataResponse;
        } catch (error: any) {
            console.error("ERROR SERVER RESPONSE: " + error);
        }
    }
    return {
        handleBuscarNombre,
        handleCrearMantenimiento,
        handleListarMantenimiento,
        handleEditarMantenimiento
    }
}



export default useMantenimiento