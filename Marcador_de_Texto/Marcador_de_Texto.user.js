// ==UserScript==
// @name		Marcador de Texto
// @description	Highlight lines of text on mouseover
// @namespace	https://github.com/cezaraugusto/
// @author		Micael Levi
// @language	pt-br
// @include		*://github.com/cezaraugusto/You-Dont-Know-JS/blob/portuguese-translation/*
// @version		0.22-2
// @require		https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @require		https://cdn.rawgit.com/mir3z/texthighlighter/master/src/TextHighlighter.js
// @grant       document-end
// ==/UserScript==

// using http://mir3z.github.io/texthighlighter/doc/index.htm
// TODO vide http://madapaja.github.io/jquery.selection/

(function($) {

	/* FIXME (c) http://stackoverflow.com/questions/11994696/highlight-lines-of-text-on-mouseover
	$('head').append('<style> ' +
		'.headline { position: relative; width: 600px; padding: 0; margin: 30px auto 10px auto; }' +
		'.headline h2 { font: bold 16px Arial; color: #000000; padding: 0; margin: 0; }' +
		'.headline span { display: block; font: normal 11px Arial; color: #333333; padding: 0; margin: 0; }' +
		'.textWrapper { position: relative; width: 600px; padding: 0px 10px; margin: 0 auto; cursor: default; }' +
		'.textWrapper p { font: normal 12px Arial; color: #000000; line-height: 18px; padding: 0; margin: 0; text-align: justify; }' +
		'.highlight { position: absolute; top: 0; left: 0; width: 100%; height: 18px; background: yellow; z-index: -1; display: none; }' +
	'</style>');

	let handlerIn = function(){
		$('.highlight', this).show();
	 	$(this).mousemove(function(e) {
			var relativePos = e.pageY - this.offsetTop;
			var textRow = (Math.ceil(relativePos / 18) * 18) - 18;
			if(textRow >= 0) $('.highlight', this).css('top', textRow + 'px');
		});
	};

	let handlerOut = function(){
		$('.highlight', this).hide();
 	};

	$(document).ready(function() {
		$('.textWrapper').hover(handlerIn, handlerOut);
	});
	*/

	/** DOUBLE CLICK TO highlight
	let colorir = function(){
		var corAtual = $(this).css('background-color');
		if(corAtual != "transparent") corAtual = "transparent";
		else corAtual = 'rgba(255, 255, 122,0.3)';

		$(this).dblclick(function(e) {
			var relativePos = e.pageY - this.offsetTop;
			var textRow = (Math.ceil(relativePos / 18) * 18) - 18;
			if(textRow >= 0) $(this).css('background-color', corAtual);
		});
	};
	$("p").hover(colorir);
	*/
	let colorir = function(){
		var corAtual = $(this).css('background-color');
		if(corAtual != "transparent") corAtual = "transparent";
		else corAtual = 'rgba(161, 221, 133, 0.4)';

		$(this).mousemove(function(e) {
			var relativePos = e.pageY - this.offsetTop;
			var textRow = (Math.ceil(relativePos / 18) * 18) - 18;
			if(textRow >= 0) $(this).css('background-color', corAtual);
		});
	};
	$("p").hover(colorir);

	var hltr = new TextHighlighter(document.body);
	hltr.setColor('rgba(255, 255, 122, 0.5)');

	var btnRemover = document.createElement('BUTTON');
	btnRemover.id= 'remove-highlights';
	btnRemover.className = 'btn btn-sm js-update-url-with-hash BtnGroup-item';
	btnRemover.textContent = 'Remove all highlights';
	btnRemover.setAttribute('data-copied-hint', 'clear all');
	btnRemover.setAttribute('arial-label', 'remove');
	btnRemover.addEventListener('click', function(){
		hltr.removeHighlights();
	});

	$('#raw-url').before(btnRemover);


})(jQuery);
