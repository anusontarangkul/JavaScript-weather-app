const APIkey = "54f5d77c61f7b7d7da7d2c41a2956900";
const url = "http://api.openweathermap.org/data/2.5/weather?q=";


$(document).ready(function () {

    const searchCity = (e) => {
        e.preventDefault();
        let currentCity = $("#enter-city").val();
        console.log(currentCity)
        $("#enter-city").val("");
        fetchCity(currentCity)
    }

    const fetchCity = (city) => {
        let weatherURL = `${url + city}&appid=${APIkey}`
        fetch(weatherURL)
            .then(res => res.json())
            .then(data => console.log(data))
    }

    // pressing search icon or on enter.
    $(".fa-search").on("click", searchCity)
    $("#search").submit(searchCity)


});