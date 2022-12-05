import './Carrinho.css';
import Header from '../../components/Header/Header.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import curso from '../../assets/imagens/cursos/default-course.png';
import carrinhoVazio from '../../assets/carrinho-vazio.png';


export default function Carrinho(){
    let total = 0;
    const navigate = useNavigate();

    function onScroll(){
        if(window.pageYOffset > 110){
            document.querySelector('#Carrinho > section:last-child').style = 'position:fixed; top:10px; right:80px';
        }else{
            document.querySelector('#Carrinho > section:last-child').style = 'position:static';
        }
    }

    function reset(){
        document.querySelector('#Carrinho > section:first-child').innerHTML = `
        <div id="carrinho-vazio-container">
            <h1>Seu carrinho está vazio.</h1>
            <img src="${carrinhoVazio}" id="carrinho-vazio-img"/>
        </div>
        `;
        document.querySelector('#Carrinho > section:last-child h1').innerHTML = `
        TOTAL: R$ --.--
        `;
        document.querySelector('#header-nav #bolinha').style = 'display:none';
    }
    
    async function fetchData(){
        try{
            total = 0;
            const controller1 = new AbortController();
            setTimeout(()=>{controller1.abort()},5000);

            const resposta1 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/carrinho/ler`,{
                signal:controller1.signal,
                method:'GET',
                mode:'no-cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token': localStorage.getItem('token')
                }
            });

            const container = document.querySelector('#Carrinho > section:first-child');
            container.innerHTML = '';
            const itens = await resposta1.json();
            if(itens.length == 0){
                reset();
                throw new Error('Nenhum item no carrinho');
            }
            if(itens.status == 'err'){
                throw new Error('CARRINHO_NAO_EXISTE');
            }
            document.querySelector('#header-nav #bolinha').style = 'display:block';
            for(let i=0;i<itens.length;i++){
                total += itens[i].preco;
                const controller2 = new AbortController();
                setTimeout(()=>{controller2.abort()},5000);
                const resposta2 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosAdquiridosImg?id=${itens[i].id}`,{
                    signal:controller2.signal,
                    method:'GET',
                    mode:'no-cors',
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8',
                        'x-access-token': localStorage.getItem('token')
                    }
                });

                const res2 = await resposta2.blob();

                let imgSrc;
                if(res2.type == 'text/html'){
                    imgSrc = curso;
                }else{
                    imgSrc = URL.createObjectURL(res2);
                }

                container.innerHTML += `
                <div class="card" data-id="${itens[i].id}">
                    <div class='pelicula'>
                        <button type="button" data-id="${itens[i].id}" data-desc="link"/>
                        <button type="button" data-id="${itens[i].id}" data-desc="delete"/>
                    </div>
                    <img src="${imgSrc}"/>
                    <div>
                        <h3>${itens[i].titulo_longo}</h3>
                        <h4>R$ ${(itens[i].preco/100).toFixed(2)}</h4>
                    </div>
                </div>
                `;
            }
            
            document.querySelector('#Carrinho > section:last-child h1').innerHTML = `TOTAL: R$ ${(total/100).toFixed(2)}`;
            for(let i=0;i<document.querySelectorAll('#Carrinho .card .pelicula > button').length;i++){
                document.querySelectorAll('#Carrinho .card .pelicula > button')[i].addEventListener('click', (event)=>{
                    if(event.target.dataset.desc == 'delete'){
                        document.querySelector(`#Carrinho .card[data-id="${event.target.dataset.id}"]`).remove();
                        if(!document.querySelector('#Carrinho > section:first-child:has(.card)')){
                            reset();
                        }
                        fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/carrinho/deleteItem`,{
                            method:'DELETE',
                            mode:'no-cors',
                            headers:{
                                'Content-Type': 'application/json;charset=UTF-8',
                                'x-access-token': localStorage.getItem('token')
                            },
                            body:JSON.stringify({
                                item:event.target.dataset.id
                            })
                        })
                        .catch((err)=>{
                            console.log(err);
                            alert('Ocorreu um erro ao tentar deletar um item');
                        })
                    }else{
                        navigate(`/sobre/${event.target.dataset.id}`);
                    }
                })
            }
        }catch(err){
            console.log(err);
            reset();
        }
    }


    async function removerTodosItens(){
        try{
            if(!window.confirm('Tem certeza de que deseja excluir todos os itens?')){
                throw new Error('Cancelado pelo usuário');
            }
            reset();
            await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/carrinho/delete`,{
                method:'DELETE',
                mode:'no-cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token': localStorage.getItem('token')
                }
            });

            fetchData();
        }catch(err){
            console.log(err);
        }
    }

    async function finalizarCompra(){
        try{
            const resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/carrinho/finalizarCompra`,{
                method:'POST',
                mode:'no-cors',
                headers:{
                    'Content-Type': 'application/json;charset=UTF-8',
                    'x-access-token': localStorage.getItem('token')
                }
            });

            await resposta.json();
            reset();
        }catch(err){
            console.log(err);
            window.alert('Ocorreu um erro ao finalizar a compra!');
        }
    }


    useEffect(()=>{
        document.addEventListener('scroll',onScroll);
        fetchData();

        return ()=>{
            document.removeEventListener('scroll', onScroll);
        }
        
    },[])
    return(
        <>
        <Header/>
        <main id='Carrinho'>
            <section>

            </section>
            <section>
                <h1>TOTAL: R$ --.--</h1>
                <button type='button' onClick={removerTodosItens}>Remover todos os itens</button>
                <button type='button' onClick={finalizarCompra}>finalizar compra</button>
            </section>
        </main>
        <Footer/>
        </>
    )
}