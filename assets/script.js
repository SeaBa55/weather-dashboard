// OpenWeather API Key 
var key = "63bf744b035f495cccad8662678a851d";

// populate recent cities area from localstorage on page start
recentCities();

// function call currentWeather passes last searched city name from local storage - makes open weather api call to display the current weather for last searched 
currentWeather(localStorage.getItem("last_searched"));


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

    // set last_searched key word with currently selected city name as value in local storage
    localStorage.setItem("last_searched",city);

    // function call displayCurrent passes city name to display current weather from local storage
    displayCurrnet(city);

    // function call display5Day passes city name to display 5-day weather forecast from local storage
    display5Day(city);

});


// function currentWeather makes open weather api call with whatever valid city name it is passed
function currentWeather(city) {

    // querry url for open weather api call
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial" + "&appid=" + key;

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
        
        // set last_searched key word with currently searched city name as value in local storage
        localStorage.setItem("last_searched",response.name);

        // function call oneCall creates a new open weather instance to get current weather, and 7 day forecast w/ uv index
        oneCall(response);

    });

}


// function oneCall creates a new open weather instance to get current weather, and 7 day forecast w/ uv index, and adds the previous call's city name value to the new object structure
function oneCall(r) {

    // querry url for open weather one-call api - uses lat and lon form previous api call response structure
    var queryURL = "https://api.openweathermap.org/data/2.5/onecall?" + "&appid=" + key + "&lat=" + r.coord.lat + "&lon=" + r.coord.lon + "&units=imperial&exclude=hourly,minutely";

    // ajax call to the open weather api - fetch(queryURL) may also be used for this pourpose
    $.ajax({
        async: true,
        crossDomain: true,
        url: queryURL,
        method: "GET"
    })
    
    // promise - on api responce execute the following
    .then(function(response) {

        // add city name (r.name) value to current api responce object structure, from original api call response "r" and overwrite r
        r = Object.assign({name:r.name}, response)
        
        // write accumulated api data for currrent city to local storage as JSON string, with the city name as the key word
        localStorage.setItem(r.name,JSON.stringify(r));

        // function call recentCities adds city name from local storage to recent cities area as list button
        recentCities();

        // function call displayCurrent passes city name to display from local storage
        displayCurrnet(r.name);

        // function call display5Day passes city name to display 5-day forecast from local storage
        display5Day(r.name);

    });

};


