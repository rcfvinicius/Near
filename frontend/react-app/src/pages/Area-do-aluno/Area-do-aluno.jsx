import { useEffect } from 'react';
import Sidebar from '../../components/Sidebar/Sidebar';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import './Area-do-aluno.css';

import quimica from "../../assets/exercicio-quimica.png";
import funcoes from '../../assets/exercicio-funcoes.png';

export default function Area_do_aluno(){
    useEffect(()=>{
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    },[])
    return(
        <>
        <Header/>
        <main id="Area-do-aluno">
        
        <Sidebar/>
<div id="conteudo">
<section id="textos-sobre">
    <h1>Titulo</h1>
        <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.  Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum. Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
</section>

<form>
<div className="container-exercicios">
    <div className="colunas">
        <section>
            <b><a href="">Tecnologia</a> {'>'} <a href="">Programação</a></b>
            <h2>Exercicio</h2>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
            <img src={quimica} alt="imagem de um exercício de química"/>


            <label className="container-checkbox"><h5>a) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                <input type="radio" name="exercicio1" value="a"/><br/>
                <span className="check"></span>
            </label>

            <label className="container-checkbox"><h5>b) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                <input type="radio" name="exercicio1" value="b"/><br/>
                <span className="check"></span>
            </label>
            
            <label className="container-checkbox"><h5>c) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                <input type="radio" name="exercicio1" value="c"/><br/>
                <span className="check"></span>
            </label>
    
            <label className="container-checkbox"><h5>d) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                <input type="radio" name="exercicio1" value="d"/><br/>
                <span className="check"></span>
            </label>
            

        </section>

        <section>
            <h2>Exercicio</h2>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
        </section>

    </div>

    
    <div className="colunas">
        <section>
            <b><a href="">Tecnologia</a> {'>'} <a href="">Programação</a></b>
            <h2>Exercicio</h2>
            <p>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
            <img src={funcoes} alt="imagem de um exercício de funções"/>


            <label className="container-checkbox"><h5>a) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                <input type="radio" name="exercicio2" value="a"/><br/>
                <span className="check"></span>
            </label>

            <label className="container-checkbox"><h5>b) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                <input type="radio" name="exercicio2" value="b"/><br/>
                <span className="check"></span>
            </label>
            
            <label className="container-checkbox"><h5>c) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                <input type="radio" name="exercicio2" value="c"/><br/>
                <span className="check"></span>
            </label>
    
            <label className="container-checkbox"><h5>d) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                <input type="radio" name="exercicio2" value="d"/><br/>
                <span className="check"></span>
            </label>
        </section>

    </div>

    </div>{/* <!-- fim do primeiro container de exercicios --> */}


    <div className="container-exercicios">
        <div className="colunas">
            <section>
                <b><a href="">Tecnologia</a> {'>'} <a href="">Programação</a></b>
                <h2>Exercicio</h2>
                <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <img src={funcoes} alt="imagem de um exercício de funções"/>
    
    
                <label className="container-checkbox"><h5>a) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                    <input type="radio" name="exercicio2" value="a"/><br/>
                    <span className="check"></span>
                </label>
    
                <label className="container-checkbox"><h5>b) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                    <input type="radio" name="exercicio2" value="b"/><br/>
                    <span className="check"></span>
                </label>
                
                <label className="container-checkbox"><h5>c) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                    <input type="radio" name="exercicio2" value="c"/><br/>
                    <span className="check"></span>
                </label>
        
                <label className="container-checkbox"><h5>d) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                    <input type="radio" name="exercicio2" value="d"/><br/>
                    <span className="check"></span>
                </label>
            </section>
    
        </div>
 
        <div className="colunas">
            <section>
                <b><a href="">Tecnologia</a> {'>'} <a href="">Programação</a></b>
                <h2>Exercicio</h2>
                <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
                <img src={quimica} alt="imagem de um exercício de química"/>
    
    
                <label className="container-checkbox"><h5>a) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                    <input type="radio" name="exercicio1" value="a"/><br/>
                    <span className="check"></span>
                </label>
    
                <label className="container-checkbox"><h5>b) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                    <input type="radio" name="exercicio1" value="b"/><br/>
                    <span className="check"></span>
                </label>
                
                <label className="container-checkbox"><h5>c) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                    <input type="radio" name="exercicio1" value="c"/><br/>
                    <span className="check"></span>
                </label>
        
                <label className="container-checkbox"><h5>d) Lorem Ipsum is simply dummy text of the printing and typesetting industry</h5>
                    <input type="radio" name="exercicio1" value="d"/><br/>
                    <span className="check"></span>
                </label>
                
    
            </section>
    
            <section>
                <h2>Exercicio</h2>
                <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                </p>
            </section>
    
        </div>


    </div>
    <div id="btn-fim-pagina-container">
        <button type="button" className="btn-fim-pagina">Carregar mais</button>
        <input type="submit" className="btn-fim-pagina" value="Enviar respostas"/>
    </div>



</form>


 </div>

</main>
<Footer/>
</>
    )
}