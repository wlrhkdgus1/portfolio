// 우클릭 방지
document.oncontextmenu = function() {
    return false;
};
// 마우스 드래그 금지
document.ondragstart = function() {
    return false;
};



//초기실행, 초기화
var mapLayer = null;
init();




let deleteLayers = function(id) {
    let layers = new Array();
    let originLayers = map.props.layers;

    for (let i = 0; i < originLayers.length; i++) {
        const element = originLayers[i];
        if (element.id == id) {
            continue;
        }
        layers.push(element);
    }
    console.log(layers);

    map.setProps({
        layers: layers
    });
}

let addLayers = function(inputLayer) {
    let layers = new Array();
    let originLayers = map.props.layers;

    console.log(inputLayer);
    for (let i = 0; i < originLayers.length; i++) {
        const element = originLayers[i];
        layers.push(element);
    }
    layers.push(inputLayer);


    map.setProps({
        layers: layers,
    });

    //return layers;

}


let setBgLayers= function(bgLayer) {
    let layers = new Array();
    let originLayers = map.props.layers;

    layers.push(bgLayer);
    for (let i = 1; i < originLayers.length; i++) {
        const element = originLayers[i];
        layers.push(element);
    }
    map.setProps({
        layers: layers,
    });

    //return layers;

}


function getTooltip(info) {
    console.log('getTooltip : ', info);
    tooltipDiv = document.querySelector("#tooltip");
    tooltipDiv.style.display = "block";
    tooltipDiv.style.left = info.x + 10 + "px";
    tooltipDiv.style.top = info.y + 10 + "px";
    tooltipDiv.innerHTML = '';

    var messageInfo = info.messageInfo;

    for (key in messageInfo) {
        tooltipDiv.innerHTML += '<span>' + key + " : " + messageInfo[key] + '</span><br>';

    }
}


let visible = false;
document.querySelector("#real_time_TrafficAccident").addEventListener("click", () => { //XMLHttpRequest 객체 생성
    if (!visible) {
        real_time_TrafficAccident.setAttribute('value', '실시간 사고 정보 끄기');
        visible = true;
        url = 'https://openapi.its.go.kr:9443/eventInfo?apiKey=ad9b591f15894ea18a0565f468dc7a3a&type=all&eventType=all&getType=json';
        xhr = new XMLHttpRequest(); //요청을 보낼 방식, 주소, 비동기여부 설정
        xhr.open('GET', url, true); //요청 전송
        xhr.send(); //통신후 작업
        xhr.onload = () => {
            //통신 성공
            if (xhr.status == 200) {

                jsonData = JSON.parse(xhr.response);
                console.log(jsonData.body.items);

                layer = new deck.ScatterplotLayer({
                    id: 'real_time_TrafficAccident',
                    data: jsonData.body.items,
                    pickable: true,
                    opacity: 0.8,
                    stroked: true,
                    billboard: true,
                    autoHighlight: true,
                    filled: true,
                    radiusScale: 1,
                    radiusMinPixels: 10,
                    radiusMaxPixels: 50,
                    lineWidthMinPixels: 1,
                    getPosition: d => [Number(d.coordX), Number(d.coordY)],
                    getFillColor: d => [255, 0, 0],
                    onHover: function(info) {
                        tooltipDiv = document.querySelector("#tooltip");
                        tooltipDiv.style.display = "none";
                        if (info == undefined) {
                            return;
                        } else {
                            if (info.object == undefined) {
                                return;
                            }
                            // console.log(info.object.eventType);
                            let tooltip = {
                                x: info.x,
                                y: info.y,
                                messageInfo: {
                                    '돌발정보': '[' + info.object.eventType + info.object.eventDetailType + ']',
                                    '상세정보': info.object.message,
                                    '도로': info.object.roadName + '/' + info.object.type,
                                    '좌표': info.object.coordX + ", " + info.object.coordY
                                }
                            };
                            getTooltip(tooltip);
                        }
                    },
                    parameters: {
                        depthTest: false
                    }
                });
                addLayers(layer);
            } else {
                console.log("통신 실패");
            }
        }
    } else {
        real_time_TrafficAccident.setAttribute('value', '실시간 사고 정보');
        visible = false;
        deleteLayers('real_time_TrafficAccident');
    }
});



