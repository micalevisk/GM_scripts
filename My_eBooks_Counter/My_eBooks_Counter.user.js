// ==UserScript==
// @name        My eBooks Counter
// @description Adiciona no título a quantidade de livros adquiridos
// @namespace   packtpub
// @author      Micael Levi
// @include     *://www.packtpub.com/account/my-ebooks
// @version     0.13-3
// @grant       none
// ==/UserScript==
document.getElementsByTagName('h1')[1].innerHTML += `(${document.querySelectorAll('div[class="product-line unseen"').length})`
