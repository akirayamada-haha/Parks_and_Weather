'use strict';

const apiKey = 'ZwZh41hbFNQDlQubGQG9OdEepfOYOuBaY8EmOV50';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

const weatherApiKey = 'a1b84e9f01c54a93b59e895e666c594a';
const weatherSearchURL = 'https://api.openweathermap.org/data/2.5/forecast';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  //console.log(JSON.stringify(responseJson, null, 4));
  $('#js-results').empty();
  for (let i = 0; i < responseJson.data.length; i++){
    $('#js-results').append(
      `<li>
        <h3>${responseJson.data[i].fullName}</h3>
        <p>${responseJson.data[i].description}</p>
        <a class="park-more-info ${responseJson.data[i].parkCode}"
        data-latLong="${responseJson.data[i].latLong}" href="#">Click Here for More Info!</a>
        <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
      </li>`
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

  console.log(url);

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong ${err.message}`)
    })

}

function displayMoreInfo(responseJson) {
    //console.log(JSON.stringify(responseJson, null, 4));
  for (let i = 0; i < responseJson.data.length; i++){
    $('#js-results').append(
      `<li>
          <h3>${responseJson.data[i].fullName}</h3>
          <p>${responseJson.data[i].description}</p>
          <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
          <h4>${responseJson.data[i].weatherInfo}</h4>
          <h3>4 Day Weather Forecast</h3>
          <h3 id="js-weather-error-message"></h3>
        </li>`
      )};
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
  //console.log(JSON.stringify(responseJson, null, 4));

  for (let i = 0; i < responseJson.list.length - 36; i++){
    $('#js-results').append(`
      <li class="displayed-weather">
        <h4>Day ${[i+1]}</h4>
        <h4>Low of ${responseJson.list[i].main.temp_min}</h4>
        <h4>High of ${responseJson.list[i].main.temp_max}</h4>
      </li>
      `)
  };
}

function generateWeather(clickedLatLong) {
  const { lat, lon } = extractLatLong(clickedLatLong);
  const weatherParams = {
    lat,
    lon,
    units: "imperial",
    appid: weatherApiKey,
  };
    console.log(weatherParams)
    const weatherQueryString = formatWeatherQueryParams(weatherParams)
    const weatherUrl = weatherSearchURL + '?' + weatherQueryString;

    console.log(weatherUrl);

    fetch(weatherUrl)
    .then(response => {
      console.log(response)
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => {
      displayWeather(responseJson)
    })
    .catch(err => {
      $('#js-weather-error-message').text(`Something went wrong: ${err.message}`);
    })
}

function generateControlBar() {
  return `<form>
  <fieldset class="control-bar">
  <label for="park-search">Search National Parks by keyword (e.g. "Texas")</label>
  <input name="park-search" type="text" id="js-park-search" required>

  <input type="submit" value="Submit">
  </fieldset>
</form>

<p id="js-error-message"></p>

<section>
  <ul id="js-results">
      <li><h2 class="intro">Welcome to my National Parks search website!</h2></li>
      <li><h3>Here you can search the U.S. national parks by entering a keyword above.
          With the results, you can select the parks' website, or choose the "More Info"
          link, which will redirect you to a page with important information regarding that 
          particular park.</h3></li>
  </ul>        
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
  return `<label for="park-search-reset">Click Here to Begin a New Search</label><input name="park-search-reset" class="park-search-reset" type="submit" value="HOME">`
}

function replaceControlBar() {
  $('.control-bar').html(generateReplacedControlBar());
  returnHomePage();
}

function watchInfoLinkClick() {
  $('#js-results').on("click", ".park-more-info", event => {
      event.preventDefault();
      replaceControlBar();
      const clickedCode = $(event.currentTarget).attr('class').split(' ')[1]
      const clickedLatLong = $(event.currentTarget).attr('data-latLong')
      $('#js-results').empty();
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