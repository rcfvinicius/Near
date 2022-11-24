import './Atendimento.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { useEffect } from 'react';
import { useAuth } from '../../utils/Authentication.jsx';


export default function Atendimento(){
    const tokenData = useAuth()[4];
    //const [ultimoChat, setUltimoChat] = useState();
    let ultimoChat;

    function selecionarChat(event){
        const botoes = document.querySelectorAll('#Atendimento #chats button');
        for(let i=0;i<botoes.length;i++){
            if(botoes[i].dataset.id == event.target.dataset.id){
                for(let e=0;e<botoes.length;e++){
                    botoes[e].style = 'background-color:#351c50;';
                }
                botoes[i].style = 'background-color:#210a3a;';
                ultimoChat = botoes[i].dataset.id;
                renderMensagens(botoes[i].dataset.id);
                break;
            }
        }
    }

    async function buscarChats(){
        try{
            const controller = new AbortController();
                setTimeout(()=>{controller.abort()},5000);
    
                const resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/atendimento/buscarChats`,{
                    signal:controller.signal,
                    method:'GET',
                    mode:'cors',
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8',
                        'x-access-token': localStorage.getItem('token')
                    }
                });
    
                const res = await resposta.json();
                console.log(res)
                
                const container = document.querySelector('#Atendimento #chats');
                container.innerHTML = '';
                
                if(res.length == 0){
                    container.innerHTML = '<h1>Você ainda não possui conversas. Comece a digitar para criar uma.</h1>'
                    return;
                }
                
                for(let i=0;i<res.length;i++){
                    container.innerHTML += `
                    <button data-id='${res[i].id_chat}' type='button'>
                        ${tokenData.role == 'admin' ? res[i].nome_usuario : 'Atendimento'}
                        <div></div>
                    </button>
                    `;
                }

                for(let i=0;i<document.querySelectorAll('#Atendimento #chats button').length;i++){
                    document.querySelectorAll('#Atendimento #chats button')[i].addEventListener('click', selecionarChat);
                }
    
                if(document.querySelectorAll('#Atendimento #chats button').length != 0){
                    selecionarChat({target:{dataset:{id:document.querySelector('#Atendimento #chats button').dataset.id}}});
                    ultimoChat = document.querySelector('#Atendimento #chats button').dataset.id;
                    renderMensagens(ultimoChat);
                }
        }catch(err){
            console.log(err);
        }
    }

    async function renderMensagens(id_chat){
        try{
            const controller = new AbortController();
                setTimeout(()=>{controller.abort()},5000);
    
                const resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/atendimento/buscarMensagens?id_chat=${id_chat}`,{
                    signal:controller.signal,
                    method:'GET',
                    mode:'cors',
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8',
                        'x-access-token': localStorage.getItem('token')
                    }
                });
    
                const res = await resposta.json();
 
                const container = document.querySelector('#Atendimento #section-chat');
                container.innerHTML = '';

                for(let i=0;i<res.length;i++){
                    let lado;
                    if(res[i].admin && tokenData.role == 'admin'){
                        lado = 'direita';
                    }else{
                        if(tokenData.sub == res[i].id_usuario){
                            lado = 'direita';
                        }else{
                            lado = 'esquerda';
                        }
                    }

                    container.innerHTML = `
                    <div class="${lado}">
                        <p>${res[i].mensagem}</p>
                    </div>
                    ` + container.innerHTML;
                }

                const chats = document.querySelector('#Atendimento #section-chat');
                chats.scroll({
                    top:chats.offsetHeight,
                    left:0,
                    behavior: 'smooth'
                });
                
        }catch(err){
            console.log(err);
        }

    }

    async function enviarMensagem(event){
        try{
            event.preventDefault();
            const controller = new AbortController();
                setTimeout(()=>{controller.abort()},5000);
    
                const resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/atendimento/enviarMensagem`,{
                    signal:controller.signal,
                    method:'POST',
                    mode:'cors',
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8',
                        'x-access-token': localStorage.getItem('token')
                    },
                    body:JSON.stringify({
                        id_chat:ultimoChat,
                        mensagem:document.querySelector('#Atendimento #enviar-comentario-container input').value
                    })
                });
                const botoes = document.querySelectorAll('#Atendimento #chats button');
                if(botoes.length == 0){
                    buscarChats();
                }
                const res = await resposta.json();
                console.log(res);
                document.querySelector('#Atendimento #enviar-comentario-container input').value = '';
                if(ultimoChat){
                    renderMensagens(ultimoChat);
                    //buscarChats();
                }else{
                    renderMensagens(res.id_chat);
                    //buscarChats();
                }
        }catch(err){
            console.log(err);
        }
    }

    useEffect(()=>{

        buscarChats();

        const timer = setInterval(()=>{
            console.log(ultimoChat)
            renderMensagens(ultimoChat);
        },2000);

        return(()=>{
            clearInterval(timer);
        })
    },[]);

    return(
        <>
        <Header/>
        <main id='Atendimento'>
        <section id="chats">

        </section>
        <form id="form-chat" onSubmit={enviarMensagem}>
            <section id="section-chat">

            </section>
        <div id='enviar-comentario-container'>
            <input type="text" id='comentario-input' placeholder='Digite uma mensagem...'/>
            <button type="submit">enviar</button>
        </div>
</form>
</main>
        <Footer/>
        </>
    )
}