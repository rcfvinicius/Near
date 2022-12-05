export default async function(){
    try{
        const controller = new AbortController();
        setTimeout(() => {controller.abort()},5000);
        const pesquisa = encodeURIComponent(window.location.href.split('?')[1].split('q=')[1]);

        let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/pesquisar?q=${pesquisa}`,{
            signal: controller.signal,
            method: 'GET',
            headers:{
                'Content-Type': 'application/json;charset=UTF-8'
            }
        })
        
        let res = await resposta.text();
        
        if(res == 'Internal Server Error'){
            throw new Error('DECODE_EXCEPTION');
        }
        res = JSON.parse(res);
        //console.log(res)

        if(res.cursos.length == 0){
            document.querySelector('#Pesquisa #cursos-container .cards').innerHTML = '';
            document.querySelector('#Pesquisa #cursos-container > h2').innerHTML = `Cursos (0)`;
        }else{
            //setNenhumCurso('');
            document.querySelector('#Pesquisa #cursos-container .cards').innerHTML = '';
            document.querySelector('#Pesquisa #cursos-container > h2').innerHTML = `Cursos (${res.cursos.length})`;
            for(let i=0;i<res.cursos.length;i++){
                const controller2 = new AbortController();
                setTimeout(() => {controller2.abort()},5000);
                let resposta2 = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/curso/cursosAdquiridosImg?id=${res.cursos[i].id}`,{
                    signal:controller2.signal,
                    method:'GET',
                    mode:'no-cors'
                })
                let res2 = await resposta2.blob();
    
                let imgSrc;
                if(res2.type == 'text/html'){
                    //imgSrc = //imagem padrao
                }else{
                    imgSrc = URL.createObjectURL(res2);
                }
                
                document.querySelector('#Pesquisa #cursos-container .cards').innerHTML += `
                <button type="button" class="card" data-id="${res.cursos[i].id}">
                    <div class='imgCurso-container'>
                        <img src="${imgSrc}" loading="lazy"></img>
                    </div>
                    <h3>${res.cursos[i].titulo}</h3>
                </button>
                `;

            }
            //adicionando os links nos cards
            for(let i=0;i<document.querySelectorAll('#Pesquisa #cursos-container .cards button').length;i++)
                document.querySelectorAll('#Pesquisa #cursos-container .cards button')[i].addEventListener('click', (event)=>{
                window.location.href = `/sobre/${event.currentTarget.dataset.id}`;
            })
        }

        if(res.aulas.length == 0){
            document.querySelector('#Pesquisa #cards-aulas').innerHTML = '';
            document.querySelector('#Pesquisa #aulas-container > h2').innerHTML = `Aulas (0)`;
        }else{
            document.querySelector('#Pesquisa #aulas-container > h2').innerHTML = `Aulas (${res.aulas.length})`;
            document.querySelector('#Pesquisa #cards-aulas').innerHTML = '';
            for(let i=0;i<res.aulas.length;i++){
                document.querySelector('#Pesquisa #cards-aulas').innerHTML += `
                    <a href="/sobre/${res.aulas[i].id_curso}" class="card-menor">
                        <h6>${res.aulas[i].titulo}</h6>
                        <h3>${res.aulas[i].nome}</h3>
                    </a>
                `;
            }
        }

        if(res.usuarios.length == 0){
            document.querySelector('#Pesquisa #cards-usuarios').innerHTML = '';
            document.querySelector('#Pesquisa #usuarios-container > h2').innerHTML = `Usuários (0)`;
        }else{
            document.querySelector('#Pesquisa #usuarios-container #cards-usuarios').innerHTML = '';
            document.querySelector('#Pesquisa #usuarios-container > h2').innerHTML = `Usuários (${res.usuarios.length})`;

            for(let i=0;i<res.usuarios.length;i++){
                const controller2 = new AbortController();
                setTimeout(() => {controller2.abort()},5000);

                let resposta = await fetch(`${process.env.REACT_APP_API_HOSTNAME}/user/img?id=${res.usuarios[i].id}`,{
                    signal: controller2.signal,
                    method: 'GET',
                    headers:{
                        'Content-Type': 'application/json;charset=UTF-8'
                    }
                })

                let res2 = await resposta.blob();

                let imgSrc = '';
                if(res2.type == 'text/html'){
                    //imgSrc = //imagem padrao
                }else{
                    imgSrc = URL.createObjectURL(res2);
                }


                document.querySelector('#Pesquisa #cards-usuarios').innerHTML += `
                    <div class="card-menor">
                        <div class='imgUser-container'>
                            <img src=${imgSrc}></img>
                        </div>
                        <h3>${res.usuarios[i].nome}</h3>
                    </div>
                `;
            }
        }


    }catch(err){
        console.log(err);
    }
}