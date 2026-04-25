// index.js
//
import "./styles.css";
const formatter = new Intl.NumberFormat("nl-BE", {
  signDisplay: "always",
});

async function getWeatherData(locatie) {
  const key = "C4HRWDPZD5AW8R2C2EDZV39JR";
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locatie}?unitGroup=metric&key=${key}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
  } catch {}
}

function kiesIcoon(icoon) {
  const iconMap = {
    // basis
    "clear-day": "clear-day.svg",
    "clear-night": "clear-night.svg",
    "partly-cloudy-day": "partly-cloudy-day.svg",
    "partly-cloudy-night": "partly-cloudy-night.svg",
    cloudy: "cloudy.svg",
    fog: "fog.svg",
    wind: "wind.svg",
    rain: "rain.svg",
    snow: "snow.svg",
    sleet: "sleet.svg",
    thunderstorm: "thunderstorms.svg",

    // extra / fallback varianten
    "rain-snow": "sleet.svg",
    "showers-day": "rain.svg",
    "showers-night": "rain.svg",
    "thunder-rain": "thunderstorms.svg",
    "thunder-showers-day": "thunderstorms.svg",
    "thunder-showers-night": "thunderstorms.svg",
  };
  return iconMap[icoon];
}

function getWindName(winddirection) {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  const index = Math.round(winddirection / 22.5) % 16;
  console.log(winddirection, directions);
  return directions[index];
}

function filterData(ruweData) {
  const gefilterd = {
    resolvedAddress: ruweData.resolvedAddress,
    observationTime: ruweData.currentConditions.datetime.slice(0, -3),
    observationDate: new Date(ruweData.days[0].datetime).toLocaleDateString(
      "en-GB",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      },
    ),
    currentTemp: ruweData.currentConditions.temp,
    feelsLikeTemp: ruweData.currentConditions.feelslike,
    conditions: ruweData.currentConditions.conditions,
    windspeed: ruweData.currentConditions.windspeed,
    winddirection: ruweData.currentConditions.winddir,
    icon: ruweData.currentConditions.icon,
    currentDew: ruweData.currentConditions.dew,
    currentWindspeed: ruweData.currentConditions.windspeed,
    currentWindgust: ruweData.currentConditions.windgust,
    currentPrecip: ruweData.currentConditions.precip,
    currentPrecipType:
      ruweData.currentConditions.preciptype === null
        ? "none"
        : ruweData.currentConditions.preciptype,
    currentPrecipProb: ruweData.currentConditions.precipprob,
    currentPressure: ruweData.currentConditions.pressure,
    currentHumidity: ruweData.currentConditions.humidity,
    currentCloudCover: ruweData.currentConditions.cloudcover,
    currentUV: ruweData.currentConditions.uvindex,
    // voorspellingen
    days: ruweData.days,
  };
  return gefilterd;
}

//start
async function init(stad) {
  const ruweData = await getWeatherData(stad);
  const weergegevens = filterData(ruweData);
  displayData(weergegevens);
  displayPrediction(weergegevens.days);
}

// form
const form = document.querySelector(".location-input");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const locatie = e.target.elements["location"].value;
  init(locatie);
});

// weergeven data
function displayData(weergegevens) {
  const iconMap = {
    // basis
    "clear-day": "clear-day.svg",
    "clear-night": "clear-night.svg",
    "partly-cloudy-day": "partly-cloudy-day.svg",
    "partly-cloudy-night": "partly-cloudy-night.svg",
    cloudy: "cloudy.svg",
    fog: "fog.svg",
    wind: "wind.svg",
    rain: "rain.svg",
    snow: "snow.svg",
    sleet: "sleet.svg",
    thunderstorm: "thunderstorms.svg",

    // extra / fallback varianten
    "rain-snow": "sleet.svg",
    "showers-day": "rain.svg",
    "showers-night": "rain.svg",
    "thunder-rain": "thunderstorms.svg",
    "thunder-showers-day": "thunderstorms.svg",
    "thunder-showers-night": "thunderstorms.svg",
  };
  //
  // ophalen html-elementen
  const icon = document.querySelector(".current-icon");
  const conditions = document.querySelector(".current-conditions");
  const currentTemp = document.querySelector(".current-temp");
  const resolvedAddress = document.querySelector(".location");
  const observationTime = document.querySelector(".observation-time");
  const observationDate = document.querySelector(".observation-date");
  const currentFeelsLike = document.querySelector(".current-feels-like");
  const currentDew = document.querySelector(".current-dew");
  const currentWinddirection = document.querySelector(".winddirection-value");
  const currentWindSymbol = document.querySelector("#windsymbol");
  const currentWindspeed = document.querySelector(".windspeed-value");
  const currentWindgust = document.querySelector(".windgust-value");
  const currentPrecip = document.querySelector(".precipitation-total-value");
  const currentPrecipType = document.querySelector(".precipitation-type-value");
  const currentPrecipProb = document.querySelector(
    ".precipitation-probability-value",
  );
  const currentPressure = document.querySelector(".misc-pressure-value");
  const currentHumidity = document.querySelector(".misc-humidity-value");
  const currentCloudcover = document.querySelector(".misc-cloudcover-value");
  const currentUV = document.querySelector(".misc-UV-value");
  //
  // inhoud html-elementen aanpassen
  const icoontje = iconMap[weergegevens.icon];
  const iconUrl = `https://cdn.jsdelivr.net/gh/basmilius/weather-icons/production/fill/all/${icoontje}`;
  icon.src = iconUrl;
  conditions.textContent = weergegevens.conditions;
  currentTemp.textContent = `${formatter.format(weergegevens.currentTemp)}°C`;
  resolvedAddress.textContent = weergegevens.resolvedAddress;
  observationTime.textContent = weergegevens.observationTime;
  observationDate.textContent = weergegevens.observationDate;
  currentFeelsLike.textContent = `Feels like ${formatter.format(weergegevens.feelsLikeTemp)}°C`;
  currentDew.textContent = `dew point ${formatter.format(weergegevens.currentDew)}°C`;
  currentWinddirection.textContent = getWindName(weergegevens.winddirection);
  currentWindSymbol.className = "";
  currentWindSymbol.classList.add(
    "wi",
    "wi-wind",
    `from-${weergegevens.winddirection}-deg`,
  );
  currentWindspeed.textContent = `Speed: ${weergegevens.currentWindspeed} km/h`;
  currentWindgust.textContent = `Gust: ${weergegevens.currentWindgust} km/h`;
  currentPrecip.textContent = `${weergegevens.currentPrecip} mm`;
  currentPrecipType.textContent = `Type: ${weergegevens.currentPrecipType}`;
  currentPrecipProb.textContent = `Probability: ${weergegevens.currentPrecipProb} %`;
  currentPressure.textContent = `${weergegevens.currentPressure} hPa`;
  currentHumidity.textContent = `${weergegevens.currentHumidity}%`;
  currentCloudcover.textContent = `cover: ${weergegevens.currentCloudCover}%`;
  currentUV.textContent = `UV-index: ${weergegevens.currentUV}`;
}