// function display5Day displays 5-day forecast weather data from local storage to the 5-day forecast weather area
function display5Day(r) {

    // get local storage data for the local storage key that matches city name and save to forecastConditions as object
    var forecastConditions = JSON.parse(localStorage.getItem(r));

    $("#forcast-5day-container").empty();

    // loop for 6 of the 8 availible daily forecast object arrays - todays forecast + 5 days
    for (i=0; i < 6; i++) {

        // create 5-day forecast display elements
        // note: do not change 5-day forecast display elements var names without changing all associated id names in the loop - may generate confusion
        var card5dFrcstSize = $("<div>");    
        var card5dFrcst = $("<div>");
        var card5dFrcstHdr = $("<div>");
        var card5dFrcstBdy = $("<div>");
        var card5dFrcstIcn = $("<div>");
        var card5dIcnDiv = $("<div>");
        var card5dFrcstTmp = $("<div>");
        var card5dFrcstRH = $("<div>");

        // if on the first loop itteration, we are processing the current date's forecast card - add class hide to remove it from viewport
        if (i == 0) {

            // format 5-day first forecast card appearance with class "hide" to remove it form viewport
            $(card5dFrcstSize).addClass('hide');

        }

        // format 5-day forecast card appearances using bootstrap classes
        $(card5dFrcstSize).addClass('col-lg-2 col-md-4 col-sm-3 mb-4 card5day');

        // give each 5-day forecast card container a unique id using the loop ittaration parameter - "day-i"
        $(card5dFrcstSize).attr("id", "day" + "-" + i);

        // append card5dFrcstSize div to forecast-5day-container
        $("#forcast-5day-container").append(card5dFrcstSize);


        // format 5-day forecast card text and background appearances using bootstrap classes
        $(card5dFrcst).addClass('card text-white bg-info');

        // give each 5-day forecast card a unique id using the loop ittaration parameter - "card5dFrcst-i"
        $(card5dFrcst).attr("id", "card5dFrcst" + "-" + i);

        // append card5dFrcst card to card5dFrcstSize (day-i) container
        $(card5dFrcstSize).append(card5dFrcst);


        // format 5-day forecast card header text and appearances using bootstrap & custom CSS classes
        $(card5dFrcstHdr).addClass('card-header card5day-header');

        // give each 5-day forecast card header a unique id using the loop ittaration parameter - "card5dFrcstHdr-i" - **removed this line if unused**
        $(card5dFrcstHdr).attr("id", "card5dFrcstHdr" + "-" + i);

        // get date (MM/DD) using moment-timezone.js
        date = moment.unix(forecastConditions.daily[i].dt).tz(forecastConditions.timezone).format('MM/DD');

        // give each 5-day forecast card header date text - **need to create the date with moment-timezone** 
        $(card5dFrcstHdr).text(date);

        // append card5dFrcstHdr card to card5dFrcst (card5dFrcst-i) container
        $(card5dFrcst).append(card5dFrcstHdr);


        // format 5-day forecast card body appearances using bootstrap and custum CSS classes
        $(card5dFrcstBdy).addClass('card-body single-day-body');

        // give each 5-day forecast card a unique id using the loop ittaration parameter - "card5dFrcstBdy-i"
        $(card5dFrcstBdy).attr("id", "card5dFrcstBdy" + "-" + i);

        // append card5dFrcstBdy card to card5dFrcst (card5dFrcst-i) container
        $(card5dFrcst).append(card5dFrcstBdy);


        // format 5-day forecast card weather icon row div appearances using bootstrap & custom CSS classes - my row is a development only custom CSS class used for visualizing containers during initial front-end development
        $(card5dFrcstIcn).addClass('row my-row');

        // give each 5-day forecast card weather icon row div a unique id using the loop ittaration parameter - "card5dFrcstIcn-i" - **removed this line if unused**
        $(card5dFrcstIcn).attr("id", "card5dFrcstIcn" + "-" + i);

        // append card5dFrcstIcn row div to card5dFrcstBdy (card5dFrcstBdy-i) container
        $(card5dFrcstBdy).append(card5dFrcstIcn); 


        // format 5-day forecast card weather col div appearances using bootstrap & custom CSS classes - my col is a development only custom CSS class used for visualizing containers during initial front-end development
        $(card5dIcnDiv).addClass('col-12 my-col justify-content-center');

        // give each 5-day forecast card weather icon div a unique id using the loop ittaration parameter - "card5dIcnDiv-i" - **removed this line if unused**
        $(card5dIcnDiv).attr("id", "card5dIcnDiv" + "-" + i);

        // create weather icon image source url with current weather icon - **need to find the proper way to get icon**
        var imgURL = "https://openweathermap.org/img/wn/" + forecastConditions.daily[i].weather[0].icon + ".png";

        // append current weather icon image from url to card5dIcnDiv-i div
        $(card5dIcnDiv).append('<img src =' + imgURL + '>');

        // append card5dFrcstIcn col div to card5dFrcstIcn row div (card5dFrcstIcn-i) container
        $(card5dFrcstIcn).append(card5dIcnDiv);

        
        // format 5-day forecast card temperature div appearances using bootstrap & custom CSS classes - my row is a development only custom CSS class used for visualizing containers during initial front-end development
        $(card5dFrcstTmp).addClass('row my-row');

        // give each 5-day forecast card temperature div a unique id using the loop ittaration parameter - "card5dFrcstTmp-i" - **removed this line if unused**
        $(card5dFrcstTmp).attr("id", "card5dFrcstTmp" + "-" + i);

        // get the day temperature for the current date with no decemal place
        var Temp = (forecastConditions.daily[i].temp.day).toFixed(0);

        // give each 5-day forecast card temperature div text reflecting the temperature for that date 
        $(card5dFrcstTmp).text("Temp: " + Temp + String.fromCharCode(176) + "F");

        // append card5dFrcstTmp div to card5dFrcstBdy (card5dFrcstBdy-i) container
        $(card5dFrcstBdy).append(card5dFrcstTmp);


        // format 5-day forecast card relative humidity div appearances using bootstrap & custom CSS classes - my row is a development only custom CSS class used for visualizing containers during initial front-end development
        $(card5dFrcstRH).addClass('row my-row');

        // give each 5-day forecast card relative humidity div a unique id using the loop ittaration parameter - "card5dFrcstRH-i" - **removed this line if unused**
        $(card5dFrcstRH).attr("id", "card5dFrcstRH" + "-" + i);

        // get relative humidity for the current date with no decemal place
        var RH = forecastConditions.daily[i].humidity;

        // give each 5-day forecast card relative humidity div text reflecting the relative humidity for that date 
        $(card5dFrcstRH).text("RH: " + RH + "%");

        // append card5dFrcstRH div to card5dFrcstBdy (card5dFrcstBdy-i) container
        $("#card5dFrcstBdy" + "-" + i).append(card5dFrcstRH);

    }

}


