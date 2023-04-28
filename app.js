//selecting the elements
const notificationElement = document.querySelector(".notification");
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(".temperature-description p");
const locationElement = document.querySelector(".location p");

//to store the data
const weather = {

    temperature: {
        value: 18,
        unit: "celsius"
    },
    description: "few clouds",
    iconId: "01d",
    city: "london",
    country: "GB",
};

// check if geolocation is supported or notification
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

//set user's position
function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;
    getWeather(latitude, longitude);
};
//show error when there is an issue with geolocation service
function showError(error) {
    notificationElement.style.display = "block";
    notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

// APP CONSTS AND VARS
const KELVIN = 273;
// API KEY
const key = "82005d27a116c2880c8f0fcb866998a0";

//get weather from api provider
function getWeather(latitude, longitude) {
    let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;
    fetch(api) //fetching the api
        .then(function (response) {
            let data = response.json();
            return data;
        }
    ) //converting the response to json
        .then(function (data) {
            weather.temperature.value = Math.floor(data.main.temp - KELVIN);
            weather.description = data.weather[0].description;
            weather.iconId = data.weather[0].icon;
            weather.city = data.name;
            weather.country = data.sys.country; //getting the data from the api and storing it in the weather object 
        } //displaying the data 
        ).then(function () {
            displayWeather();
        } )
}

//display weather to UI 
function displayWeather(){
    iconElement.innerHTML =
        `<img src="icons/${weather.iconId}.png"/>`;
    tempElement.innerHTML =
        `${weather.temperature.value} °<span>C</span>`;
    descElement.innerHTML =
        weather.description;
    locationElement.innerHTML = `${weather.city},${weather.country}`;
    //we will use this multiple times so put this in a fun
}
// C to F conversion on click
function celsiusToFahrenheit(temperature) {
    return (temperature * 9/5) + 32;
}
// when the user clicks on the temperature element

tempElement.addEventListener("click", function() { 
    
    if (weather.temperature.value === undefined) return;
    
    if (weather.temperature.unit === "celsius") {
        let fahrenheit =  celsiusToFahrenheit(weather.temperature.value);
        fahrenheit = Math.floor(fahrenheit);
        tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
        weather.temperature.unit = "fahrenheit";
    }
 
    else {
        tempElement.innerHTML = `${weather.temperature.value}° <span>C</span>`;
        weather.temperature.unit = "celsius";
    }
});
