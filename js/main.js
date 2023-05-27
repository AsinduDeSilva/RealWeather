const WEATHER_API_KEY="1a7e232a669b4a1a8da83109231405";
var forecastData;
var historyData;
var isImperial=false;

const setWeatherData=(location)=>{

    fetch('http://api.weatherapi.com/v1/forecast.json?key='+WEATHER_API_KEY+'&days=3&alerts=yes&q='+location)
      .then(response => response.json())
      .then(json => {
        forecastData=json;
        $(".location-name").text(json.location.name+", "+json.location.region+", "+json.location.country);
        $(".current-time").text(json.location.localtime);
        $(".current-condition-icon").attr('src', "https:"+json.current.condition.icon);
        $(".current-condition-text").text(json.current.condition.text);
        $(".current-temp").text(json.current.temp_c+" °C");
        $(".current-wind").text(json.current.wind_kph+" kmph");
        $(".current-humidity").text(json.current.humidity+"%");
        $(".current-realFeel").text(json.current.feelslike_c+" °C");
        $(".current-uv").text(json.current.uv);

        for(var i=1; i<3; i++){
            $(".forecast-day"+i).text(json.forecast.forecastday[i].date);
            $(".forecast-condition-icon"+i).attr('src', "https:"+json.forecast.forecastday[i].day.condition.icon);
            $(".forecast-condition-text"+i).text(json.forecast.forecastday[i].day.condition.text);
            $(".forecast-temp"+i).text(json.forecast.forecastday[i].day.avgtemp_c+" °C");
            $(".forecast-humidity"+i).text(json.forecast.forecastday[i].day.avghumidity+" %");
        }
        
        if(json.alerts.alert.length>0){
            $(".alerts").empty();
            for(var i=0; i<json.alerts.alert.length; i++){
                $(".alerts").append("<p>"+json.alerts.alert[i].headline+"</p>");
                $(".alerts").append("<hr>"); 
            }         
        }           
    })

    const epoch = Math.round(Date.now()/1000);

    fetch('http://api.weatherapi.com/v1/history.json?key='+WEATHER_API_KEY+'&q='+location+'&unixdt='+(epoch-604800)+'&unixend_dt='+(epoch-86400))
      .then(response => response.json())
      .then(json => {
        historyData=json;
        
        for(var i=0; i<7; i++){
            $(".history-day"+(i+1)).text(json.forecast.forecastday[i].date);
            $(".history-condition-text"+(i+1)).text(json.forecast.forecastday[i].day.condition.text);
            $(".history-temp"+(i+1)).text(json.forecast.forecastday[i].day.avgtemp_c+" °C");
            $(".history-humidity"+(i+1)).text(json.forecast.forecastday[i].day.avghumidity+" %");
        }        
    })

}

function setLocationWeatherData(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
            setWeatherData(position.coords.latitude+','+position.coords.longitude);
        });
    }else{
        alert("Geolocation is not supported by this browser.");
    }
}

function unitsChanger(){
    if(isImperial){
        isImperial=false;
        $(".current-temp").text(forecastData.current.temp_c+" °C");
        $(".current-wind").text(forecastData.current.wind_kph+" kmph");
        $(".current-realFeel").text(forecastData.current.feelslike_c+" °C");

        for(var i=1; i<3; i++){
            $(".forecast-temp"+i).text(forecastData.forecast.forecastday[i].day.avgtemp_c+" °C");
        }

        for(var i=0; i<7; i++){
            $(".history-temp"+(i+1)).text(historyData.forecast.forecastday[i].day.avgtemp_c+" °C");
        }    

    }else{
        isImperial=true;
        $(".current-temp").text(forecastData.current.temp_f+" °F");
        $(".current-wind").text(forecastData.current.wind_mph+" mph");
        $(".current-realFeel").text(forecastData.current.feelslike_f+" °F");

        for(var i=1; i<3; i++){
            $(".forecast-temp"+i).text(forecastData.forecast.forecastday[i].day.avgtemp_f+" °F");
        } 
        
        for(var i=0; i<7; i++){
            $(".history-temp"+(i+1)).text(historyData.forecast.forecastday[i].day.avgtemp_f+" °F");
        } 
        
    }
}



setWeatherData("Colombo");
setLocationWeatherData();



$(".search-bar").keyup(function(e) {
    $(".search-dropdown").empty();
    if(e.target.value != ''){
        fetch('http://api.weatherapi.com/v1/search.json?key='+WEATHER_API_KEY+'&q='+(e.target.value))
            .then(response => response.json())
            .then(json => {
                //var txt="";
                for(var i=0; i<json.length; i++){                 
                    $(".search-dropdown").append("<li class=\"dropdown-item search-dropdown-item\">"+json[i].name+", "+json[i].region+", "+json[i].country+"</li>");

                    //txt=txt+"<li class=\"dropdown-item search-dropdown-item\"> "+json[i].name+", "+json[i].region+", "+json[i].country+"</li>";    
                }
                //$(".search-dropdown").append("<ul class=\"dropdown-menu search-dropdown\"></ul>");            
        })
    }    



    if(e.which == 13) {
        setWeatherData(e.target.value);
        e.target.value='';
    }
});



$( ".search-dropdown" ).on( "click", '.search-dropdown-item', function(e) {
    console.log(e.target.innerHTML);
    setWeatherData(e.target.innerHTML);
});

$(".units-changer-btn").click(function(){
    $("body").toggleClass("imperial-units");
    unitsChanger();   
});

$(".user-location-btn").click(function(){
    setLocationWeatherData();
});


$(".theme-changer-btn").click(function(){
    $("body").toggleClass("light-theme");
});


// const tl = gsap.timeline({defaults: {duration: 0.7, ease: "power1.out"}})


// animations=()=>{
//     tl.fromTo('.location-name', {opacity: 0, y:-100}, {opacity: 1, y:0})
//     tl.fromTo('.current-outer', {opacity: 0, y:-100}, {opacity: 1, y:0})
    
// }
