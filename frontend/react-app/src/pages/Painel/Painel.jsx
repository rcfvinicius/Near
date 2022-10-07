import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../../utils/Authentication.jsx';

import './Painel.css';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import quimica from "../../assets/exercicio-quimica.png";
import funcoes from '../../assets/exercicio-funcoes.png';
import curso from '../../assets/imagens/cursos/morfologia.png'
import fechar from '../../assets/x2.png'

export default function Painel(){
    const navigate = useNavigate();
    //const [logado,setLogado,returnTo,setReturnTo] = useAuth();
    const setLogado = useAuth()[1];
    const tokenData = useAuth()[4];

    function sair(){
        localStorage.removeItem("token");
        setLogado(false);
        navigate('/');
    }

    async function editarPerfil(event){
        event.preventDefault();
        try{
            document.querySelector('#Painel #perfil-direito #load-perfil .erro').style = 'display:none';
            document.querySelector('#Painel #perfil-direito #load-perfil .success').style = 'display:none';
            document.querySelector('#Painel #perfil-direito #load-perfil .load').style = 'display:inline-block;';
            
            if(document.querySelectorAll('#Painel #perfil form input[type="password"]')[0].value !== document.querySelectorAll('#Painel #perfil form input[type="password"]')[1].value){
                throw new Error('SENHAS_DIFERENTES');
            }
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);

            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/login`,{
                signal: controller.signal,
                method: 'PATCH',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8'
                },
                body: JSON.stringify({
                    nome: document.querySelector('#Painel #perfil form input[type="text"]').value,
                    senha: document.querySelector('#Painel #perfil form input[type="password"]').value
                })//mudar esse 'nome' para 'email'
            })
            
            let res = await resposta.text();
            if(res !== 'ok'){
                throw new Error('RES != OK');
            }
            document.querySelector('#Painel #perfil-direito #load-perfil .load').style = 'display:none';
            document.querySelector('#Painel #perfil-direito #load-perfil .success').style = 'display:inline-block';
        }catch(err){
            document.querySelector('#Painel #perfil-direito #load-perfil .load').style = 'display:none';
            document.querySelector('#Painel #perfil-direito #load-perfil .erro').style = 'display:inline-block';

            console.log(err);
        }
    }

    async function getCursosAdquiridos(){
    try{
        const container = document.querySelector('#Painel #cursos-container #cards-cursos');
        container.innerHTML = '';

        const controller = new AbortController();
        setTimeout(() => {controller.abort()},5000);
        let quantidade = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosAdquiridosCount`,{
            signal:controller.signal,
            method:'GET',
            mode:'cors',
            headers:{
                'Content-Type': 'application/json;charset=UTF-8',
                'x-access-token': localStorage.getItem('token')
            }
        })
        let count = parseInt(await quantidade.text());
        //inicio do loop
        for(let i=1;i<=count;i++){
            
            //consulta de dados do curso
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);
            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosAdquiridosDados`,{
                signal:controller.signal,
                method:'POST',
                mode:'cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token':localStorage.getItem('token')
                },
                body: JSON.stringify({
                    curso: i-1
                })
            })
            //console.log(resposta)
            let res = await resposta.json();
  
            
            //consulta de imagem do curso
            const controller2 = new AbortController();
            setTimeout(() => {controller.abort()},5000);
            let resposta2 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosAdquiridosImg?id=${res.id}`,{
                signal:controller2.signal,
                method:'POST',
                mode:'cors'
            })
            let res2 = await resposta2.blob();

            let imgSrc;
            if(res2.type == 'text/html'){
                imgSrc = quimica;
            }else{
                imgSrc = URL.createObjectURL(res2);
            }


            container.innerHTML =
            `
            <button type="button" class="card card-curso btn-curso" data-id="${res.id}">
                <div class='imgCurso-container'>
                <img src="${imgSrc}"></img>
                </div>
                <h3>${res.titulo}</h3>
            </button>
            ` + container.innerHTML;
        }
        
    }catch(err){
        console.log(err);
        if(err == 'Error: IMAGE_NOT_FOUND'){
            //preencher a imgem do curso com uma imagem padrão
        }
    }
    }



    async function getCursosCriados(){
        try{
            const container = document.querySelector('#Painel #cursos-criados-container #cursos-criados');
            container.innerHTML = '';

            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);
            let quantidade = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosCriadosCount`,{
                signal:controller.signal,
                method:'GET',
                mode:'cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token': localStorage.getItem('token')
                }
            })
            let count = parseInt(await quantidade.text());

            //inicio do loop
            for(let i=1;i<=count;i++){
            
                //consulta de dados do curso
                const controller = new AbortController();
                setTimeout(() => {controller.abort()},5000);
                let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosCriadosDados`,{
                    signal:controller.signal,
                    method:'POST',
                    mode:'cors',
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8',
                        'x-access-token':localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        curso: i-1
                    })
                })
                //console.log(resposta)
                let res = await resposta.json();
      
                //console.log(res)
                //consulta de imagem do curso
                const controller2 = new AbortController();
                setTimeout(() => {controller.abort()},5000);
                let resposta2 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosAdquiridosImg?id=${res.id}`,{
                    signal:controller.signal,
                    method:'POST',
                    mode:'cors'
                })
                let res2 = await resposta2.blob();
    
                let imgSrc;
                if(res2.type == 'text/html'){
                    imgSrc = quimica;//imagem padrao
                }else{
                    imgSrc = URL.createObjectURL(res2);
                }
                const container = document.querySelector('#Painel #cursos-criados-container #cursos-criados');
                container.innerHTML = `
                <button type="button" class="card card-curso btn-curso" data-id="${res.id}">
                    <div class='imgCurso-container'>
                    <img src="${imgSrc}"></img>
                    </div>
                    <h3>${res.titulo}</h3>
                </button>
                ` + container.innerHTML;

                //document.querySelector('#cursos-criados tag').dataset.id
            }
            //console.log(document.querySelectorAll('.btn-curso')[0])
            const btn = document.querySelectorAll('#Painel .btn-curso');
            for(let i=0;i<btn.length;i++){
                btn[i].addEventListener('click',(event)=>{
                    //console.log(event.currentTarget.dataset.id);
                    navigate(`/curso/${event.currentTarget.dataset.id}`);
                })
            }
        }catch(err){
            console.log(err);
        }
    }

    async function cadastrarCurso(event){
        try{
            event.preventDefault();
            /* formData.append('foto', document.querySelector('#Painel #criar-curso-area form #foto').files[0]) mandar a foto na segunda requisicao */
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);
            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/criar`,{
                signal: controller.signal,
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token':localStorage.getItem('token')
                },
                body: JSON.stringify({
                    titulo: document.querySelector('#Painel #criar-curso-area form input[name="titulo"]').value,
                    tituloLongo: document.querySelector('#Painel #criar-curso-area form input[name="tituloLongo"]').value,
                    descricao: document.querySelector('#Painel #criar-curso-area form input[name="descricao"]').value,
                    preco: Number(document.querySelector('#Painel #criar-curso-area form input[name="preco"]').value),
                    categoria: document.querySelector('#Painel #criar-curso-area form input[name="categoria"]').value
                })
            })
            let res = await resposta.json();
            //console.log(res)
            if(res.id){
                const formData = new FormData();
                formData.append('foto', document.querySelector('#Painel #criar-curso-area form #foto').files[0]);

                let resposta2 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/criarImg?id=${res.id}&jwt=${localStorage.getItem('token')}`,{
                    method:'POST',
                    mode:'cors',
                    body:formData
                })
                const res2 = await resposta2.text();
                //console.log(res2)
                getCursosCriados();
            }else{
                throw new Error('ID_INVALIDO');
            }
            

        }catch(err){
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
        document.querySelector('#Painel #criar-curso-area #btn-fechar').addEventListener('click', ()=>{
            document.querySelector('#Painel #criar-curso-area').style = 'display:none;';
        });

        document.querySelector('#Painel #cursos-criados-container #btn-criar').addEventListener('click', ()=>{
            document.querySelector('#Painel #criar-curso-area').style = 'display:flex;';
        });

        getCursosAdquiridos();
        getCursosCriados();
    },[])
    return(
    <>
        <Header/>
        <main id="Painel">
            <div id='perfil'>
                <div id='nome-e-logout'>
                <h2>{tokenData.nome}</h2>
                <button type='button' onClick={sair}>Sair</button>
                </div>

               <section>
               <div id="perfil-esquerdo" className='card-painel'>
                    <div id="img-placeholder">
                    <img src={curso}></img>
                    </div>
                    <h4>Alterar imagem de perfil</h4>
                    <input type='file' accept="image/png, image/jpeg"></input>
               </div>
               <div id="perfil-direito" className='card-painel'>
                <form onSubmit={editarPerfil}>
                    <input type='email' disabled value={tokenData.email}></input>
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
                        <div className='load'></div>
                        <div className='erro'></div>
                        <div className='success'></div>
                    </div>
                    </div>

                </form>
               </div>
               </section>
            </div>
            <div id="cursos-container">
                <h2>Cursos adquiridos</h2>
                <div id="cards-cursos">
                    <div className="card card-curso">
                        <div className='imgCurso-container'>
                            <img src={curso}></img>
                        </div>
                        <h3>Nome do curso</h3>
                    </div>
                    <div className="card card-curso">
                        <div className='imgCurso-container'>
                            <img></img>
                        </div>
                        <h3>titulo</h3>
                    </div>
                    <div className="card card-curso"></div>

                </div>
            </div>



            <div id="cursos-criados-container">
                <h2>Cursos criados</h2>
                <button id="btn-criar" type='button'>+</button>

                <div id="cursos-criados">
                    <div className="card card-curso">
                        <div className='imgCurso-container'>
                            <img src={curso}></img>
                        </div>
                        <h3>Nome do curso</h3>
                    </div>

                </div>
            </div>

            <div id="criar-curso-area">
                <button id="btn-fechar" type='button'>
                <img src={fechar}></img>
                </button>
                <form onSubmit={cadastrarCurso}>
                    <input name='titulo' type='text' placeholder='Titulo' maxLength='30'></input>
                    <input name='tituloLongo' type='text' placeholder='Titulo completo' maxLength='80'></input>
                    <input name='descricao' type='text' placeholder='Descrição' maxLength='800'></input>
                    <input name='preco' type='number' placeholder='Preço' step='0.01'></input>
                    <input name='categoria' type='text' placeholder='Categoria' maxLength='20'></input>
                    <input name="foto" type="file" accept="image/*" id="foto"/>
                    <button type='submit'>enviar</button>
                </form>
            </div>
        </main>
        <Footer/>
    </>
    )
}