// function recentCities adds city name from local storage to recent cities area as list button
function recentCities () {

    // clear all children of the recent cities container - without this the recentCities function would append duplicate buttons to recentCities if a city was search more than once
    $("#recent-cities-btns").empty();
    
    // loop through local storage to append buttons with local storage keys as their names - guarantee's that follow logic will not execute if local storage is empty
    for ( i=0 ; i < localStorage.length ; i++ ) {
        
        // this conditional enables the storage of other parameters in local storage without worry of creating a button for it
        if(isJSONcity(i)){
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

    }

};

// function isJSONcity validates if the expression "local storage key value equals city name value (in its corresponding structure)" can be evaluated for each ittertion through localstorage
function isJSONcity(i) {

    try {

        // if local storage key value is equal to the city name (in its corresponding structure) is evaluated, then return true
        JSON.parse(localStorage.getItem(localStorage.key(i))).name == localStorage.key(i);

        return true;

    } catch (error) {
        
        // if local storage key value is equal to the city name (in its corresponding structure) generates console error, then return false

        return false;

    }

}

// function displayCurrent displays weather data from local storage to the current weather area
function displayCurrnet(city) {

    // loop through local storage to find the local storage key that matches the city name passed into the function
    for ( i=0 ; i < localStorage.length ; i++ ) {

        // compare the current local storage key to the city name passed into the function - execute on true
        if (city == localStorage.key(i)) {

            // get local storage data for the local storage key that matches city and save to currentConditions as object
            var currentConditions = JSON.parse(localStorage.getItem(localStorage.key(i)));

            // get temperature data form currentConditions object - singe digit precision 
            var currentTemp = (currentConditions.current.temp).toFixed(1);

            // get current date using moment.js
            var currentDate = moment().format('dddd')+", "+moment().format('MMMM Do YYYY');

            // create weather icon image source url with current weather icon
            var imgURL = "https://openweathermap.org/img/wn/" + currentConditions.current.weather[0].icon + "@2x.png";
           
            // clear previous weather icon image from current-weather-icon div
            $("#current-weather-icon").empty();

            // append current weather icon image from url to current-weather-icon div
            $("#current-weather-icon").append('<img src =' + imgURL + '>');

            // Display current city and date
            $("#current-city-date").text(currentConditions.name + " - " + currentDate);

            // Temperature Display
            $("#current-temp").text("Temperature: " + currentTemp + String.fromCharCode(176) + "F");

            // Relative Humidity Display
            $("#current-humidity").text("Humidity: " + currentConditions.current.humidity + "%");

            // Wind Speed Display
            $("#current-wind").text("Wind Speed: " + currentConditions.current.wind_speed + " mph");
            
            var uvi = currentConditions.current.uvi;

            // UV Index Display
            $("#current-uvi").text("UV Index: " + uvi);

            // remove any existing bootstrap button color classes from badge
            $("#current-uvi").removeClass("badge-success badge-warning badge-danger");

            // if uvi is less than 3 set badge color to low (success)
            if(uvi < 3){
                $("#current-uvi").addClass("badge-success");
                // else if uvi is greater than or equal to 3 and less than 8 set badge color to moderate (warning)  
            }else if(uvi >= 3 && uvi < 8){
                $("#current-uvi").addClass("badge-warning");
            }else{
                // else set color to high (danger) 
                $("#current-uvi").addClass("badge-danger");
            }

        }

    }

};