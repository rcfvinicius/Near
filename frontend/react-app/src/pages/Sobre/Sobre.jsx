import { useEffect } from 'react';
import './Sobre.css';
import imagemCurso from '../../assets/imagens/cursos/js.jpg'
//importar as imagens
//arrumar o css do #section2

export default function Sobre(){
    useEffect(()=>{
        const curso = window.location.href.split('?')[1] ?? 'err';

const div = document.querySelectorAll('main > section:first-child > div')[0];
/* 
div.innerHTML = `
<h1>${curso}</h1>
`; */


/* 
window.addEventListener('scroll', () => {
    console.log(window.scrollY)
    if(window.scrollY >100){
        document.querySelector('main > section aside').style = 'position:fixed; top:0px;';
        if(window.scrollY > 380){
            document.querySelector('main > section aside').style = 'position:absolute; margin-top:calc(50% - 365px)';
        }
    }
    else{
        document.querySelector('main > section aside').style = ''
    }

})
 */


    /* posicionamento do aside e #section2 */
const posAsideSection = function(){
    
    if(window.innerWidth < 1261){
        const altura = document.querySelector('main > section aside img').offsetHeight + 328;
        document.querySelector('main > section aside').style = `height:${altura}px`;
        document.querySelector('#section2').style = `margin-top:${altura+30}px;`;
        }
        else{
            document.querySelector('main > section aside').style = '';
            document.querySelector('#section2').style = '';
        }

        /* tamanho do aside */
        const alturaImg = document.querySelector('main > section aside img').offsetHeight;
        const alturaDiv = document.querySelector('main section aside #container-aside').offsetHeight
        const aside = document.querySelector('main section aside');

        aside.style = `height: ${alturaDiv+alturaImg+110}px`


        /* adquirido */
        if(false){
            document.querySelector('#fundo-adquirido').style = `
            display:flex;
            width:calc(100% - 6px);
            height:${document.querySelector('main > section aside img').offsetHeight}px;
            `;

            document.querySelector('main > section aside div button').style = `cursor:not-allowed;`;
            document.querySelector('main > section aside div #botao2').style = `cursor:not-allowed;`;

            document.querySelector('aside div h3').innerHTML= 'Adquirido!';
        }
}

window.addEventListener('resize', posAsideSection);

posAsideSection();
    },[])

    return(
        <main id="Sobre-container">
    <section>
        <div>
            <b><a href="">Tecnologia</a> {">"} <a href="">Programação</a></b>
            <h1>JavaScript(iniciante): Aprenda a programar do zero com javascript</h1>
            <div class="avaliacao-after"><h3>Avaliação:</h3></div>
            <h3>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eu sollicitudin sapien. Morbi id feugiat leo. In malesuada, nisl eget venenatis congue, erat libero ullamcorper mi, eget venenatis arcu tellus vitae ante. Nulla eu pellentesque leo. Nullam eget odio aliquet, tincidunt arcu eget, posuere ex. </h3>
        </div>

        <aside>
            <div>
            <div id="fundo-adquirido"><div id="d1-maior"><div id="d2-menor"></div></div></div>
            <img src={imagemCurso} alt="tela de computador preta com códigos"/>
            </div>
            <div id="container-aside">
                <h3>R$ 00,00</h3>
                <button type="button">Adicionar ao carrinho</button>
                <button type="button" id="botao2">Comprar</button>
                <h4>Total de aulas: 44</h4>
                <h4>Carga horária: 70h</h4>
            </div>

        </aside>

    </section>

    <section id="section2">
        <h2>O que você vai aprender</h2>
        <div id="flex-container-uls">

        <ul>
            <li>Estrutura e algorítmos</li>
            <li>Boas práticas e como esta liguagem é utilizada no mercado</li>
            <li>Lorem ipsum dolor sit amet</li>


        </ul>
        <ul>
            <li>Lorem ipsum dolor sit amet</li>
            <li>Lorem ipsum dolor sit amet</li>
            <li>Lorem ipsum dolor sit amet</li>

        </ul>
        </div>
    </section>
    <section id="section3">
        
    </section>
</main>
    )
}