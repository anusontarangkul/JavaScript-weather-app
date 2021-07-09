const APIkey = "54f5d77c61f7b7d7da7d2c41a2956900";
const url = "http://api.openweathermap.org/data/2.5/weather?q=";
let citiesArray = [];


$(document).ready(function () {

    // Search city
    const searchCity = (e) => {
        e.preventDefault();
        let currentCity = $("#enter-city").val().trim();
        currentCity = currentCity.replace(/^.{1}/g, currentCity[0].toUpperCase());
        $("#enter-city").val("");
        fetchCity(currentCity)
    }

    // Makes API call to get coordinates
    const fetchCity = (city) => {
        let weatherURL = `${url + city}&appid=${APIkey}`
        fetch(weatherURL)
            .then(res => {
                if (!res.ok) throw res;
                return res.json()
            })
            .then(data => {
                getCoord(data)
                recentSearch(city);
            })
            .catch(err => {
                console.log(err)
                noCity(city);
            })
    }

    // Creating recent search buttons, add local storage, click search function
    const recentSearch = (search) => {
        citiesArray.push(search)
        let newButton = $(`<button/>`,
            {
                text: search,
                "class": "recent-btn"
            }).appendTo("#history-container")
        newButton.click(function () {
            let recentCity = $(this).text()
            $(this).remove();
            citiesArray = citiesArray.filter(city => city !== recentCity)
            fetchCity(recentCity);
        })

        localStorage.setItem("savedCities", citiesArray)
    }

    // Loading saved Cities on open
    const loadSearch = () => {
        let citiesToLoad = localStorage.getItem("savedCities");
        if (citiesToLoad) {
            let citiesToLoadArray = citiesToLoad.split(",")
            citiesToLoadArray.forEach(city => recentSearch(city))

        }
    }

    // Second API call using coordinates because additional info needed.
    const getCoord = (data) => {
        let lat = data.coord.lat;
        let lon = data.coord.lon;
        let cityName = data.name;
        const coordCall = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${APIkey}`
        fetch(coordCall)
            .then(res => {
                if (!res.ok) throw res;
                return res.json()
            })
            .then(data => {
                data.name = cityName;
                displayTemp(data);

            })
            .catch(err => {
                console.log(err)
            })
    }

    // Dynamically creating div to display weather using API data
    const displayTemp = (data) => {
        let cityName = data.name;
        let currentDate = moment().format("MM/DD/YYYY");
        let tempF = convertToF(data.current.temp);
        let humidity = data.current.humidity;
        let wind = data.current.wind_speed;
        let uvi = data.current.uvi;
        let forecast = data.daily;
        let icon = `http://openweathermap.org/img/wn/${data.current.weather[0].icon}@2x.png`
        console.log(icon)
        console.log("forecast")
        console.log(forecast)
        const getForecast = (dailyArray) => {
            let forecast = ""
            for (let i = 1; i <= 5; i++) {
                let forecastDate = moment().add(i, 'days').format("MM/DD/YYYY");
                let futureTempF = convertToF(dailyArray[i].temp.day);
                let forecastHumidity = dailyArray[i].humidity;
                let forecastIcon = `http://openweathermap.org/img/wn/${dailyArray[i].weather[0].icon}@2x.png`;
                forecast += `<div class="forecast-card">
                                <h5>${forecastDate}</h5>
                                <img src="${forecastIcon}" alt=""/>
                                <p>${futureTempF}&#8457</p>
                                <p>${forecastHumidity}%</p>
                            </div>    
                            `
            }
            return forecast;
        }

        $("#current-city").html(`
        <div id="city-temp">
            <h3>${cityName} (${currentDate})  <img src="${icon}" alt=""/></h3>
            <p>Temperature: ${tempF}&#8457</p>
            <p>Humidity: ${humidity}%</p>
            <p>Wind Speed: ${wind}mph</p>
            <p >UV Index: <span class="${checkUV(uvi)}">${uvi}</span></p>
        </div>
        <div id=display-forecast>
            <h4>5-Day Forecast:</h4>
            <div id="forecast-container">
            ${getForecast(forecast)}
            </div>
        </div
        `)
    }

    // Error handling if city doesn't exist
    const noCity = (city) => {
        $("#current-city").html(`
        <div id="city-temp">
            <h3>Sorry, ${city} is not found</h3>

        </div>
        `
        )
    }

    // Convert Kelvin to Farenheit
    const convertToF = (temp) => {
        return Math.floor((temp - 273.15) * 9 / 5 + 32)
    }

    // Color coding uv
    const checkUV = (uv) => {
        if (uv <= 2) {
            return "uv-low"
        } else if (uv >= 6) {
            return "uv-high"
        } else {
            return "uv-mod"
        }
    }

    loadSearch();
    $(".fa-search").on("click", searchCity)
    $("#search").submit(searchCity)

});