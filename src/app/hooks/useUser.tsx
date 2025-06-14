import React from 'react'
import { LoginInput } from '../models/LoginInputDTO'
import { API_PROD } from '../models/variables';
import Cookies from 'js-cookie';



const useUser = () => {

    const cookieProfile = typeof window !== 'undefined' ? Cookies.get("data") : null;
    const cookieParse = cookieProfile ? JSON.parse(cookieProfile) : [];

    const handleLogin = async (loginInput: LoginInput) => {
        try {
            const response = await fetch(`${API_PROD}/auth/users`, {
                headers: {
                    "Content-Type": "application/json"
                },
                method: "POST",
                body: JSON.stringify(loginInput)
            });
            if (!response.ok) {
                console.error("ERROR RESPONSE HANDLE LOGIN");
            }

            const dataResponse = await response.json();

            return dataResponse;
        } catch (error: any) {
            console.error("ERROR SERVER HANDLE LOGIN: " + error);
        }
    }

    const handlePerfil = async () => {
        try {
            console.log(cookieParse)

        } catch (error: any) {
            console.error("ERROR SERVER API: " + error);
        }
    }

    return {
        handleLogin,
        handlePerfil
    }
}

export default useUser