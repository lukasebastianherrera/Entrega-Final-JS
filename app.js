// Carrusel // 

const btnIzquierda = document.querySelector(".btn-izquierda"),
    btnDerecha = document.querySelector(".btn-derecha"),
    slider = document.querySelector("#slider"),
    sliderSection = document.querySelectorAll(".slider-section");
btnIzquierda.addEventListener("click", e => moverAIzquierda())
btnDerecha.addEventListener("click", e => moverADerecha())

setInterval(() => {
    moverADerecha()
}, 3000);

let operacion = 0,
    counter = 0,
    widthImg = 100 / sliderSection.length;

function moverADerecha() {
    if(counter >= sliderSection.length-1){
        counter = 0;
        operacion = 0; 
        slider.style.transform = `translate(-${operacion}%)`;
        slider.style.transition = "none"
        return;  
    }
    counter++; 
        operacion = operacion + widthImg;
        slider.style.transform = `translate(-${operacion}%)`;
        slider.style.transition = "all ease .6s"
}
function moverAIzquierda(){
    counter--;
    if(counter < 0 ){
        counter = sliderSection.length-1;
        operacion = widthImg * (sliderSection.length-1)
        slider.style.transform = `translate(-${operacion}%)`;
        slider.style.transition = "none";
        return;
    }
    operacion = operacion - widthImg;
    slider.style.transform = `translate(-${operacion}%)`;
    slider.style.transition = "all ease .6s";
}
// Fin Carrusel//