import './Curso.css'
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { useEffect } from 'react';
import { Link } from "react-router-dom";
import { useParams } from 'react-router-dom';

export default function Curso(){
    const params = useParams();
    /* 
    https://www.youtube.com/watch?v=PsRWLIyRxjY
    https://www.youtube.com/watch?v=nJmLMIwQty0&list=WL&index=6
    https://youtu.be/PsRWLIyRxjY

    https://www.youtube.com/embed/idDoVideo

if
    link.split('//')[1].split('/')[0] === 'youtu.be':
    link.split('//')[1].split('/')[1]
else----------------------------------------    ---
    link.split('v=')[1].split('&')[0]

======
a ;ordem; vai; ser ;decidida; clicando; nos ;cursos ;disponiveis; na ;ordem ;desejada. Deverá; ter; um botão para resetar a escolha da ordem
    */
   function selecionarVideoAula(event){
    console.log(event.target.name)
    document.querySelector('#Curso #iframe-container').innerHTML = `
    <iframe width="560" height="315" src="https://www.youtube.com/embed/X0KOEd34Mb8" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
    `;
   }
   cada botao vai ser criado por um fetch e vai ter um data-id contendo o codigo do video(colocar as classes nos botoes)
   quando estiver selecionado, a cor do botao deve mudar(event.currentTarget.style). Precisa resetar os estilos dos outros botoes(fazer um for com todos os botoes pra remover os estilos
    depois adicionar o estilo de selecionado ao event.currentTarget
   )

    return(
        <>
        <Header/>
        <div id="Curso">
            <div id='sidebar'>
                <button type='button' name='1' onClick={selecionarVideoAula}>
                aula 1 ewjfo wofjweoij wfwoejf woijweiof
                </button>
                <button type='button' name='2'>
                aula 1 ewjfo wofjweoij wfwoejf woijweiofaula 1 ewjfo wofjweoij wfwoejf woijweiofaula 1 ewjfo wofjweoij wfwoejf woijweiofaula 1 ewjfo wofjweoij wfwoejf woijweiof
                </button>

                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
                <button type='button' name='1' onClick={selecionarVideoAula}>aula 1 ewjfo wofjweoij wfwoejf woijweiof</button>
            </div>
            <div>
                <div id='iframe-container'>
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/pEfrdAtAmqk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
                </div>
                <div id='comentarios-container'>
                    comentarios
                </div>
            </div>
        </div>
        <Footer/>
        </>
    )
}