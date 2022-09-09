import { useEffect } from 'react';
import './Painel.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import quimica from "../../assets/exercicio-quimica.png";
import funcoes from '../../assets/exercicio-funcoes.png';

export default function Painel(){
    //usar o useNavigate pra verificar o token e redirecionar caso não encontre
    useEffect(()=>{
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    },[])
    return(
    <>
        <Header/>
        <main id="Painel">
            <div id="cursos-container">
                <h2>Cursos adquiridos</h2>
                <div id="cursos">
                    <div class="card-curso">

                    </div>
                    <div class="card-curso">

                    </div>
                    <div class="card-curso"></div>
                    <div class="card-curso"></div>
                    <div class="card-curso"></div>
                    <div class="card-curso"></div>

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