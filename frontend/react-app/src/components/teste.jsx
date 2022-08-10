import React from 'react';
import { useEffect } from 'react';
import { useTema } from '../providers/tema.jsx';
import './Teste.css'

export default function Teste(){
const [valor,setValor] = useTema();
useEffect(()=>{

},[])

return(
    <main id='tmain'>
        <div id='tsidebar'>

        </div>
        <div id='tconteudo'>
            
        </div>
    </main>
)
}