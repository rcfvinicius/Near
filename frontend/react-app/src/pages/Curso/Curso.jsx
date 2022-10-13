import './Curso.css'
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useParams, useNavigate } from 'react-router-dom';
import fechar from '../../assets/x2.png'
import { useState } from 'react';

export default function Curso(){
    const params = useParams();
    const navigate = useNavigate();
    const [ordem,setOrdem] = useState();

//a ;ordem; vai; ser ;decidida; clicando; nos ;cursos ;disponiveis; na ;ordem ;desejada. Deverá; ter; um botão para resetar a escolha da ordem
    
   function selecionarVideoAula(event){
    document.querySelector('#Curso #iframe-container').innerHTML = `
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${event.target.dataset.cod}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
    `;
    const botoes = document.querySelectorAll('#Curso #sidebar button');
    for(let i=0;i<botoes.length;i++){
        if(botoes[i].dataset.id == event.target.dataset.id){
            for(let e=0;e<botoes.length;e++){
                botoes[e].style = 'background-color:#351c50;';
            }
            botoes[i].style = 'background-color:#1d0f2c;';
            break;
        }
    }
   }
   //cada botao vai ser criado por um fetch e vai ter um data-id contendo o codigo do video(colocar as classes nos botoes)
   //quando estiver selecionado, a cor do botao deve mudar(event.currentTarget.style). Precisa resetar os estilos dos outros botoes(fazer um for com todos os botoes pra remover os estilos
  //  depois adicionar o estilo de selecionado ao event.currentTarget
  // )

   async function buscarVideos(){
    try{
    const sidebar = document.querySelector('#Curso #sidebar');
    sidebar.innerHTML = '';
    //buscar todas as video aulas visiveis e colocar os codigos num array
    //no array é salvo o codigo e no botao é salvo o index
    const controller = new AbortController();
    setTimeout(() => {controller.abort()},5000);

    let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/buscarVideoAulas?idCurso=${params.id}`,{
        signal:controller.signal,
        method:'GET',
        mode:'cors',
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': localStorage.getItem('token')
        }
    })
    //console.log(JSON.parse(await resposta.text()))
    let res = await resposta.text();
    if(res == 'Erro de autenticação via token'){
        navigate('/login');
    }
    //const aulas = JSON.parse(await resposta.text());
    const aulas = JSON.parse(res);
    for(let i=0;i<aulas.length;i++){
        sidebar.innerHTML += `<button type='button' data-id="${aulas[i].id}" data-cod="${aulas[i].cod}" data-nome="${aulas[i].nome}">${aulas[i].nome}</button>`;
    }

    const botoes = document.querySelectorAll('#Curso #sidebar button');
    for(let i=0;i<botoes.length;i++){
        botoes[i].addEventListener('click',selecionarVideoAula);
    }

    document.querySelector('#Curso #iframe-container').innerHTML = `
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${botoes[0].dataset.cod}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
    `;
    for(let i=0;i<botoes.length;i++){
        botoes[i].style = 'background-color:#351c50;';
    }
    botoes[0].style = 'background-color:#1d0f2c;';
}catch(err){
    console.log(err)
    
}
}

//let ultimaOrdemDataset=1;
function resetarOrdem(){
    for(let i=0;i<document.querySelectorAll('#Curso #todas-aulas button').length;i++){
        document.querySelectorAll(`#Curso #todas-aulas button + span`)[i].innerHTML = '0';
        document.querySelectorAll(`#Curso #todas-aulas button + span`)[i].style = 'color:red;';
        document.querySelectorAll('#Curso #todas-aulas button')[i].style = 'background-color:#351c50;';
    }
    let ultimaOrdem = 1;
    for(let i=0;i<ordem.length;i++){
        for(let e=0;e<document.querySelectorAll('#Curso #todas-aulas button').length;e++){
            if(ordem[i] == document.querySelectorAll('#Curso #todas-aulas button')[e].dataset.id){
                document.querySelectorAll('#Curso #todas-aulas button')[e].style = 'background-color:#1d0f2c;';
                document.querySelectorAll('#Curso #todas-aulas button')[e].dataset.ordem = ultimaOrdem;
                document.querySelectorAll(`#Curso #todas-aulas button + span`)[e].innerHTML = ultimaOrdem;
                document.querySelectorAll(`#Curso #todas-aulas button + span`)[e].style = 'color:white;';
                ultimaOrdem++;
            }
        }
    }
}
async function buscarTodasAulas(){
try{
    const controller = new AbortController();
    setTimeout(()=>{controller.abort()},5000);

    let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/buscarVideoAulas?idCurso=${params.id}&mode=all`,{
        signal:controller.signal,
        method:'GET',
        mode:'cors',
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': localStorage.getItem('token')
        }
    });

    let res = JSON.parse(await resposta.text());
    console.log(res)
    const container = document.querySelector('#Curso #todas-aulas');
    container.innerHTML = '';
    if(res[0]){
        for(let i=0;i<res[1].length;i++){
            container.innerHTML += `<div><button type='button' data-id="${res[1][i].id}" data-cod="${res[1][i].cod}" data-ordem="0" data-nome="${res[1][i].nome}">${res[1][i].nome}</button><span></span></div>`;
            document.querySelectorAll(`#Curso #todas-aulas button + span`)[document.querySelectorAll(`#Curso #todas-aulas button + span`).length-1].innerHTML = '0';
            document.querySelectorAll(`#Curso #todas-aulas button + span`)[document.querySelectorAll(`#Curso #todas-aulas button + span`).length-1].style = 'color:red;';
        }
        for(let i=0;i<document.querySelectorAll('#Curso #todas-aulas button').length;i++){
            document.querySelectorAll('#Curso #todas-aulas button')[i].addEventListener('click',(event)=>{
                if(event.target.dataset.ordem == '0'){
                    document.querySelectorAll(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`)[document.querySelectorAll(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`).length-1].style = 'color:white;';
                    let maior = 0; 
                    for(let i=0;i<document.querySelectorAll('#Curso #todas-aulas button').length;i++){
                        if(parseInt(document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.ordem) > maior){
                            maior = parseInt(document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.ordem);
                        }
                    }
                    //event.target.dataset.ordem = ultimaOrdemDataset;
                    event.target.dataset.ordem = maior+1;
                    event.target.style = 'background-color:#1d0f2c;';
                    //ultimaOrdemDataset++;
                    document.querySelector(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`).innerHTML = event.target.dataset.ordem;
                }else{
                    document.querySelectorAll(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`)[document.querySelectorAll(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`).length-1].style = 'color:red;';
                    event.target.dataset.ordem = 0;
                    event.target.style = 'background-color:#351c50;';
                   // ultimaOrdemDataset--;
                    document.querySelector(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`).innerHTML = event.target.dataset.ordem;
                }
            });
        }

        let limit=0;
        let i=0;
        const ordemInicial = [];
        while(i < res[0].split(';').length-1 && limit < 9999){
            ordemInicial.push(res[0].split(';')[i]);
            limit++;
            i++;
        }
        setOrdem(ordemInicial);

        let ultimaOrdem = 1;
        for(let i=0;i<ordemInicial.length;i++){
            for(let e=0;e<document.querySelectorAll('#Curso #todas-aulas button').length;e++){
                if(ordemInicial[i] == document.querySelectorAll('#Curso #todas-aulas button')[e].dataset.id){
                    document.querySelectorAll('#Curso #todas-aulas button')[e].style = 'background-color:#1d0f2c;';
                    document.querySelectorAll('#Curso #todas-aulas button')[e].dataset.ordem = ultimaOrdem;
                    document.querySelectorAll(`#Curso #todas-aulas button + span`)[e].innerHTML = ultimaOrdem;
                    document.querySelectorAll(`#Curso #todas-aulas button + span`)[e].style = 'color:white;';
                    ultimaOrdem++;
                }
            }
        }

    }else{
        for(let i=0;i<res[1].length;i++){
            container.innerHTML += `<div><button type='button' data-id="${res[1][i].id}" data-cod="${res[1][i].cod}" data-ordem="${i+1}" data-nome="${res[1][i].nome}">${res[1][i].nome}</button><span></span></div>`;
        }

    }
}catch(err){
    console.log(err);
}
}

