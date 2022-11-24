import { useEffect } from 'react';
import './Sobre.css';
import Header from '../../components/Header/Header.jsx'
import Footer from '../../components/Footer/Footer.jsx';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
//importar as imagens
//arrumar o css do #section2
export default function Sobre(){
    const params = useParams();
    const navigate = useNavigate();
    const [adquirido, setAdquirido] = useState(false);

    const posAsideSection = function(){
        if(window.innerWidth < 1261){
            const altura = document.querySelector('#Sobre-container > section aside img').offsetHeight + 328;
            document.querySelector('#Sobre-container > section aside').style = `height:${altura}px`;
            document.querySelector('#section2').style = `margin-top:${altura+30}px;`;
            }
            else{
                document.querySelector('#Sobre-container > section aside').style = '';
                document.querySelector('#section2').style = '';
            }
            if(adquirido){
                document.querySelector('#fundo-adquirido').style = `
                display:flex;
                width:calc(100% - 6px);
                height:${document.querySelector('#Sobre-container > section aside img').offsetHeight}px;`;
            }
            
            
            /* tamanho do aside */
            const alturaImg = document.querySelector('#Sobre-container > section aside img').offsetHeight;
            const alturaDiv = document.querySelector('#Sobre-container section aside #container-aside').offsetHeight + 10;
            const aside = document.querySelector('#Sobre-container section aside');
    
            aside.style = `height: ${alturaDiv+alturaImg+63}px`;

    }


    async function fetchData(){
        try{
            //consulta de dados do curso
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);
            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursoInfo?id=${params.id}`,{
                signal:controller.signal,
                method:'GET',
                mode:'cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token':localStorage.getItem('token')
                }
            })
            let res = await resposta.json();
            console.log(res);
            if(!res[0]){
                throw new Error('Nenhum curso encontrado');
            }

            document.querySelector('#Sobre-container > section:first-child > div:first-child').innerHTML = `
            <b>${res[0].categoria}</b>
            <h1>${res[0].titulo_longo}</h1>
           
            <h3>${res[0].descricao}</h3>
            `;

            document.querySelector('#Sobre-container section aside #container-aside h3').innerHTML = `
            R$ ${(res[0].preco/100).toFixed(2)}
            `;

            document.querySelector('#Sobre-container section aside #container-aside h4').innerHTML = `
            Total de aulas: ${res[1]}
            `;

            if(res[0].aprendizado){
                document.querySelector('#Sobre-container #flex-container-uls').innerHTML = '<ul></ul><ul></ul>';
            
                for(let i=0;i<res[0].aprendizado.split(';').length;i++){
                    if(i % 2 > 0){
                        document.querySelector('#Sobre-container #flex-container-uls ul:first-child').innerHTML += `
                        <li>${res[0].aprendizado.split(';')[i]}</li>
                        `;
                    }else{
                        document.querySelector('#Sobre-container #flex-container-uls ul:last-child').innerHTML += `
                        <li>${res[0].aprendizado.split(';')[i]}</li>
                        `;
                    }
                }
            }

            //consulta de imagem do curso
            const controller2 = new AbortController();
            setTimeout(() => {controller2.abort()},5000);
            let resposta2 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosAdquiridosImg?id=${params.id}`,{
                signal:controller2.signal,
                method:'GET',
                mode:'cors'
            })
            let res2 = await resposta2.blob();
            document.querySelector('#Sobre-container aside > div:first-child img').src =  URL.createObjectURL(res2);

            verificarAquisicao();
            setTimeout(()=>{
                posAsideSection();
            },200);
        }catch(err){
            console.log(err);
            if(err == 'Error: Nenhum curso encontrado'){
                navigate('/404');
            }
        }
    }

    async function comprar(){
        try{
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);
            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/adquirir`, {
                signal:controller.signal,
                method:'POST',
                mode:'cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token':localStorage.getItem('token')
                },
                body:JSON.stringify({
                    idCurso: params.id
                })
            })

            let res = await resposta.text();
            //console.log(res)
            if(res == 'adquirido'){
                verificarAquisicao();
            }else if(res == 'Erro de autenticação via token'){
                navigate('/login');
            }

        }catch(err){
            console.log(err);
        }
    }

    async function verificarAquisicao(){
        try{
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);
            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/verificarAquisicao?idCurso=${params.id}`, {
                signal:controller.signal,
                method:'GET',
                mode:'cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token':localStorage.getItem('token')
                }
            })
            const res = await resposta.json();

            if(res.adquirido){
                document.querySelector('#fundo-adquirido').style = `
                display:flex;
                width:calc(100% - 6px);
                height:${document.querySelector('main > section aside img').offsetHeight}px;
                `;
    
                document.querySelector('main > section aside div button').style = `cursor:not-allowed;`;
                document.querySelector('main > section aside div button').disabled = true;
                document.querySelector('main > section aside div #botao2').style = `cursor:not-allowed;`;
    
                document.querySelector('aside div h3').innerHTML= 'Adquirido!';
                setAdquirido(true);

            }else{
                document.querySelector('#fundo-adquirido').style = 'display:none;'
                setAdquirido(false);

                //document.querySelector('main > section aside div button').addEventListener('click', ()=>{});
                document.querySelector('main > section aside div #botao2').addEventListener('click', comprar);
            }
        }catch(err){
            console.log(err);
            document.querySelector('main > section aside div #botao2').addEventListener('click', comprar);
        }
    }

    async function addAoCarrinho(){
        try{
            console.log('passou')
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);
            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/carrinho/salvar`, {
                signal:controller.signal,
                method:'POST',
                mode:'cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token':localStorage.getItem('token')
                },
                body:JSON.stringify({
                    item:params.id
                })
            })
            await resposta.json();
            document.querySelector('main > section aside div button').style = `cursor:not-allowed;`;
            document.querySelector('main > section aside div button').disabled = true;
            document.querySelector('#header-nav #bolinha').style = 'display:block';
        }catch(err){
            console.log(err);
        }
    }

    async function temNoCarrinho(){
        try{
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);
            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/carrinho/ler`, {
                signal:controller.signal,
                method:'GET',
                mode:'cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token':localStorage.getItem('token')
                }
            })
            const res = await resposta.json();
            for(let i=0;i<res.length;i++){
                if(res[i].id == params.id){
                    document.querySelector('main > section aside div button').style = `cursor:not-allowed;`;
                    document.querySelector('main > section aside div button').disabled = true;
                    return;
                }
            }
            document.querySelector('main > section aside div button').addEventListener('click', addAoCarrinho);
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{
        window.scrollTo(0, 0);

        /* posicionamento do aside e #section2 */
        window.addEventListener('resize', posAsideSection);
        window.addEventListener('load', posAsideSection);
        posAsideSection();
        fetchData();
        temNoCarrinho();
    },[])

    return(
        <>
        <Header/>
        <main id="Sobre-container">
    <section>
        <div>
            <b><a href=""></a> {">"} <a href=""></a></b>
            <h1></h1>
            <div className="avaliacao-after"><h3>Avaliação:</h3></div>
            <h3></h3>
        </div>

        <aside>
            <div>
                <div id="fundo-adquirido"><div id="d1-maior"><div id="d2-menor"></div></div></div>
                <img/>
            </div>
            <div id="container-aside">
                <h3>R$ 00,00</h3>
                <button type="button">Adicionar ao carrinho</button>
                <button type="button" id="botao2">Comprar</button>
                <h4></h4>
            </div>

        </aside>

    </section>

    <section id="section2">
        <h2>O que você vai aprender</h2>
        <div id="flex-container-uls">

        </div>
    </section>
    <section id="section3">
        
    </section>
    </main>
    <Footer/>
        </>
    )
}