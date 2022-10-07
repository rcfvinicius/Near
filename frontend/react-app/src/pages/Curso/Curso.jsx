import './Curso.css'
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';

export default function Curso(){
    const params = useParams();

//a ;ordem; vai; ser ;decidida; clicando; nos ;cursos ;disponiveis; na ;ordem ;desejada. Deverá; ter; um botão para resetar a escolha da ordem
    
   function selecionarVideoAula(event){
    document.querySelector('#Curso #iframe-container').innerHTML = `
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${event.target.dataset.cod}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
    `;
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
    const aulas = JSON.parse(await resposta.text());
    for(let i=0;i<aulas.length;i++){
        sidebar.innerHTML += `<button type='button' data-id="${aulas[i].id}" data-cod="${aulas[i].cod}">${aulas[i].nome}</button>`;
    }

    const botoes = document.querySelectorAll('#Curso #sidebar button');
    for(let i=0;i<botoes.length;i++){
        botoes[i].addEventListener('click',selecionarVideoAula);
    }
}catch(err){
    console.log(err)
}
}
   useEffect(()=>{


    buscarVideos();
   },[])

    return(
        <>
        <Header/>
        <div id="Curso">
            <div id='sidebar'>
                <button type='button' name='1' onClick={selecionarVideoAula}>
                aula 1 ewjfo wofjweoij wfwoejf woijweiof
                </button>
                <button type='button' name='2' onClick={buscarVideos}>
                aula 1 ewjfo wofjweoij wfwoejf woijweiofaula 1 ewjfo wofjweoij wfwoejf woijweiofaula 1 ewjfo wofjweoij wfwoejf woijweiofaula 1 ewjfo wofjweoij wfwoejf woijweiof
                </button>
            </div>
            <div>
                <div id='iframe-container'>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/pEfrdAtAmqk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
                </div>
                <div id='comentarios-container'>
                    <h2>Comentários (0)</h2>
                    <div id='comentarios'>

                    </div>
                    <form>
                        <input type="text" name='comentario'/>
                    </form>
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}