import React, { useEffect } from 'react'
import { ProductosDTO } from '../models/ProductsDTO';
import Cookies from 'js-cookie';


const useProductos = () => {

    const cookieProfile = Cookies.get("data");
    const cookieParse = JSON.parse(cookieProfile || "{}");
    const token = cookieParse[0].token;

    const handleGetProductos = async () => {
        try {
            const response = await fetch(`http://localhost:5270/listar_productos`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                method: "GET"
            });

            if (!response.ok) {
                console.error("ERROR SERVER RESPONSE");
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("ERROR HANDLE LIST PRODUCTS: " + error);
        }
    }

    const handleCreateProductos = async (productosInput: ProductosDTO) => {
        try {
            const response = await fetch(`http://localhost:5270/crear_productos`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`

                },
                method: "POST",
                body: JSON.stringify(productosInput)
            });

            if (!response.ok) {
                console.error("ERROR SERVER RESPONSE");
            }

            const data = await response.json();
            console.log(data)
            handleGetProductos()
            return data;
        } catch (error: any) {
            console.error("ERROR HANDLE CREATE PRODUCTS: " + error);
        }
    }

    const handleUpdateProductos = async (productosInput: ProductosDTO) => {
        try {
            const response = await fetch(`http://localhost:5270/editar_productos`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`

                },
                method: "PUT",
                body: JSON.stringify(productosInput)
            });

            if (!response.ok) {
                console.error("ERROR SERVER RESPONSE API UPDATE PRODUCTS");
            }

            const data = await response.json();
            return data;
        } catch (error: any) {
            console.error("ERROR SERVER RESPONSE: " + error);
        }
    }

    return {
        handleGetProductos,
        handleCreateProductos,
        handleUpdateProductos
    }
}

export default useProductos