import React from 'react'
import { LoginInput } from '../models/LoginInputDTO'


const useUser = () => {
    const handleLogin = async (loginInput:LoginInput) => {
        try{
            const response = await fetch(`http://localhost:5270/auth/users`,{
                headers:{
                    "Content-Type" : "application/json"
                },
                method: "POST",
                body: JSON.stringify(loginInput)
            });
            if(!response.ok){
                console.error("ERROR RESPONSE HANDLE LOGIN");
            }

            const dataResponse = await response.json();
            return dataResponse;
        }catch(error:any){
            console.error("ERROR SERVER HANDLE LOGIN: " + error);
        }
    }

    return {
        handleLogin
    }
}

export default useUser