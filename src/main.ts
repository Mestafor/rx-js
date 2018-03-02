import Rx from 'rx';
import './test.ts';

var refreshButton: any = document.querySelector('.refresh');
var closeButton1: any = document.querySelector('.close1');
var closeButton2: any = document.querySelector('.close2');
var closeButton3: any = document.querySelector('.close3');


var refreshClickStream = Rx.Observable.fromEvent(refreshButton, 'click');
var close1ClickStream = Rx.Observable.fromEvent(closeButton1, 'click');
var close2ClickStream = Rx.Observable.fromEvent(closeButton2, 'click');
var close3ClickStream = Rx.Observable.fromEvent(closeButton3, 'click');

var requestStream = refreshClickStream.startWith('startup click')
  .map(() => 'https://api.github.com/users?since=' + Math.floor(Math.random() * 500));

var responseStream = requestStream
  .flatMap(requestUrl => Rx.Observable.fromPromise(fetch(requestUrl).then(resp => resp.json(), err => {throw new Error(err)})));

function createSuggestionStream(closeClickStream: any) {
  return closeClickStream.startWith('startup click')
    .combineLatest(responseStream, (click: any, listUsers: any) =>
      listUsers[Math.floor(Math.random() * listUsers.length)])
    .merge(refreshClickStream.map(() => null))
    .startWith(null);
}

var suggestion1Stream = createSuggestionStream(close1ClickStream);
var suggestion2Stream = createSuggestionStream(close2ClickStream);
var suggestion3Stream = createSuggestionStream(close3ClickStream);


// Rendering ---------------------------------------------------
function renderSuggestion(suggestedUser: any, selector: any) {
  var suggestionEl = document.querySelector(selector);
  if (suggestedUser === null || suggestedUser === undefined) {
    // suggestionEl.style.visibility = 'hidden';
  } else {
    suggestionEl.style.visibility = 'visible';
    var usernameEl = suggestionEl.querySelector('.username');
    usernameEl.href = suggestedUser.html_url;
    usernameEl.textContent = suggestedUser.login;
    var imgEl = suggestionEl.querySelector('img');
    imgEl.src = "";
    imgEl.src = suggestedUser.avatar_url;
  }
}

suggestion1Stream.subscribe(function (suggestedUser: any) {
  renderSuggestion(suggestedUser, '.suggestion1');
});

suggestion2Stream.subscribe(function (suggestedUser: any) {
  renderSuggestion(suggestedUser, '.suggestion2');
});

suggestion3Stream.subscribe(function (suggestedUser: any) {
  renderSuggestion(suggestedUser, '.suggestion3');
});



