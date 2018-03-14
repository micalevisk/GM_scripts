// ==UserScript==
// @name        My eBooks Counter
// @description Adiciona no título a quantidade de livros adquiridos
// @namespace   packtpub
// @author      Micael Levi
// @include     *://www.packtpub.com/account/my-ebooks
// @version     0.13-3
// @grant       none
// ==/UserScript==


function download(filename, text) {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

document.getElementsByTagName('h1')[1].innerHTML += `<button id='my-ebooks-counter'>download ${document.querySelectorAll('div[class="product-line unseen"').length} titles </button>`;
document.getElementById('my-ebooks-counter').onclick = function() {
  download(
    (new Date().toLocaleDateString()).replace(/\D/g,'_') + '.txt',
    Array.from( document.querySelectorAll('div[class="product-line unseen"') )
      .map(({title}) => title.replace(' [eBook]',''))
      .join('\r\n'));
};
