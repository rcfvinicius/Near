/* Descontinuado
function headerScroll() {
      if(document.getElementsByTagName('body')[0].offsetHeight - 15 < (window.innerHeight)){
        document.getElementsByTagName('body')[0].style = 'width:100vw'
    }
} */


let contador = 1;
document.getElementById("radio1").checked = true;

function slider() {
  contador++;
  if (contador > 4) {
    contador = 1;
  }
  document.getElementById(`radio${contador}`).checked = true;
}

setInterval(() => {
  slider();
}, 10000);


function addEstrela(count=0){
  const est = document.getElementsByClassName("avaliacao-after");

  for(let i=0; i<est.length;i++){
    for(let e=0;e<count;e++){
      est[i].innerHTML += '<img src="./assets/estrela.png">';
    }
  }

  const arr = document.querySelectorAll(".avaliacao-after img");

  /* estilo das estrelas */
  for(let i=0;i<arr.length;i++){
    arr[i].style = "height:16px; position:relative; top:1px;";
  }
}


addEstrela(4);

//document.getElementsByClassName("avaliacao-after")[0].innerHTML += '<img src="./assets/meia-estrela.png">';
//document.getElementsByClassName("avaliacao-after")[1].innerHTML += '<img src="./assets/meia-estrela.png">';