async function verificarCriador(){
try{
    const controller = new AbortController();
    setTimeout(() => {controller.abort()},5000);

    let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/verificarCriador?idCurso=${params.id}`,{
        signal:controller.signal,
        method:'GET',
        mode:'cors',
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': localStorage.getItem('token')
        }
    });
    let res = await resposta.json();
    if(res.criador){
        document.querySelector('#Curso #btn-editar').style = 'display:inline-block';
    }

}catch(err){
    console.log(err)
}
}


async function ordenar(event){
try{
    event.preventDefault();
    
    let ordemFinal = [];
    for(let i=0;i<document.querySelectorAll(`#Curso #todas-aulas button`).length+15;i++){
        let encontrado = false;
        for(let e=0;e<document.querySelectorAll(`#Curso #todas-aulas button`).length;e++){
            if(document.querySelectorAll(`#Curso #todas-aulas button`)[e].dataset.ordem == (i+1)){
                encontrado = true;
                ordemFinal.push(document.querySelectorAll(`#Curso #todas-aulas button`)[e].dataset.id);
            }
        }
    }
    console.log(ordemFinal)

    /* const controller = new AbortController();
    setTimeout(() => {controller.abort()},5000);
    let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/`,{
        signal:controller.signal,
        method:'PATCH',
        mode:'cors',
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': localStorage.getItem('token')
        },
        
        body:JSON.stringify({
            ordem: ,
            idCurso:params.id
        })
    }) */

}catch(err){
    console.log(err);
}
}
async function enviarForm2(event){
try{
    event.preventDefault();
    if(document.querySelector('#Curso #editar-curso-area #form2 #rd-buttons input[type="radio"]').checked){
        const controller = new AbortController();
        setTimeout(() => {controller.abort()},5000);
        let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/criarVideoAula`,{
            signal:controller.signal,
            method:'POST',
            mode:'cors',
            headers:{
                'Content-Type': 'application/json;charset=UTF-8',
                'x-access-token': localStorage.getItem('token')
            },
            body:JSON.stringify({
                nome:document.querySelectorAll('#Curso #form2 #criar-aula-area input')[0].value,
                link:document.querySelectorAll('#Curso #form2 #criar-aula-area input')[1].value,
                idCurso:params.id
            })
            
        })

        let res = await resposta.text();
        if(res == 'criado'){
            console.log(res);
            buscarTodasAulas();
        }else{
            throw new Error('ERRO_CRIACAO_CURSO');
        }
    }else{

    }
}catch(err){
    console.log(err);
}
}

function renderCriarEditar(){
    if(document.querySelector('#Curso #editar-curso-area #form2 #rd-buttons input[type="radio"]').checked){
        document.querySelector('#Curso #form2 #criar-aula-area').style = 'display:block;';
        document.querySelector('#Curso #form2 #editar-aula-area').style = 'display:none;';
        document.querySelector('#Curso #form2 #editar-aula-area').innerHTML='';
        document.querySelector('#Curso #form2 #criar-aula-area').innerHTML = `
        <input type="text" placeholder='Nome da aula' required/>
        <input type="url" placeholder='Link (youtube)' required/>
        `
    }else{
        document.querySelector('#Curso #form2 #criar-aula-area').style = 'display:none;';
        document.querySelector('#Curso #form2 #criar-aula-area').innerHTML = '';
 
        document.querySelector('#Curso #form2 #editar-aula-area').innerHTML=`
        <input type="text" placeholder='Nome da aula'/>
        <input type="url" placeholder='Link (youtube)'/>
        `;
        for(let i=0;i<document.querySelectorAll('#Curso #todas-aulas button').length;i++){
            document.querySelector('#Curso #form2 #editar-aula-area').innerHTML += `
            <label>
                <input type='radio' required name='id' value='${document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.id}'/>
                <h4>${document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.nome}</h4>
            </label>
            `
        }
        document.querySelector('#Curso #form2 #editar-aula-area').style = 'display:block;';
    }
}

   useEffect(()=>{
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    document.querySelector('#Curso #btn-editar').addEventListener('click',()=>{
        document.querySelector('#Curso #editar-curso-area').style = 'display:flex;';
    });

    document.querySelector('#Curso #editar-curso-area #btn-fechar').addEventListener('click',()=>{
        document.querySelector('#Curso #editar-curso-area').style = 'display:none;';
    });

    document.querySelectorAll('#Curso #editar-curso-area #form2 #rd-buttons input[type="radio"]')[0].addEventListener('click', renderCriarEditar);
    document.querySelectorAll('#Curso #editar-curso-area #form2 #rd-buttons input[type="radio"]')[1].addEventListener('click', renderCriarEditar);

    //se for o criador do curso vai parecer um botão pra editar e adicionar aulas
    buscarVideos();
    verificarCriador();
    buscarTodasAulas();
    renderCriarEditar();
   },[])

    return(
        <>
        <Header/>
        <div id="Curso">
            <div id='sidebar'>

            </div>
            <div>
                <div id='iframe-container'>
                    
                </div>
                <div id='comentarios-container'>
                    <button type='button' id='btn-editar'/>
                    <h2>Comentários (0)</h2>
                    <div id='comentarios'>

                    </div>
                    <form>
                        <input type="text" name='comentario'/>
                    </form>
                </div>
            </div>

            <div id="editar-curso-area">
                <button id="btn-fechar" type='button'>
                    <img src={fechar}></img>
                </button>
                <form>
                    enviar exercicio
                </form>
                <form id='form2' onSubmit={enviarForm2}>
                    <div>
                        <div id='rd-buttons'>
                            <div>
                                <input type='radio' name='modo' value='criar' defaultChecked id='rd-criar-aula'/>
                                <label htmlFor="rd-criar-aula">Criar aula</label>
                            </div>
                            <div>
                                <input type='radio' name='modo' value='editar' id='rd-editar-aula'/>
                                <label htmlFor="rd-editar-aula">Editar aula</label> 
                            </div>
                        </div>
                        <button type='submit'>Enviar</button>
                    </div>
                    <div id='criar-aula-area' className='criar-editar-aula'>

                    </div>
                    <div id='editar-aula-area' className='criar-editar-aula'>

                    </div>
                </form>


                <form id='form3' onSubmit={ordenar}>
                    <div>
                        <button type='submit'>Enviar</button>
                        <button type='button' onClick={resetarOrdem}></button>
                    </div>
                    <div id='todas-aulas'>

                    </div>
                </form>

            </div>
        </div>
        <Footer/>
        </>
    )
}