const WEATHER_API_KEY="1a7e232a669b4a1a8da83109231405";
var forecastData;
var historyData;
var isImperial=false;

const setWeatherData=(location)=>{

    if(!window.navigator.onLine){
        Swal.fire({
            icon: 'error',
            title: "No Internet",                           
            customClass: {
                popup: 'popup',
                title: 'popup-title',
                icon: 'popup-icon',
                image: 'popup-icon',
            }  
        })
        return;
    }

    $(".loading-screen").css('display', 'flex');
    $(".alerts").empty();  
    $(".alerts").append("<p>No Alerts</p>");    

    fetch('https://api.weatherapi.com/v1/forecast.json?key='+WEATHER_API_KEY+'&days=3&alerts=yes&q='+location)
      .then(response => {
        setTimeout(() => {
            $(".loading-screen").css('display', 'none');
        },500);    
        if (response.ok) {
            return response.json();
        }

        if(response.status == 400){   
            Swal.fire({
                icon: 'error',
                title: "No matching location found.",                           
                customClass: {
                    popup: 'popup',
                    title: 'popup-title',
                    icon: 'popup-icon',
                    image: 'popup-icon',
                }  
            })          
        }    
        
        
      })
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
    .catch(error =>{
        console.log(error);
    })

    const epoch = Math.round(Date.now()/1000);

    fetch('https://api.weatherapi.com/v1/history.json?key='+WEATHER_API_KEY+'&q='+location+'&unixdt='+(epoch-604800)+'&unixend_dt='+(epoch-86400))
      .then(response => {
        if (response.ok) {
            return response.json();
        }
      })

      .then(json => {
        historyData=json;    
        for(var i=0; i<7; i++){
            $(".history-day"+(i+1)).text(json.forecast.forecastday[i].date);
            $(".history-condition-text"+(i+1)).text(json.forecast.forecastday[i].day.condition.text);
            $(".history-temp"+(i+1)).text(json.forecast.forecastday[i].day.avgtemp_c+" °C");
            $(".history-humidity"+(i+1)).text(json.forecast.forecastday[i].day.avghumidity+" %");
        }        
      })
      .catch(error =>{
        
        
      })

}

function setLocationWeatherData(){
    if(!window.navigator.onLine){
        Swal.fire({
            icon: 'error',
            title: "No Internet",                           
            customClass: {
                popup: 'popup',
                title: 'popup-title',
                icon: 'popup-icon',
                image: 'popup-icon',
            }  
        })
        return;
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position)=>{
            setWeatherData(position.coords.latitude+','+position.coords.longitude);
        }/*, (err)=>{
            alert(err.message);
        }*/);
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



window.addEventListener('online', () => {
    Swal.fire({
        icon: 'success',
        title: "Back online",                           
        customClass: {
            popup: 'popup',
            title: 'popup-title',
            icon: 'popup-icon',
            image: 'popup-icon',
        }  
    })
});
window.addEventListener('offline', () => {
    Swal.fire({
        icon: 'error',
        title: "You are offline",                           
        customClass: {
            popup: 'popup',
            title: 'popup-title',
            icon: 'popup-icon',
            image: 'popup-icon',
        }  
    })
});

$(".search-bar").on('keyup',function(e) { 
    if(!window.navigator.onLine){
        Swal.fire({
            icon: 'error',
            title: "No Internet",                           
            customClass: {
                popup: 'popup',
                title: 'popup-title',
                icon: 'popup-icon',
                image: 'popup-icon',
            }  
        })
        return;
    }
    if(e.which !=13) {
        $(".search-dropdown").empty();
        if(e.target.value != ""){
            fetch('https://api.weatherapi.com/v1/search.json?key='+WEATHER_API_KEY+'&q='+(e.target.value))
                .then(response => response.json())
                .then(json => {
                $(".search-dropdown").empty();
                for(var i=0; i<json.length; i++){                 
                    $(".search-dropdown").append("<li class=\"dropdown-item search-dropdown-item\">"+json[i].name+", "+json[i].region+", "+json[i].country+"</li>");  
                }         
                })
                .catch(error =>{
                
                })
        }   
    }
});
 
$(".search-bar").keypress(function(e) {
    if(e.which == 13) {
        $(".search-dropdown").empty();       
        e.target.value != "" ? setWeatherData(e.target.value) : null; 
        e.target.value="";       
    }
});  

$('.search-bar').focusin(function() {
    $('.search-dropdown').css('display', 'block');
});

$('.search-bar').focusout(function() {
    setTimeout(function() {
        $('.search-dropdown').css('display', 'none');
    }, 200); 
});

$('.search-dropdown').on('click', '.search-dropdown-item', function(e) {
    setWeatherData(e.target.innerHTML);
    $( ".search-bar" ).val('');
    $(".search-dropdown").empty(); 
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
