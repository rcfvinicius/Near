import './Curso.css'
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import fechar from '../../assets/x2.png'

export default function Curso(){
    const params = useParams();
    const navigate = useNavigate();
    const [ordem,setOrdem] = useState();
    const [idVideoAula, setIdVideoAula] = useState();

    
   function selecionarVideoAula(event){
    document.querySelector('#Curso #iframe-container').innerHTML = `
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${event.target.dataset.cod}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
    `;
    const botoes = document.querySelectorAll('#Curso #sidebar button');
    for(let i=0;i<botoes.length;i++){
        if(botoes[i].dataset.id == event.target.dataset.id){
            for(let e=0;e<botoes.length;e++){
                botoes[e].style = 'background-color:#351c50;';
            }
            botoes[i].style = 'background-color:#1d0f2c;';
            setIdVideoAula(botoes[i].dataset.id);
            buscarComentarios(botoes[i].dataset.id);
            break;
        }
    }
   }


   async function buscarVideos(){
    try{
    const sidebar = document.querySelector('#Curso #sidebar');
    sidebar.innerHTML = '';
    //buscar todas as video aulas visiveis e colocar os codigos num array
    //no array é salvo o codigo e no botao é salvo o index
    const controller = new AbortController();
    setTimeout(() => {controller.abort()},5000);

    let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/buscarVideoAulas?idCurso=${params.id}`,{
        signal:controller.signal,
        method:'GET',
        mode:'cors',
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': localStorage.getItem('token')
        }
    })
    //console.log(JSON.parse(await resposta.text()))
    let res = await resposta.text();
    if(res == 'Erro de autenticação via token'){
        navigate('/login');
        return;
    }
    if(res.slice(0,11) == 'Usuário não'){
        alert('Você não possui este curso!');
        navigate('/');
        return;
    }
    //const aulas = JSON.parse(await resposta.text());
    const aulas = JSON.parse(res);
    for(let i=0;i<aulas.length;i++){
        sidebar.innerHTML += `<button type='button' data-id="${aulas[i].id}" data-cod="${aulas[i].cod}" data-nome="${aulas[i].nome}">${aulas[i].nome}</button>`;
    }

    const botoes = document.querySelectorAll('#Curso #sidebar button');
    for(let i=0;i<botoes.length;i++){
        botoes[i].addEventListener('click',selecionarVideoAula);
    }

    document.querySelector('#Curso #iframe-container').innerHTML = `
    <iframe width="560" height="315" src="https://www.youtube.com/embed/${botoes[0].dataset.cod}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="allowfullscreen"></iframe>
    `;
    for(let i=0;i<botoes.length;i++){
        botoes[i].style = 'background-color:#351c50;';
    }
    botoes[0].style = 'background-color:#1d0f2c;';
    setIdVideoAula(botoes[0].dataset.id);
    buscarComentarios(botoes[0].dataset.id);

}catch(err){
    console.log(err);
}
}

async function buscarComentarios(id){
try{

    const controller = new AbortController();
    setTimeout(() => {controller.abort()},5000);

    let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/buscarComentarios?id_video_aula=${id}&idCurso=${params.id}`,{
        signal:controller.signal,
        method:'GET',
        mode:'cors',
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': localStorage.getItem('token')
        }
    });
    
    let res = JSON.parse(await resposta.text());
    
    const container = document.querySelector('#Curso #comentarios');
    container.innerHTML = '';
    
    document.querySelector('#Curso #comentarios-container h2').innerHTML = `Comentários (${res[0]})`;
    

    for(let i=0;i<res[1].length;i++){
        //console.log(res[1][i].data_comentario)
        let data = String(new Date(parseInt(res[1][i].data_comentario)));
        let mes = '00';
        switch(data.split(' ')[1]){
            case 'Jan':
                mes = '01';
                break;
            case 'Feb':
                mes = '02';
                break;
            case 'Mar':
                mes = '03';
                break;
            case 'Apr':
                mes = '04';
                break;
            case 'May':
                mes = '05';
                break;
            case 'Jun':
                mes = '06';
                break;
            case 'Jul':
                mes = '07';
                break;
            case 'Aug':
                mes = '08';
                break;
            case 'Sep':
                mes = '09';
                break;
            case 'Oct':
                mes = '10';
                break;
            case 'Nov':
                mes = '11';
                break;
            case 'Dec':
                mes = '12';
                break;
        }

        container.innerHTML += `
        <div class="comentario-container">
            <div>
                <h4>
                ${res[1][i].nome} - 
                ${data.split(' ')[2]}/${mes}/${data.split(' ')[3]}
                </h4>
            </div>
            <div>
                <p>${res[1][i].comentario}</p>
            </div>
        </div>
        `;
    }

}catch(err){
    console.log(err);
}
}


