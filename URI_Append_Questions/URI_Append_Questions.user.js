// ==UserScript==
// @name	URI Append Questions
// @description	Adiciona questões na página Academic/Desafios de Programação II (2016/02)
// @version	1.15-2
// @namespace	https://github.com/micalevisk/GM_scripts
// @author	Micael Levi
// @locale	pt-br
// @include	*://www.urionlinejudge.com.br/judge/pt/disciplines/view/2040*
// @icon	https://raw.githubusercontent.com/micalevisk/GM_scripts/master/URI_Append_Questions/URI.ico?token=AM1nQ377JYru74Y339rgUM4ZLfoZE8L0ks5YW0ahwA%3D%3D
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// ==/UserScript==

// http://desenvolvimentoparaweb.com/html/textarea-dicas-truques-textarea/
// http://www.criarweb.com/artigos/740.php
// http://www.bootply.com/

/**************************************************************************
TODO
====
IDENTIFICAR QUESTÕES QUE JÁ VENCERAM E FAZER style="cursor:not-allowed"
RENOMEAR VALORES PARA ADEQUAR AO OBJETIVO
Implementar escolha do separador (1 caractere)
TORNAR FUNCIONAL
→ VERIFICAR QUESTÕES NÃO ENCONTRADAS (arrumar banco)
FILTRAR ids DO ARRAY banco
ELIMINAR COM ids REPETIDAS
***************************************************************************/




