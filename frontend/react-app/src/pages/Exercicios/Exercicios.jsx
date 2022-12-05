import './Exercicios.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function Exercicios(){
    const params = useParams();
    let arr;
    let nextIndex=0;
    let respostas;


    async function buscarExercicios(){
        try{
            const controller = new AbortController();
            setTimeout(()=>{controller.abort()},5000);

            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/exercicio/buscarExercicios?id_curso=${params.id}`,{
                signal:controller.signal,
                method:'GET',
                mode:'no-cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token': localStorage.getItem('token')
                }
            });

            arr = await resposta.json();
            if(arr.length == 0){
                document.querySelector('#Exercicios #btn-fim-pagina-container button[type="button"]').style = 'display:none';
                document.querySelector('#Exercicios #btn-fim-pagina-container button[type="submit"]').style = 'display:none';
                return;
            }
            carregarExercicios();
            buscarRespostas();
            //console.log(res);
        }catch(err){
            document.querySelector('#Exercicios #btn-fim-pagina-container button[type="button"]').style = 'display:none';
            document.querySelector('#Exercicios #btn-fim-pagina-container button[type="submit"]').style = 'display:none';
            console.log(err);
        }
    }


    async function carregarExercicios(){
        const respostasMarcadas = new Array();
        for(let i=0;i<document.querySelectorAll('#Exercicios > div:first-child section').length;i++){
            if(document.querySelectorAll(`#Exercicios > div:first-child section:nth-child(${i+1}) input:checked`).length > 0){
                respostasMarcadas.push({
                    id:document.querySelectorAll('#Exercicios > div:first-child section')[i].dataset.id,
                    resposta:document.querySelector(`#Exercicios > div:first-child section:nth-child(${i+1}) input:checked`).value
                })
            }
        }

        const container = document.querySelector('#Exercicios > div:first-child');
        try{
            let limit=0;
            for(let i=nextIndex;i<arr.length && limit < 4;i++){
                const controller = new AbortController();
                setTimeout(() => {controller.abort()},5000);
                let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/exercicio/img?id=${arr[i].id}`,{
                    signal:controller.signal,
                    method:'GET',
                    mode:'no-cors'
                })
                let res = await resposta.blob();

                let imgSrc;
                if(res.type == 'text/html'){
                    imgSrc = false;
                }else{
                    imgSrc = URL.createObjectURL(res);
                }

                container.innerHTML += `
                <section data-id="${arr[i].id}">
                    <p>${arr[i].pergunta}</p>

                    ${imgSrc ? `<img src="${imgSrc}"/>` : ''}

                    <label class="container-checkbox" data-value="r1"><h5>a) ${arr[i].resposta1}</h5>
                        <input type="radio" name="exercicio${arr[i].id}" value="r1"/><br/>
                        <span class="check"></span>
                    </label>
        
                    <label class="container-checkbox" data-value="r2"><h5>b) ${arr[i].resposta2}</h5>
                        <input type="radio" name="exercicio${arr[i].id}" value="r2"/><br/>
                        <span class="check"></span>
                    </label>
                    
                    ${arr[i].resposta3 ? `
                    <label class="container-checkbox" data-value="r3"><h5>c) ${arr[i].resposta3}</h5>
                        <input type="radio" name="exercicio${arr[i].id}" value="r3"/><br/>
                        <span class="check"></span>
                    </label>
                    ` : ''}

                    ${arr[i].resposta4 ? `
                    <label class="container-checkbox" data-value="r4"><h5>c) ${arr[i].resposta4}</h5>
                        <input type="radio" name="exercicio${arr[i].id}" value="r4"/><br/>
                        <span class="check"></span>
                    </label>
                    ` : ''}

                </section>
                `;
                nextIndex = i + 1;
                limit++;
                
            }
            if(nextIndex >= arr.length){
                document.querySelector('#Exercicios #btn-fim-pagina-container button[type="button"]').style = 'display:none';
            }

            for(let i=0;i<respostasMarcadas.length;i++){
                for(let e=0;e<document.querySelectorAll('#Exercicios > div:first-child section').length;e++){
                    if(respostasMarcadas[i].id == document.querySelectorAll('#Exercicios > div:first-child section')[e].dataset.id){
                        document.querySelector(`#Exercicios > div:first-child section:nth-child(${e+1}) input[value="${respostasMarcadas[i].resposta}"]`).checked = true;
                    }
                }
            }

            renderRespostas();
        }catch(err){
            console.log(err);
        }
    }

    async function buscarRespostas(){
        try{
            const controller = new AbortController();
                setTimeout(() => {controller.abort()},5000);
                let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/exercicio/buscarRespostas?id_curso=${params.id}`,{
                    signal:controller.signal,
                    method:'GET',
                    mode:'no-cors',
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8',
                        'x-access-token': localStorage.getItem('token')
                    }
                });

                respostas = await resposta.json();
               renderRespostas();
        }catch(err){
            console.log(err);
        }
    }

    function renderRespostas(){
        for(let i=0;i<respostas.length;i++){
            for(let e=0;e<document.querySelectorAll('#Exercicios > div:first-child section').length;e++){
                if(respostas[i].id == document.querySelectorAll('#Exercicios > div:first-child section')[e].dataset.id){
                    if(respostas[i].resposta == respostas[i].resposta_correta){
                        document.querySelectorAll('#Exercicios > div:first-child section')[e].style = 'border: 3px solid green';
                        document.querySelector(`#Exercicios > div:first-child section[data-id="${document.querySelectorAll('#Exercicios > div:first-child section')[e].dataset.id}"] label[data-value="${respostas[i].resposta_correta}"] h5`)
                        .style = 'color:green';
                    }else{
                        document.querySelectorAll('#Exercicios > div:first-child section')[e].style = 'border: 3px solid red';

                        document.querySelector(`#Exercicios > div:first-child section[data-id="${document.querySelectorAll('#Exercicios > div:first-child section')[e].dataset.id}"] label[data-value="${respostas[i].resposta_correta}"] h5`)
                        .style = 'color:green';

                        document.querySelector(`#Exercicios > div:first-child section[data-id="${document.querySelectorAll('#Exercicios > div:first-child section')[e].dataset.id}"] label[data-value="${respostas[i].resposta}"] h5`)
                        .style = 'color:red';
                    }
                    //marcando a resposta do usuario
                    document.querySelector(`#Exercicios > div:first-child section[data-id="${document.querySelectorAll('#Exercicios > div:first-child section')[e].dataset.id}"] label[data-value="${respostas[i].resposta}"] input`).checked = true;
                    //desabilitando os inputs
                    for(let i=0;i<document.querySelectorAll(`#Exercicios > div:first-child section[data-id="${document.querySelectorAll('#Exercicios > div:first-child section')[e].dataset.id}"] label input`).length;i++){
                        document.querySelectorAll(`#Exercicios > div:first-child section[data-id="${document.querySelectorAll('#Exercicios > div:first-child section')[e].dataset.id}"] label input`)[i].disabled = true;
                    }
                }
            }
        }
    }

    async function enviarRespostas(event){
        try{
            let arrRespostas = [];
            for(let i=0;i<document.querySelectorAll('#Exercicios > div:first-child section').length;i++){
                let tem=false;
                for(let e=0;e<respostas.length;e++){
                    if(document.querySelectorAll('#Exercicios > div:first-child section')[i].dataset.id == respostas[e].id){
                        tem=true
                    }
                }
                if(!tem){
                    const id = document.querySelectorAll('#Exercicios > div:first-child section')[i].dataset.id;
                    if(document.querySelectorAll(`#Exercicios > div:first-child section[data-id="${id}"] input:checked`).length > 0){
                        arrRespostas.push({id:id, resposta:document.querySelector(`#Exercicios > div:first-child section[data-id="${id}"] input:checked`).value});
                    }
                }
            }
            const controller = new AbortController();
            setTimeout(() => {controller.abort()},5000);
            let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/exercicio/responder`,{
                signal:controller.signal,
                method:'POST',
                mode:'no-cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token': localStorage.getItem('token')
                },
                body:JSON.stringify({
                    idCurso:params.id,
                    respostas:arrRespostas
                })
            });
            
            console.log(await resposta.json());
            
            alert('Respostas enviadas com sucesso!');
            window.location.reload();
        }catch(err){
            alert('Ocorreu um erro ao tentar enviar as respostas.');
            console.log(err);
        }
    }


    useEffect(()=>{
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
        
        buscarExercicios();
    },[])
    return(
        <>
        <Header/>
        <main id='Exercicios'>
            <div>

            </div>
            <div id="btn-fim-pagina-container">
                <button type="button" className="btn-fim-pagina" onClick={carregarExercicios}>Carregar mais</button>
                <button type="submit" className="btn-fim-pagina" onClick={enviarRespostas}>Enviar respostas</button>
            </div>
        </main>
        <Footer/>
        </>
    )
}