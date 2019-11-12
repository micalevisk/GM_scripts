// ==UserScript==
// @name        YT Save Current Time
// @description Adds button to save video current time in URL.
// @author      Micael Levi
// @namespace   https://github.com/micalevisk/GM_scripts
// @supportURL  https://github.com/micalevisk/GM_scripts/tree/master/YT_Save_Current_Time
// @version     1
// @license     MIT
// @include     http*://*.youtube.com/*
// @include     http*://youtube.com/*
// @include     http*://*.youtu.be/*
// @include     http*://youtu.be/*
// @run-at      document-end
// ==/UserScript==


let idTimer = null;
if (document.getElementById('polymer-app') || document.getElementById('masthead') || window.Polymer) {

  idTimer = setInterval(function __inject__() {
    if (window.location.href.indexOf('watch?v=') < 0){
      console.info(4)
      return false;
    }

    if (document.getElementById('control-save-time')) {
      console.info(5)
      window.clearInterval(idTimer);
    } else {
      if ( addButton() ) {
        window.clearInterval(idTimer);
      }
    }

  }, 100);

}

function injectStyle() {
  const style = `
  #control-save-time {
    border: 0;
    cursor: pointer;
    background: transparent;
    margin-right: 8px;
    padding: 0;
    outline: 0;
    font-size: 0;

    height: 36px;
    width: 36px;
  }

  [dark] button svg {
    fill: rgba(255, 255, 255, 0.5);
    pointer-events: none;
    display: block;
  }

  [dark] button:hover svg {
    fill: rgba(255, 255, 255, 0.75);
  }
  `;

  (function addGlobalStyle(css) {
    const head = document.getElementsByTagName('head')[0];
    if (!head) return;
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
  })(style);
}


function saveTime() {
  const video_player = document.getElementById('movie_player');
  if (!video_player) return;

  const player_button = video_player.getElementsByClassName('ytp-play-button ytp-button')[0];
  if (!player_button) return;

  if (typeof video_player.pauseVideo === 'function') {
    video_player.pauseVideo();
  } else {
    try {
      const isPlaying = player_button.firstChild.lastChild.attributes.d.nodeValue.endsWith('10 z');
      if (isPlaying) {
        player_button.click();
      }
    } catch (err) {
      console.error(err);
    }
  }

  const str_curr_time = player_button.parentElement.lastElementChild.firstElementChild.textContent;
  if ( !(/[1-9]/g).test(str_curr_time) || !str_curr_time ) return;

  // TODO: usar o URLSearchParams https://developer.mozilla.org/pt-BR/docs/Web/API/URLSearchParams
  const qs_curr_time = str_curr_time.replace(/(?:(\d+):)?(\d+):(\d+)/, (_, hr = 0, min, seg) => `&t=${hr}h${min}m${seg}s`);
  const new_location_href = window.location.href.replace(/&t=[^&]+/, '') + qs_curr_time;

  window.location.replace(new_location_href); // Redirect to the URL with saved time
}


function addButton() {
  const elMetaSection = document.getElementById('menu-container');
  let elBtnSaveTime = document.getElementById('control-save-time');

  if (elMetaSection && document.querySelector('ytd-watch:not([hidden]), ytd-watch-flexy:not([hidden])')) {
    if (!elBtnSaveTime) {
      elBtnSaveTime = document.createElement('BUTTON');

      elBtnSaveTime.id = 'control-save-time';
      elBtnSaveTime.title = 'Save current time';
      elBtnSaveTime.innerHTML = "" +
        "<svg viewBox='0 0 448 512' height='20' width='20'>" +
        "  <path d='M432 304c0 114.9-93.1 208-208 208S16 418.9 16 304c0-104 76.3-190.2 176-205.5V64h-28c-6.6 0-12-5.4-12-12V12c0-6.6 5.4-12 12-12h120c6.6 0 12 5.4 12 12v40c0 6.6-5.4 12-12 12h-28v34.5c37.5 5.8 71.7 21.6 99.7 44.6l27.5-27.5c4.7-4.7 12.3-4.7 17 0l28.3 28.3c4.7 4.7 4.7 12.3 0 17l-29.4 29.4-.6.6C419.7 223.3 432 262.2 432 304zm-176 36V188.5c0-6.6-5.4-12-12-12h-40c-6.6 0-12 5.4-12 12V340c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12z' />" +
        "</svg>";
      elBtnSaveTime.onclick = saveTime;

			elMetaSection.parentNode.insertBefore(elBtnSaveTime, elMetaSection);
    }

    injectStyle();

    return elBtnSaveTime;
  }
}
