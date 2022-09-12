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
                setTimeout(() => {controller.abort()},6000);
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
                setLogado(false);
                setTokenData(false);
            }
        }
        fetchData()
        console.log(tokenData)
    },[logado])
    return(
        <AuthContext.Provider value={[logado,setLogado,returnTo,setReturnTo,tokenData,setTokenData]}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => React.useContext(AuthContext);



/* 

    async function fetchData(){
        try{
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},6000);
            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/token`,{
                signal:controller.signal,
                method:'GET',
                headers:{
                    'x-access-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmNiMTdiMGZmZTYxODc5OGQ0OTc1NDgiLCJub21lIjoibm9tZSBhcnRpZmljaWFsIiwiZW1haWwiOiJleGVtcGxvQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsInRva2VuSW5mbyI6InRva2VuIGFydGlmaWNpYWwiLCJleHAiOjE2NjI4MzcxNjAsImlhdCI6MTY2MjgzNjI2MH0.f_R2ux9Jbqodj1LYIeUzkbEnimbCaObJl6R8a9rPlCY'
                }
            })
            let res = await resposta.text();
            console.log(res)
            console.log(localStorage.getItem("token"))
            //JSON.parse(res)
            setLogado(true)
        }catch(err){
            console.log('catch')
            setLogado(false)
        }
    }
*/