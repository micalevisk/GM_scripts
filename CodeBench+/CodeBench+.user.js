// ==UserScript==
// @name        CodeBench+
// @namespace   https://github.com/micalevisk/GM_scripts/tree/master/CodeBench+
// @supportURL	https://github.com/micalevisk
// @description	Aumenta em 100% as chances de a carta sorteada ser a carta desejada com maior valor. (ES6)
// @author      Micael Levi L. C.
// @language    pt-br
// @include     *//codebench.icomp.ufam.edu.br/index.php?r=trabalho%2Fview&id=*&turma=*
// @version     0.06-5
// @grant       none
// @run-at		document-end
// ==/UserScript==

(function(){
	if($("a[id^=menu_submeter_codigo_]").length)//verifica se o trabalho ainda pode ser submetido
		initSistema();
		// console.log.apply(console, ['%c Sistema Em Construção', 'font:1.5em/1.5 italic comic sans,chalkboard,tscu_comic,fantasy;color:hotpink;']);
})();


const REGEX_ACAO = new RegExp(/(andar|forca)(?:=(\d+))?/);//[1] contém o tipo, [2] a quantidade

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
		const texto = '<li>'+ '<a>' + `<input type="text" class="form-control" style="display:initial;" id="${ID_INPUT_TEXT}${exercicio_id}" value="andar" title="andar|forca" required>&nbsp;` + '</a>' +'</li>';
		const botao = $( '<li>'+ `<a href="#" id=${ID_SUBMIT_BUTTON}${exercicio_id}>`+ '<span style="float: left">Submeter Hard</span>' + '<span style="float: right;color:#AAA">F4</span>' + '&nbsp;' + '</a>'+ '</li>' );

		const submeter_hard = () => {///Ação do evento de click do novo botão de submissão
			const acao = $('#'+ ID_INPUT_TEXT + exercicio_id).val();
			euQuero(acao, exercicio_id);
		};

		///Adicionando o evento de tecla de atalho para ativar o 'submeter_hard'
		$(`div[id^=codigo_fonte][id$=${exercicio_id}]`).keydown(function(e){// $("#codigo_fonte_1_" + exercicio_id)
			if(e.which === 115){/// F4
				e.preventDefault();
				e.stopImmediatePropagation();
				$('#' + ID_SUBMIT_BUTTON + exercicio_id).click();
			}
		});

		///Adicionando ao HTML da página:
		menu.append('<li role="separator" class="divider"></li>');///separador
		menu.append(texto);
		menu.append( () => botao.click(submeter_hard) );
	});
}

/**
 * Utilizado para submeter uma questão e alterar.
 * @param {String} acao - A ação que as cartas deverão receber; casa com a RegEx 'REGEX_ACAO'.
 * @param {String} idExercicio - (opcional) id da questão que será submetida.
 */
function euQuero(acao, idExercicio=exercicio_id){
	if(!acao || !REGEX_ACAO.test(acao)) return;
	const cardsSelector = "#block_result_" + idExercicio + " div.card";

	const buscarEClicar = () => {
		const cardFound = findCardWithMaxValue(acao, cardsSelector);
		const card = $(cardsSelector + ` > span[data-cartaid=${cardFound.id}]`).parent()
		card.css('z-index', 100);///Traz para o topo
		card.click();///"Clica" na carta encontrada
	};

	$('#submeter_' + idExercicio).trigger('click');///Submeter
	setTimeout(buscarEClicar, 3500);///Esperar 3,5 segundos e executa o 'buscarEClicar'
}

/**
 * Utilizado para procurar a carta que
 * possui maior valor associado de acordo com a acao dada.
 * @param {String} tipoAcao - A ação buscada, deve ser "andar" ou "forca".
 * @param {String} selector - Seletor para as cartas.
 * @return {Object} - Objeto com as keys: "acao", "max" e "id" (da carta encontrada).
 */
function findCardWithMaxValue(tipoAcao, selector){
	const dados = { max:-1 };

	$(selector).each(function(){
		const card = $(this);
		const id_card   = card.find("span").data("cartaid");
		const acao_card = card.find("span").data("acao");
		const [, key, value] = acao_card.match(REGEX_ACAO);
		const valor_card = Number(value);

		if((key !== tipoAcao) || !(valor_card > dados.max)) return true;///next
		Object.assign(dados, {acao:key, max:valor_card, id:id_card});
	});

	return dados;
}





/******************************** [OUTRO MÉTODO] *******************************
///Função que submete e busca a carta com a ação (válida) desejada:
function euQuero(acao){
  	if(!acao || !/(andar|forca)=\d+/.test(acao)) return;

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
	setTimeout(buscarEClicar, 2000);
}
******************************************************************************/




/********************** [EXIBIR O ID DE CADA EXERCÍCIO] **********************
$('a:has(span)[id*=tab_id_]').each((i,aba) => {
	const tabid = aba.id.replace(/tab_id_(.+)/, '$1');
	$(`span[id=tab_acerto_${tabid}]`).append(`(${tabid})`);
});
*****************************************************************************/
