// ==UserScript==
// @name	URI Append Questions
// @description	Adiciona questões na página Academic
// @version	1.16-2
// @namespace	https://github.com/micalevisk/GM_scripts
// @supportURL	https://github.com/micalevisk/
// @author	Micael Levi
// @language	pt-BR
// @include	*://www.urionlinejudge.com.br/judge/pt/disciplines/view/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// ==/UserScript==

// http://desenvolvimentoparaweb.com/html/textarea-dicas-truques-textarea/
// http://www.criarweb.com/artigos/740.php
// http://www.bootply.com/

/**************************************************************************
WORKS ON
========
→ Firefox 50.1.0
→ Edge 38.14393.0.0
→ Chrome 55.0.2883.87
→ Opera


TODO
====
→ não verifica (corretamente) a formatação do texto
→ implementar escolha do separador (1 caractere)
***************************************************************************/




(function($) {

 	/// GLOBAL
	var questoesSalvas, banco=[], sep = ',';

	String.prototype.isEmpty = function(){ return !(this.trim()); };
	String.prototype.isValid = function(){ return this.isEmpty() || (/^\d{4}.\d{4}..+$/m).test(this); };// FIXME o multiline não funciona.
	String.prototype.formatLikeDate = function(lang){
		let anoAtual=new Date().getFullYear().toString();
		return this.replace(/(.{2})(.{2})/, (lang==='en') ? `$2/$1/${anoAtual}` : `$1/$2/${anoAtual}`);
	};


	/**
	 * Recupera a listagem salva no banco de dados local.
	 */
	function getSavedValues(){
		questoesSalvas = GM_getValue('savedquestions', '');
		banco = questoesSalvas.isValid() ? questoesSalvas.split('\n') : []; // TODO melhorar verificação.
	}

	/**
	 * Cria e adiciona os estilos do campo de texto e botão extra na página.
	 */
	function botaoPrincipal_adicionarEstilo(){
		/// CRIANDO E ADICIONANDO CSS
		var margintop = $('.ribbon').height() + parseInt( $('.ribbon').css('padding-top') ) + parseInt( $('.ribbon').css('padding-bottom') );
		$('head').append('<style> ' +
			'.uri-skill { color: #a11909; font-weight: bold; } ' +
			'#lista-bloco-questoes { width: 180px; height:360px; display: flex; flex-flow: row wrap; align-items: baseline; position: fixed; right: 150px; top:' + margintop + 'px; padding: 0 5px 20px 5px; background-color: rgba(255, 255, 255, 0.85); box-shadow: 0 1px 1px 0 rgba(0,0,0,.1); border: 1px solid #e8e8e8; border-top: 0; z-index: 9999999999; } ' +
			'#lista-bloco-questoes div { box-sizing: border-box; padding: 3px; } ' +
			'#lista-bloco-questoes .textarea div { width: 100%;  text-align: center; font-weight: 500; } ' +
			'#lista-bloco-questoes .textarea textarea { resize: none; width: 100%; padding: 4px; border: 2px solid rgba(0,0,0,.13); box-sizing: border-box; margin-top:5px; margin-bottom:0px; } ' +
			'#lista-bloco-questoes .textarea.wl { width: 100%; } ' +
			'#btnsave { font-size:10px; height: 25px; width: 180px; float: none; padding: 5px; margin: 5px; } ' +
			'#lbltextarea { color: #61B9A9; text-shadow: 1px 1px 1px rgba(6, 94, 78, 0.40); } ' +
		'</style>');

		/// CRIANDO A CAIXA
		$('body').append('<div id="lista-bloco-questoes" style="display: none">' +
				'<input id="btnsave" title="salvar no banco de dados" class="send-green send-right" value="registrar" type="submit">' +
				`<div class="textarea wl"><div id="lbltextarea">Atividades Requisitadas</div><textarea placeholder=id${sep}ddmm${sep}autor rows="4" id="whitelist-words" title="uma questão por linha">` + questoesSalvas + '</textarea></div>' +
				'</div>');

		/// OBJETO PRINCIPAL, A BARRA
		$('#menu').append('<li><a href="#" class="uri-skill" id="btnmain">banco</a></li>');
	}

	/**
	 * Define os eventos de cliques dos novos objetos criados.
	 */
	function botaoPrincipal_initEventos(){
		$saved = $('<span style="font-size: 90%; color:green">salvo!</span>');
		/// OBJETO QUE SERÁ CONSTRUÍDO
		$('#btnmain').on('click', () => $('#lista-bloco-questoes').slideToggle());

		$('#btnsave').on('click', function() {
			// save new values
			let listagem = $('#whitelist-words').val().replace(/ /g, "").trim();
			if(listagem.isValid()){ // FIXME arrumar identificação.
				listagem.isEmpty() ? GM_deleteValue('savedquestions') : GM_setValue('savedquestions', listagem);
				// add notification
				$(this).before($saved);
				$saved.fadeOut("slow");
				setTimeout(function() { location.reload(); }, 650); // refresh
			}
		});
	}


	//|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| [ LESS jQuery ] ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//

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
	};

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
			`<td class='id'><a target='_blank' href=${links.questao(id_questao)} title="abrir descrição">${id_questao}</a></td>` +
			`<td class='large' id=${id_questao}><a target='_blank' alt="${rotulo}" href=${links.enviar_questao(id_questao)}>${rotulo}</a></td>` +
			`<td class='medium'>${dia_inicio}</td>` +
			`<td class='medium'>${dia_final}</td>`
		;
	}

	//////////////////////////////////////////// [ MAIN ] ////////////////////////////////////////////
	(function(){
		getSavedValues();
		botaoPrincipal_adicionarEstilo();
		botaoPrincipal_initEventos();

		banco = banco.map(x => x.replace(/ /g,'').split(','));
		banco.map(arrDadosQuestao => inserirQuestao(...arrDadosQuestao) );

		for(x of banco){
			let id=x[0];
			const link = links.questao(id);
			const rawlink = links.raw_questao(id);
			id='#'+x[0];

			/// Definindo os títulos nas linhas adicionadas:
			$.get(rawlink, null).done(function(text){
				let tituloQuestao = $(text).find('h1').html();
				tituloQuestao = `&nbsp;&#187;&nbsp;<a target='_blank' href=${rawlink} style='color:#af5302;' title="abrir em tela cheia">${tituloQuestao}</a>&nbsp;`;
				$(id).append(tituloQuestao);
			}).fail(function(xhr, status, error){
				console.error("Erro questão "+id+": "+error);
				$(id).parent().children().remove();
			});

			/// Definindo o status de cada questão:
			$.get(link, null).done(function(text){
				let cor, qStatus = $(text).find('#place').find('h3');
				if(qStatus.length === 0){
					cor = "rgba(221, 0, 0, 0.5)";
					qStatus = "PENDENTE";
				}
				else{
					cor = "rgba(16, 143, 18, 0.5)";
					qStatus="RESOLVIDO";
				}
				let lblStatus = `&nbsp;<b style="color:${cor};">${qStatus}</b>`;
				$(id).append(lblStatus);
				$(id).addClass(qStatus);
			});

			/// extra:
			$(id).find('a[alt]').hover(
				function(){ $(this).html('enviar'); },
				function(){ $(this).html($(this).attr('alt')); }
			);
		}
	})();


})(jQuery);