var TrafficAccident_EMD_OPEN_API = 'http://localhost:8080/geoserver/wfs?service=WFS&' +
                                    'version=1.1.0&request=GetFeature&typename=myMap:TfcacdStatusEmd&' +
                                    'outputFormat=application/json';
let visible_TrafficAccident_EMD_Hexagon = false;
document.querySelector("#TrafficAccident_EMD_Hexagon").addEventListener("click", () => { //XMLHttpRequest 객체 생성
    console.log(visible_TrafficAccident_EMD_Hexagon);
    if (!visible_TrafficAccident_EMD_Hexagon) {
        visible_TrafficAccident_EMD_Hexagon = true;

        var xhr = new XMLHttpRequest(); //요청을 보낼 방식, 주소, 비동기여부 설정
        xhr.open('GET', TrafficAccident_EMD_OPEN_API, true); //요청 전송
        xhr.send(); //통신후 작업
        xhr.onload = () => {
            //통신 성공
            if (xhr.status == 200) {
                xhrData = JSON.parse(xhr.response).features;
                console.log(xhrData);

               // console.log(xhrData);
                layer = new deck.HexagonLayer({
                    id: 'TrafficAccident_EMD_Hexagon',
                    data: xhrData,
                    extruded: true,
                    elevationScale: 100,
                    getPosition: d => [Number(d.properties.xcoord), Number(d.properties.ycoord)],
                    pickable: true,
                    autoHighlight: true,
                    onHover: function(xhrData,info){
                        if( (xhrData.object == undefined) || (xhrData.object.points == undefined) ){
                            return;
                        }
                        var obj = xhrData.object.points;
                        console.log(info);
                        for(var i = 0; obj.length; i++){
                            if((obj[i] == undefined) || (obj[i].source == undefined) || (obj[i].source.properties == undefined)){
                                continue;
                            }

                        
                            
                            var tooltip = {
                                x:info.center.x,
                                y:info.center.y,
                                messageInfo : {
                                    '위치' : obj[i].source.properties.CTPRVN_NM+" "+obj[i].source.properties.SGG_NM,
                                    '사고' : obj.length +'건'
                                }
                            }
    
                            break;
                        }
                        getTooltip(tooltip);

                    }
                });

                addLayers(layer);
            } else {
                console.log("통신 실패");
            }
        }
    } else {
        TrafficAccident_EMD.setAttribute('value', '교통사고 통계');
        visible_TrafficAccident_EMD_Hexagon = false;
        deleteLayers('TrafficAccident_EMD_Hexagon');
    }
});

let visible_TrafficAccident_EMD = false;
document.querySelector("#TrafficAccident_EMD").addEventListener("click", () => { //XMLHttpRequest 객체 생성

    console.log(visible_TrafficAccident_EMD);
    if (!visible_TrafficAccident_EMD) {
        visible_TrafficAccident_EMD = true;

        var xhr = new XMLHttpRequest(); //요청을 보낼 방식, 주소, 비동기여부 설정
        xhr.open('GET', TrafficAccident_EMD_OPEN_API, true); //요청 전송
        xhr.send(); //통신후 작업
        xhr.onload = () => {

            //통신 성공
            if (xhr.status == 200) { 
                xhrData = JSON.parse(xhr.response).features;

                console.log(xhrData);
                layer = new deck.HeatmapLayer({
                    id: 'TrafficAccident_EMD',
                    data: xhrData,
                    radiusPixels: 50,
                    intensity: 3,
                    getPosition: d => [Number(d.properties.xcoord), Number(d.properties.ycoord)],
                    aggregation: 'SUM',
                    pickable: true,
                    parameters: {
                        depthTest: false
                    },
                    onHover: (info, event) => {

                        var x = info.x;
                        var y = info.y;
                        var tt = map.pickMultipleObjects({
                            x: x,
                            y: y,
                            radius: 10,
                            layerIds: ['TrafficAccident_EMD'],
                            depth: 1

                        });
                        if (tt.length != 0) {
                            //    console.log(tt[0] );
                        }
                    }
                });
                addLayers(layer);
            } else {
                //통신 실패
                console.log("통신 실패");
            }
        }
    } else {
        TrafficAccident_EMD.setAttribute('value', '교통사고 통계');
        visible_TrafficAccident_EMD = false;
        deleteLayers('TrafficAccident_EMD');
    }
});