function displayPrediction(prediction) {
  prediction.forEach((dag, index) => {
    console.log(index, dag.tempmax);
    const containerPrediction = document.querySelector(".container-prediction");
    const dagContainer = document.createElement("div");
    let datum;
    if (index === 0) {
      datum = "Today";
    } else if (index === 1) {
      datum = "Tomorrow";
    } else {
      datum = new Date(dag.datetime).toLocaleDateString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
    }
    const predDate = document.createElement("p");
    const datumTitel = new Date(dag.datetime);
    if (datumTitel.getDay() === 6 || datumTitel.getDay() === 0) {
      predDate.classList.add("pred-date", "weekend");
    } else {
      predDate.classList.add("pred-date", "weekdag");
    }

    predDate.textContent = datum;
    dagContainer.classList.add("dag-container", `dag-${index}`);
    dagContainer.append(predDate);
    //
    // ikoon voorspelling
    const icon = kiesIcoon(dag.icon);
    const predIcon = document.createElement("img");
    predIcon.src = `https://cdn.jsdelivr.net/gh/basmilius/weather-icons/production/fill/all/${icon}`;
    dagContainer.append(predIcon);
    //
    //temp voorspelling
    const predTemp = document.createElement("div");
    predTemp.classList.add("pred-temp");
    const tempMin = document.createElement("p");
    tempMin.classList.add("temp-min");
    const scheiding = document.createElement("p");
    scheiding.textContent = "|";
    const tempMax = document.createElement("p");
    tempMax.classList.add("temp-max");
    tempMin.textContent = formatter.format(Math.round(dag.tempmin));
    tempMax.textContent = formatter.format(Math.round(dag.tempmax));
    predTemp.append(tempMin, scheiding, tempMax);
    dagContainer.append(predTemp);
    //
    // wind voorspellen
    const predWind = document.createElement("div");
    predWind.classList.add("pred-wind");
    const predWindsymbol = document.createElement("i");
    predWindsymbol.classList.add(
      "wi",
      "wi-wind",
      `from-${Math.round(dag.winddir)}-deg`,
    );
    predWind.append(predWindsymbol);
    dagContainer.append(predWind);
    //
    // neerslag voorspellen
    const predRain = document.createElement("div");
    predRain.classList.add("pred-rain");
    const predRegendruppel = document.createElement("i");
    predRegendruppel.classList.add("pred-regendruppel", "wi", "wi-raindrops");
    const predRainValue = document.createElement("p");
    predRainValue.classList.add("pred-rain-value");
    predRainValue.textContent = `${dag.precip} mm`;
    predRain.append(predRegendruppel, predRainValue);
    dagContainer.append(predRain);
    //
    //sunrise & sunset
    const sunriseAndSet = document.createElement("div");
    sunriseAndSet.classList.add("sunrise-sunset");
    const sunrise = document.createElement("div");
    sunrise.classList.add("sunrise");
    const sunset = document.createElement("div");
    sunset.classList.add("sunset");
    const sunriseSymbol = document.createElement("i");
    sunriseSymbol.classList.add("wi", "wi-sunrise");
    const sunsetSymbol = document.createElement("i");
    sunsetSymbol.classList.add("wi", "wi-sunset");

    const sunriseTime = document.createElement("p");
    sunriseTime.classList.add("sunrise-time");
    sunriseTime.textContent = dag.sunrise;

    const sunsetTime = document.createElement("p");
    sunsetTime.classList.add("sunset-time");
    sunsetTime.textContent = dag.sunset;

    sunrise.append(sunriseSymbol, sunriseTime);
    sunset.append(sunsetSymbol, sunsetTime);

    sunriseAndSet.append(sunrise, sunset);
    dagContainer.append(sunriseAndSet);

    containerPrediction.append(dagContainer);
  });
}

init("Maldegem, Vlaanderen");
