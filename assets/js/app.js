const APIkey = "54f5d77c61f7b7d7da7d2c41a2956900";
const url = "http://api.openweathermap.org/data/2.5/weather?q=";
let citiesArray = [];


$(document).ready(function () {


    const searchCity = (e) => {
        e.preventDefault();
        let currentCity = $("#enter-city").val().trim();
        currentCity = currentCity.replace(/^.{1}/g, currentCity[0].toUpperCase());
        console.log(currentCity)
        $("#enter-city").val("");


        fetchCity(currentCity)
    }

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
                console.log(data)
            })
            .catch(err => {
                console.log("error")
                console.log(err)
                noCity(city);
            })
    }

    const recentSearch = (search) => {
        let newButton = $(`<button/>`,
            {
                text: search,
                "class": "recent-btn"
            }).appendTo("#history-container")
        citiesArray.push(search)
        localStorage.setItem("savedCities", citiesArray)
    }

    const loadSearch = () => {
        let citiesToLoad = localStorage.getItem("savedCities");
        if (citiesToLoad) {
            let citiesToLoadArray = citiesToLoad.split(",")
            citiesToLoadArray.forEach(city => recentSearch(city))

        }
    }

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
                console.log(data)
                displayTemp(data);

            })
            .catch(err => {
                console.log(err)

            })

    }

    const displayTemp = (data) => {
        let cityName = data.name;

        let tempF = convertToF(data.current.temp);
        let humidity = data.current.humidity;
        let wind = data.current.wind_speed;
        let uvi = data.current.uvi;
        let forecast = data.daily;
        console.log("forecast")
        console.log(forecast)
        const getForecast = (dailyArray) => {
            let forecast = ""
            for (let i = 0; i <= 4; i++) {

                let futureTempF = convertToF(dailyArray[i].temp.day)
                forecast += `<p>${futureTempF}</p>`
            }
            return forecast;
        }

        // let kelvinTemp = 
        $("#current-city").html(`
        <div id="city-temp">
            <h3>${cityName}</h3>
            <p>Temperature: ${tempF}&#8457</p>
            <p>Humidity: ${humidity}</p>
            <p>Wind Speed: ${wind}</p>
            <p>UV Index: ${uvi}</p>
        </div>
        <div id=display-forecast>
            <h4>5-Day Forecast:</h4>
            ${getForecast(forecast)}
        </div
        `)


    }

    const noCity = (city) => {
        $("#current-city").html(`
        <div id="city-temp">
            <h3>Sorry, ${city} is not found</h3>

        </div>
        `
        )
    }

    const convertToF = (temp) => {
        return Math.floor((temp - 273.15) * 9 / 5 + 32)
    }
    loadSearch();
    // pressing search icon or on enter.
    $(".fa-search").on("click", searchCity)
    $("#search").submit(searchCity)


});