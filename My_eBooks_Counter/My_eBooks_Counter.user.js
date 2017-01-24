// ==UserScript==
// @name        My eBooks Counter
// @description Adiciona no título a quantidade de livros adquiridos
// @namespace   packtpub
// @author      Micael Levi
// @language    pt-br
// @include     *://www.packtpub.com/account/my-ebooks
// @version     0.23-1
// @grant       none
// @run-at		document-end
// ==/UserScript==
document.getElementsByTagName('h1')[1].innerHTML += `(${$('div[class="product-line unseen"').length})`
