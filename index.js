function formatDate(date) {
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let dayIndex = date.getDay();
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[dayIndex];
  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  if (!response.data.daily) {
    console.error("No daily forecast data available.");
    return;
  }
  console.log(response.data);


  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      forecastHTML += `
        <div class="col-2">
          <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
          <img
            src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
            alt="${forecastDay.weather[0].description}"
            width="50"
          />
          <div class="weather-forecast-temperatures">
            <span class="weather-forecast-temperature-max"> ${Math.round(forecastDay.temp.max)}° </span>
            <span class="weather-forecast-temperature-min"> ${Math.round(forecastDay.temp.min)}°</span>
          </div>
        </div>
      `;
    }
  });

  forecastHTML += `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "3bf81fb33582abec8181053340fbaf27";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(displayForecast)
    .catch((error) => {
      console.error("Error fetching forecast data:", error);
    });
}

function displayWeatherCondition(response) {
  if (!response.data || !response.data.main) {
    console.error("Incomplete weather data received:", response);
    return;
  }

  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(response.data.main.temp);
  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(response.data.wind.speed);

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  getForecast(response.data.coord);
}

function searchCity(city) {
  let apiKey = "4104431b5067788c689c23fb1ae31cec";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(displayWeatherCondition)
    .catch((error) => {
      console.error("Error fetching city weather data:", error);
      alert("City not found. Please try again.");
    });
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value.trim();
  if (city) {
    searchCity(city);
  } else {
    alert("Please enter a city name.");
  }
}

function getCurrentLocation(event) {
  event.preventDefault();
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(searchLocation, (error) => {
      console.error("Geolocation error:", error);
      alert("Unable to retrieve your location.");
    });
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

function searchLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiKey = "4104431b5067788c689c23fb1ae31cec";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

  axios
    .get(apiUrl)
    .then(displayWeatherCondition)
    .catch((error) => {
      console.error("Error fetching location weather data:", error);
    });
}

let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

searchCity("Madrid"); // Default city
