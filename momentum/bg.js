const body = document.querySelector("body");

const IMG_NUMBER = 8;

function paintImage(imgNumber){
    const image = new Image();
    image.src = `images/${imgNumber + 1}.jpg`
    image.classList.add("bgImage");
    body.prepend(image);
}

function genRandom(){
    const number = Math.floor(Math.random() * IMG_NUMBER); // floor = 3.1 3.2 3.3 다 3으로 ceil = 3.1~3.9 다 4로
    return number;
}

function init(){
    const randomNumber = genRandom();
    paintImage(randomNumber);
}

init();