/*
//   console에 에러코드가 많아 임시 주석 처리함
var nodeLayer = new deck.ScatterplotLayer({
    data: "http://localhost:8080/geoserver/gwc/service/tms/1.0.0/myMap:moct_node_4326@EPSG:4326@pbf/{z}/{x}/{-y}.pbf",
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusScale: 6,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: d => d.coordinates,
    getFillColor: d => [255, 140, 0],
    getLineColor: d => [0, 0, 0]
  });

*/

/*
let stanLink = null;
var stanLinURL = 'http://localhost:8080/geoserver/wfs?service=WFS&' +
  'version=1.1.0&request=GetFeature&typename=myMap:moct_link_4326&' +
  'outputFormat=application/json&cql_filter=ROAD_RANK IN(101,102,103)';
var xhr = new XMLHttpRequest(); //요청을 보낼 방식, 주소, 비동기여부 설정
xhr.open('GET', stanLinURL, true); //요청 전송
xhr.send(); //통신후 작업
xhr.onload = () => {
if(xhr.status == 200){
    document.querySelector("#standardNodeLink").removeAttribute('disabled');
    stanLink =JSON.parse(xhr.response).features;

}
}
*/
let visible_standardNodeLink = false;
document.querySelector('#standardNodeLink').addEventListener('click',function(){

    if(!visible_standardNodeLink){
        visible_standardNodeLink = true;
        let xhrData = stanLink
        layer = new deck.GeoJsonLayer({
            data:xhrData,
            id:"standardNodeLink",
            pickable: true,
            stroked: false,
            filled: true,
            extruded: true,
            pointType: 'circle',
            lineWidthScale: 20,
            lineWidthMinPixels: 2,
            //getFillColor: [160, 160, 180, 200],
            getLineColor: d => {
                var road_rank = d.properties.ROAD_RANK;
    
                switch(road_rank){
                    case '101':
                        return [180, 50, 0, 200];    
                    case '102': 
                        return [140, 50, 0, 200];    
                    case '103':
                        return [120, 50, 0, 200];    
                    case '104':
                        return [100, 50, 0, 200];    
                }
            },
            getPointRadius: 100,
            getLineWidth: 1,
            getElevation: 30,
            renderSubLayers: function(props) {
                const {
                    bbox: {
                        west,
                        south,
                        east,
                        north
                    }
                } = props.tile;
    
                return [
                    new deck.TileLayer(props, {
                        data: null,
                        image: props.data,
                        bounds: [west, south, east, north],
                    })
                ];
            }
          });
          addLayers(layer);


          
    }else{
        visible_standardNodeLink = false;
        deleteLayers('standardNodeLink');
    }



    
});

