// ==UserScript==
// @name        CleanScotch
// @description esconde elementos irrelevantes
// @namespace   https://scotch.io
// @author      Micael Levi
// @language    pt-br
// @include     *://scotch.io/*
// @version     0.02-3
// @require		https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant       document-end
// ==/UserScript==
(function($){
	$('.sidebar').remove(); // barra lateral direita
	$('.super-side').remove(); // barra lateral esquerda
	$('div.page-friend').remove(); // barra flutuante de redes sociais
	$('header.site-header').remove(); $('div.super-search').remove(); // barra de pesquisa
	$('.single-top-scotcherisment').remove(); // espaço vazio do topo
	$('.clearfix').remove(); // related course
	$('div.inner-guts,guts,no-top-margin').attr('class',''); // "expande" o artigo
	$('.site-footer').remove(); // rodapé
})(jQuery)
