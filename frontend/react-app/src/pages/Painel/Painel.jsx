import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../../utils/Authentication.jsx';

import './Painel.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import quimica from "../../assets/exercicio-quimica.png";
import funcoes from '../../assets/exercicio-funcoes.png';
import reset from '../../assets/reset.png'

export default function Painel(){
    const navigate = useNavigate();
    const [logado,setLogado,returnTo,setReturnTo] = useAuth();

    async function editarPerfil(event){
        event.preventDefault();
        try{
            document.querySelector('#Painel #perfil-direito #load-perfil #erro').style = 'display:none';
            document.querySelector('#Painel #perfil-direito #load-perfil #load').style = 'display:inline-block;';

            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);

            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/login`,{
                signal: controller.signal,
                method: 'PATCH',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    //email: document.querySelector('#Login #user').value,
                    //senha: document.querySelector('#Login #pass').value
                })
            })
            
            let res = await resposta.text();
            document.querySelector('#Painel #perfil-direito #load-perfil #load').style = 'display:none';
            
        }catch(err){
            document.querySelector('#Painel #perfil-direito #load-perfil #load').style = 'display:none';
            document.querySelector('#Painel #perfil-direito #load-perfil #erro').style = 'display:inline-block';

            console.log(err);
        }
    }


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
               <section>
               <div id="perfil-esquerdo" className='card-painel'>
                    <div id="img-placeholder">
                    <img src={quimica}></img>
                    </div>
                    <h4>Alterar imagem de perfil</h4>
                    <input type='file' accept="image/png, image/jpeg"></input>
               </div>
               <div id="perfil-direito" className='card-painel'>
                <form onSubmit={editarPerfil}>
                    <input type='email' disabled value='email@gmail'></input>
                    <button id='btn1' type="button"></button>

                    <input type='text' placeholder='Alterar nome'></input>
                    <button id='btn2' type="button"></button>

                    <input type='password' placeholder='Digite uma nova senha'></input>
                    <button id='btn3' type="button"></button>

                    <input type='password' placeholder='Confirme a senha'></input>
                    <button id='btn4' type="button"></button>

                    <div id='submit-e-load'>
                    <button id='btn5' type="submit">alterar dados</button>
                    <div id='load-perfil'>
                        <div id='load'></div>
                        <div id='erro'></div>
                    </div>
                    </div>

                </form>
               </div>
               </section>
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