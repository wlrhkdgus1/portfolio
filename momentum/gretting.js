const form = document.querySelector(".js-form"),
 input = form.querySelector("input"),
 greeting = document.querySelector(".js-greetings");

const USER_LS = "currentUser",
    SHOWING_CN = "showing"

function saveName(text){
    localStorage.setItem(USER_LS, text); // user이름을 내가입력.
}

function handleSubmit(event) {
    event.preventDefault();
    const currentValue = input.value;  //paintGreeting 는 text가 필요함 그 text를
    paintGreeting(currentValue)         // currentValue = 내가input에 적는 text를 가져옴
    saveName(currentValue);                   
}                                               

function askForName(){
    form.classList.add(SHOWING_CN);
    form.addEventListener("submit", handleSubmit);
}

function paintGreeting(text){
    form.classList.remove(SHOWING_CN); // form을 지우고
    greeting.classList.add(SHOWING_CN); // greeting을 보여줄거고
    greeting.innerText = `Hello ${text}`; // 내가보낸 text를 넣을거야
}

function loadName() {
    const currentUser = localStorage.getItem(USER_LS);
    if(currentUser === null) { // 유저가 없는경우
        askForName(); // What is your name이 나오겠지?
    } else { // 유저가 있는경우 
        paintGreeting(currentUser);
    }
}

function init(){
    loadName();
}
init();