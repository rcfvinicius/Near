import { useEffect } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../../utils/Authentication.jsx';

import './Painel.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';

import defaultIcon from '../../assets/default-icon.png';
import quimica from "../../assets/exercicio-quimica.png";
import curso from '../../assets/imagens/cursos/morfologia.png';
import fechar from '../../assets/x2.png';
import defaultCourse from '../../assets/default-course.png';

export default function Painel(){
    const navigate = useNavigate();
    //const [logado,setLogado,returnTo,setReturnTo] = useAuth();
    const setLogado = useAuth()[1];
    const tokenData = useAuth()[4];
    const setTokenData = useAuth()[5];
    let deletando;

    function sair(){
        localStorage.removeItem("token");
        setLogado(false);
        navigate('/');
    }


    async function navegarPara(event){
        if(!deletando){
            console.log(event.currentTarget.dataset.id);
            navigate(`/curso/${event.currentTarget.dataset.id}`);
            return;
        }
        try{
            if(!window.confirm('Tem certeza de que deseja remover este curso?')){
                return;
            }
            event.currentTarget.remove();
            
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);

            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/delete/${event.currentTarget.dataset.id}`,{
                signal: controller.signal,
                method: 'DELETE',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token': localStorage.getItem('token')
                }
            });

            const res = await resposta.json();
            console.log(res)
            
        }catch(err){
            console.log(err);
        }
        
    }



    function deletarBtn(){
        if(!deletando){
            deletando = true;
            for(let i=0;i<document.querySelectorAll('#Painel .card .pelicula').length;i++){
                document.querySelectorAll('#Painel .card .pelicula')[i].style = 'display:flex';
            }
        }else{
            deletando = false;
            for(let i=0;i<document.querySelectorAll('#Painel .card .pelicula').length;i++){
                document.querySelectorAll('#Painel .card .pelicula')[i].style = 'display:none';
            }
        }
    console.log(deletando)
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

            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/update`,{
                signal: controller.signal,
                method: 'PATCH',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    email: tokenData.email,
                    nome: document.querySelector('#Painel #perfil form input[type="text"]').value,
                    senha: document.querySelector('#Painel #perfil form input[type="password"]').value
                })
            })
            
            const controller2 = new AbortController();
            setTimeout(() => {controller2.abort()},5000);

            const formData = new FormData();
            formData.append('foto', document.querySelector('#Painel #perfil-esquerdo input[type="file"]').files[0]);
            let resposta2 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/criarImg?id=${tokenData.sub}&jwt=${localStorage.getItem('token')}`,{
                method:'POST',
                mode:'cors',
                body:formData
            });

            console.log(await resposta2.text());

            /* parte 1 */
            let res = await resposta.json();
            //console.log(res);
            if(res.status){
                if(document.querySelector('#Painel #perfil-esquerdo input[type="file"]').files.length > 0){
                    document.querySelector('#Painel #perfil-direito #load-perfil .load').style = 'display:none';
                    document.querySelector('#Painel #perfil-direito #load-perfil .success').style = 'display:inline-block';
                    imgUsuario();
                    return;
                }else{
                    throw new Error('Nada para editar');
                }
            }
            if(res.token.split('.').length != 3){
                throw new Error('SEM_TOKEN');
            }
            
            localStorage.setItem('token', res.token);
            delete res.token;
            setTokenData(res);
            imgUsuario();

            document.querySelector('#Painel #perfil form input[type="text"]').value = '';
            document.querySelector('#Painel #perfil form input[type="password"]').value = '';

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
                method:'GET',
                mode:'cors'
            })
            let res2 = await resposta2.blob();

            let imgSrc;
            if(res2.type == 'text/html'){
                imgSrc = defaultCourse;
            }else{
                imgSrc = URL.createObjectURL(res2);
            }

            container.innerHTML =
            `
            <button type="button" class="card card-curso btn-curso" data-id="${res.id}">
                <div class="pelicula">
                    <div data-id="${res.id}"></div>
                </div>
                <div class='imgCurso-container'>
                    <img src="${imgSrc}"></img>
                </div>
                <h3>${res.titulo}</h3>
            </button>
            ` + container.innerHTML;
        }
        const btn = document.querySelectorAll('#Painel #cursos-container #cards-cursos button');
        for(let i=0;i<btn.length;i++){
            btn[i].addEventListener('click', navegarPara, true);
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
                setTimeout(() => {controller2.abort()},5000);
                let resposta2 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosAdquiridosImg?id=${res.id}`,{
                    signal:controller2.signal,
                    method:'GET',
                    mode:'cors'
                })
                let res2 = await resposta2.blob();
    
                let imgSrc;
                if(res2.type == 'text/html'){
                    imgSrc = defaultCourse;
                }else{
                    imgSrc = URL.createObjectURL(res2);
                }
                const container = document.querySelector('#Painel #cursos-criados-container #cursos-criados');
                container.innerHTML = `
                <button type="button" class="card card-curso btn-curso" data-id="${res.id}">
                    <div class="pelicula">
                        <div data-id="${res.id}"></div>
                    </div>
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
                btn[i].addEventListener('click', navegarPara, true);
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
                    categoria: document.querySelector('#Painel #criar-curso-area form select[name="categoria"]').value,
                    aprendizado:document.querySelector('#Painel #criar-curso-area form input[name="aprendizado"]').value
                })
            })
            let res = await resposta.json();
            console.log(res)
            if(res.id){
                const formData = new FormData();
                formData.append('foto', document.querySelector('#Painel #criar-curso-area form #foto').files[0]);

                let resposta2 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/criarImg?id=${res.id}&jwt=${localStorage.getItem('token')}`,{
                    method:'POST',
                    mode:'cors',
                    body:formData
                })
                const res2 = await resposta2.json();
                document.querySelector('#Painel #criar-curso-area form input[name="titulo"]').value = '';
                document.querySelector('#Painel #criar-curso-area form input[name="tituloLongo"]').value = '';
                document.querySelector('#Painel #criar-curso-area form input[name="descricao"]').value = '';
                document.querySelector('#Painel #criar-curso-area form input[name="preco"]').value = '';
                document.querySelector('#Painel #criar-curso-area form select[name="categoria"]').value = '';
                document.querySelector('#Painel #criar-curso-area form input[name="aprendizado"]').value = '';
                getCursosCriados();
            }else{
                throw new Error('ID_INVALIDO');
            }
            

        }catch(err){
            console.log(err);
        }
    }

    async function imgUsuario(){
        try{
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);

            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/img?id=${tokenData.sub}`,{
                signal: controller.signal,
                method: 'GET',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8'
                }
            })

            let res = await resposta.blob();

            let imgSrc;
            if(res.type == 'text/html'){
                imgSrc = defaultIcon;
            }else{
                imgSrc = URL.createObjectURL(res);
            }
            document.querySelector('#perfil #img-placeholder > img').src = imgSrc;

        }catch(err){
            console.log(err);
        }
    }

    function resetarCampo(event){
        switch(event.target.id){
            case 'btn2':
                document.querySelector('#Painel #perfil-direito form > input[type="text"]').value = '';
                break;
            case 'btn3':
                document.querySelectorAll('#Painel #perfil-direito form > input[type="password"]')[0].value = '';
                break;
            case 'btn4':
                document.querySelectorAll('#Painel #perfil-direito form > input[type="password"]')[1].value = '';
                break;
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

        for(let i=0;i<document.querySelectorAll('#Painel #perfil-direito form > button[type="button"]').length;i++){
            document.querySelectorAll('#Painel #perfil-direito form > button[type="button"]')[i].addEventListener('click', resetarCampo);
        }
        
        

        deletando = false;
        getCursosAdquiridos();
        getCursosCriados();
        imgUsuario();
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
                        <img></img>
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
                <button id="btn-deletar" type='button' onClick={deletarBtn}/>

                <div id="cards-cursos">
                    <div className="card card-curso">
                        <div className='imgCurso-container'>
                            <img></img>
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
                    <input name='titulo' type='text' placeholder='Titulo' maxLength='30' required></input>
                    <input name='tituloLongo' type='text' placeholder='Titulo completo' maxLength='80' required></input>
                    <input name='descricao' type='text' placeholder='Descrição' maxLength='800' required></input>
                    <input name='preco' type='number' placeholder='Preço' step='0.01' required></input>
                    {/* <input name='categoria' type='text' placeholder='Categoria' maxLength='20'></input> */}
                    <select name="categoria" size="1">
                        <option value="" selected disabled hidden>--selecione uma categoria--</option>
                        <option value="Tecnologia">Tecnologia</option>
                        <option value="Idiomas">Idiomas</option>
                        <option value="Design">Design</option>
                        <option value="Marketing">Marketing</option>
                        <option value="Musica">Música</option>
                        <option value="Saude">Saúde</option>
                        <option value="Outro">Outra categoria</option>
                    </select>
                    <input name='aprendizado' type='text' placeholder='Digite tópicos que o usuário irá aprender com seu curso (separe-os com ";")'></input>
                    <input name="foto" type="file" accept="image/*" id="foto"/>
                    <button type='submit'>enviar</button>
                </form>
            </div>

            <div id='deletar-curso-area'>
                <button id="btn-fechar-delete" type='button'>
                    <img src={fechar}></img>
                </button>
                <section className='cursos-container-delete'>
                    <h2>Cursos adquiridos</h2>
                    <div>

                    </div>
                </section>
                <section className='cursos-container-delete'>
                    <h2>Cursos criados</h2>
                    <div>

                    </div>
                </section>
            </div>
        </main>
        <Footer/>
    </>
    )
}