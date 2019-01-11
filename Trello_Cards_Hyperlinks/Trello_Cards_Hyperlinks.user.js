// ==UserScript==
// @name         Trello Cards Hyperlinks
// @namespace    https://github.com/micalevisk/GM_scripts
// @supportURL   https://github.com/micalevisk/GM_scripts/tree/master/Trello_Cards_Hyperlinks
// @version      1.1
// @description  Adds support for clickable hyperlinks in your Trello card titles.
// @author       Micael Levi
// @license      MIT
// @match        *://trello.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function($) {
  console.debug('------ Trello Cards Hyperlinks ------ ');

  const linkRegExp = /https?:\/\/(www\.)?[-a-z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-z0-9@:%_\+.~#?&\/\/=]*)/gi;

  window.document.addEventListener('load', dispatchRender, true);
  window.document.addEventListener('blur', dispatchRender, true);

  /* // Alternativa para disparar a atualizaÃ§Ã£o dos cards
  const boardCanvasElement = document.querySelector('.board-canvas');
  const observer = new MutationObserver((mutations) => {
    if ( $(mutations[0].target).hasClass('list-card') ) {
      // console.debug(mutations[0]);
      dispatchRender();
    }
  });

  observer.observe(boardCanvasElement, {
    attributes: true,
    subtree: true,
    //     childList: true,
    //     characterData: true,
  });
  */

  function dispatchRender() {
    window.setTimeout(renderCardLinks, 0);
  }

  function updateNode(nodeElement) {
    // if (!nodeElement) return;
    const innerHTML = $(nodeElement).html();
    const innerHTMLWithLinks = innerHTML.replace(linkRegExp, url =>
                                                 `<a class='tcards-title-link' onclick='event.stopPropagation();' href='${url}' target='_blank' rel='noopener'>${url}</a>`);
    if (innerHTML !== innerHTMLWithLinks) $(nodeElement).html(innerHTMLWithLinks);
  }

  function renderCardLinks() {
    $('.list-card-title').each((_, e) => updateNode(e));
    // Resolver o problema do `.replace` sobre um link ja mapeado (parseado)
    $('.list-card-title').find('a.tcards-title-link:empty').remove();
  }

})(jQuery || unsafeWindow.jQuery);
