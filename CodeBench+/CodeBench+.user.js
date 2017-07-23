// ==UserScript==
// @name        CodeBench+
// @namespace   https://github.com/micalevisk/GM_scripts/tree/master/CodeBench+
// @supportURL  https://github.com/micalevisk
// @description Aumenta em 100% as chances de a carta sorteada ser a carta desejada com maior valor possível. [ES6 & airbnb style guide]
// @author      Micael Levi L. C.
// @language    pt-br
// @include     *//codebench.icomp.ufam.edu.br/index.php?r=*view&id=*&turma=*
// @version     0.21-7
// @grant       none
// @run-at      document-end
// ==/UserScript==

(function iniciar() {
  // console.log.apply(console, ['%c Sistema Em Manutenção', 'font:1.5em/1.5 italic comic sans,chalkboard,tscu_comic,fantasy;color:hotpink;']);

  // verifica se o trabalho ainda pode ser submetido
  if ( $('a[id^=menu_submeter_codigo_]').length > 0 ) {
    initSistema();
  }
}());


const REGEX_ACAO = new RegExp(/(for[c\xE7]a|andar)(?:=(\d+))?/);// [1] contém o tipo, [2] a quantidade

/**
* Cria um novo "botão" no menu e
* uma caixa de texto para o novo tipo de submissão.
*/
function initSistema() {
  const ID_INPUT_TEXT    = 'hard_acao_';
  const ID_SUBMIT_BUTTON = 'menu_submeter_hard_';
  const itensMenu = $('div.ide-menu .ide-menu-item:nth-child(4)').find('ul.dropdown-menu');
  const idExercicio = itensMenu.attr('aria-labelledby').match(/\d+$/)[0];

  // Novos elementos para a página:
  const texto = `<li> <a><input type="text" class="form-control" style="display:initial; text-transform:lowercase;" id="${ID_INPUT_TEXT}${idExercicio}" value="andar" title="'andar' ou 'força'" required>&nbsp;</a> </li>`;
  const botao = $(`<li> <a href="#" id=${ID_SUBMIT_BUTTON}${idExercicio}> <span style="float: left">Submeter</span> <span style="float: right;color:#AAA">F4</span> <span style="padding: .1em .4em .7em"><i class="fa fa-bolt" style="color:#D9534F;"/>&nbsp;Katiau</span>&nbsp;</a> </li>`);

  const submeterHard = () => { // ação do evento de click do novo botão de submissão
    const acaoDesejada = $('#' + ID_INPUT_TEXT + idExercicio).val().trim().toLowerCase();
    euQuero(acaoDesejada, idExercicio);
  };

  // Adicionando o evento de tecla de atalho para ativar o 'submeterHard'
  $(`div[id^=codigo_fonte][id$=${idExercicio}]`).keydown(( e ) => { // $("#codigo_fonte_1_" + idExercicio)
    if (e.which === 115) { // F4
      e.preventDefault();
      e.stopImmediatePropagation();
      $('#' + ID_SUBMIT_BUTTON + idExercicio).click();
    }
  });

  // Adicionando ao HTML da página:
  itensMenu.append('<li role="separator" class="divider"></li>');// separador
  itensMenu.append(texto);
  itensMenu.append( () => botao.click(submeterHard) );
}

/**
* Utilizado para submeter uma questão e alterar.
* @param {String} acao - A ação que as cartas deverão receber; casa com a RegEx 'REGEX_ACAO'.
* @param {String} idExercicio - (opcional) id da questão que será submetida.
*/
function euQuero( acao = '', idExercicio = exercicio_id ) {
  if (!REGEX_ACAO.test(acao)) return;
  const exerciseSelector = '#block_result_' + idExercicio;

  const buscarEClicar = () => {
    const cardFound = findCardWithMaxValue(acao.replace('ç', 'c'), `${exerciseSelector} [data-cartaid]`);
    const card = $(`${exerciseSelector} span[data-cartaid=${cardFound.id}]`).parent();
    card.css('z-index', 100);// traz para o topo
    card.click();// "clica" na carta encontrada
  };

  $('#submeter_' + idExercicio).trigger('click');// ativa a ação submeter
  setTimeout(buscarEClicar, 3500);// esperar 3,5 segundos e executar o 'buscarEClicar'
}

/**
* Utilizado para procurar a carta que
* possui maior valor associado de acordo com a acao dada.
* @param {String} tipoAcao - A ação buscada, deve ser "andar" ou "forca".
* @param {String} selector - Seletor para as cartas do exercício corrente.
* @return {Object} - Objeto com as keys: "acao", "max" e "id" (da carta encontrada).
*/
function findCardWithMaxValue( tipoAcao, selector ) {
  const arrOfSelected = Array.from($(selector));
  const returnLarger = ( acc, card ) => {
    const idCard   = card.getAttribute('data-cartaid');
    const acaoCard = card.getAttribute('data-acao');
    const [, key, value] = acaoCard.match(REGEX_ACAO);
    const valorCard = Number(value);

    return ((key === tipoAcao) && (valorCard > acc.max))
          ? { max: valorCard, id: idCard, acao: key }
          : acc;
  };

  return arrOfSelected.reduce(returnLarger, { max: -1 });
}


/* ******************************* [OUTRO MÉTODO] *******************************
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


/* ********************* [EXIBIR O ID DE CADA EXERCÍCIO] **********************
$('a:has(span)[id*=tab_id_]').each((i,aba) => {
const tabid = aba.id.replace(/tab_id_(.+)/, '$1');
$(`span[id=tab_acerto_${tabid}]`).append(`(${tabid})`);
});
*****************************************************************************/
