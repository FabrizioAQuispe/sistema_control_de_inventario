import React from 'react'
import { cookieParse } from '../provider/CookiesData'
import { API_PROD } from '../models/variables';
import { NextResponse } from 'next/server';
import { error } from 'console';

const useCategorias = () => {
    const token = cookieParse[0].token;

    const handleListCategorias = async () => {
        try{
            const response = await fetch(`${API_PROD}/api/Categorias/ListarCategorias`,{
                headers:{
                    "Content-Type" : "application/json",
                    "Authorization" : `Bearer ${token}`
                },
                method: "GET",
            });

            if(!response.ok){
                NextResponse.json({error:"INTERNAL SERVER ERROR",status:500})
            }
            const dataCategorias = await response.json();

            if(dataCategorias.length > 0){
                NextResponse.json({error: "NOT FOUN DATA",status:400})
            }
            console.log(dataCategorias)
            return dataCategorias;
        }catch(error:any){
            console.error("ERROR SERVER HANDLE LIST CATEGORIAS: " + error);
        }
    }

    return {
        handleListCategorias
    }
}

export default useCategorias