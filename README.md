# National Parks and Weather
A site that allows users to search for national parks (making calls to the NPS API) by keyword. Results listed will display basic information, and each provides a link to the particular park's website as well as a page for more information. "More Info" will display just that, as well as asynchronously call to a weather API to display a forecast for that park!

### Working Prototype 
You can access a working prototype here: https://evanpoe.github.io/Parks-and-Weather/


### User Stories 

###### Landing Page (Importance - High) (Est: 1h)
* as a visitor
* I want to understand what I can do with this app 
* so I can decide if I want to use it and search for a park

###### Search Page (Importance - High) (Est: 3h)
* As a visitor
* I want to be able to view the results of a keyword search,
* So I can see the results.

###### More Information Page (Importance - Medium)  (Est: 2h)
* As a visitor,
* I want to be able to view the weather,
* So I can see the forecast for that park



### Functionality 
The app's functionality includes:
* Every user can make parks searches by keyword
* Every user can select "more information" or that park's website
* Every user can view the park's 4 day weather forecast



### Technology 
* Front-End: HTML5, CSS3, JavaScript ES6, jQuery
* API: National Parks (https://developer.nps.gov/api/v1/parks)



### Screenshots 
Parks Page
:-------------------------:
![Parks Screenshot](/github-images/park-screenshot.png)
Weather Page
![Weather Screenshot](/github-images/weather-screenshot.png)



### Development Roadmap 
This is v1.0 of the app, but future enhancements are expected to include:
* add database support
* add to favorites functionality