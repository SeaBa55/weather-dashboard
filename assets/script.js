// OpenWeather API Key 
var key = "63bf744b035f495cccad8662678a851d";

// mitigate cors issues by prepending heroku proxy to api call url - still poorly understood how to mitigate without heroku work-around
var corsAnywhere = "https://cors-anywhere.herokuapp.com/";

// populate recent cities area from localstorage on page start
recentCities();


// search button div event listener to make open weather api call
$(".search").on("click", function() {

    // get text from corresponding sibling div and save it to var "city" 
    var city = $(this).siblings(".form-control").val();
    
    // clear text input feild - displays placeholder value
    $(this).siblings(".form-control").val("");

    // function call currentWeather makes open weather api call with input paramerter city derived from user input
    currentWeather(city);

});


// recent cities div event listener to make open weather api call
$("#recent-cities-btns").on("click", function() {

    // get city name from target id and save it to var "city" 
    var city = event.target.id;

    // function call displayCurrent passes city name to display from local storage
    displayCurrnet(city);

});


// function currentWeather makes open weather api call with whatever valid city name it is passed
function currentWeather(city) {

    // querry url for open weather api call
    var queryURL = corsAnywhere + "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + key;

    // ajax call to the open weather api - fetch(queryURL) may also be used for this pourpose
    $.ajax({
        async: true,
        crossDomain: true,
        url: queryURL,
        method: "GET",
    })
    
    // promise - on api responce, execute the following
    .then(function(response) {
        
        // validation criteria for faulty search input - api did not understand city querry
        if(response.status == 404){
    
            // change this to on page validation - debug only
            alert("Please type valid city");
        
        }

        // function call uvIndex adds uv index to response object structure
        uvIndex(response);

    });

}


// function uvIndex makes separate open weather api call to get uv index, and adds uv index to response object structure
function uvIndex(r) {

    // querry url for open weather uv index api call - uses lat and lon form previous api call response structure
    var queryURL = corsAnywhere + "http://api.openweathermap.org/data/2.5/uvi?" + "&appid=" + key + "&lat=" + r.coord.lat + "&lon=" + r.coord.lon;

    // ajax call to the open weather api - fetch(queryURL) may also be used for this pourpose
    $.ajax({
        async: true,
        crossDomain: true,
        url: queryURL,
        method: "GET"
    })
    
    // promise - on api responce execute the following
    .then(function(response) {
    
        // add uv index (uvi) value to original api cal responce "r", and overwrite response
        response = Object.assign({uvi:response.value}, r);
        
        // write api responce structure to local storage as JSON string, with the city name as the key word
        localStorage.setItem(response.name,JSON.stringify(response));

        // function call recentCities adds city name from local storage to recent cities area as list button
        recentCities();
        
        // function call displayCurrent passes city name to display from local storage
        displayCurrnet(response.name);

    });

};


// function recentCities adds city name from local storage to recent cities area as list button
function recentCities () {

    // clear all children of the recent cities container - without this the recentCities function would append duplicate buttons to recentCities if a city was search more than once
    $("#recent-cities-btns").empty();
    
    // loop through local storage to append buttons with local storage keys as their names 
    for ( i=0 ; i < localStorage.length ; i++ ) {

        // create button element
        let button = $("<button>");

        // format button appearance using bootstrap classes 
        $(button).addClass('list-group-item list-group-item-action');

        // give each button a unique id using the current local storage key, which is also the city name it represents
        $(button).attr("id", localStorage.key(i));

        // give button attribute type button
        $(button).attr("type", "button");

        // give each button a unique label text using the current local storage key, which is also the city name it represents
        $(button).text(localStorage.key(i));

        // append button to recent cities div area
        $("#recent-cities-btns").append(button);

    }

};


// function displayCurrent displays weather data from local storage to the current weather area
function displayCurrnet(city) {

    // loop through local storage to find the local storage key that matches the city name passed into the function
    for ( i=0 ; i < localStorage.length ; i++ ) {

        // compare the current local storage key to the city name passed into the function - execute on true
        if (city == localStorage.key(i)) {

            // get local storage data for the local storage key that matches city and save to currentConditions as object
            var currentConditions = JSON.parse(localStorage.getItem(localStorage.key(i)));

            // get temperature data form currentConditions object and convert form deg K to deg F with singe digit precision 
            var currentTemp = (((currentConditions.main.temp-273.15)*(9/5))+32).toFixed(1);

            // get current date using moment.js
            var currentDate = moment().format('dddd')+", "+moment().format('MMMM Do YYYY');

            // create weather icon image source url with current weather icon
            var imgURL = corsAnywhere + "http://openweathermap.org/img/wn/" + currentConditions.weather[0].icon + "@2x.png";
           
            // clear previous weather icon image from current-weather-icon div
            $("#current-weather-icon").empty();

            // append current weather icon image from url to current-weather-icon div
            $("#current-weather-icon").append('<img src =' + imgURL + '>');

            // Display current city and date
            $("#current-city-date").text(currentConditions.name + " - " + currentDate);

            // Temperature Display
            $("#current-temp").text("Temperature: " + currentTemp + String.fromCharCode(176) + "F");

            // History Display
            $("#current-humidity").text("Humidity: " + currentConditions.main.humidity + "%");

            // Wind Speed Display
            $("#current-wind").text("Wind Speed: " + currentConditions.wind.speed + "mph");
            
            // UV Index Display
            $("#current-uvi").text("UV Index: " + currentConditions.uvi);

        }

    }

};



