import './Cadastro.css';
import imagem from '../../assets/imagens/Students-pana.png';//https://storyset.com/illustration/students/pana
import { useState } from 'react';

export default function Cadastro(){
    const [mensagemErro, setMensagemErro] = useState('cadastro');

    function cadastrar(event){
        event.preventDefault();

        const controller = new AbortController();
        setTimeout(() => {controller.abort()},9000);

        fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/cadastro`,{
            signal: controller.signal,
            method: 'POST',
            headers:{
                'Content-Type': 'application/json;charset=UTF-8'
            },
            body: JSON.stringify({
                nome: document.querySelector('#Cadastro #nome').value,
                email: document.querySelector('#Cadastro #email').value,
                senha: document.querySelector('#Cadastro #senha').value,
                role: document.querySelector('#radio-buttons input:checked').value
            })
        }).then(r=>r.text())
        .then(res => {
            console.log(res);
            if(res === 'criado'){
                window.location.href = "http://localhost:3000/";
            }else{
                setMensagemErro('Este usuário já está cadastrado!');
                document.querySelector('#Cadastro form h2').style = 'color:red;text-shadow:none;'
            }
        })
    }
/* 

*/
console.log()

    return(
        <div id="Cadastro">
        <section>
        <form onSubmit={cadastrar}>
            <h2>{mensagemErro}</h2>
            <div className="user-box">
                <label htmlFor="nome"><h5>Nome</h5></label>
                <input id="nome" type="text" name="nome" placeholder="Nome" required/>
            </div>
            <div className="user-box">
                <label htmlFor="email"><h5>Email</h5></label>
                <input id="email" type="email" name="email" placeholder="Email" required/>
            </div>

            <div className="user-box">
                <label htmlFor="senha"><h5>Senha</h5></label>
                <input id="senha" type="password" name="senha" placeholder="Senha" required/>
            </div>
            <div className="user-box">
                <label htmlFor="senha-confirm"><h5>Confirme a senha</h5></label>
                <input id="senha-confirm" type="password" name="senha-confirm" placeholder="Confirme a senha" required/>
            </div>
            <div id="radio-buttons">
            <div><input type="radio" name="role" id='r-aluno' value="aluno" defaultChecked/><label htmlFor='r-aluno'>Sou aluno</label></div>
            <div><input type="radio" name="role" id='r-professor' value="professor"/><label htmlFor='r-professor'>Sou professor</label></div>
            </div>

            <input id="submit-btn" value="CRIAR CONTA" type="submit"/>
        </form>
        <div id="parte2">
            <img src={imagem} alt='Estudantes'/>
        </div>
    </section>
    </div>
    )
}