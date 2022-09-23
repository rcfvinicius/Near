import './Home.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { useEffect } from 'react';
import { Link } from "react-router-dom";

import imagem1 from '../../assets/imagens/imagem1.jpeg';
import imagem2 from '../../assets/imagens/imagem2.jpeg';
import imagem3 from '../../assets/imagens/imagem3.jpeg';
import imagem4 from '../../assets/imagens/imagem4.jpeg';

import cursoJs from '../../assets/imagens/cursos/js.jpg';
import mat from '../../assets/imagens/cursos/matematica-basica.jpg';
import geo from '../../assets/imagens/cursos/geometria-espacial.jpg';
import morfologia from '../../assets/imagens/cursos/morfologia.png';
//../../assets/estrela.png
export default function Home(){
    useEffect(()=>{
/*         document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0; */
        window.scrollTo(0, 0)
        if(window.location.pathname == '/'){

        
        let contador = 1;
        document.getElementById("radio1").checked = true;
        
        function slider() {
          contador++;
          if (contador > 4) {
            contador = 1;
          }
          document.getElementById(`radio${contador}`).checked = true;
        }
        
        setInterval(() => {
          slider();
        }, 10000);
        
        
        function addEstrela(count=0){
          const est = document.getElementsByClassName("avaliacao-after");
        
          for(let i=0; i<est.length;i++){
            for(let e=0;e<count;e++){
              est[i].innerHTML += '<img src="/imagens/estrela.png">';
            }
          }
        
          const arr = document.querySelectorAll(".avaliacao-after img");
        
          /* estilo das estrelas */
          for(let i=0;i<arr.length;i++){
            arr[i].style = "height:16px; position:relative; top:1px;";
          }
        }
        
        addEstrela(2);
    }
    },[]);


    return(
        <>
        <Header/>
        <main id="Home-container">
        <div className="slider">
            <div className="slides">
     
                <input type="radio" name="radio-btn" id="radio1"/>
                <input type="radio" name="radio-btn" id="radio2"/>
                <input type="radio" name="radio-btn" id="radio3"/>
                <input type="radio" name="radio-btn" id="radio4"/>
                
                <div className="slide primeira-imagem">
                    <div className="texto-slider">
                        <h2>
                            Por uma educação mais próxima e por mais
                            <br/>
                            <h2><mark>autonomia</mark> E <mark>liberdade!</mark></h2>
                        </h2>
                    </div>
                    <img src={imagem1} alt="alunos estudando em uma sala"/>
                </div>
                <div className="slide">
                    <div className="texto-slider">
                        <h2>
                            Lorem Ipsum is simply dummy text 
                            <br/>
                            <h2><mark>lorem</mark> AND <mark>ipsum!</mark></h2>
                        </h2>
                    </div>

                    <img src={imagem2} alt="jovens sorrindo e olhando a mesma coisa"/>
                    
                </div>
                <div className="slide">
                    <div className="texto-slider">
                        <h2>
                            Lorem Ipsum is simply dummy text 
                            <br/>
                            <h2><mark>lorem</mark> AND <mark>ipsum!</mark></h2>
                        </h2>
                    </div>
                    <img src={imagem3} alt="professor explicando algo para alunos em uma sala de aula"/>
                </div>
                <div className="slide">
                    <div className="texto-slider">
                        <h2>
                            Lorem Ipsum is simply dummy text 
                            <br/>
                            <h2><mark>lorem</mark> AND <mark>ipsum!</mark></h2>
                        </h2>
                    </div>
                    <img src={imagem4} alt="professora olhando para a câmera e sorrindo"/>
                </div>
             
                <div className="navigation-auto">
                    <div className="auto-btn1"></div>
                    <div className="auto-btn2"></div>
                    <div className="auto-btn3"></div>
                    <div className="auto-btn4"></div>
                </div>
            </div>
            <div className="manual-navigation">
                <label htmlFor="radio1" className="manual-btn"></label>
                <label htmlFor="radio2" className="manual-btn"></label>
                <label htmlFor="radio3" className="manual-btn"></label>
                <label htmlFor="radio4" className="manual-btn"></label>
            </div>

    </div>


    <div id="gradient1" className="gradient">
        <div>
            <Link to="/sobre"><h2>JavaScript (iniciante)</h2></Link>
            <div className="avaliacao-after"><h3>Avaliação:</h3></div>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
        </div>
        
        <Link to="/sobre" className="img-focus"><img src={cursoJs} alt="tela de computador preta com códigos"/></Link>
    </div>


    <div className="gradient">
        <div>
            <a href="/"><h2>Matemática básica</h2></a>
            
            <div className="avaliacao-after"><h3>Avaliação:</h3></div>
            <p>
                type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
        </div>
        
        <a href="/" className="img-focus"><img src={mat} alt="tela azul escrito matemática básica com simbolos de operações aritméticas acima da escrita"/></a>  
    </div>

    <div className="gradient">
        <div>
            <a href="/"><h2>Geometria Espacial</h2></a>
            
            <div className="avaliacao-after"><h3>Avaliação:</h3></div>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
        </div>
        <a href="/" className="img-focus"><img src={geo} alt="cubo com uma reta atravessando na diagonal"/></a>

    </div>
    

    <div className="gradient">
        <div>
            <a href="/"><h2>Morfologia</h2></a>
            
            <div className="avaliacao-after"><h3>Avaliação:</h3></div>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
        </div>
        <a href="/" className="img-focus"><img src={morfologia} alt="tela escrito morfologia com uma explicaçao abaixo: parte da língua portuquesa que se dedica a analisar a estrutura, o formato e a classificação das palavras; Seguido de várias setas que apontam para: substantivo, adjetivo, advérbio, artigo, conjunção, interjeição, numeral, preposição, pronome e verbo"/></a>

    </div>

    </main>
    <Footer/>
</>
    )
}