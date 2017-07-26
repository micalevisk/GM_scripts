// ==UserScript==
// @name        YoutubeTags
// @namespace   https://gist.github.com/micalevisk/8cf208b3522ab935eec65c10ba13cd13
// @supportURL  https://gist.github.com/micalevisk/8cf208b3522ab935eec65c10ba13cd13
// @version     0.26-7
// @description Show tags on Youtube videos.
// @author      Micael Levi
// @match       *://www.youtube.com/*
// @grant       GM_getResourceText
// @resource    spfremove https://greasyfork.org/scripts/16935-disable-spf-youtube/code/Disable%20SPF%20Youtube.user.js
// @locale      pt-br
// ==/UserScript==


eval(GM_getResourceText('spfremove'));


/**
 * @param {string} path
 * @param {function} success - Execute this callback on success.
 * @param {function} [error] - Execute this callback on error.
 */
function loadJSON(path, success = () => {}, error) {
  const xhr = new XMLHttpRequest();

  xhr.onreadystatechange = () => {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        success(JSON.parse(xhr.responseText));
      } else if (error) {
        error(xhr);
      }
    }
  };

  xhr.open('GET', path, true);
  xhr.send();
}

/**
 * @param {object} json - An object from Youtube API.
 * @return {object} With properties 'tags' (string[]) and 'quantidade' (number)
 */
function getTagsFrom(json = {}) {
  const tags = json.items[0].snippet.tags;
  if (tags === null) return null;

  return {
    tags: tags.toString().replace(/,/g, '; '),
    quantidade: tags.length,
  };
}

/**
 * @param {object} data
 */
function viewTags(data) {
  const tagsArray = getTagsFrom(data);
  if (!tagsArray || tagsArray.length < 0) return;

  const qtdTags = tagsArray.quantidade;
  const tagsStr = tagsArray.tags;
  const titleTags = `${qtdTags} Tags`;

  const elementoTags = document.getElementById('tags-field');
  if (elementoTags === null) {
    const lix = document.createElement('LI');
    const elTitulo = document.createElement('H4');
    const luy = document.createElement('UL');
    const liy = document.createElement('LI');

    lix.className = 'watch-meta-item yt-uix-expander-body';
    elTitulo.className = 'title';
    luy.className = 'content watch-info-tag-list';

    lix.id = 'info-tags';
    elTitulo.id = 'tag-title';
    liy.id = 'tags-field';

    elTitulo.appendChild( document.createTextNode(titleTags) );
    lix.appendChild( elTitulo );

    luy.appendChild( liy );
    liy.appendChild( document.createTextNode(tagsStr) ); // document.getElementById('tags-field').innerHTML = getTagsFrom(data)
    lix.appendChild( luy );

    document.getElementsByClassName('watch-extras-section')[0].appendChild(lix);
  } else {
    document.getElementById('tag-title').innerHTML = titleTags;
    elementoTags.innerHTML = tagsStr;
  }
}

/**
 * main function.
 */
function startYouTags() {
  /* for new YouTube UI
  const videoURL = document.querySelector('div.ytp-title-text').childNodes[0].getAttribute('href');
  const videoID  = videoURL.match(/(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/)[1];
  */
  const videoID = document.querySelector('meta[itemprop=videoId').getAttribute('content');
  const jsonLink = 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAZiST8vkBnAbxFIZO_KfhQ7YU0amBv0To&fields=items(snippet(tags))&part=snippet&id=' + videoID;

  loadJSON(
    jsonLink,
    viewTags,
    xhr => console.error(xhr),
  );
}


if (/^.+watch\?v=.+$/i.test(document.location.href)) {
  startYouTags();// adicionar tags
  document.getElementById('action-panel-details').classList.remove('yt-uix-expander-collapsed');// abrir descrição
}
