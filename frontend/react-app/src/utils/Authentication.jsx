import React from 'react';
import { useEffect, useState } from 'react';


export const AuthContext = React.createContext();
//export const Return = React.createContext();

export default function Authentication({children}){
    const [logado,setLogado] = useState();
    const [returnTo,setReturnTo] = useState('/');
    const [tokenData,setTokenData] = useState();
    
    useEffect(()=>{
        async function fetchData(){
            try{
                const controller = new AbortController();
                setTimeout(() => {controller.abort()},4000);
                let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/token`,{
                    signal:controller.signal,
                    method:'GET',
                    headers:{
                        'x-access-token': localStorage.getItem('token')
                    }
                })
                let res = await resposta.text();
                //console.log(res)
                //setTokenData(res);
                //console.log(tokenData);
                setTokenData(JSON.parse(res));

                setLogado(true);
            }catch(err){
                setLogado(false);//false
                setTokenData(false);
            }
        }
        fetchData();
        console.log(tokenData);

    },[logado])
    return(
        <AuthContext.Provider value={[logado,setLogado,returnTo,setReturnTo,tokenData,setTokenData]}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => React.useContext(AuthContext);