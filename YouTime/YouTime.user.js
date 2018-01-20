// ==UserScript==
// @name         YouTime
// @namespace    http://micalevisk.github.io
// @version      2018-01-20
// @description  Save YouTube's video current time for new YouTube Material Layout (and old one)
// @compatible   Chrome
// @compatible   Firefox
// @author       Micael Levi
// @include      http*://*.youtube.com/*
// @include      http*://youtube.com/*
// @include      http*://*.youtu.be/*
// @include      http*://youtu.be/*
// @run-at       document-end
// ==/UserScript==

// (c) style based on "Simple YouTube MP3 Button" by Arari

function ytimeSavetime() {
  const playerButton = document.getElementsByClassName('ytp-play-button ytp-button')[0];
  if (!playerButton) return;

  const ytimeVideoIsPaused = p => p.getElementsByTagName('path')[0].getAttribute('d').length > 60;

  if ( !ytimeVideoIsPaused(playerButton) ) playerButton.click();

  const currTimeAsString = document.getElementsByClassName('ytp-time-current')[0].innerHTML;
  if (!currTimeAsString) return;

  const currTimeAsQueryString = currTimeAsString.replace(/(?:(\d+):)?(\d+):(\d+)/, (_, hr = 0, min, seg) => `&t=${hr}h${min}m${seg}s`);
  const newLocationHref = window.location.href.replace(/&t=[^&]+/, '') + currTimeAsQueryString;
  window.location.replace(newLocationHref);
}

// ----------------- for new YouTube Layout ----------------- //
function polymerInject() {
  // create button
  const buttonDiv = document.createElement('div');
  buttonDiv.id = 'ytime-parentbutton';
  buttonDiv.style.width = '100%';
  buttonDiv.style.textAlign = 'center';

  const saveTimeButton = document.createElement('button');
  buttonDiv.appendChild(saveTimeButton);
  saveTimeButton.appendChild( document.createTextNode('Save Current Time') );

  saveTimeButton.style.width = '100%';
  saveTimeButton.style.backgroundColor = '#0f4873';
  saveTimeButton.style.color = 'var(--yt-subscribe-button-text-color)';
  saveTimeButton.style.textAlign = 'center';
  saveTimeButton.style.padding = '4px 0';
  saveTimeButton.style.marginTop = '5px';
  //saveTimeButton.style.fontSize = '14px';
  saveTimeButton.style.border = '0';
  saveTimeButton.style.cursor = 'pointer';
  saveTimeButton.style.borderRadius = '2px';
  saveTimeButton.style.fontFamily = 'Roboto, Arial, sans-serif';
  saveTimeButton.onclick = ytimeSavetime;

  // Find and add to target (below "Subscribe" button)
  const targetElements = document.querySelectorAll('[id=subscribe-button]');
  targetElements.forEach((targetElement) => {
    if (targetElement.className.indexOf('ytd-video-secondary-info-renderer') > -1) targetElement.appendChild(buttonDiv);
  });

  // Fix hidden description bug
  const descriptionBox = document.querySelectorAll('ytd-video-secondary-info-renderer')[0];
  if (descriptionBox.className.indexOf('loading') > -1) descriptionBox.classList.remove('loading');
}


// ----------------- for old YouTube Layout ----------------- //
function standardInject() {
  if ( !document.getElementById('page-container') ) return;

  if (!document.getElementById('ytime-parentbutton') && window.location.href.substring(0, 25).indexOf('youtube.com') > -1 && window.location.href.indexOf('watch?v=') > -1) {
    const buttonDiv = document.createElement('div');
    buttonDiv.id = 'ytime-parentbutton';
    buttonDiv.className = 'yt-uix-button yt-uix-button-default';
    buttonDiv.style.height = '23px';
    buttonDiv.style.marginLeft = '28px';
    buttonDiv.style.paddingBottom = '1px';
    buttonDiv.onclick = ytimeSavetime;

    document.getElementById('watch7-user-header').appendChild(buttonDiv);

    const childButton = document.createElement('span');
    buttonDiv.appendChild(childButton);

    childButton.appendChild(document.createTextNode('Save Current Time'));
    childButton.className = 'yt-uix-button-content';
    childButton.style.lineHeight = '25px';
    childButton.style.fontSize = '12px';
  }
}


// ----------------- injecting ----------------- //
if (document.getElementById('polymer-app') || document.getElementById('masthead') || window.Polymer) {
  setInterval(() => {
    if (window.location.href.indexOf('watch?v=') < 0) return false;
    if (document.getElementById('count') && document.getElementById('ytime-parentbutton') === null) polymerInject();
    return true;
  }, 100);
} else {
  setInterval(() => {
    if (window.location.href.indexOf('watch?v=') < 0) return false;
    if (document.getElementsByClassName('watch-view-count').length && document.getElementById('ytime-parentbutton') === null) standardInject();
    return true;
  }, 100);
}
