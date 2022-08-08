import './Login.css';
import gif from '../../assets/imagens/Mathematics.gif';

export default function Login(){
    return(
        <div id="Login">
        <div id="sections">
    <section>
        <div id="login-area">
            <form method="POST" action="http://localhost:8000/user/login">
                <h2>login</h2>
                <br/>

                <div class="user-box">
                <label for="user"><h5>Email</h5></label>
                <input id="user" type="email" name="email" placeholder="Email" required/>
                </div>

                <div class="user-box">
                <label for="pass"><h5>Senha</h5></label>
                <input id="pass" type="password" name="senha" placeholder="Senha" minlength="1" required/>
                </div>
                
                <input id="submit-btn" value="ENTRAR" type="submit"/>
            </form>
        </div>
    </section>



    <section>
        <h3>Não tem uma conta? <a href="./cadastro.html">Cadastre-se agora!</a></h3>
        <img src={gif} alt="professor com um caderno na mão e em dúvida olhando para professora que está escrevendo em um quadro negro várias expressões matemáticas e gráficos"/>
    </section>
</div>
</div>
    )
}