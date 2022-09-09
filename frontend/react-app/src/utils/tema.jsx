import React from 'react';
import { useState } from 'react';


export const TemaContext = React.createContext();
export function TemaProvider(props){
    const [valor,setValor] = useState('provedor')
    return(
        <TemaContext.Provider value={[valor,setValor]}>
            {props.children}
        </TemaContext.Provider>
    );
}
export const useTema = () => React.useContext(TemaContext);