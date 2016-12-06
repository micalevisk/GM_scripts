// ==UserScript==
// @name		testePostPastebin
// @description		precisa: nome, senha; não usa API auxiliares (apenas a do Greasemonkey).
// @namespace		https://greasyfork.org/en/forum/discussion/4897/pastebin-api-bad-api-request
// @author		Micael Levi
// @locale		pt-br
// @include		*://pastebin.com/index*
// @version		1.04-2
// @run-at		document-end
// @grant		GM_xmlhttpRequest
// @require		file:///C:/Users/user/AppData/Roaming/Mozilla/Firefox/Profiles/xwt25znr.default/gm_scripts/_private-pastebin.js
// ==/UserScript==

//TODO	como criar um post privado
//TODO	para "editar" um paste, dado o id de um já existente, obter content raw, criar outro com o conteúdo acrescido de informações e deletar o primeiro.



/// TESTES
const CRIAR = Boolean(false)
const OBTER = Boolean(false)
const DELET = Boolean(false)

/////////////// [ PRIVATE DATA ] ///////////////
const AUTH = pastebin_privateData;
API_USER_NAME= AUTH.username;
API_USER_PASSWORD= AUTH.userpass;
API_DEV_KEY= AUTH.userdevkey;
////////////////////////////////////////////////


/////////////// [ GLOBAL CONFIGS ] ///////////////
/// [ Required Parameters ]
API_PASTE_CODE = encodeURI("Some really good code A\nBC");
API_OPTION 	= {
	post: "paste", // to create a new paste															[ api_dev_key, api_user_name, api_user_password ]
	get_raw: "show_paste", // to get raw paste output of users pastes including 'private' pastes	[ api_dev_key, api_user_key, api_paste_key ]
	list: "list", // to list pastes created by a user												[ api_dev_key, api_user_key ]
	delete_raw: "delete" // to delete a paste created by a user										[ api_dev_key, api_user_key, api_paste_key ]
};
URL = {
	post: "http://pastebin.com/api/api_login.php",
	get_raw: "http://pastebin.com/api/api_raw.php",
	list: "http://pastebin.com/api/api_post.php"
};

/// [Optional Parameters]
API_PASTE_NAME			= encodeURI("some cool title.here");
API_PASTE_FORMAT		= "text";
API_PASTE_PRIVATE		= {
	public: "0",
	unlisted: "1",
	private: "2"
};
API_PASTE_EXPIRE_DATE	= {
	never: "N", // (only allowed in combination with api_user_key, as you have to be logged into your account to access the paste)
	ten_min: "10M",
	one_hour: "1H",
	one_day: "1D",
	one_month: "1M"
};
/////////////////////////////////////////////////



/////////////////// [ MAIN ] ////////////////////
function getAPI_USER_KEY(callback, callback_arg){
	if(!callback) return;

	/*
	var a = Array.prototype.slice.call(arguments),	// args
	e = a[0],	// expression
	c = a[1],	// context
	t = a[2];	// type
	*/

	/// http://pastebin.com/api#7
	var params = "api_dev_key="+API_DEV_KEY + "&api_user_name="+API_USER_NAME + "&api_user_password="+API_USER_PASSWORD;

	var API_USER_KEY = "";
	GM_xmlhttpRequest({
		method: "POST",
		url: URL.post,
		data: params,
		headers: { "Content-Type": "application/x-www-form-urlencoded", Referer: "http://pastebin.com" },
		onload: function (response){
			if (response.status == 200){
				API_USER_KEY = response.responseText; //We need the user key to make a private post

				callback(API_USER_KEY, callback_arg);
			}
		}
	});

}
/////////////////////////////////////////////////



////////////////////////////////////////////////// [ POST MEMBER LOGIN ] /////////////////////////////////////////////////
/// http://pastebin.com/api#8
function pasteFileAsMember(API_USER_KEY){
	if(!API_USER_KEY) return;

	var params = "api_option="+API_OPTION.post + "&api_dev_key="+API_DEV_KEY + "&api_user_name="+API_USER_NAME + "&api_user_password="+API_USER_PASSWORD +
	"&api_user_key="+API_USER_KEY + "&api_paste_expire_date="+API_PASTE_EXPIRE_DATE.never+ "&api_paste_private="+API_PASTE_PRIVATE.private +
	"&api_paste_format="+API_PASTE_FORMAT + "&api_paste_name="+API_PASTE_NAME + "&api_paste_code="+API_PASTE_CODE;

	GM_xmlhttpRequest({
		method: "POST",
		url: URL.list,
		data: params,
		headers: { "Content-Type": "application/x-www-form-urlencoded", Referer: "http://pastebin.com" },
		onload: function (response){
			console.info(response.responseText);
		}
	});

}

if(CRIAR)
	getAPI_USER_KEY(pasteFileAsMember);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////// [ GETTING RAW PASTE ] /////////////////////////////////////////////////
/// http://pastebin.com/api#13
function getRawPaste(API_USER_KEY, api_paste_key){
	var params = "api_dev_key="+API_DEV_KEY + "&api_user_key="+API_USER_KEY + "&api_paste_key="+api_paste_key + "&api_option="+API_OPTION.get_raw;

	GM_xmlhttpRequest({
		method: "POST",
		url: URL.get_raw,
		data: params,
		headers: { "Content-Type": "application/x-www-form-urlencoded", Referer: "http://pastebin.com" },
		onload: function (response){
			console.info(response.responseText);
		}
	});

}

if(OBTER)
	getAPI_USER_KEY(getRawPaste, "nyXggfT0");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////// [ DELETING A PASTE ] /////////////////////////////////////////////////
/// http://pastebin.com/api#11
function deleteRawPaste(API_USER_KEY, api_paste_key){
	var params = "api_dev_key="+API_DEV_KEY + "&api_user_key="+API_USER_KEY + "&api_paste_key="+api_paste_key + "&api_option="+API_OPTION.delete_raw;

	GM_xmlhttpRequest({
		method: "POST",
		url: URL.list,
		data: params,
		headers: { "Content-Type": "application/x-www-form-urlencoded", Referer: "http://pastebin.com" },
		onload: function (response){
			console.info(response.responseText);
		}
	});

}

if(DELET)
	getAPI_USER_KEY(deleteRawPaste, "ctyg8HfH");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


/*
http://pastebin.com/api
http://pastebin.com/api/api_user_key.html
https://wiki.greasespot.net/GM_xmlhttpRequest

http://pt.stackoverflow.com/questions/9936/como-funcionam-fun%C3%A7%C3%B5es-an%C3%B4nimas
http://blog.caelum.com.br/organize-seu-codigo-javascript-de-maneira-facil/
*/
