import React from 'react';
import Login from '../pages/Login/Login.jsx';
import { useAuth } from './Authentication.jsx';
import {useNavigate} from 'react-router-dom';

export const PrivateRouteContext = React.createContext();
export default function PrivateRoute(props){
    const navigate = useNavigate();
    const logado = useAuth()[0];
    const setReturnTo = useAuth()[3];
    if(!logado){
        setReturnTo('/painel');
        //navigate('/login');
    }
    console.log(logado)
    return(
        <PrivateRouteContext.Provider>
            {logado ? props.children : <Login/>}
        </PrivateRouteContext.Provider>
    );
}
//export const  = () => React.useContext(PrivateRouteContext);