import './Header.css';
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuth } from '../../utils/Authentication.jsx';

import pesquisar from '../../utils/Pesquisar.js';  
import nearLogo from '../../assets/near-logo.png';
import logoteste from '../../assets/logoteste.png';
import lupa from '../../assets/lupa.png';

export default function Header(){
    const [to,setTo] = useState('/login');
    const [usuario,setUsuario] = useState('Entrar');
    const navigate = useNavigate();
    
    const logado = useAuth()[0];
    const tokenData = useAuth()[4];

    function pesquisa(event){
        event.preventDefault();
        if(document.querySelector('#barra-de-pesquisa').value != ''){
            const q = encodeURIComponent(document.querySelector('#barra-de-pesquisa').value);
            if(window.location.href.split('//')[1].split('/')[1].split('?')[0] == 'pesquisa'){
                navigate(`/pesquisa?q=${q}`);
                pesquisar();
            }else{
                navigate(`/pesquisa?q=${q}`);
            }
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
            if(res.length > 0){
                document.querySelector('#header-nav #bolinha').style = 'display:block';
            }else{
                document.querySelector('#header-nav #bolinha').style = 'display:none';
            }
        }catch(err){
            console.log(err);
        }
    }


    useEffect(()=>{
        document.querySelector('#header-nav #barra-de-pesquisa').addEventListener('focus',()=>{
            if(window.innerWidth < 701){
                document.querySelector('#header-nav header > a').style = 'display:none';
                //document.querySelector('#header-nav #login-cadastro-link').style = 'display:none';
                document.querySelector('#header-nav #c-p').style = 'display:none';
            }
        });
        document.querySelector('#header-nav #barra-de-pesquisa').addEventListener('focusout',()=>{
            document.querySelector('#header-nav header > a').style = 'display:inline-block';
            //document.querySelector('#header-nav #login-cadastro-link').style = 'display:flex';
            document.querySelector('#header-nav #c-p').style = 'display:flex';
        });

        temNoCarrinho();
    },[])

    useEffect(()=>{
        if(logado && tokenData.nome != undefined){
            setUsuario(`Olá, ${tokenData.nome.split(' ')[0]}`);
            setTo('/painel');
        }
    },[tokenData])

    return(
    <div id="header-nav">
    <div id="promo"></div>
    <header>
        <a href="/"><img id="logo" src={nearLogo} alt="logo parte 1"/><img src={logoteste} width="60px" alt="logo parte 2"/></a>

    <form onSubmit={pesquisa}>
        <input id="barra-de-pesquisa" type="text" name="search_query" placeholder="Pesquise cursos, pessoas, aulas, etc..."/>
        <button type="submit" to="/" id="botao-pesquisar" tabIndex="-1">
            <img src={lupa} height="30px" alt="lupa de pesquisa"/>
        </button>
        <label htmlFor="barra-de-pesquisa">
        <img id="lupa-mob" src={lupa} height="30px" alt="lupa de pesquisa"/>
        </label>
    </form>

    <div id='c-p' style={{display:'flex', columnGap:'20px'}}>
        <button onClick={()=>{navigate('/carrinho')}} title='Carrinho'>
            <div id="bolinha"></div>
        </button>
        <Link id="login-cadastro-link" to={to}>
            <div id="login-cadastro">
                {usuario}
            </div>
        </Link>
    </div>
    </header>
    <nav>
        <h4>...</h4>
        <a href="/#gradient1">Cursos populares</a>
        <Link to='/categorias'>Categorias</Link>
        <Link to='/atendimento'>Atendimento</Link>
        <Link to="/painel">Painel do usuário</Link>
    </nav> 
</div>
    )
}