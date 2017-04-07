// ==UserScript==
// @name        CodeBench+
// @namespace   https://github.com/micalevisk/GM_scripts/tree/master/CodeBench+
// @description	Aumenta em 100% as chances de a carta sorteada ser a desejada. (ES6)
// @author      Micael Levi
// @language    pt-br
// @include     *//codebench.icomp.ufam.edu.br/index.php?r=trabalho%2Fview&id=*&turma=*
// @version     0.07-4
// @grant       none
// @run-at		document-end
// ==/UserScript==

(function(){
	initSystem();
})();


const REGEX_ACAO = new RegExp(/(andar|forca)=(\d+)/);//[1] contém o tipo, [2] a quantidade

/**
 * Cria um novo "botão" no menu
 * e caixa de texto para o novo tipo de submissão.
 */
function initSystem(){
	if(! $('a[id^=menu_submeter_codigo_]').length ) return;//verifica se o trabalho ainda pode ser submetido
	const ID_INPUT_TEXT = "hard_acao_";
	
	$("div.ide-menu .ide-menu-item:nth-child(4)").each(function(){
		let pai = $(this).find('ul.dropdown-menu');//barra de menu
		const exercicio_id = pai.attr('aria-labelledby').match(/\d+$/)[0];

		///Novos elementos para a página
		const texto = '<li>'+ '<a>' + `<input type="text" id="${ID_INPUT_TEXT}${exercicio_id}" value="andar=5">&nbsp;` + '</a>' +'</li>';
		const botao = $( '<li>'+ `<a href="#" id=menu_submeter_hard_${exercicio_id}>`+ '<span style="float: left">Submeter Hard</span>&nbsp;'+ '</a>'+ '</li>' );

		///Ação do eveno de click do novo botão de submissão
		let submeter_hard = () => {
			let acao = $('#'+ ID_INPUT_TEXT + exercicio_id).val();
			euQuero(acao, exercicio_id);
		};

		///Adicionando no HTML
		pai.append(texto);
		pai.append( () => botao.click(submeter_hard) );
	});
}

/**
 * Utilizado para submeter uma questão e alterar
 * @param {String} acao - A ação que as cartas deverão receber; casa com a RegEx 'REGEX_ACAO'
 * @param {String} exercicio_id - id da questão que será submetida.
 */
function euQuero(acao, exercicio_id){
	if(!acao || typeof acao !== 'string' || !REGEX_ACAO.test(acao)) return;

	///Submeter
	$('#submeter_' + exercicio_id).trigger('click');

	///Função para editar as cartas geradas pela submissão correta
	let editarCartas = () => {
		$('#block_result_' + exercicio_id + ' .card').each(function(){
			let $dados= $('span[data-cartaid]', this);
			$dados.attr('data-acao', acao);
			$dados.attr('data-title', __getMessageFor(acao));
		});
	};

	///Esperar 1 segundo e editar as cartas
	setTimeout(editarCartas, 1000);
}

/**
 * Utilizado para criar uma mensagem para as cartas (atributo 'data-title').
 * @param {String} acao
 * @return {String} A mensagem especfica para a ação dada.
 */
function __getMessageFor(acao){
	const _acao = acao.match(REGEX_ACAO); if(!_acao) return;
	const msg = {
		 andar:(num) => `Parabéns! Sua habilidade na resolução desta questão lhe deu o direito de andar ${num} casas!`
		,forca:(num) => `Parabéns! Você encontrou uma poção mágica e ganhou ${num} unidades de força!`
	};

	let num = _acao[2];
	return (_acao[1] === 'forca') ? msg.forca(num) : msg.andar(num);
}
