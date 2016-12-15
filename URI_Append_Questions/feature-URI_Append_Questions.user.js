// ==UserScript==
// @name        (feature) URI Append Questions
// @description Adiciona questões na página
// @namespace   https://github.com/micalevisk/GM_scripts
// @author      Micael Levi
// @locale      pt-br
// @include     *://www.urionlinejudge.com.br/judge/pt/disciplines/view/2040*
// @version     1.10-2
// @icon	https://raw.githubusercontent.com/micalevisk/GM_scripts/master/URI_Append_Questions/URI.ico
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==

// http://desenvolvimentoparaweb.com/html/textarea-dicas-truques-textarea/
// http://www.criarweb.com/artigos/740.php
// http://www.bootply.com/

//TODO
//====
//Copiar a ideia do https://github.com/Schegge/Userscripts/blob/master/Block%20Youtube%20Users.js
//Criar caixa de texto para adicionar/remover as questões do banco.


/// [id],[ddmm],[autor] ///

(function($) {


	/// CARREGANDO DADOS DO BD
	var questoesSalvas = ''+
	'1077,0912,Moisés \n' +
	'1215,0912,Moisés \n' +
	'1256,0912,Moisés \n' +
	'1251,0912,Moisés \n' +
	'1527,0212,André \n' +
	'1896,0212,André \n';

	function getQuestoesBanco(){
		questoesSalvas = GM_getValue('savedquestions', '');
	}

	/// ADICIONAR CSS	FIXME
	var margintop = $('#yt-masthead-container').height() + parseInt($('#yt-masthead-container').css('padding-top')) + parseInt($('#yt-masthead-container').css('padding-bottom'));
	margintop = 5;
	$('head').append('<style> ' +
		'.uri-skill { font-weight: bold; color: #ff1b00; } ' +
		'#yt-blacklist-options { width: 180px; height:400px; display: flex; flex-flow: row wrap; align-items: baseline; position: fixed; right: 70px; top:' + margintop + 'px; padding: 0 20px 15px; background-color: #fff; box-shadow: 0 1px 1px 0 rgba(0,0,0,.1); border: 1px solid #e8e8e8; border-top: 0; z-index: 9999999999; } ' +
		'#yt-blacklist-options div { box-sizing: border-box; padding: 5px; } ' +
		'#yt-blacklist-options .textarea div { width: 100%;  text-align: center; font-weight: 500; } ' +
		'#yt-blacklist-options .textarea textarea { resize: vertical; width: 100%; padding: 4px; border: 2px solid rgba(0,0,0,.13); box-sizing: border-box; } ' +
		'#yt-blacklist-options .textarea.wl { width: 100%; } ' +
	'</style>');

	/// CRIANDO A CAIXA
	$('body').append('<div id="yt-blacklist-options" style="display: none">' +
			'<div style="width: 100%; text-align: center"><span id="saveblacklist">registrar</span></div>' +
			'<div class="textarea wl"><div>Atividades Requisitadas</div><textarea rows="4" id="whitelist-words">' + questoesSalvas + '</textarea></div>' +
			'</div>');


	/// OBJETO PRINCIPAL
	$barra = $('#menu');

	/// objeto que será construído
	$main = $barra.children().first();
	$main.html('<a href="#" class="uri-skill">banco</a>'); // onclick="configQuestoes();"
	$main.on('click', function(){
		console.error("AQUI SERÁ MOSTRADO UMA CAIXA PARA INSERIR AS QUESTÕES");
		$('#yt-blacklist-options').slideToggle();
	});




})(jQuery);
