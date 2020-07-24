# 06 Server-Side APIs: Weather Dashboard

Developers are often tasked with retrieving data from another application's API and using it in the context of their own. Third-party APIs allow developers to access their data and functionality by making requests with specific parameters to a URL. Your challenge is to build a weather dashboard that will run in the browser and feature dynamically updated HTML and CSS.

Use the [OpenWeather API](https://openweathermap.org/api) to retrieve weather data for cities. The documentation includes a section called "How to start" that will provide basic setup and usage instructions. Use `localStorage` to store any persistent data.

## User Story

```
AS A traveler
I WANT to see the weather outlook for multiple cities
SO THAT I can plan a trip accordingly
```

## Acceptance Criteria

```
GIVEN a weather dashboard with form inputs
WHEN I search for a city
THEN I am presented with current and future conditions for that city and that city is added to the search history
WHEN I view current weather conditions for that city
THEN I am presented with the city name, the date, an icon representation of weather conditions, the temperature, the humidity, the wind speed, and the UV index
WHEN I view the UV index
THEN I am presented with a color that indicates whether the conditions are favorable, moderate, or severe
WHEN I view future weather conditions for that city
THEN I am presented with a 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, and the humidity
WHEN I click on a city in the search history
THEN I am again presented with current and future conditions for that city
WHEN I open the weather dashboard
THEN I am presented with the last searched city forecast
```

The following image demonstrates the application functionality:

![weather dashboard demo](./Assets/06-server-side-apis-homework-demo.png)

## Version History
weather-dashboard_v1.0 - Created basic site skeleton with nav bar, and footer.

weather-dashboard_v1.1 - Added card for the search area with a text input and search button with search icon (index.html lines 53-75); Added card containing flush list-group buttons with dummy cities (for styling reference) to the recent cities area (index.html lines 82-98); Added card containing skeleton for the current day forecast, with containers for the current wather icon, temperature, humidity, wind speed, and uv index (index.html lines 109-147); Added card container for the 5-day forecast, which houses cards containing rough skeletons for the date, weather icon, temperature, and humidity, for each of the days in the 5-day forecast (index.html lines 164-263).

weather-dashboard_v1.2 - Added functionality to the search bar, which initiates an open weather api call, populates a city button to the recent cities area, and displays current weather (script.js lines 9-20, 36-63, 67-95, 99-127, 130-175); Added "on-click" event listener to the recent cities div to disply localstorage weather data for the selected city (script.js lines 24-32).  

weather-dashboard_v1.3 - Removed uvIndex function and associate uv index open weather api call; Using the one-call open weather api in conjunction with moment-timezone.js we are able to make one api call to get both the 5 day forecast and uvi data; Added fucntion oneCall to get the 7-day forecast data from open weather and display5Day to display all pertinent info to the 5-day forecast area (script.js lines 35, 66, 91, 94, 100, 103, 111-245, 299, 314, 320); Removed all card containers for the 5-day forecast since I decsided to make them programmatically added (index.html lines 162-262). 

weather-dashboard_v1.4 - Added function call currentWeather which passes last searched city name from local storage, inorder to makes open weather api call to display the current weather for last searched upon page load. The last searched city is updated upon search in the currentWeather function call (to grab correct city name format from the api querry), and upon recent cities button selection (script.js lines 8,33,70); Added conditional if statment to the recent citties button creation loop inside the recentCities function, that enables storage of other parameters in local storage without the worry of creating a button for that item in local storage. Fucntion isJSONcity employs error handeling methods try/catch, to test if local storage key value equals city name value (in its corresponding structure) can be evaluated for each element in local storage. If the expression can be resolved it returns true, if the expression triggers a console error then catch returns false back to the conditional that gate keeps the creation of recent cities buttons (script.js lines 265, 291-308). 

weather-dashboard_v1.5 - Added pill badge around UV Index text in the current weather area, and created conditional statements that toggle the bage color to reflect the level of severity of the UV Index (index.html lines 139)(script.js lines 349-366); Added hide class to weather forcast and recent cities areas, when local storage is empty (scrip.js lines 8-20, 288).

## Wish List

Add delete buttons to all recently city buttons to remove them individualy from viewport.

Add a toggle button to all recently city buttons to select a default city to view.

Add functionality to 5-day forcast so that user can get a closer look at the weather for a particular day in the future by clicking on the respective display card.

Add call-back function that updates weather every hour, and displays last update timestamp

- - -
© 2019 Trilogy Education Services, a 2U, Inc. brand. All Rights Reserved.
