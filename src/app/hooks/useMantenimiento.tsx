import React from 'react'
import { MantenimientoDTO } from '../models/MantenimientoDTO';

const useMantenimiento = () => {

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

            // Extrae solo los nombres
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
                    "Content-Type": "application/json"
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
                    "Content-Type": "application/json"
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
    return {
        handleBuscarNombre,
        handleCrearMantenimiento,
        handleListarMantenimiento
    }
}



export default useMantenimiento