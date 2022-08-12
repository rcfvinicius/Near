import './Sidebar.css';
import menuBars from '../../assets/menu-bars.png';
import home from '../../assets/home.png';
import lapis from '../../assets/lapis-exercicios.png';
import youtube from "../../assets/youtube-icon.png";
//fazer a sibebar pra celular 

export default function Sidebar(){
    return(
        <section id="side-menu-container">
            <div id="side-menu">
                <div className="side-menu-item">
                    <img id="menu-img" src={menuBars} alt="icone menu"/><h4 id="menuh4">Menu</h4>
                </div>

                <div className="side-menu-item">
                    <a href="/">
                        <img src={home} alt="side bar item"/><h4>Página inicial</h4>
                    </a>
                </div>

                <div className="side-menu-item">
                    <a href="./area-do-aluno.html">
                        <img src={lapis} alt="side bar item"/><h4>Exercícios</h4>
                    </a>
                </div>

                <div className="side-menu-item">
                    <a href="./area-do-aluno.html">
                        <img src={youtube} alt="side bar item"/><h4>Video aulas</h4>
                    </a>
                </div>
            </div>

        </section>
    )
}