let darkMode = false;
const modeChageBtn = document.querySelector('#changeBgMap')
modeChageBtn.addEventListener('click',function(){

    if(!darkMode){
        var layer = new deck.TileLayer({
            data:[
                'https://a.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                'https://b.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                'https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                'https://d.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                'https://e.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                'https://f.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                'https://g.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                'https://h.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                'https://i.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
                'https://j.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
            ],
            maxRequests: 20,
            minZoom: 0,
            maxZoom: 19,
            tileSize: 256,
            zoomOffset: devicePixelRatio === 1 ? -1 : 0,
            opacity:0.5,
            renderSubLayers: function(props) {
                const {
                    bbox: {
                        west,
                        south,
                        east,
                        north
                    }
                } = props.tile;
    
                return [
                    new deck.BitmapLayer(props, {
                        data: null,
                        image: props.data,
                        bounds: [west, south, east, north],
                    })
                ];
            }
        });
        modeChageBtn.innerHTML="컬러모드🗺";
        darkMode = true;
        setBgLayers(layer);
    }else{
        modeChageBtn.innerHTML="다크모드🗺";
        darkMode = false;
        setBgLayers(mapLayer);
    }



})

// 맵 초기설정
function init() {

    mapLayer = new deck.TileLayer({
        data: [
            'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://b.tile.openstreetmap.org/{z}/{x}/{y}.png',
            'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png'
        ],
        maxRequests: 20,
        minZoom: 0,
        maxZoom: 19,
        tileSize: 256,
        zoomOffset: devicePixelRatio === 1 ? -1 : 0,
        opacity:0.5,
        renderSubLayers: function(props) {
            const {
                bbox: {
                    west,
                    south,
                    east,
                    north
                }
            } = props.tile;

            return [
                new deck.BitmapLayer(props, {
                    data: null,
                    image: props.data,
                    bounds: [west, south, east, north],
                })
            ];
        }
    });


     

    map = new deck.DeckGL({
        id: "map",
        initialViewState: {
            longitude: 127.0655,
            latitude: 36.606,
            zoom: 7.5,
        },
        controller: true,
        layers: [mapLayer]
    });



}

// 커서 설정
map.props.getCursor = function(cursor) {
    return cursor.isHovering ? 'pointer' : 'grab';
 }

 // 위치 초기화
var resetCamera = function() {
        map.setProps({
            initialViewState: {
                longitude: 127.00655,
                latitude: 36.6060,
                zoom: 7.5,
                transitionDuration: 500,
                transitionInterpolator: new deck.FlyToInterpolator()
                
            }
        })
    }
 document.querySelector("#resetBtn").addEventListener("click", resetCamera);


/* VWorld 오픈데이터 API 사용 시 CORS 보안정책 이슈

function ajax(Data) {
    var xhr = new XMLHttpRequest(); //요청을 보낼 방식, 주소, 비동기여부 설정
    //메소드 요청 준비
    xhr.open('GET', 'https://cors-anywhere.herokuapp.com/https://api.vworld.kr/req/data?service=data&request=GetFeature&data=LT_L_MOCTLINK&key=138BB84F-51E8-323C-8B8E-D17E633AD352&domain=localhost:8080/map.html&geomFilter=LINESTRING(120 30,130 40)', true); //요청 전송
   //통신 작업
    xhr.send(JSON.stringify(data)); 
}


xhr.onload = () => {
    //통신 성공
    if (xhr.status == 200) {

      jsonData = JSON.parse(xhr.response);
      console.log(jsonData.result.featureCollection.features);

  
       datalayer = new deck.ScatterplotLayer({
        id: 'scatterplot-layer',
        data : jsonData.body.items,
        pickable: true,
        opacity: 0.8,
        stroked: true,
        billboard: true,
        autoHighlight: true,
        filled: true,
        radiusScale: 1,
        radiusMinPixels: 10,
        radiusMaxPixels: 50,
        lineWidthMinPixels: 1,
        getPosition: d => [Number(d.coordX),Number(d.coordY) ],
        // getRadius: d => d.,
        getFillColor: d => [255, 0, 0]
      });
      map.setProps({
         layers: [tileLayer,datalayer]
      });
       
    } else {
        //통신 실패
        console.log("통신 실패");

    }
}

 */





