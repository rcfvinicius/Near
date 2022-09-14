import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../../utils/Authentication.jsx';

import './Painel.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import quimica from "../../assets/exercicio-quimica.png";
import funcoes from '../../assets/exercicio-funcoes.png';

export default function Painel(){
    const navigate = useNavigate();
    const [logado,setLogado,returnTo,setReturnTo] = useAuth();
    useEffect(()=>{
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
/*         if(!logado){
            setReturnTo(window.location.pathname);
            navigate('/login');
        } */
    },[])
    return(
    <>
        <Header/>
        <main id="Painel">
            <div id='perfil'>
               <h2>Seu perfil</h2>
               <div id="perfil-esquerdo" className='card-painel'>

               </div>
               <div id="perfil-direito" className='card-painel'>
                
               </div>
            </div>
            <div id="cursos-container">
                <h2>Cursos adquiridos</h2>
                <div id="cards-cursos">
                    <div className="card card-curso"></div>
                    <div className="card card-curso"></div>
                    <div className="card card-curso"></div>
                    <div className="card card-curso"></div>
                    <div className="card card-curso"></div>
                    <div className="card card-curso"></div>

                </div>
            </div>


            <div id="exercicios-container">
                <h2>Exercicios</h2>
                <div id="exercicios">

                </div>
            </div>

            <div id="cursos-criados-container">
                <h2>Cursos criados</h2>
                <div id="cursos-criados"></div>
            </div>
        </main>
        <Footer/>
    </>
    )
}