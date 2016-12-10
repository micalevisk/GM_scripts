// ==UserScript==
// @name        URI Append Questions
// @description Adiciona questões na página
// @namespace   https://github.com/micalevisk/GM_scripts
// @author      Micael Levi
// @locale      pt-br
// @include     *://www.urionlinejudge.com.br/judge/pt/disciplines/view/2040*
// @version     1.10-2
// @icon	https://raw.githubusercontent.com/micalevisk/GM_scripts/master/URI_Append_Questions/URI.ico
// @grant       none
// ==/UserScript==



/// [id],[ddmm],[autor] ///
var banco =
[
	'1077,0912,Moisés',
	'1215,0912,Moisés',
	'1256,0912,Moisés',
	'1251,0912,Moisés',
	'1527,0212,André',
	'1896,0212,André'
];
/* |||||||||||||||||||||||||||| */
/* ||||||| APPEND ABOVE ||||||| */
/* |||||||||||||||||||||||||||| */


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


////////////////////////////////////////////////////////////

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
 * Itera entre a tabela que contém as questões (na página) até encontrar uma TR "vazia"
 * @return {Object} - A primeira table row sem questão
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


// ====================================================================== [ MAIN ] ====================================================================== //
(function(){
	String.prototype.formatLikeDate = function(lang){
		return this.replace(/(.{2})(.{2})/, (lang==='en') ? "$2/$1/2016" : "$1/$2/2016");
	}

	banco = banco.reverse().map(x => x.replace(/ /g,'').split(','));
	banco.map(arrDadosQuestao => inserirQuestao(...arrDadosQuestao) );

	for(x of banco){
		let id=x[0];
		const link = links.questao(id);
		const rawlink = links.raw_questao(id);
		id='#'+x[0];

		// Definindo os títulos nas linhas adicionadas:
		$.get(rawlink, null, function(text){
			let tituloQuestao = $(text).find('h1').html();
			tituloQuestao = `&nbsp;&#187;&nbsp;<a target='_blank' href=${rawlink} style='color:#af5302;'>${tituloQuestao}</a>&nbsp;`;
			$(id).append(tituloQuestao);
		});

		// Definindo o status de cada questão:
		$.get(link, null, function(text){
			let cor = "#f63333"; // vermelho
			let qStatus = $(text).find('#place').find('h3');
			if(qStatus.length === 0) qStatus = "PENDENTE";
			else{  qStatus="RESOLVIDO"; cor="#08812680"; } // verde
			qStatus = `&nbsp;<b style='color:${cor};'>${qStatus}</b>`
			$(id).append(qStatus);
		});

		// extra:
		$(id).find('a[alt]').hover(
			function(){ $(this).html('enviar'); },
			function(){ $(this).html($(this).attr('alt')); })

	}
})();
