import './Home.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import defaultCourse from '../../assets/imagens/cursos/default-course.png';
import imagem1 from '../../assets/imagens/imagem1.jpeg';
import imagem2 from '../../assets/imagens/imagem2.jpeg';
import imagem3 from '../../assets/imagens/imagem3.jpeg';
import imagem4 from '../../assets/imagens/imagem4.jpeg';

export default function Home(){
    const navigate = useNavigate();

    async function fetchData(){
        try{
            //buscar info dos cursos poulares depois fazer um for pra buscar as imagens e gerar o gradient
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);
            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosPopulares`,{
                signal:controller.signal,
                method:'GET',
                mode:'cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token':localStorage.getItem('token')
                }
            })
            let res = await resposta.json();

            const tamanho = document.querySelectorAll('#Home-container > div:not(:first-child)').length;
            for(let i=0;i<tamanho;i++){
                document.querySelectorAll('#Home-container > div:not(:first-child)')[0].remove();
            }
            
            const container = document.querySelector('#Home-container');
            for(let i=0;i<res.length;i++){
                container.innerHTML += `
                <div class="gradient">
                    <div>
                        <a><h2 data-id=${res[i].id}>${res[i].titulo}</h2></a>
                        
                        <p>
                            ${res[i].descricao}
                        </p>
                    </div>
                    
                    <a class="img-focus"><img data-id=${res[i].id}/></a>
                </div>
                `;
            }

            for(let i=0;i<document.querySelectorAll('#Home-container > div:not(:first-child)').length;i++){
                const controller2 = new AbortController();
                setTimeout(() => {controller2.abort()},5000);
                let resposta2 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosAdquiridosImg?id=${res[i].id}`,{
                    signal:controller2.signal,
                    method:'GET',
                    mode:'cors',
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8',
                        'x-access-token':localStorage.getItem('token')
                    }
                })
                let res2 = await resposta2.blob();

                let imgSrc;
                if(res2.type == 'text/html'){
                    imgSrc = defaultCourse;
                }else{
                    imgSrc = URL.createObjectURL(res2);
                }

                document.querySelectorAll('#Home-container > div:not(:first-child) a > img')[i].src = imgSrc;
            }

            document.querySelector('#Home-container > div:not(:first-child)').id = 'gradient1';

            for(let i=0;i<document.querySelectorAll('#Home-container > div:not(:first-child)').length;i++){
                document.querySelectorAll('#Home-container > div:not(:first-child) > div h2')[i].addEventListener('click', (event)=>{
                    navigate(`/sobre/${event.target.dataset.id}`);
                });
                document.querySelectorAll('#Home-container > div:not(:first-child) img')[i].addEventListener('click', (event)=>{
                    navigate(`/sobre/${event.target.dataset.id}`);
                });
            }

        }catch(err){
            console.log(err);
        }
    }


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
        
        const intervalo = setInterval(() => {
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
        fetchData();

        const controller = new AbortController();
        setTimeout(() => {controller.abort()},4000);
        fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/token`,{
            signal:controller.signal,
            method:'GET',
            headers:{
                'x-access-token': localStorage.getItem('token')
            }
        }).catch((err)=>{
            window.alert('Api offline!');
        })

        return(()=>{
            clearInterval(intervalo);
        })
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
                            <mark>autonomia</mark> E <mark>liberdade!</mark>
                        </h2>
                    </div>
                    <img src={imagem1} alt="alunos estudando em uma sala" loading="lazy"/>
                </div>
                <div className="slide">
                    <div className="texto-slider">
                        <h2>
                            Lorem Ipsum is simply dummy text 
                            <br/>
                            <mark>lorem</mark> AND <mark>ipsum!</mark>
                        </h2>
                    </div>

                    <img src={imagem2} alt="jovens sorrindo e olhando a mesma coisa" loading="lazy"/>
                    
                </div>
                <div className="slide">
                    <div className="texto-slider">
                        <h2>
                            Lorem Ipsum is simply dummy text 
                            <br/>
                            <mark>lorem</mark> AND <mark>ipsum!</mark>
                        </h2>
                    </div>
                    <img src={imagem3} alt="professor explicando algo para alunos em uma sala de aula" loading="lazy"/>
                </div>
                <div className="slide">
                    <div className="texto-slider">
                        <h2>
                            Lorem Ipsum is simply dummy text 
                            <br/>
                            <mark>lorem</mark> AND <mark>ipsum!</mark>
                        </h2>
                    </div>
                    <img src={imagem4} alt="professora olhando para a câmera e sorrindo" loading="lazy"/>
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


    </main>
    <Footer/>
</>
    )
}