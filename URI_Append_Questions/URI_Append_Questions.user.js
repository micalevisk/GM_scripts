// ==UserScript==
// @name        URI Append Questions
// @description Adiciona questões na página
// @namespace   https://github.com/micalevisk/GM_scripts
// @author      Micael Levi
// @locale      pt-br
// @include     *://www.urionlinejudge.com.br/judge/pt/disciplines/view/2040*
// @version     1.10-2
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
	'1896,0212,André',
];
/* |||||||||||||||||||||||||||| */
/* ||||||| APPEND ABOVE ||||||| */
/* |||||||||||||||||||||||||||| */


/**
 * @param {String} id - O identificador exclusivo da questão do URI
 * @param {String} data - A data de início, no formato 'ddmm'
 * @param {String} profAutor - O nome do professor que indicou a questão
 */
function inserirQuestao(id, data, profAutor){
	var elemento = questaoHTML(id, data, profAutor);
	var linha = getElementoAlvo();
	if(elemento) linha.html(elemento);
}


////////////////////////////////////////////////////////////
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


function questaoHTML(id_questao, dia_inicio, prof){
	// const link = `../../problems/view/${id_questao}`;
	const link = `https://www.urionlinejudge.com.br/judge/pt/problems/view/${id_questao}`;
	var titulo= `Autor: ${prof}`;

	var dia_final= ( (inicio) => {
		dia_inicio = dia_inicio.formatLikeDate(); // (ddmmyy) -> dd/mm/yyyy
		var d = inicio.formatLikeDate('en'); // (ddmmyy) -> mm/dd/yyyy
		var diaFinal = new Date(d);
		diaFinal.setDate(diaFinal.getDate() + 7);
		return diaFinal.toLocaleDateString('pt-BR');
	})(dia_inicio);

	return ""+
		`<td class='id'><a target='_blank' href=${link}>${id_questao}</a></td>`        +
		`<td class='large' id=${id_questao}><a href=${link}>${titulo}</a></td>` +
		`<td class='medium'>${dia_inicio}</td>`                     +
		`<td class='medium'>${dia_final}</td>`
	;
}


(function(){
	String.prototype.formatLikeDate = function(lang){
		return this.replace(/(.{2})(.{2})/, (lang==='en') ? "$2/$1/2016" : "$1/$2/2016");
	}

	banco = banco.reverse().map(x => x.split(','));
	banco.forEach(x => inserirQuestao(x[0], x[1], x[2]));

	banco.forEach(function(x){
		let id=x[0];
		// alterando conteúdo da coluna "HOMEWORK"
		// $.get('../../problems/view/'+id, null, function(text){
		$.get('https://www.urionlinejudge.com.br/judge/pt/problems/view/'+id, null, function(text){
			let cor = "#fc3d46";
			let qStatus = $(text).find('#place').find('h3');
			if(qStatus.length === 0) qStatus = "PENDENTE";
			else{  qStatus="RESOLVIDO"; cor="#208c3b"; }
			qStatus = `&nbsp;<b style='color:${cor};'>${qStatus}</b>`
			$('#'+id).append(qStatus);
		});
	});
})();
////////////////////////////////////////////////////////////
