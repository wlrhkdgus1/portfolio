// 여기에는 유용한 유효성 검증 함수가 있습니다

// [유효성 검증 함수]: 영어 또는 숫자만 가능
function onlyNumberAndEnglish(str) {
  return /^[A-Za-z][A-Za-z0-9]*$/.test(str);
  /* 
  /  매칭시킬 패턴  / 
  .test(str): 자바스크립트 정규표현식 확인하는 메소드. true/false 반환
  ^ : 특정 문자열로 나타냄([]바깥). [^]는 제외를 의미
  * : 수량 패턴을 나타내는 방법. 있거나/없거나/여러개 포함 의미
  $ : 문자열의 끝부분에 위치. 
  */
}

// [유효성 검증 함수]: 최소 8자 이상하면서, 알파벳과 숫자 및 특수문자(@$!%*#?&) 는 각각 하나 이상 포함
function strongPassword(str) {
  return /^(?=.*[A-Za-z]) (?=.*\d) (?=.*[@$!%*#?&]) [A-Za-z\d@$!%*#?&] {8,} $/.test(str);



  
  /*
    ^(?=.{8,20}$)(?=[^A-Za-z]*[A-Za-z])(?=[^0-9]*[0-9])(?:([\w\d*?!:;])\1?(?!\1))+$ 

    <설명> 최소 8자이상 20자 이하이면서, 알파벳과, 숫자는 하나 이상 포함 
    ^
    (?=.{8,20}$)                 8 to 20 characters
    (?=[^A-Za-z]*[A-Za-z])       At least one Alpha
    (?=[^0-9]*[0-9])             At least one Numeric
    (?:([\w\d*?!:;])\1?(?!\1))+  Valid Characters, not repeated thrice.
    $

    < 보충 >
    (?=.*[0-9]) - Assert a string has at least one number;
    (?=.*[!@#$%^&*]) - Assert a string has at least one special character.
  */
}

// 주석을 제거하고, 유효성 검증 함수를 테스트 해보세요

console.log('`codestates`는 영어만 포함하므로', onlyNumberAndEnglish('codestates'))
console.log('`김coding`은 영어 외의 다른 글자도 포함하므로', onlyNumberAndEnglish('김coding'))
console.log('`김코딩`은 영어 외의 다른 글자도 포함하므로', onlyNumberAndEnglish('김코딩'))
console.log('`qwerty`는 충분히 강력하지 않은 암호이므로', strongPassword('qwerty'))
console.log('`q1w2e3r4`는 특수문자를 포함하지 않으므로', strongPassword('q1w2e3r4'))
console.log('`q1w2e3r4!`는 조건을 충족하므로', strongPassword('q1w2e3r4!'))
