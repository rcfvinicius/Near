import { Link } from "react-router-dom";
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import { useAuth } from '../../utils/Authentication.jsx';
import './Login.css';

import gif from '../../assets/imagens/Mathematics.gif';


export default function Login(){
    const [mensagemErro, setMensagemErro] = useState('login');
    //const [logado,setLogado,returnTo,setReturnTo,tokenData,setTokenData] = useAuth();
    const setLogado = useAuth()[1];
    const returnTo = useAuth()[2];
    const setTokenData = useAuth()[5];

    const navigate = useNavigate();

    function logar(event){
        event.preventDefault();

        const controller = new AbortController();
        setTimeout(() => {controller.abort()},5000);

        //fetch para autenticar usuario e buscar o token
        fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/login`,{
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
            if(res.split('.').length < 3){
                throw new Error('TOKEN_INVALIDO');
            }
            localStorage.setItem("token", res);

            const controller = new AbortController();
                setTimeout(() => {controller.abort()},6000);
                
                //fetch para verificar o conteudo do token
                fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/token`,{
                    signal:controller.signal,
                    method:'GET',
                    headers:{
                        'x-access-token': res
                    }
                }).then(r=>r.text())
                .then(res2 => {
                    setTokenData(JSON.parse(res2));
                    setLogado(true);
                    navigate(returnTo);
                })

            //window.location.href = "http://localhost:3000/";
        }).catch((err)=>{
            //colocar aqui a remoçao do load
            setMensagemErro('Dados incorretos!');
            document.querySelector('#Login form h2').style = 'color:red;text-shadow:none;font-size:30px;'
            console.log(err);
            setLogado(false);
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