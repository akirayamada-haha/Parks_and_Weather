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

//converting "latLong": "lat:35.5819662, long:-101.6717008" into lat, value, and long, (needs to be lon) value
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

  for (let i = 0; i < responseJson.list.length; i++){
    $('#js-results').append(`
      <li>
        <h3>${responseJson.list[i].main.temp}</h3>
      </li>
      `)
  };
}

function generateWeather(clickedLatLong) {
  const { lat, lon } = extractLatLong(clickedLatLong);
  const weatherParams = {
    lat,
    lon,
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
      console.log(err)
    })
}

function watchInfoLinkClick() {
  $('#js-results').on("click", ".park-more-info", event => {
      event.preventDefault();
      console.log("watchInfoLinkClick is running")
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