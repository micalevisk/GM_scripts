// ==UserScript==
// @name        My eBooks Counter
// @description Adiciona no título a quantidade de livros adquiridos
// @namespace   packtpub
// @author      Micael Levi
// @include     *://account.packtpub.com/account/products*
// @version     0.30-1
// @run-at      document-end
// @grant       none
// ==/UserScript==

function inject() {

  function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  const titlesOnPage = document.querySelectorAll('h5.title');

	document.getElementsByClassName('mb-3')[0].innerHTML += ` <button id='my-ebooks-counter' class='reader-link ng-star-inserted'>download titles name</button>`;
  document.getElementById('my-ebooks-counter').onclick = function() {
    const titlesOnPage = document.querySelectorAll('h5.title');
    download(
      (new Date().toLocaleDateString()).replace(/\D/g,'_') + '' + '_ebooks-title' + '.txt',
      Array.prototype
      	.map.call(titlesOnPage, node => node.textContent.replace(' [eBook]', ''))
        .join('\r\n'));
  };

}


const titlesContainer = document.querySelector('div.account__container');
const observerContainer = new MutationObserver(function (mutations) {
	if (mutations.length === 12) {
		observerContainer.disconnect();
    inject();
	}
})

observerContainer.observe(titlesContainer, {subtree:true,childList:true});
