"use client";

import ObtenerCookies from '@/app/models/ObtenerCookies'
import React, { useEffect, useState } from 'react'
import { FaAd, FaDollarSign, FaMonero, FaParking } from 'react-icons/fa'
import { FaTag } from 'react-icons/fa6'
import Cookies from 'js-cookie';


const Index = () => {
    const cookieProfile = typeof window !== 'undefined' ? Cookies.get("data") : null;
    const cookieParse = cookieProfile ? JSON.parse(cookieProfile) : [];
    

  return (
    <section className='px-4 py-6'>
      <h1 className='text-3xl'>Dashboard del {cookieParse[0].nombre_usuario}</h1>
      <div className='grid grid-cols-3 gap-3 mt-10 justify-center items-center m-auto '>
        <div className='w-[450px] h-[200px] border rounded-md grid grid-cols-2 items-center justify-around p-4'>
          <FaDollarSign className='text-7xl' />
          <div className='flex flex-col items-center text-4xl ml-10'>
            <span>Ingresos</span>
            <span className='ml-10'>50</span>
          </div>
        </div>
        <div className='w-[450px] h-[200px] border rounded-md grid grid-cols-2 items-center justify-around p-4'>
          <FaParking className='text-7xl' />
          <div className='flex flex-col items-center text-4xl ml-10'>
            <span>Salidas</span>
            <span className='ml-10'>20</span>
          </div>
        </div>        <div className='w-[450px] h-[200px] border rounded-md grid grid-cols-2 items-center justify-around p-4'>
          <FaTag className='text-7xl' />
          <div className='flex flex-col items-center text-4xl ml-10'>
            <span>Stock</span>
            <span className='ml-10'>30</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Index