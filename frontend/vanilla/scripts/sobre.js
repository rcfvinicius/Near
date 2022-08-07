const curso = window.location.href.split('?')[1] ?? 'err';

const div = document.querySelectorAll('main > section:first-child > div')[0];
/* 
div.innerHTML = `
<h1>${curso}</h1>
`; */


/* 
window.addEventListener('scroll', () => {
    console.log(window.scrollY)
    if(window.scrollY >100){
        document.querySelector('main > section aside').style = 'position:fixed; top:0px;';
        if(window.scrollY > 380){
            document.querySelector('main > section aside').style = 'position:absolute; margin-top:calc(50% - 365px)';
        }
    }
    else{
        document.querySelector('main > section aside').style = ''
    }

})
 */


    /* posicionamento do aside e #section2 */
const posAsideSection = function(){
    
    if(window.innerWidth < 1261){
        const altura = document.querySelector('main > section aside img').offsetHeight + 328;
        document.querySelector('main > section aside').style = `height:${altura}px`;
        document.querySelector('#section2').style = `margin-top:${altura+30}px;`;
        }
        else{
            document.querySelector('main > section aside').style = '';
            document.querySelector('#section2').style = '';
        }

        /* tamanho do aside */
        const alturaImg = document.querySelector('main > section aside img').offsetHeight;
        const alturaDiv = document.querySelector('main section aside #container-aside').offsetHeight
        const aside = document.querySelector('main section aside');

        aside.style = `height: ${alturaDiv+alturaImg+110}px`


        /* adquirido */
        if(false){
            document.querySelector('#fundo-adquirido').style = `
            display:flex;
            width:calc(100% - 6px);
            height:${document.querySelector('main > section aside img').offsetHeight}px;
            `;

            document.querySelector('main > section aside div button').style = `cursor:not-allowed;`;
            document.querySelector('main > section aside div #botao2').style = `cursor:not-allowed;`;

            document.querySelector('aside div h3').innerHTML= 'Adquirido!';
        }
}

window.addEventListener('resize', posAsideSection);





