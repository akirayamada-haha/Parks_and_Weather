'use strict';

const apiKey = 'ZwZh41hbFNQDlQubGQG9OdEepfOYOuBaY8EmOV50';
const searchURL = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
  const queryItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function displayResults(responseJson) {
  console.log(JSON.stringify(responseJson, null, 4));
  $('#js-results').empty();
  for (let i = 0; i < responseJson.data.length; i++){
    $('#js-results').append(
      `<ul>
        <li>
          <h3>${responseJson.data[i].fullName}</h3>
          <p>${responseJson.data[i].description}</p>
          <a class="park-more-info ${responseJson.data[i].parkCode}" href="#">Click Here for More Info!</a>
          <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a>
        </li>
      </ul>`
      )};
}

function getParkInfo(searchTerm) {
  const params = {
    stateCode: searchTerm,
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
    console.log(JSON.stringify(responseJson, null, 4));
  $('#js-results').empty();

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

function getMoreInfo(clickedCode) {
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
    .then(responseJson => displayMoreInfo(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong ${err.message}`)
    })    
}

function watchInfoLinkClick() {
    $('#js-results').on("click", ".park-more-info", event => {
        event.preventDefault();
        console.log("this is running")
        const clickedCode = $(event.currentTarget).attr('class').split(' ')[1]
        getMoreInfo(clickedCode);
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