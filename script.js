async function findUserLocation() {
    const location = document.getElementById('userLocation').value;
    const unit = document.getElementById('converter').value.includes('°C') ? 'metric' : 'imperial';
    const apiKey = '6a27700e312300262228ce349111df39';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=${unit}&appid=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (response.ok) {
            displayWeather(data, unit);
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
}


function displayWeather(data, unit) {
    document.querySelector('.weatherIcon').innerHTML = `<img src="https://openweathermap.org/img/wn/${data.weather[0].icon}.png" alt="${data.weather[0].description}"/>`;
    document.querySelector('.temperature').innerHTML = `${TemConverter(data.main.temp, unit)}`;
    document.querySelector('.feelsLike').innerHTML = `Feels like: ${TemConverter(data.main.feels_like, unit)}`;
    document.querySelector('.description').innerHTML = data.weather[0].description;
    document.querySelector('.date').innerHTML = new Date().toLocaleDateString();
    document.querySelector('.city').innerHTML = `${data.name}, ${data.sys.country}`;

    document.getElementById('HValue').innerHTML = `${data.main.humidity}<span>%</span>`;
    document.getElementById('WValue').innerHTML = `${Math.round(data.wind.speed)} ${unit === 'metric' ? 'm/s' : 'mph'}`;
    document.getElementById('SRValue').innerHTML = formatUnixTime(data.sys.sunrise, data.timezone, { hour: "numeric", minute: "numeric", hour12: true });
    document.getElementById('SSValue').innerHTML = formatUnixTime(data.sys.sunset, data.timezone, { hour: "numeric", minute: "numeric", hour12: true });
    document.getElementById('CValue').innerHTML = `${data.clouds.all}<span>%</span>`;
    document.getElementById('UVValue').innerHTML = 'N/A';
    document.getElementById('PValue').innerHTML = `${data.main.pressure}<span>hPa</span>`;

    fetch(Forecast + `lon=${data.coord.lon}&lat=${data.coord.lat}`);

}

function fetchWeeklyForecast(lat, lon, unit) {
    const apiKey = '6a27700e312300262228ce349111df39';
    const apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=${unit}&exclude=minutely,hourly&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const forecastContainer = document.querySelector('.Forecast');
            forecastContainer.innerHTML = '';

            data.daily.forEach((weather) => {
                let div = document.createElement('div');
                const dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
                div.innerHTML = `<strong>${new Date(weather.dt * 1000).toLocaleDateString(undefined, dateOptions)}</strong><br>`;
                div.innerHTML += `<img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="${weather.weather[0].description}"/>`;
                div.innerHTML += `<p class="forecast-desc">${weather.weather[0].description}<br>
                                    <span>${TemConverter(weather.temp.min, unit)} - ${TemConverter(weather.temp.max, unit)}</span></p>`;
                forecastContainer.appendChild(div);
            });
        });
}

function formatUnixTime(dtValue, offSet, options = {}) {
    const date = new Date((dtValue + offSet) * 1000);
    return date.toLocaleTimeString([], { timeZone: "UTC", ...options });
}


function getLongFormateDateTime(dtValue, offSet, options) {
    return formatUnixTime(dtValue, offSet, options);
}


function TemConverter(temp) {
    let tempValue = Math.round(temp);
    let message = "";
    if (converter.value == "°C") {
        message = tempValue + "<span>" + "\xB0C </span>";
    } else {
        let ctof = (tempValue * 9) / 5 + 32;
        message = ctof + "<span>" + "\xB0F </span>";
    }
    return message;
}

document.querySelector('.fa-search').addEventListener('onclick', findUserLocation);