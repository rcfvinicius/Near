import React from 'react';
import { useEffect } from 'react';
import { useTema } from '../providers/tema.jsx';

export default function Teste(){
const [valor,setValor] = useTema();
useEffect(()=>{
},[])
return(
    <h1>
        {valor}
    </h1>
)
}