import {Navigate} from 'react-router-dom';

export default function PrivateRoute({children}){
    const logado = true;
    return(
        logado ? children : <Navigate to='/'/>
    )
}