const weather = document.querySelector(".js-weather");

const API_KEY = "241051bf13976dd3ddf8b8d9f247255e";
const COORDS = 'coords';

function getWeather(lat, lng){
  fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
  ).then(function(response){
      return response.json()
  }).then(function(json){
      const temperature = json.main.temp;
      const place = json.name;
      weather.innerText = `${temperature} @ ${place}`;
  });
}

function saveCoords(coordsObj){
    localStorage.setItem(COORDS, JSON.stringify(coordsObj))
}

function handleGeoSucces(position){
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const coordsObj = {
       latitude, // < 위도이며 왼쪽코드와 같은의미latitude: latitude,
       longitude // < 경도이며 왼쪽코드와 같은의미longitude: longitude
    };
    saveCoords(coordsObj);
    getWeather(latitude, longitude);
}

function handleGeoError(){
   console.log("Cant access geo location") //위치 정보를 찿을수 없습니다.
}

function askForCoords(){
    navigator.geolocation.getCurrentPosition(handleGeoSucces, handleGeoError) // navigetor사용법 https://developer.mozilla.org/ko/docs/Web/API/Window/navigator
}

function loadCoords(){
    const loadedCoords = localStorage.getItem(COORDS);
    if(loadedCoords === null){
        askForCoords();
    } else {
       const parseCoords = JSON.parse(loadedCoords);
       getWeather(parseCoords.latitude, parseCoords.longitude);
    }
}

function init(){
    loadCoords();
}

init();