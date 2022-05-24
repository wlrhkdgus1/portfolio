/*
1. username 유효성검사(elInputUsername) 함수 조건 업데이트 -> (영어/숫자만 가능) (완료)
  - 정규표현식 패턴 이해해보기 (완료)
  - 함수 조건 설정 -> 영문/숫자 조합 (8~20자) (완료)
  - 함수가 잘 돌아가는지 테스트 (완료)

2. 패스워드 처음 생성시(elInputPassword) 유효성검사 함수 조건 업데이트 -> (화면에 보이는 조건 3가지) -> (옵션) 조건에 맞으면 x가 v로 바뀌기 (완료)
  
  <3가지 조건> 
  - 영문/숫자/특수문자 포함 조합 (8~20자)
  - 3개 이상 연속되거나 동일한 문자/숫자 제외 (333, aaa)
  - 아이디 제외 (sujeong !== sujeong)

  2.1 이벤트핸들러 작성 (완료)
  2.2 조건식(+정규표현식) 함수 작성 (완료)
  2.3 함수 테스트 (완료)

3. 회원가입 버튼이 비활성화 됬다가, 모든 필수기입조건들 충족 시 활성화 되면서 버튼 submit 자동하게 하기 (완료)

  - html에서 disabled가 있는 상태로 시작 (완료)
  - queryselector 버튼부분을 변수에 담아놓기 (완료)
  - 이벤트핸들러 -> 만약에 회원가입에 마우스오버가 될때, 함수가 실행이 된다. (문제: disabled된 버튼에는 이벤트가 발생 안함)
  - 함수 생성 -> username, password, passwordRetype 부분의 조건을 다 만족했는지 확인해서,
    만약 조건을 다 충족했다면, 회원가입 버튼이 활성화(=disabled가 사라짐)
    만약 조건이 충족되지 않았다면, 버튼 비활성화 (완료)

4. CSS 업데이트해보기 (완료)

<추후 업데이트>
5. 이름 유효성 검사 함수 만들기
6. 휴대폰 유효성 검사 함수 만들기 
*/

let elInputUsername = document.querySelector('#username');
let elSucessMessage = document.querySelector('.success-message');
let elFailureMessage = document.querySelector('.failure-message');
let elInputPassword = document.querySelector('#password');
let elSucessMessagePW = document.querySelector('.success-message-password');
let elFailureMessagePW = document.querySelector('.failure-message-password');
let elInputPasswordRetype = document.querySelector('#password-retype');
let elMismatchMessage = document.querySelector('.mismatch-message');
let elMatchMessage = document.querySelector('.match-message');
let elInputPhone = document.querySelector('#phone');
let elPhoneMessageSuccess = document.querySelector('.success-message-phone');
let elPhoneMessageFailure = document.querySelector('.failure-message-phone');
let elButton = document.querySelector('.newBtn');
let icon1 = document.querySelector('.icon1');
let icon2 = document.querySelector('.icon2');
let icon3 = document.querySelector('.icon3');
let icon4 = document.querySelector('.icon4');
let checkboxAgree = document.querySelector('#checkboxAgree');

/* USERNAME */
function isMoreThan4Length(value) { // 과제 통과를 위해 길이를 8->4로 변경
  return /^[A-Za-z0-9]{4,20}$/.test(value);
};

elInputUsername.onkeyup = function() {
  if (isMoreThan4Length(elInputUsername.value)) { 
    elSucessMessage.classList.remove('hide');
    elFailureMessage.classList.add('hide');
    icon1.className = "fa-solid fa-check";
    conditionChecker("elInputUsername",1);
  } else { 
    elSucessMessage.classList.add('hide');
    elFailureMessage.classList.remove('hide');
    icon1.className = "fa-solid fa-x";
    conditionChecker("elInputUsername",0);
  }
};

/* PASSWORD */
function passwordChecker(value) {
  const success = "fa-solid fa-check";
  const failure = "fa-solid fa-x";
  let checkList = ["","",""];
  let condition1 = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{4,20}$/.test(value);
  let condition2 = !(/(\w)\1\1/.test(value));
  let condition3 = value.search(elInputUsername.value) === -1;
  checkList[0] = condition1 ? success : failure;
  checkList[1] = condition2 ? success : failure;
  checkList[2] = condition3 ? success : failure;
  return checkList;
};

elInputPassword.onkeyup = function() {
  let result = passwordChecker(elInputPassword.value);
  icon2.className = result[0];    
  icon3.className = result[1];    
  icon4.className = result[2];  
  if (result.indexOf("fa-solid fa-x") === -1) {
    elSucessMessagePW.classList.remove('hide');
    elFailureMessagePW.classList.add('hide');
    conditionChecker("elInputPassword",1);
  } else {
    elSucessMessagePW.classList.add('hide');
    elFailureMessagePW.classList.remove('hide');
    conditionChecker("elInputPassword",0);
  }
};

/* PASSWORDRETYPE */
function isMatch (password1, password2) {
  return password1 === password2; 
};

elInputPasswordRetype.onkeyup = function() {
  if (isMatch(elInputPassword.value, elInputPasswordRetype.value)) { 
    elMismatchMessage.classList.add('hide');
    elMatchMessage.classList.remove('hide');
    conditionChecker("elInputPasswordRetype",1)
  } else { 
    elMismatchMessage.classList.remove('hide');
    elMatchMessage.classList.add('hide');
    conditionChecker("elInputPasswordRetype",0);
  }
};

/* CHECKBOX */
checkboxAgree.onclick = function() {
  checkboxAgree.checked ? conditionChecker("checkboxAgree",1) : conditionChecker("checkboxAgree",0);
};

/* BUTTON */
let checkbox = {elInputUsername:0, elInputPassword:0, elInputPasswordRetype:0, checkboxAgree:0};
function conditionChecker(key, value) { 
  checkbox[key] = value; 
  if (checkbox['elInputUsername'] + checkbox['elInputPassword'] + checkbox['elInputPasswordRetype'] + checkbox['checkboxAgree'] === 4) {
    elButton.removeAttribute('disabled');
  } else {
    elButton.setAttribute('disabled', '') ;
  }
};