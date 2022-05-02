//empty는 반복문 불가
//1~45번 번호 채우기
//mapping
var 후보군 =Array(45).fill().map(function(요소,인덱스){
    return 인덱스 +1;
});
console.log(후보군);

//6개 뽑기
//splice를 통해 후보군에서 하나씩 랜덤으로 뽑고 이동 값에 넣어준다음 셔플에 푸시한다.
var 셔플 = [];
while(후보군.length>0){
   var 이동값= 후보군.splice(Math.floor(Math.random() * 후보군.length),1)[0];
   셔플.push(이동값);
}
console.log(셔플);
var 보너스 = 셔플[셔플.length-1];
var 당첨숫자들 = 셔플.slice(0,6).sort(function(p,c){return p-c;});

// for(var i=0; i<당첨숫자들.length; i+=1){
//     (function(j){
//         setTimeout(function callback(){
//             var 공 = document.createElement('div');
//             공.textContent = 당첨숫자들[i];
//             결과창.appendChild(공);
//         },1000);
//     })(i);
// }
var 결과창 = document.querySelector('#결과창');

function 공색칠하기(숫자,결과창){
    var 공 = document.createElement('div');
    공.textContent = 숫자;
    공.style.display = 'inline-block';
    공.style.border = '2px solid black';
    공.style.borderRadius = '50%';
    공.style.width = '150px';
    공.style.height ='150px';
    공.style.lineHeight = '150px';
    공.style.textAlign = 'center';
    공.style.marginRight = '10px';
    공.style.fontSize = '45px';
    공.style.marginLeft= '100px';
    공.style.padding = 25;
    공.className = '공아이디'+숫자;
    var 배경색;
    //text-align: left;
    //border: 4px solid #ff0000;
   // border-radius: 50%;
    //background-color: #ffffff;
    //background-repeat: no-repeat;
    //width: 70px;
   // height: 70px;
    //display: inline-block;
   // padding: 25px margin-right: 10px;
   // margin-left: 10px;
    if(숫자<=10){
        배경색 = 'red';
    }else if(숫자 <=20){
        배경색 = 'orange';
    }else if(숫자 <=30){
        배경색 = 'yellow';
    }else if(숫자 <=40){
        배경색 = 'blue';
    }else{
        배경색 = 'green';
    }
    공.style.background = 배경색; 
    결과창.appendChild(공);
}
//클로저 문제로 클로저 배우고 난잡한 코드를 수정하겠음.
setTimeout(function callback(){
    공색칠하기(당첨숫자들[0],결과창);
},1000);
setTimeout(function callback(){
    공색칠하기(당첨숫자들[1],결과창);},2000);
setTimeout(function callback(){
    공색칠하기(당첨숫자들[2],결과창);},3000);
setTimeout(function callback(){
    공색칠하기(당첨숫자들[3],결과창);},4000);
setTimeout(function callback(){
    공색칠하기(당첨숫자들[4],결과창);},5000);
setTimeout(function callback(){
    공색칠하기(당첨숫자들[5],결과창);},6000);
setTimeout(function callback(){
    var 칸 = document.querySelector('.보너스');
    공색칠하기(보너스,칸);
},7000);