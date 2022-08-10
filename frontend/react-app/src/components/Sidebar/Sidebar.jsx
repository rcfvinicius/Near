import './Sidebar.css';

export default function Sidebar(){
    return(
        <section id="side-menu-container">
            <div id="side-menu">
                <div class="side-menu-item">
                    <img id="menu-img" src="../assets/menu-bars.png" alt="icone menu"/><h4 id="menuh4">Menu</h4>
                </div>

                <div class="side-menu-item">
                    <a href="/">
                        <img src="../assets/home.png" alt="side bar item"/><h4>Página inicial</h4>
                    </a>
                </div>

                <div class="side-menu-item">
                    <a href="./area-do-aluno.html">
                        <img src="../assets/lapis-exercicios.png" alt="side bar item"/><h4>Exercícios</h4>
                    </a>
                </div>

                <div class="side-menu-item">
                    <a href="./area-do-aluno.html">
                        <img src="../assets/youtube-icon.png" alt="side bar item"/><h4>Video aulas</h4>
                    </a>
                </div>
            </div>

        </section>
    )
}