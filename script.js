'use strict';

const apiKey = 'ZwZh41hbFNQDlQubGQG9OdEepfOYOuBaY8EmOV50';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

const weatherApiKey = 'a1b84e9f01c54a93b59e895e666c594a';
const weatherSearchURL = 'https://api.openweathermap.org/data/2.5/forecast';


let resultsData = []

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults() {
  //console.log(JSON.stringify(responseJson, null, 4)); //un-comment to see results in json
  $('#js-results-parks').empty();
  for (let i = 0; i < resultsData.length; i++){
    $('#js-results-parks').append(
      `<div class="results-list">
        <h3 class="full-name">${resultsData[i].fullName}</h3>
        <p>${resultsData[i].description}</p>
        <h4 class="more-info-links"><a class="park-more-info ${resultsData[i].parkCode}"
        data-latLong="${resultsData[i].latLong}" href="#" target="_blank">Click Here for More Info!</a>
        <a href="${resultsData[i].url}" target="_blank">${resultsData[i].url}</a></h4>
      </div>`
      )};
}

function getParkInfo(searchTerm) {
  const params = {
    q: searchTerm,
    limit: 50,
    start: 1,
    api_key: apiKey,
  };
  const queryString = formatQueryParams(params)
  const url = searchURL + '?' + queryString;

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      resultsData = responseJson.data
      displayResults()
    }) 
    .catch(err => {
      $('#js-error-message').text(`Something went wrong ${err.message}`)
    })

}

function watchForBackButton() {
  $('#js-results-parks').on("click", ".back-button", event => {
    $('#js-error-container').empty();
    event.preventDefault();
    $('.weather-container').empty();
    displayResults();
  })
}

function displayMoreInfo(responseJson) {
  for (let i = 0; i < responseJson.data.length; i++){
    $('#js-results-parks').append(
      `<div>
          <h3 class="full-name">${responseJson.data[i].fullName}</h3>
          <p>${responseJson.data[i].description}</p>
          <h4 class="more-info-links"><a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a></h4>
          <p>${responseJson.data[i].weatherInfo}<p>
        </div>`
      )
    };
}

function createBackButton() {
  $('#js-results-parks').append(
    `<div class="back-button-div">
      <input type="submit" class="back-button" value="BACK TO PREVIOUS SEARCH">
      </div>`
  )
  watchForBackButton();
}

function getMoreInfo(clickedCode, clickedLatLong) {
    const params = {
        parkCode: clickedCode,
        limit: 1,
        start: 1,
        api_key: apiKey,
    };
    const queryString = formatQueryParams(params)
    const url = searchURL + '?' + queryString;

    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      displayMoreInfo(responseJson)
      generateWeather(clickedLatLong);
    })
    .catch(err => {
      $('#js-error-message').text(`Something went wrong ${err.message}`)
    })    
}

function extractLatLong(clickedLatLong) {
  return clickedLatLong.replace('ng','n').split(', ') 
  .reduce((acc, str) => {
    const strSplit = str.split(':');
    acc[strSplit[0]] = strSplit[1];
    return acc;
  }, {})
}

function formatWeatherQueryParams(weatherParams) {
  const weatherQueryItems = Object.keys(weatherParams)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(weatherParams[key])}`)
  return weatherQueryItems.join('&');
}

function displayWeather(responseJson) {
  $('.weather-container').append(`
    <div class="weather-items">
    <h3 class="forecast-title">4 Day Weather Forecast</h3>
    <div>`)
  for (let i = 0; i < responseJson.list.length - 36; i++){
    $('.weather-items').append(`
    <ul class="displayed-weather">
      <li>
        <h4>Day ${[i+1]}</h4>
        <h4>Low of ${responseJson.list[i].main.temp_min}</h4>
        <h4>High of ${responseJson.list[i].main.temp_max}</h4>
      </li>
    </ul>
      `)};
}

function generateWeather(clickedLatLong) {
  const { lat, lon } = extractLatLong(clickedLatLong);
  const weatherParams = {
    lat,
    lon,
    units: "imperial",
    appid: weatherApiKey,
  };

    const weatherQueryString = formatWeatherQueryParams(weatherParams)
    const weatherUrl = weatherSearchURL + '?' + weatherQueryString;


    fetch(weatherUrl)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      displayWeather(responseJson)
      createBackButton();
    })
    .catch(err => {
      $('#js-error-container').append(`<p id="js-weather-error-message">Something went wrong: ${err.message}</p>`)
      createBackButton();
    })
}

function generateControlBar() {
  return `<form>
  <fieldset class="control-bar">
  <label for="park-search">Search National Parks by keyword (e.g. "Texas")</label>
  <input name="park-search" type="text" id="js-park-search" required>

  <input type="submit" class="submit" value="Submit">
  </fieldset>
  </form>

  <div id="js-error-container">

  </div>

  <section id="js-results-parks">
    <h2 class="intro">Welcome to my National Parks search website!</h2>
    <h3>Here you can search the U.S. national parks by entering a keyword above.
        With the results, you can select the parks' website, or choose the "More Info"
        link, which will redirect you to a page with important information regarding that 
        particular park.</h3>
  </section>

  <section class="weather-container">

  </section>`
}

function returnHomePage() {
  $('.control-bar').on("click", ".park-search-reset", event => {
    event.preventDefault();
    $('.main').html(generateControlBar());
    watchForm();
  })

}

function generateReplacedControlBar() {
  return `<label for="park-search-reset">Click <input name="park-search-reset" class="park-search-reset" type="submit" value="HERE"> to Begin a New Search</label>`
}

function replaceControlBar() {
  $('.control-bar').html(generateReplacedControlBar());
  returnHomePage();
}

function watchInfoLinkClick() {
  $('#js-results-parks').on("click", ".park-more-info", event => {
      event.preventDefault();
      replaceControlBar();
      const clickedCode = $(event.currentTarget).attr('class').split(' ')[1]
      const clickedLatLong = $(event.currentTarget).attr('data-latLong')
      $('#js-results-parks').empty();
      getMoreInfo(clickedCode, clickedLatLong);
  })
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    const searchTerm = $('#js-park-search').val();
    getParkInfo(searchTerm);
    watchInfoLinkClick();
  })
}

$(watchForm);