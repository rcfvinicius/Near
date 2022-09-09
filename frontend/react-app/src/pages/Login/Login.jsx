import './Login.css';
import { Link } from "react-router-dom";
import gif from '../../assets/imagens/Mathematics.gif';
import { useState } from 'react';


export default function Login(){
    const [mensagemErro, setMensagemErro] = useState('login');

    function logar(event){
        event.preventDefault();

        const controller = new AbortController();
        setTimeout(() => {controller.abort()},9000);

        fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/all`,{
            signal: controller.signal,
            method: 'POST',
            headers:{
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                email: document.querySelector('#Login #user').value,
                senha: document.querySelector('#Login #pass').value
            })
        }).then(r=>r.text())
        .then(res => {
            console.log(res);
            if(res === 'ok'){
                window.location.href = "http://localhost:3000/";
            }else{
                setMensagemErro('Dados incorretos!');
                document.querySelector('#Login form h2').style = 'color:red;text-shadow:none;font-size:30px;'
            }
        }).catch((err)=>{
            //colocar aqui a remoçao do load
            console.log(err)
            setMensagemErro('timeout')
        })
    }

    return(
        <div id="Login">
        <div id="sections">
    <section>
        <div id="login-area">
            <form onSubmit={logar}>
                <h2>{mensagemErro}</h2>
                <br/>

                <div className="user-box">
                <label htmlFor="user"><h5>Email</h5></label>
                <input id="user" type="email" name="email" placeholder="Email" required/>
                </div>

                <div className="user-box">
                <label htmlFor="pass"><h5>Senha</h5></label>
                <input id="pass" type="password" name="senha" placeholder="Senha" minLength="1" required/>
                </div>
                
                <input id="submit-btn" value="ENTRAR" type="submit"/>
            </form>
        </div>
    </section>



    <section>
        <h3>Não tem uma conta? <Link to="/cadastro">Cadastre-se agora!</Link></h3>
        <img src={gif} alt="professor com um caderno na mão e em dúvida olhando para professora que está escrevendo em um quadro negro várias expressões matemáticas e gráficos"/>
    </section>
</div>
</div>
    )
}