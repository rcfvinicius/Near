import './Header.css';
import { Link } from "react-router-dom";
import { useEffect } from 'react';
import { useState } from 'react';
import { useAuth } from '../../utils/Authentication.jsx';

import nearLogo from '../../assets/near-logo.png';
import logoteste from '../../assets/logoteste.png';
import lupa from '../../assets/lupa.png';

export default function Header(props){
    const [to,setTo] = useState('/login');
    const [usuario,setUsuario] = useState('Entrar');
    
    const logado = useAuth()[0];
    const tokenData = useAuth()[4];

    useEffect(()=>{
        document.querySelector('#header-nav #barra-de-pesquisa').addEventListener('focus',()=>{
            if(window.innerWidth < 701){
                document.querySelector('#header-nav header > a').style = 'display:none';
                document.querySelector('#header-nav #login-cadastro-link').style = 'display:none';
            }
        });
        document.querySelector('#header-nav #barra-de-pesquisa').addEventListener('focusout',()=>{
            document.querySelector('#header-nav header > a').style = 'display:inline-block';
            document.querySelector('#header-nav #login-cadastro-link').style = 'display:flex';
        });

        if(logado && tokenData.nome !== undefined){
            setUsuario(`Olá, ${tokenData.nome}`);
            setTo('/painel');
        }
    },[tokenData])

    return(
    <div id="header-nav">
    <div id="promo"></div>
    <header>
        <a href="/"><img id="logo" src={nearLogo} alt="logo parte 1"/><img src={logoteste} width="60px" alt="logo parte 2"/></a>

    <form method="GET">
        <input id="barra-de-pesquisa" type="text" name="search_query" placeholder="Pesquise cursos, pessoas, aulas, etc..."/>
        <Link to="/" id="botao-pesquisar" tabIndex="-1">
            <img src={lupa} height="30px" alt="lupa de pesquisa"/>
        </Link>
        <label htmlFor="barra-de-pesquisa">
        <img id="lupa-mob" src={lupa} height="30px" alt="lupa de pesquisa"/>
        </label>
    </form>
<Link id="login-cadastro-link" to={to}>
  <div id="login-cadastro">
    {usuario}
  </div>
</Link>
    </header>
    <nav>
        <h4>...</h4>
        <a href="/#gradient1">Cursos populares</a>
        <a>Categorias</a>
        <a>Atendimento</a>
        <Link to="/painel">Painel do usuário</Link>

    </nav> 
</div>
    )
}