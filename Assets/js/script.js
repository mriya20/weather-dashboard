$(document).ready(function () {
    console.log("ready");
    //OpenWeather API
    const apiKey = '767baab1ba615005b7b57e268ed513fe';

    // Selectors for HTML elements to display weather information
    const cityEl = $('h2#city');
    console.log(cityEl);
    const dateEl = $('h3#date');
    console.log(dateEl);
    const weatherIconEl = $('img#weather-icon');
    console.log(weatherIconEl);
    const temperatureEl = $('span#temperature');
    console.log(temperatureEl);
    const humidityEl = $('span#humidity');
    console.log(humidityEl);
    const windEl = $('span#wind');
    console.log(windEl);
    const uvIndexEl = $('span#uv-index');
    console.log(uvIndexEl);
    const cityListEl = $('div.cityList');
    console.log(cityListEl);

    // Selector for form elements
    const cityInput = $('#city-input');
    console.log(cityInput);

    // Store past searched citites
    let pastCities = [];
    console.log(pastCities);

    // Helper function to sort cities from https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
    function compare(a, b) {
        console.log(compare);
        //Use toUpperCase() to ignore characker casing
        const cityA = a.city.toUpperXace();
        console.log(cityA);
        const cityB = b.city.toUpperCase();
        console.log(cityB);

        let comparison = 0;
        console.log(comparison);
        if (cityA > cityB) {
            comparison = 1;
        } else if (cityA < cityB) {
            comparison = -1;
        }
        return comparison;
    }

    // Local storage functions for past searched cities

    // Load events from local storage
    function loadCities() {
        console.log(loadCities);
        const storedCities = JSON.parse(localStorage.getItem('pastCities'));
        if (storedCities) {
            pastCities = storedCities;
        }
    }


}
);