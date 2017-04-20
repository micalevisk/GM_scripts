// ==UserScript==
// @name        CodeBench+
// @namespace   https://github.com/micalevisk/GM_scripts/tree/master/CodeBench+
// @supportURL	https://github.com/micalevisk
// @description	Aumenta em 100% as chances de a carta sorteada ser a desejada. (ES6)
// @author      Micael Levi L. C.
// @language    pt-br
// @include     *//codebench.icomp.ufam.edu.br/index.php?r=trabalho%2Fview&id=*&turma=*
// @version     0.20-4
// @grant       none
// @run-at		document-end
// ==/UserScript==

(function(){
	if($("a[id^=menu_submeter_codigo_]").length)//verifica se o trabalho ainda pode ser submetido
		initSistema();
})();


const REGEX_ACAO = new RegExp(/(andar|forca)=([1-9]\d*)/);//[1] contém o tipo, [2] a quantidade

/**
 * Cria um novo "botão" no menu e
 * uma caixa de texto para o novo tipo de submissão.
 */
function initSistema(){
	const ID_INPUT_TEXT    = 'hard_acao_';
	const ID_SUBMIT_BUTTON = 'menu_submeter_hard_';

	$("div.ide-menu .ide-menu-item:nth-child(4)").each(function(){
		const menu = $(this).find("ul.dropdown-menu");///barra de menu
		const exercicio_id = menu.attr("aria-labelledby").match(/\d+$/)[0];

		///Novos elementos para a página:
		const texto = '<li>'+ '<a>' + `<input type="text" class="form-control" style="display:initial;" id="${ID_INPUT_TEXT}${exercicio_id}" value="andar=5" required>&nbsp;` + '</a>' +'</li>';
		const botao = $( '<li>'+ `<a href="#" id=${ID_SUBMIT_BUTTON}${exercicio_id}>`+ '<span style="float: left">Submeter Hard</span>' + '<span style="float: right;color:#AAAAAA80">(by Micael)</span>&nbsp;'+ '</a>'+ '</li>' );

		const submeter_hard = () => {///Ação do evento de click do novo botão de submissão
			const acao = $('#'+ ID_INPUT_TEXT + exercicio_id).val();
			euQuero(acao, exercicio_id);
		};

		///Adicionando ao HTML da página:
		menu.append(texto);
		menu.append( () => botao.click(submeter_hard) );
	});
}

/**
 * Utilizado para submeter uma questão e alterar.
 * @param {String} acao - A ação que as cartas deverão receber; casa com a RegEx 'REGEX_ACAO'.
 * @param {String} exercicio_id - id da questão que será submetida.
 */
function euQuero(acao, exercicio_id){
	if(!acao || !REGEX_ACAO.test(acao)) return;
	const editarCartas = () => {///Função para editar as cartas geradas pela submissão correta
		$("#block_result_" + exercicio_id + " .card").each(function(){
			const $dados= $("span[data-cartaid]", this);
			$dados.attr("data-acao", acao);
			$dados.attr("data-title", getMessagemPara(acao));
		});
	};

	$("#submeter_" + exercicio_id).trigger('click');///Submeter
	setTimeout(editarCartas, 1000);///Esperar 1 segundo e editar as cartas
}

/**
 * Utilizado para criar uma mensagem para as cartas (atributo 'data-title').
 * @param {String} acao - A ação desejada; casa com a RegEx 'REGEX_ACAO'.
 * @return {String} A mensagem específica para a ação dada.
 */
function getMessagemPara(acao){
	const [nomeAcao, qtdAcao] = acao.match(REGEX_ACAO).slice(1);
	const msg = {
		 andar: `Parabéns! Sua habilidade na resolução desta questão lhe deu o direito de andar ${qtdAcao} casas!`
		,forca: `Parabéns! Você encontrou uma poção mágica e ganhou ${qtdAcao} unidades de força!`
	};

	return nomeAcao.startsWith('f') ? msg.forca : msg.andar;
}





/******************************** [OUTRO MÉTODO] *******************************
///Função que submete e busca a carta com a ação (válida) desejada:
function euQuero(acao){
  	if(!acao || !/(andar|forca)=[1-5]/.test(acao)) return;

	const buscarEClicar = () => {
		$('#block_result_' + exercicio_id + ' .card').each(function() {
			const card = $(this);
			const acao_card = card.find('span').data('acao');///Valor do atributo 'data-acao'

			if (acao_card === acao){
				$(this).css('z-index', 100);///Traz para o topo
				$(this).click();///"Clica" na carta
				return false;
			}
		});
	};

	$('#submeter_' + exercicio_id).trigger('click');
	setTimeout(buscarEClicar, 1000);
}
******************************************************************************/




/********************** [EXIBIR O ID DE CADA EXERCÍCIO] **********************
$('a:has(span)[id*=tab_id_]').each((i,aba) => {
	const tabid = aba.id.replace(/tab_id_(.+)/, '$1');
	$(`span[id=tab_acerto_${tabid}]`).append(`(${tabid})`);
});
*****************************************************************************/