async function comentar(event){
try{
    event.preventDefault();
    if(document.querySelector('#comentarios-container form input[name="comentario"]').value == ''){
        alert('Comentário não pode estar vazio!');
        throw new Error('Comentário não pode estar vazio!');
    }
    if(!idVideoAula){
        alert('Nenhuma video aula encontrada para este curso!');
        throw new Error('Nenhuma video aula encontrada para este curso!');
    }

    const controller = new AbortController();
    setTimeout(() => {controller.abort()},5000);

    let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/comentar`,{
        signal:controller.signal,
        method:'POST',
        mode:'cors',
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': localStorage.getItem('token')
        },
        body:JSON.stringify({
            idCurso:params.id,
            id_video_aula: idVideoAula,
            comentario: document.querySelector('#comentarios-container form input[name="comentario"]').value
        })
    });
    document.querySelector('#comentarios-container form input[name="comentario"]').value = '';
    let res = await resposta.text();

    buscarComentarios(idVideoAula);
    console.log(res);
}catch(err){
    console.log(err);
}
}


//let ultimaOrdemDataset=1;
function resetarOrdem(){
    for(let i=0;i<document.querySelectorAll('#Curso #todas-aulas button').length;i++){
        document.querySelectorAll(`#Curso #todas-aulas button + span`)[i].innerHTML = '0';
        document.querySelectorAll(`#Curso #todas-aulas button + span`)[i].style = 'color:red;';
        document.querySelectorAll('#Curso #todas-aulas button')[i].style = 'background-color:#351c50;';
        document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.ordem = '0';
    }
    let ultimaOrdem = 1;
    for(let i=0;i<ordem.length;i++){
        for(let e=0;e<document.querySelectorAll('#Curso #todas-aulas button').length;e++){
            if(ordem[i] == document.querySelectorAll('#Curso #todas-aulas button')[e].dataset.id){
                document.querySelectorAll('#Curso #todas-aulas button')[e].style = 'background-color:#1d0f2c;';
                document.querySelectorAll('#Curso #todas-aulas button')[e].dataset.ordem = ultimaOrdem;
                document.querySelectorAll(`#Curso #todas-aulas button + span`)[e].innerHTML = ultimaOrdem;
                document.querySelectorAll(`#Curso #todas-aulas button + span`)[e].style = 'color:white;';
                ultimaOrdem++;
            }
        }
    }
}
async function buscarTodasAulas(){
try{
    const controller = new AbortController();
    setTimeout(()=>{controller.abort()},5000);

    let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/buscarVideoAulas?idCurso=${params.id}&mode=all`,{
        signal:controller.signal,
        method:'GET',
        mode:'cors',
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': localStorage.getItem('token')
        }
    });

    let res = JSON.parse(await resposta.text());
    //console.log(res)
    const container = document.querySelector('#Curso #todas-aulas');
    container.innerHTML = '';
    if(res[0]){
        for(let i=0;i<res[1].length;i++){
            container.innerHTML += `<div><button type='button' data-id="${res[1][i].id}" data-cod="${res[1][i].cod}" data-ordem="0" data-nome="${res[1][i].nome}">${res[1][i].nome}</button><span></span></div>`;
            document.querySelectorAll(`#Curso #todas-aulas button + span`)[document.querySelectorAll(`#Curso #todas-aulas button + span`).length-1].innerHTML = '0';
            document.querySelectorAll(`#Curso #todas-aulas button + span`)[document.querySelectorAll(`#Curso #todas-aulas button + span`).length-1].style = 'color:red;';
        }
        for(let i=0;i<document.querySelectorAll('#Curso #todas-aulas button').length;i++){
            document.querySelectorAll('#Curso #todas-aulas button')[i].addEventListener('click',(event)=>{
                if(event.target.dataset.ordem == '0'){
                    document.querySelectorAll(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`)[document.querySelectorAll(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`).length-1].style = 'color:white;';
                    let maior = 0; 
                    for(let i=0;i<document.querySelectorAll('#Curso #todas-aulas button').length;i++){
                        if(parseInt(document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.ordem) > maior){
                            maior = parseInt(document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.ordem);
                        }
                    }
                    //event.target.dataset.ordem = ultimaOrdemDataset;
                    event.target.dataset.ordem = maior+1;
                    event.target.style = 'background-color:#1d0f2c;';
                    //ultimaOrdemDataset++;
                    document.querySelector(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`).innerHTML = event.target.dataset.ordem;
                }else{
                    document.querySelectorAll(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`)[document.querySelectorAll(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`).length-1].style = 'color:red;';
                    event.target.dataset.ordem = 0;
                    event.target.style = 'background-color:#351c50;';
                   // ultimaOrdemDataset--;
                    document.querySelector(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`).innerHTML = event.target.dataset.ordem;
                }
            });
        }

        let limit=0;
        let i=0;
        const ordemInicial = [];
        while(i < res[0].split(';').length-1 && limit < 9999){
            ordemInicial.push(res[0].split(';')[i]);
            limit++;
            i++;
        }
        setOrdem(ordemInicial);

        let ultimaOrdem = 1;
        for(let i=0;i<ordemInicial.length;i++){
            for(let e=0;e<document.querySelectorAll('#Curso #todas-aulas button').length;e++){
                if(ordemInicial[i] == document.querySelectorAll('#Curso #todas-aulas button')[e].dataset.id){
                    document.querySelectorAll('#Curso #todas-aulas button')[e].style = 'background-color:#1d0f2c;';
                    document.querySelectorAll('#Curso #todas-aulas button')[e].dataset.ordem = ultimaOrdem;
                    document.querySelectorAll(`#Curso #todas-aulas button + span`)[e].innerHTML = ultimaOrdem;
                    document.querySelectorAll(`#Curso #todas-aulas button + span`)[e].style = 'color:white;';
                    ultimaOrdem++;
                }
            }
        }

    }else{
        const ordemInicial = [];
        for(let i=0;i<res[1].length;i++){
            container.innerHTML += `<div><button type='button' data-id="${res[1][i].id}" data-cod="${res[1][i].cod}" data-ordem="${i+1}" data-nome="${res[1][i].nome}">${res[1][i].nome}</button><span></span></div>`;
            ordemInicial.push(i+1);
        }
        setOrdem(ordemInicial);
        for(let i=0;i<document.querySelectorAll('#Curso #todas-aulas button').length;i++){
            document.querySelectorAll('#Curso #todas-aulas button')[i].addEventListener('click',(event)=>{
                if(event.target.dataset.ordem == '0'){
                    document.querySelectorAll(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`)[document.querySelectorAll(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`).length-1].style = 'color:white;';
                    let maior = 0; 
                    for(let i=0;i<document.querySelectorAll('#Curso #todas-aulas button').length;i++){
                        if(parseInt(document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.ordem) > maior){
                            maior = parseInt(document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.ordem);
                        }
                    }
                    //event.target.dataset.ordem = ultimaOrdemDataset;
                    event.target.dataset.ordem = maior+1;
                    event.target.style = 'background-color:#1d0f2c;';
                    //ultimaOrdemDataset++;
                    document.querySelector(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`).innerHTML = event.target.dataset.ordem;
                }else{
                    document.querySelectorAll(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`)[document.querySelectorAll(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`).length-1].style = 'color:red;';
                    event.target.dataset.ordem = 0;
                    event.target.style = 'background-color:#351c50;';
                   // ultimaOrdemDataset--;
                    document.querySelector(`#Curso #todas-aulas button[data-id="${event.target.dataset.id}"] + span`).innerHTML = event.target.dataset.ordem;
                }
            });
        }

        let ultimaOrdem = 1;
        for(let i=0;i<ordemInicial.length;i++){
            for(let e=0;e<document.querySelectorAll('#Curso #todas-aulas button').length;e++){
                if(ordemInicial[i] == document.querySelectorAll('#Curso #todas-aulas button')[e].dataset.id){
                    document.querySelectorAll('#Curso #todas-aulas button')[e].style = 'background-color:#1d0f2c;';
                    document.querySelectorAll('#Curso #todas-aulas button')[e].dataset.ordem = ultimaOrdem;
                    document.querySelectorAll(`#Curso #todas-aulas button + span`)[e].innerHTML = ultimaOrdem;
                    document.querySelectorAll(`#Curso #todas-aulas button + span`)[e].style = 'color:white;';
                    ultimaOrdem++;
                }
            }
        }
        
    }
}catch(err){
    console.log(err);
}
}

