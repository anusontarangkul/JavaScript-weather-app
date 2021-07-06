const APIkey = "54f5d77c61f7b7d7da7d2c41a2956900";
const url = "http://api.openweathermap.org/data/2.5/weather?q=";
let citiesArray = [];


$(document).ready(function () {


    const searchCity = (e) => {
        e.preventDefault();
        let currentCity = $("#enter-city").val();
        console.log(currentCity)
        $("#enter-city").val("");
        recentSearch(currentCity);
        // fetchCity(currentCity)
    }

    // const fetchCity = (city) => {
    //     let weatherURL = `${url +city}&appid=${APIkey}`
    //     fetch(weatherURL)
    //         .then(res => res.json())
    //         .then(data => console.log(data))
    // }

    const recentSearch = (search) => {
        let newButton = $('<button/>',
            {
                text: search,
                "class": "recent-btn"
            })
        $("#history-container").append(newButton);
        citiesArray.push(search)
        localStorage.setItem("savedCities", citiesArray)
    }

    const loadSearch = () => {
        let citiesToLoad = localStorage.getItem("savedCities");
        let citiesToLoadArray = citiesToLoad.split(",")
        console.log(citiesToLoadArray)

        console.log(typeof citiesToLoadArray)
        citiesToLoadArray.forEach(city => recentSearch(city))
    }
    loadSearch();
    // pressing search icon or on enter.
    $(".fa-search").on("click", searchCity)
    $("#search").submit(searchCity)


});