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
                displayTemp(city);
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

    const displayTemp = (city) => {
        $("#current-city").html(`
        <div id="city-temp">
            <h3>${city}</h3>
            <p>Temperature:</p>
            <p>Humidity:</p>
            <p>Wind Speed:</p>
            <p>UV Index:</p>
        </div>
        <div id=display-forecast>
            <h4>5-Day Forecast:</h4>
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
    loadSearch();
    // pressing search icon or on enter.
    $(".fa-search").on("click", searchCity)
    $("#search").submit(searchCity)


});