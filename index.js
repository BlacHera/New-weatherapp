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
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
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
  // Debugging: Log the full API response to ensure it's working
  console.log("Forecast API response:", response.data);

  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 6) {
      // Debugging: Log the icon URL to confirm it's correct
      let iconUrl = `http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png`;
      console.log(`Icon URL for day ${index}: ${iconUrl}`);

      forecastHTML =
        forecastHTML +
        `
          <div class="col-2">
            <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
            <img
              src="${iconUrl}"
              alt="${forecastDay.weather[0].description}"
              width="50"
            />
            <div class="weather-forecast-temperatures">
              <span class="weather-forecast-temperature-max"> ${Math.round(
                forecastDay.temp.max
              )}° </span>
              <span class="weather-forecast-temperature-min"> ${Math.round(
                forecastDay.temp.min
              )}°</span>
            </div>
          </div>
      `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;

  // Debugging: Log the final HTML inserted into #forecast
  console.log("Generated forecast HTML:", forecastHTML);
}

function getForecast(coordinates) {
  console.log("Coordinates for forecast:", coordinates); // Debugging: Verify coordinates
  let apiKey = "3bf81fb33582abec8181053340fbaf27";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  console.log("Forecast API URL:", apiUrl); // Debugging: Log the API URL

  axios.get(apiUrl).then(displayForecast).catch((error) => {
    console.error("Error fetching forecast data:", error); // Debugging: Catch API errors
  });
}

function displayWeatherCondition(response) {
  console.log("Current weather API response:", response.data); // Debugging: Log API response

  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#temperature").innerHTML = Math.round(
    response.data.main.temp
  );

  document.querySelector("#humidity").innerHTML = response.data.main.humidity;
  document.querySelector("#wind").innerHTML = Math.round(
    response.data.wind.speed
  );

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
  console.log("Search city API URL:", apiUrl); // Debugging: Log the API URL

  axios.get(apiUrl).then(displayWeatherCondition).catch((error) => {
    console.error("Error fetching current weather data:", error); // Debugging: Catch API errors
  });
}

function handleSubmit(event) {
  event.preventDefault();
  let city = document.querySelector("#city-input").value;
  console.log("City entered by user:", city); // Debugging: Log user input
  searchCity(city);
}

function getCurrentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let coordinates = {
        lat: position.coords.latitude,
        lon: position.coords.longitude,
      };
      console.log("Current location coordinates:", coordinates); // Debugging: Log coordinates
      getForecast(coordinates);
    },
    (error) => {
      console.error("Error getting current location:", error); // Debugging: Handle location errors
    }
  );
}

let dateElement = document.querySelector("#date");
let currentTime = new Date();
dateElement.innerHTML = formatDate(currentTime);

let searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSubmit);

searchCity("Madrid"); // Default city to display on load
