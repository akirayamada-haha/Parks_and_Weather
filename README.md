
Summary:
App that will use National Park Services API and weather API
Searches national parks by keyword entered, then displays a list that match that keyword. 
Each item will have a "more info" button which will display a page with 
more detailed information (including a weather forecast)



# National Parks and Weather
A site that allows users to search for national parks (making calls to the NPS API) by keyword. Results listed will display basic information, and each provides a link to the particular park's website as well as a page for more information. "More Info" will display just that, as well as asynchronously call to a weather API to display a forecast for that park!

### 1. Working Prototype 
You can access a working prototype here: https://evanpoe.github.io/Parks-and-Weather/


### 2. User Stories 

###### Landing Page (Importance - High) (Est: 1h)
* as a visitor
* I want to understand what I can do with this app 
* so I can decide if I want to use it

###### Question Page (Importance - High) (Est: 3h)
* As a visitor
* I want to enter be able to answer a question,
* So I can see the results.

###### Results Page (Importance - Medium)  (Est: 2h)
* As a visitor,
* I want to be able to view final results of the quiz,
* So i can decide if I want to take it again



### 3. Functionality 
The app's functionality includes:
* Every user can start the quiz
* Every user can take the quiz
* Every user can get their final score



### 4. Technology 
* Front-End: HTML5, CSS3, JavaScript ES6, jQuery
* API: National Parks (https://developer.nps.gov/api/v1/parks)



### 9. Screenshots 
Parks Page
:-------------------------:
![Parks Screenshot](/github-images/park-screenshot.png)
Weather Page
![Weather Screenshot](/github-images/weather-screenshot.png)



### 10. Development Roadmap 
This is v1.0 of the app, but future enhancements are expected to include:
* add database support
* add to favorites functionality