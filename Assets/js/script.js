$(document).ready(function () {

    //OpenWeather API
    let apiKey = 'caa08d33277dd57f7467bcfe8447c0dc';
    console.log(apiKey);


    // Selectors for HTML elements to display weather information
    const cityEl = $('h2#city');
    const dateEl = $('h3#date');
    const weatherIconEl = $('img#weather-icon');
    const temperatureEl = $('span#temperature');
    const humidityEl = $('span#humidity');
    const windEl = $('span#wind');
    const cityListEl = $('div.cityList');


    // Selector for form elements
    const cityInput = $('#city-input');


    // Store past searched citites
    let pastCities = [];


    // Helper function to sort cities from https://www.sitepoint.com/sort-an-array-of-objects-in-javascript/
    function compare(a, b) {
        //Use toUpperCase() to ignore characker casing
        let cityA = a.city.toUpperCace();
        console.log(cityA);
        let cityB = b.city.toUpperCase();
        console.log(cityB);


        let comparison = 0;
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
        let storedCities = JSON.parse(localStorage.getItem('pastCities'));
        if (storedCities) {
            pastCities = storedCities;
        }
    }
    console.log(loadCities);


    // Store searched cities in local storage
    function storeCities() {
        localStorage.setItem('pastCities', JSON.stringify(pastCities));
    }


    // Function to build the URL for the OpenWeather API call

    function buildUrlFromInputs(city) {
        return `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    }

    function buildUrlFromId(id) {
        return `https://api.openweathermap.org/data/2.5/weather?id=${id}&appid=${apiKey}`;
    }

    // Function to display the last 5 searched cities
    function displayCities(pastCities) {

        cityListEl.empty();
        pastCities.splice(5);
        let sortedCities = [...pastCities];
        sortedCities.sort(compare);
        sortedCities.forEach(function (location) {
            let cityDiv = $('<div>').addClass('col-12 city');
            let cityBtn = $('<button>').addClass('btn btn-light city-btn').text(location.city);
            cityDiv.append(cityBtn);
            cityListEl.append(cityDiv);
        });

    }

    // Function to color for the UV Index based on EPS color scale: https://www.epa.gov/sunsafety/uv-index-scale-0
    function setUVIndexColor(uvi) {
        if (uvi < 3) {
            return 'green';
        } else if (uvi >= 3 && uvi < 6) {
            return 'yellow';
        } else if (uvi >= 6 && uvi < 8) {
            return 'orange';
        } else if (uvi >= 8 && uvi < 11) {
            return 'red';
        } else return 'purple';

    }


    // Search for weather conditions by calling the OpenWeather API

    function searchWeather(queryURL) {

        // Create an AJAX call to retrieve weather data
        $.ajax({
            url: queryURL,
            method: 'GET'
        }).then(function (response) {
            console.log(queryURL);


            // Store current city in past cities
            let city = response.name;
            let id = response.id;

            // Remove duplicate cities
            // if (pastCities[0]) {
            //     pastCities = $.prep(pastCities, function (storedCity) {
            //         return id != storedCity.id;
            //     })
            // }
            pastCities.unshift({ city, id });
            // storeCities();
            //displayCities(pastCities);
            console.log(pastCities);

            // Display current weather in DOM elements
            cityEl.text(response.name);
            let formattedDate = moment.unix(response.dt).format('L');
            dateEl.text(formattedDate);
            let weatherIcon = response.weather[0].icon;
            weatherIconEl.attr('src', `http://openweathermap.org/img/wn/${weatherIcon}.png`).attr('alt', response.weather[0].description);
            temperatureEl.html(((response.main.temp - 273.15) * 1.8 + 32).toFixed(1));
            humidityEl.text(response.main.humidity);
            windEl.text((response.wind.speed * 2.237).toFixed(1));

            // Call OpenWeather API OneCall with lat and lon to get to UV index and 5 day forecast
            let lat = response.coord.lat;
            let lon = response.coord.lon;
            //let queryURLAll = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            let queryURLAll = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;
            console.log(queryURLAll);
            console.log(lat);
            console.log(lon);
            $.ajax({
                url: queryURLAll,
                method: 'GET'
            }).then(function (response) {
                console.log(response);

                let fiveDay = response.list;
                // Display 5 day forecast in DOM elements
                for (let i = 0; i <= 5; i++) {
                    let currDay = fiveDay[i];
                    $(`div.day-${i} .card-title`).text(moment.unix(currDay.dt).format('L'));
                    $(`div.day-${i} .fiveDay-img`).attr(
                        'src',
                        `http://openweathermap.org/img/wn/${currDay.weather[0].icon}.png`
                    ).attr('alt', currDay.weather[0].description);
                    $(`div.day-${i} .fiveDay-temp`).text(((currDay.main.temp - 273.15) * 1.8 + 32).toFixed(1));
                    $(`div.day-${i} .fiveDay-humid`).text(currDay.main.humidity);

                }
            });
        });

    }


    // Function to display the last searched city
    function displayLastSearchedCity() {
        if (pastCities[0]) {
            let queryURL = buildUrlFromId(pastCities[0].id);
            searchWeather(queryURL);
        } else {
            // if no past searched cities, load Detroid weather data
            let queryURL = buildUrlFromInputs("Detroit");
            searchWeather(queryURL);
            console.log(buildUrlFromInputs);
        }
    }

    // Click handler for each button
    $('#search-btn').on('click', function (event) {
        //Preventong the button from trying to submit the form
        event.preventDefault();

        // Retrieving and scrubbing the city from the inputs
        let city = cityInput.val().trim();
        city = city.replace(' ', '%20');

        // Clear the the input fields
        cityInput.val('');

        // Build the query url with the city and searchWeather
        if (city) {
            let queryURL = buildUrlFromInputs(city);
            searchWeather(queryURL);
        }
    });

    // Click handler for city buttons to load that city's weather
    $(document).on("click", "button.city-btn", function (event) {
        let clickedCity = $(this).text();
        let foundCity = $.grep(pastCities, function (storedCity) {
            return clickedCity === storedCity.city;
        })
        let queryURL = buildUrlFromId(foundCity[0].id)
        searchWeather(queryURL);
    });

    // Initializing - when page loads

    // load any cities in local storage into array

    //loadCities();
    //displayCities(pastCities);

    // Display weather for last searched city
    displayLastSearchedCity();


});