(function($) {

	String.prototype.isEmpty = function(){ return !(this.trim());	}
	String.prototype.isValid = function(){ return this.isEmpty() || /^\d{4}.\d{4}..+$/m.test(this); } // verifica se a requisição em um formato válido.
	String.prototype.formatLikeDate = function(lang){
		let anoAtual=new Date().getFullYear().toString();
		return this.replace(/(.{2})(.{2})/, (lang==='en') ? `$2/$1/${anoAtual}` : `$1/$2/${anoAtual}`);
	}


	var questoesSalvas, banco=[], sep = ',';

	/// CARREGANDO DADOS DO BD
	function getSavedValues(){
		questoesSalvas = GM_getValue('savedquestions', `id${sep}ddmm${sep}autor`);
		banco = questoesSalvas.isValid() ? questoesSalvas.split('\n') : [];
	}(getSavedValues());

	/// ADICIONAR CSS	FIXME = resizable ao ajustar o textarea;
	var margintop = $('.ribbon').height() + parseInt( $('.ribbon').css('padding-top') ) + parseInt( $('.ribbon').css('padding-bottom') );
	$('head').append('<style> ' +
		'.uri-skill { color: #a11909; } ' +
		'#yt-blacklist-options { width: 180px; height:350px; display: flex; flex-flow: row wrap; align-items: baseline; position: fixed; right: 150px; top:' + margintop + 'px; padding: 0 20px 15px; background-color: #fff; box-shadow: 0 1px 1px 0 rgba(0,0,0,.1); border: 1px solid #e8e8e8; border-top: 0; z-index: 9999999999; } ' +
		'#yt-blacklist-options div { box-sizing: border-box; padding: 3px; } ' +
		'#yt-blacklist-options .textarea div { width: 100%;  text-align: center; font-weight: 500; } ' +
		'#yt-blacklist-options .textarea textarea { resize: none; width: 100%; padding: 4px; border: 2px solid rgba(0,0,0,.13); box-sizing: border-box; } ' +
		'#yt-blacklist-options .textarea.wl { width: 100%; } ' +
		'#saveblacklist { cursor: pointer; color: #cc181e; text-shadow: 1px 1px 1px rgba(0, 0, 0, .20); border-radius: 2px; } ' +
		'#lbltextarea { color: #5FBBAA; text-shadow: 1px 1px 1px rgba(0, 0, 0, .10); border-radius: 2px; } ' +
	'</style>');

	/// CRIANDO A CAIXA
	$('body').append('<div id="yt-blacklist-options" style="display: none">' +
			'<div style="width: 100%; text-align: center"><span id="saveblacklist" title="salvar no BD">registrar</span></div>' +
			'<div class="textarea wl"><div id="lbltextarea" title="uma questão por linha">Atividades Requisitadas</div><textarea rows="4" id="whitelist-words" style="margin-top: 14px;">' + questoesSalvas + '</textarea></div>' +
			'</div>');


	/// OBJETO PRINCIPAL
	$barra = $('#menu');
	$saved = $('<span style="margin-right: 7px; font-size: 80%; color:green">salvo!</span>');

	/// OBJETO QUE SERÁ CONSTRUÍDO
	$barra.append('<li><a href="#" class="uri-skill" id="btnmain">banco</a></li>');
	$('#btnmain').on('click', () => $('#yt-blacklist-options').slideToggle());

	$('#saveblacklist').on('click', function() {
		// save new values
		let listagem = $('#whitelist-words').val();
		if(listagem.isValid()){
			listagem.isEmpty() ? GM_deleteValue('savedquestions') : GM_setValue('savedquestions', listagem);
			// add notification
			$(this).before($saved);
			setTimeout(function() { $saved.fadeOut(); }, 300);
			setTimeout(function() { location.reload(); }, 500); // F5
			// research
			getSavedValues();
		}
	});



	//||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//
	const links = {
		questao: function(id){
			return 'https://www.urionlinejudge.com.br/judge/pt/problems/view/'+id;
		},
		raw_questao: function(id){
			return `https://www.urionlinejudge.com.br/repository/UOJ_${id}.html`;
		},
		enviar_questao: function(id){
			return 'https://www.urionlinejudge.com.br/judge/pt/runs/add/'+id;
		}
	}

	/**
	 * @param {String} id - O identificador exclusivo da questão do URI
	 * @param {String} data - A data de início da atividade, no formato 'ddmm'
	 * @param {String} profAutor - O nome do professor que lançou a atividade
	 */
	function inserirQuestao(id, data, profAutor){
		var elemento = questaoHTML(id, data, profAutor);
		var linha = getElementoAlvo();
		if(elemento) linha.html(elemento);
	}

	/**
	 * Itera entre a tabela que contém as questões (na página) até encontrar uma TR "vazia"
	 * @return {Object} A primeira table row sem questão
	 */
	function getElementoAlvo(){
		var tabela = $('table');
		var alvo = null;
		if(tabela){
			tabela = tabela.find('tbody').children();

			tabela.each(function(){
				alvo = $(this);
				return !($(this).children().length <= 1); // encontra a primeira linha "vazia".
			});
		}
		return alvo;
	}

	/**
	 * Define o código HTML que será inserido.
	 * @param {String} id_questao - O identificador exclusivo da questão do URI
	 * @param {String} dia_inicio - A data de início da atividade, no formato 'ddmm'
	 * @param {String} prof - O nome do professor que lançou a atividade
	 * @return {String} O objeto HTML que será inserido.
	 */
	function questaoHTML(id_questao, dia_inicio, prof){
		var rotulo= `Autor: ${prof}`;

		var dia_final= ( (inicio) => {
			dia_inicio = dia_inicio.formatLikeDate(); // (ddmmyy) -> dd/mm/yyyy
			var d = inicio.formatLikeDate('en'); // (ddmmyy) -> mm/dd/yyyy
			var diaFinal = new Date(d);
			diaFinal.setDate(diaFinal.getDate() + 7);
			return diaFinal.toLocaleDateString('pt-BR');
		})(dia_inicio);

		return ""+
			`<td class='id'><a target='_blank' href=${links.questao(id_questao)}>${id_questao}</a></td>` +
			`<td class='large' id=${id_questao}><a target='_blank' alt="${rotulo}" href=${links.enviar_questao(id_questao)}>${rotulo}</a></td>` +
			`<td class='medium'>${dia_inicio}</td>` +
			`<td class='medium'>${dia_final}</td>`
		;
	}

	//////////////////////////////////////////// [ MAIN ] ////////////////////////////////////////////
	(function(){
		banco = banco.map(x => x.replace(/ /g,'').split(','));
		banco.map(arrDadosQuestao => inserirQuestao(...arrDadosQuestao) );

		for(x of banco){
			let id=x[0];
			const link = links.questao(id);
			const rawlink = links.raw_questao(id);
			id='#'+x[0];

			// Definindo os títulos nas linhas adicionadas:
			$.get(rawlink, null).done(function(text){
				let tituloQuestao = $(text).find('h1').html();
				tituloQuestao = `&nbsp;&#187;&nbsp;<a target='_blank' href=${rawlink} style='color:#af5302;'>${tituloQuestao}</a>&nbsp;`;
				$(id).append(tituloQuestao);
			}).fail(function(err){ console.error("questão não encontrada",err);})

			// Definindo o status de cada questão:
			$.get(link, null).done(function(text){
				let cor = "rgba(143, 16, 16, 0.49)"; // vermelho
				let qStatus = $(text).find('#place').find('h3');
				if(qStatus.length === 0) qStatus = "PENDENTE";
				else{  qStatus="RESOLVIDO"; cor = "rgba(16, 143, 18, 0.48)"; } // verde
				qStatus = `&nbsp;<b style="color:${cor};">${qStatus}</b>`
				$(id).append(qStatus);
			});

			// extra:
			$(id).find('a[alt]').hover(
				function(){ $(this).html('enviar'); },
				function(){ $(this).html($(this).attr('alt')); })

		}
	})();


})(jQuery);
