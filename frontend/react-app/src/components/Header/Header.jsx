import './Header.css';
import { Link } from "react-router-dom";
import nearLogo from '../../assets/near-logo.png';
import logoteste from '../../assets/logoteste.png';
import lupa from '../../assets/lupa.png';

export default function Header(props){
  
    return(
    <div id="header-nav">
    <div id="promo"></div>
    <header>
        <a href="/"><img id="logo" src={nearLogo} alt="logo parte 1"/><img src={logoteste} width="60px" alt="logo parte 2"/></a>

    <form method="GET">
        <input id="barra-de-pesquisa" type="text" name="search_query" placeholder="Pesquise cursos, professores, aulas, etc..."/>
        <Link to="/" id="botao-pesquisar" tabIndex="-1">
            <img src={lupa} height="30px" alt="lupa de pesquisa"/>
        </Link>
        <label htmlFor="barra-de-pesquisa">
        <img id="lupa-mob" src={lupa} height="30px" alt="lupa de pesquisa"/>
        </label>
    </form>
<Link id="login-cadastro-link" to="/login">
  <div id="login-cadastro">
    Entrar
  </div>
</Link>
    </header>
    <nav>
        <h4>...</h4>
        <a href="/#gradient1">Cursos populares</a>
        <a>Categorias</a>
        <a>Atendimento</a>
        <Link to="/area-do-aluno">Espaço do aluno</Link>

    </nav> 
</div>
    )
}