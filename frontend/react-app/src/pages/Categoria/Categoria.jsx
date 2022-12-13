import './Categoria.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import defaultCourse from '../../assets/default-course.png';

export default function Categoria(){
    const navigate = useNavigate();

    async function fetchData(){
        const controller1 = new AbortController();
            setTimeout(()=>{controller1.abort()},5000);

            const resposta1 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/categorias`,{
                signal:controller1.signal,
                method:'GET',
                mode:'cors'
            });
        
            const res1 = await resposta1.json();
            
            function appendCard(categoria ,id, titulo, imgSrc, categoriaCompleta, preco){
                const container = document.querySelector(`#Categoria #${categoria}`);
                if(container.innerHTML == ''){
                    container.innerHTML = `
                    <div class='titulo-categoria'>
                        <h3>${categoriaCompleta}</h3>
                        <div></div>
                    </div>
                    `;
                }
                container.innerHTML += `
                <div class="card" data-id="${id}">
                    <div class='pelicula'>
                        <button type="button" data-id="${id}" data-desc="link"/>
                    </div>
                    <img src="${imgSrc}"/>
                    <div>
                        <h3>${titulo}</h3>
                        <h4>R$ ${(preco/100).toFixed(2)}</h4>
                    </div>
                </div>
                `;
            }

            for(let i=0;i<res1.length;i++){

                const controller2 = new AbortController();
                setTimeout(()=>{controller2.abort()},5000);
                const resposta2 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosAdquiridosImg?id=${res1[i].id}`,{
                    signal:controller2.signal,
                    method:'GET',
                    mode:'cors',
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8',
                        'x-access-token': localStorage.getItem('token')
                    }
                });

                const res2 = await resposta2.blob();

                let imgSrc;
                if(res2.type == 'text/html'){
                    imgSrc = defaultCourse;
                }else{
                    imgSrc = URL.createObjectURL(res2);
                }

                switch(res1[i].categoria){
                    case 'Tecnologia':
                        appendCard(res1[i].categoria, res1[i].id, res1[i].titulo, imgSrc, res1[i].categoria, res1[i].preco);
                        break;
                    case 'Idiomas':
                        appendCard(res1[i].categoria, res1[i].id, res1[i].titulo, imgSrc, res1[i].categoria, res1[i].preco);
                        break;
                    case 'Design':
                        appendCard(res1[i].categoria, res1[i].id, res1[i].titulo, imgSrc, res1[i].categoria, res1[i].preco);
                        break;
                    case 'Marketing':
                        appendCard(res1[i].categoria, res1[i].id, res1[i].titulo, imgSrc, res1[i].categoria, res1[i].preco);
                        break;
                    case 'Musica':
                        appendCard(res1[i].categoria, res1[i].id, res1[i].titulo, imgSrc, 'Música', res1[i].preco);
                        break;
                    case 'Saude':
                        appendCard(res1[i].categoria, res1[i].id, res1[i].titulo, imgSrc, 'Saúde', res1[i].preco);
                        break;
                    default:
                        appendCard('Outro', res1[i].id, res1[i].titulo, imgSrc, 'Outras categorias', res1[i].preco);
                        break;
                }

            }

            for(let i=0;i<document.querySelectorAll('#Categoria .pelicula > button').length;i++){
                document.querySelectorAll('#Categoria .pelicula > button')[i].addEventListener('click', (event)=>{
                    navigate(`/sobre/${event.target.dataset.id}`);
                })
            }
    }

    useEffect(()=>{
        fetchData();
    },[])

    return(
        <>
        <Header/>
        <main id='Categoria'>
            <section id='Tecnologia'>

            </section>
            <section id='Idiomas'>

            </section>
            <section id='Design'>

            </section>
            <section id='Marketing'>

            </section>
            <section id='Musica'>

            </section>
            <section id='Saude'>

            </section>
            <section id='Outro'>

            </section>


{/*             <div class="card" data-id="${itens[i].id}">
                <div class='pelicula'>
                    <button type="button" data-id="${itens[i].id}" data-desc="link"/>
                    <button type="button" data-id="${itens[i].id}" data-desc="delete"/>
                </div>
                <img src="${imgSrc}"/>
                <div>
                    <h3>${itens[i].titulo_longo}</h3>
                    <h4>R$ ${(itens[i].preco/100).toFixed(2)}</h4>
                </div>
            </div> */}
        </main>
        <Footer/>
        </>
    )
}