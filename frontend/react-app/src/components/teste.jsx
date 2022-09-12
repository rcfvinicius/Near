import React from 'react';
import { useEffect } from 'react';
import { useTema } from '../utils/tema.jsx';
import './Teste.css'


export default function Teste(){
const [valor,setValor] = useTema();

useEffect(()=>{
    
},[])

return(
    <main id='tmain'>
        <h1>{valor}</h1>
        <div id='tsidebar'>

        </div>
        <div id='tconteudo'>
            
        </div>
    </main>
)
}