async function verificarCriador(){
try{
    const controller = new AbortController();
    setTimeout(() => {controller.abort()},5000);

    let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/verificarCriador?idCurso=${params.id}`,{
        signal:controller.signal,
        method:'GET',
        mode:'cors',
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': localStorage.getItem('token')
        }
    });
    let res = await resposta.json();
    if(res.criador){
        document.querySelector('#Curso #btn-editar').style = 'display:inline-block';
    }

}catch(err){
    console.log(err)
}
}


async function ordenar(event){
try{
    event.preventDefault();
    
    let ordemFinal = [];
    for(let i=0;i<document.querySelectorAll(`#Curso #todas-aulas button`).length+15;i++){
        for(let e=0;e<document.querySelectorAll(`#Curso #todas-aulas button`).length;e++){
            if(document.querySelectorAll(`#Curso #todas-aulas button`)[e].dataset.ordem == (i+1)){
                ordemFinal.push(document.querySelectorAll(`#Curso #todas-aulas button`)[e].dataset.id);
            }
        }
    }
    
    if(ordemFinal.length==0){
        alert('Selecione pelo menos uma aula!')
        return;
    }

    let str = '';
    for(let i=0;i<ordemFinal.length;i++){
        str += ordemFinal[i] + ';';
    }

    const controller = new AbortController();
    setTimeout(() => {controller.abort()},5000);
    let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/ordenar`,{
        signal:controller.signal,
        method:'PATCH',
        mode:'cors',
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': localStorage.getItem('token')
        },
        body: JSON.stringify({
            idCurso: params.id,
            ordem: str
        })
    })
    let res = await resposta.text();
    if(res != 'ok'){
        throw new Error(res);
    }
    console.log('ok');
    window.location.reload();

}catch(err){
    console.log(err);
}
}
async function enviarForm2(event){
try{
    event.preventDefault();
    if(document.querySelector('#Curso #editar-curso-area #form2 #rd-buttons input[type="radio"]').checked){
        const controller = new AbortController();
        setTimeout(() => {controller.abort()},5000);
        let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/criarVideoAula`,{
            signal:controller.signal,
            method:'POST',
            mode:'cors',
            headers:{
                'Content-Type': 'application/json;charset=UTF-8',
                'x-access-token': localStorage.getItem('token')
            },
            body:JSON.stringify({
                nome:document.querySelectorAll('#Curso #form2 #criar-aula-area input')[0].value,
                link:document.querySelectorAll('#Curso #form2 #criar-aula-area input')[1].value,
                idCurso:params.id
            })
            
        })

        let res = await resposta.text();
        if(res == 'criado'){
            console.log(res);
            buscarTodasAulas();
        }else{
            throw new Error('ERRO_CRIACAO_AULA');
        }

    }else{
        const controller = new AbortController();
        setTimeout(() => {controller.abort()},5000);
        let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/updateVideoAula`,{
            signal:controller.signal,
            method:'PATCH',
            mode:'cors',
            headers:{
                'Content-Type': 'application/json;charset=UTF-8',
                'x-access-token': localStorage.getItem('token')
            },
            body:JSON.stringify({
                nome:document.querySelectorAll('#Curso #form2 #editar-aula-area input')[0].value,
                link:document.querySelectorAll('#Curso #form2 #editar-aula-area input')[1].value,
                idCurso:params.id,
                id_video_aula: document.querySelector('#Curso #form2 #editar-aula-area label input[name="id"]:checked').value
            })
            
        })

        let res = await resposta.text();
        console.log(res)
        if(res == 'modificado'){
            buscarTodasAulas();
            buscarVideos();

            setTimeout(()=>{
                renderCriarEditar();
            },200)
        }
    }
}catch(err){
    console.log(err);
}
}

async function enviarForm1(event){
try{
    event.preventDefault();
    if(!document.querySelector('#Curso #form1 div:last-child input[name="resposta"]:checked') || !document.querySelector('#Curso #form1 div:last-child input[type="text"]')){
        throw new Error('NENHUMA RESPOSTA CORRETA MARCADA');
    }

    for(let i=0;i<document.querySelectorAll('#Curso #form1 .respostas input[type="text"]').length;i++){
        if(document.querySelectorAll('#Curso #form1 .respostas input[type="text"]')[i].value == '' && document.querySelectorAll('#Curso #form1 .respostas')[i].style.display != 'none'){
            alert('Preencha todos os campos de respostas!');
            throw new Error('CAMPOS INCOMPLETOS');
        }
    }
    const controller = new AbortController();
    setTimeout(()=>{controller.abort()},5000);

    const resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/exercicio/criar`,{
        signal:controller.signal,
        method:'POST',
        mode:'cors',
        headers:{
            'Content-Type': 'application/json;charset=UTF-8',
            'x-access-token': localStorage.getItem('token')
        },
        body:JSON.stringify({
            idCurso: params.id,
            pergunta:document.querySelector('#Curso #form1 div:last-child input[type="text"]').value,
            resposta1:document.querySelectorAll('#Curso #form1 div:last-child .respostas input[type="text"]')[0].value,
            resposta2:document.querySelectorAll('#Curso #form1 div:last-child .respostas input[type="text"]')[1].value,
            resposta3:document.querySelectorAll('#Curso #form1 div:last-child .respostas input[type="text"]')[2].value,
            resposta4:document.querySelectorAll('#Curso #form1 div:last-child .respostas input[type="text"]')[3].value,
            resposta_correta:document.querySelector('#Curso #form1 div:last-child input[name="resposta"]:checked').value
        })
    });

    const res = await resposta.json();

    const formData = new FormData();
    formData.append('foto', document.querySelector('#Curso #form1 input[type="file"]').files[0]);
    
    const controller2 = new AbortController();
    setTimeout(()=>{controller2.abort()},5000);
    const resposta2 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/exercicio/criarImg?jwt=${localStorage.getItem('token')}&id=${res.id}`,{
        signal:controller2.signal,
        method:'POST',
        mode:'cors',
        body:formData
    })

    const res2 = await resposta2.json();
    
    resetForm1();
}catch(err){
    //alert('Ocorreu um erro ao enviar o exercicio');
    console.log(err);
}
}



function renderCriarEditar(){
    if(document.querySelector('#Curso #editar-curso-area #form2 #rd-buttons input[type="radio"]').checked){
        document.querySelector('#Curso #form2 #criar-aula-area').style = 'display:block;';
        document.querySelector('#Curso #form2 #editar-aula-area').style = 'display:none;';
        document.querySelector('#Curso #form2 #editar-aula-area').innerHTML='';
        document.querySelector('#Curso #form2 #criar-aula-area').innerHTML = `
        <input type="text" placeholder='Nome da aula' required/>
        <input type="url" placeholder='Link (youtube)' required/>
        `;
    }else{
        document.querySelector('#Curso #form2 #criar-aula-area').style = 'display:none;';
        document.querySelector('#Curso #form2 #criar-aula-area').innerHTML = '';
 
        document.querySelector('#Curso #form2 #editar-aula-area').innerHTML=`
        <input type="text" placeholder='Nome da aula'/>
        <input type="url" placeholder='Link (youtube)'/>
        `;
        for(let i=0;i<document.querySelectorAll('#Curso #todas-aulas button').length;i++){
            document.querySelector('#Curso #form2 #editar-aula-area').innerHTML += `
            <label>
                <input type='radio' required name='id' value='${document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.id}' data-link="https://www.youtube.com/watch?v=${document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.cod}"/>
                <h4 data-nome="${document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.nome}">${document.querySelectorAll('#Curso #todas-aulas button')[i].dataset.nome}</h4>
            </label>
            `;
        }
        document.querySelector('#Curso #form2 #editar-aula-area').style = 'display:block;';

        for(let i=0;i<document.querySelectorAll('#Curso #form2 #editar-aula-area label').length;i++){
            document.querySelectorAll('#Curso #form2 #editar-aula-area label input')[i].addEventListener('click',()=>{
                document.querySelectorAll('#Curso #form2 #editar-aula-area > input')[0].value = document.querySelectorAll('#Curso #form2 #editar-aula-area label h4')[i].dataset.nome;
                document.querySelectorAll('#Curso #form2 #editar-aula-area > input')[1].value = document.querySelectorAll('#Curso #form2 #editar-aula-area label input')[i].dataset.link;
            })
        }
    }
}

function addRes(){
    if(document.querySelectorAll('#Curso #form1 .respostas')[2].style.display == 'none' && document.querySelectorAll('#Curso #form1 .respostas')[3].style.display == 'none'){
        document.querySelectorAll('#Curso #form1 .respostas')[2].style.display = 'flex';
    }else if(document.querySelectorAll('#Curso #form1 .respostas')[3].style.display == 'none'){
        document.querySelectorAll('#Curso #form1 .respostas')[3].style.display = 'flex';
        document.querySelector('#Curso #form1 #add-res').style.display = 'none';
    }
}

function resetForm1(){
    document.querySelector('#Curso #form1 > div:last-child > input[type="text"]').value = '';
    document.querySelector('#Curso #form1 > div:last-child > input[type="file"]').value = '';
    document.querySelectorAll('#Curso #form1 > div:last-child .respostas input[type="text"]')[0].value = '';
    document.querySelectorAll('#Curso #form1 > div:last-child .respostas input[type="text"]')[1].value = '';
    document.querySelectorAll('#Curso #form1 > div:last-child .respostas input[type="text"]')[2].value = '';
    document.querySelectorAll('#Curso #form1 > div:last-child .respostas input[type="text"]')[3].value = '';
    
    document.querySelectorAll('#Curso #form1 .respostas')[2].style.display = 'none';
    document.querySelectorAll('#Curso #form1 .respostas')[3].style.display = 'none';
    document.querySelector('#Curso #form1 #add-res').style.display = 'block';
    
    document.querySelector('#Curso #form1 > div:last-child .respostas input[type="radio"]:checked').checked = false;
}

   useEffect(()=>{
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;

    document.querySelector('#Curso #btn-editar').addEventListener('click',()=>{
        document.querySelector('#Curso #editar-curso-area').style = 'display:flex;';
    });

    document.querySelector('#Curso #editar-curso-area #btn-fechar').addEventListener('click',()=>{
        document.querySelector('#Curso #editar-curso-area').style = 'display:none;';
    });

    document.querySelectorAll('#Curso #editar-curso-area #form2 #rd-buttons input[type="radio"]')[0].addEventListener('click', renderCriarEditar);
    document.querySelectorAll('#Curso #editar-curso-area #form2 #rd-buttons input[type="radio"]')[1].addEventListener('click', renderCriarEditar);

    //se for o criador do curso vai parecer um botão pra editar e adicionar aulas
    buscarVideos();
    verificarCriador();
    buscarTodasAulas();
    renderCriarEditar();
   },[])

    return(
        <>
        <Header/>
        <div id="Curso">
            <div id='sidebar'>

            </div>
            <div>
                <div id='iframe-container'>
                    
                </div>
                <div id='comentarios-container'>
                    <div id='btn-exercicioEeditar'>
                        <button type='button' id='btn-editar'/>
                        <button type='button' id='btn-exercicio' onClick={()=>{navigate(`/curso/${params.id}/exercicios`)}}/>
                    </div>
                        

                    <h2>Comentários (0)</h2>
                    <form onSubmit={comentar}>
                        <input type="text" name='comentario' placeholder='Adicionar comentário'/>
                        <button type="submit">Comentar</button>
                    </form>
                    <div id='comentarios'>

                    </div>
                </div>
            </div>

            <div id="editar-curso-area">
                <button id="btn-fechar" type='button'>
                    <img src={fechar}></img>
                </button>
                <form id='form1' onSubmit={enviarForm1}>
                    <div>
                        <button type='submit'>Enviar</button>
                        <button type='button' onClick={resetForm1}></button>
                    </div>
                    <div>
                        <input type='text' placeholder='Digite a pergunta' required/>
                        <input type='file'></input>

                        <div className='respostas'>
                            <input type='radio' name='resposta' value='r1' required></input>
                            <input type='text' placeholder="Digite uma alternativa" minLength='1'></input>
                        </div>
                        <div className='respostas'>
                            <input type='radio' name='resposta' value='r2' required></input>
                            <input type='text' placeholder="Digite uma alternativa" minLength='1'></input>
                        </div>
                        <div className='respostas' style={{display:'none'}}>
                            <input type='radio' name='resposta' value='r3' required></input>
                            <input type='text' placeholder="Digite uma alternativa" minLength='1'></input>
                        </div>
                        <div className='respostas' style={{display:'none'}}>
                            <input type='radio' name='resposta' value='r4' required></input>
                            <input type='text' placeholder="Digite uma alternativa" minLength='1'></input>
                        </div>
                        <button type='button' id='add-res' onClick={addRes}>+</button>
                    </div>
                </form>
                <form id='form2' onSubmit={enviarForm2}>
                    <div>
                        <div id='rd-buttons'>
                            <div>
                                <input type='radio' name='modo' value='criar' defaultChecked id='rd-criar-aula'/>
                                <label htmlFor="rd-criar-aula">Criar aula</label>
                            </div>
                            <div>
                                <input type='radio' name='modo' value='editar' id='rd-editar-aula'/>
                                <label htmlFor="rd-editar-aula">Editar aula</label> 
                            </div>
                        </div>
                        <button type='submit'>Enviar</button>
                    </div>
                    <div id='criar-aula-area' className='criar-editar-aula'>

                    </div>
                    <div id='editar-aula-area' className='criar-editar-aula'>

                    </div>
                </form>


                <form id='form3' onSubmit={ordenar}>
                    <div>
                        <button type='submit'>Enviar</button>
                        <button type='button' onClick={resetarOrdem}></button>
                    </div>
                    <div id='todas-aulas'>

                    </div>
                </form>

            </div>
        </div>
        <Footer/>
        </>
    )
}