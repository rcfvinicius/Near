//import {Navigate, useNavigate} from 'react-router-dom';
import {useAuth} from './PrivateRoute.jsx';

/* export default async function Auth(){
    const [logado,setLogado] = useAuth();
    //const navigate = useNavigate();
    try{
        const controller = new AbortController();
        setTimeout(() => {controller.abort()},6000);
        let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/token`,{
            signal:controller.signal,
            method:'GET',
            headers:{
                'x-access-token': 'yJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MmNiMTdiMGZmZTYxODc5OGQ0OTc1NDgiLCJub21lIjoibm9tZSBhcnRpZmljaWFsIiwiZW1haWwiOiJleGVtcGxvQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsInRva2VuSW5mbyI6InRva2VuIGFydGlmaWNpYWwiLCJleHAiOjE2NjI4NDY2NDcsImlhdCI6MTY2Mjg0NTc0N30.3Oxgw7K_PICV2AXRKUxOr3FZg819EO25xY4nTFFyVow'
            }
        })
        let res = await resposta.text();
        console.log(res)
        console.log(localStorage.getItem("token"))
        //JSON.parse(res)
        //setLogado(true)
       // navigate('/login')
    }catch(err){
        console.log('catch')
        //setLogado(false)
    }
} */