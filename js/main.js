var forecastData;

function setData(location){
    fetch('http://api.weatherapi.com/v1/forecast.json?key=1a7e232a669b4a1a8da83109231405&days=3&q='+location)
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
        
    })   
}

setData("kalutara");




$(".units-changer-btn").click(function(){
    console.log(forecastData.current.wind_mph);
});




$(".theme-changer-btn").click(function(){
    $("body").toggleClass("light-theme");
    //animations();
});


const tl = gsap.timeline({defaults: {duration: 0.7, ease: "power1.out"}})


animations=()=>{
    tl.fromTo('.location-name', {opacity: 0, y:-100}, {opacity: 1, y:0})
    tl.fromTo('.current-outer', {opacity: 0, y:-100}, {opacity: 1, y:0})
    
}
