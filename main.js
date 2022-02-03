var search = document.getElementById("search");
var current_loc = document.getElementById("current_loc") 
var list11 = document.getElementById("list");
var loc_name = document.getElementById("location_name");
var weather = document.getElementById("weather");
var temp = document.getElementById("temp");
var vid = document.getElementById("vid");
var video = document.getElementById("video");
var lat1,lon1;

var wind=document.getElementById("wind");
var visi=document.getElementById("visi");
var humi=document.getElementById("humi");


var clk_srch = document.getElementById("clk-srch");
var btn = document.getElementById("dropbtn");
var btn_val=1;


btn.addEventListener("click",show_hide);
clk_srch.addEventListener("click",function(){
    if(search.value)
    {
        city_weather(search.value);
        search.value='';
        show_hide();
    }
    else
    alert("Please enter city name or use your current location");

})
function show_hide(){
    if(btn_val)
    {
        btn.src="img/expand_less_black_24dp.svg";
        list11.style.display="block";
        btn_val=0;
    }
    else{
        btn.src="img/expand_more_black_24dp.svg";
        list11.style.display="none";
        btn_val=1;
    }
}

search.addEventListener("keyup",function(event){
    if(search.value && event.keyCode === 13)
    {
        city_weather(search.value);
        search.value='';
        show_hide();
    }
    // else
    // alert("Please enter city name or use your current location");

});

current_loc.addEventListener("click",function(){
    show_hide();
    getLocation();

});

// to get current loction of device
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(showPosition);
  }
  else { 
    alert("Geolocation is not supported by this browser.");
  }
}

 // to show positions which we get from above function
function showPosition(position) {
   lat1 = position.coords.latitude;;
   lon1= position.coords.longitude;
    
    currentLoc_weather(lat1,lon1);
}


function currentLoc_weather(lat1,lon1){
    let req = new XMLHttpRequest();

    req.open("GET",`https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=dl7nZtPGilGL8AWQy2l0CAViTbh0AJPu&q=${lat1},${lon1}`);
    req.send();

    req.onload = function(){
        var data = JSON.parse(req.response);
        let city = data.LocalizedName;
        var req2 = new XMLHttpRequest();
        req2.open("GET",`https://api.weatherapi.com/v1/current.json?key=dd744413e3d6405a852123256221701&q=${city}&aqi=yes`);
        req2.send();
        req2.onload = function(){
            let new_data = JSON.parse(req2.response);

            showData(new_data);
        }
    }
}

// to get weather by city name
function city_weather(city){
    let req = new XMLHttpRequest();

    req.open("GET",`https://api.weatherapi.com/v1/current.json?key=dd744413e3d6405a852123256221701&q=${city}&aqi=yes`);
    req.send();

    req.onload= function()
    {
        var data = JSON.parse(req.response);
        showData(data);
        // console.log(data);
    }
}

// to print data on dom
function showData(data){
    loc_name.innerText = data.location.name;
   
    let weatherText= data.current.condition.text;
    weather.innerText = weatherText;


    temp.innerHTML = Math.round(data.current.temp_c)+"&#8451;";

    
    let time;
    if(data.current.is_day)
    time = "day";
    else
    time = "night";

    if(weatherText.includes('snow'))
    weatherText = "Snowfall";
    if(weatherText.includes('drizzle'))
    weatherText = 'Light rain showers';

    if(weatherText.includes('rain'))
    weatherText = "Light rain showers";

    if(time == "night" && weatherText == "Light rain showers") 
    document.body.style.color="#ffffffb8";
    else if(time=='night' && weatherText == "Snowfall" )
    document.body.style.color="#ffffffb8";
    else
    document.body.style.color="black";

    vid.src="img/"+weatherText+"-"+time+".mp4";
    video.load();

    wind.innerText = data.current.wind_kph;
    visi.innerText = data.current.vis_km;
    humi.innerText = data.current.humidity;

}


