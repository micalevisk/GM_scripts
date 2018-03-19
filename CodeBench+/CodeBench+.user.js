// ==UserScript==
// @name        CodeBench+
// @namespace   https://github.com/micalevisk/GM_scripts/tree/master/CodeBench+
// @supportURL  https://github.com/micalevisk
// @description Aumenta em 100% as chances de a carta sorteada ser a carta desejada com maior valor possível. [ES6 & airbnb style guide]
// @author      Micael Levi L. C.
// @language    pt-br
// @include     *//codebench.icomp.ufam.edu.br/index.php?r=*view&id=*&turma=*
// @version     0.19-3
// @grant       none
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @run-at      document-end
// ==/UserScript==
// FIXME: não funciona 100% e nem quando executado pelo GM

/*
,ad8888ba,                         88              88888888ba                                        88
d8"'    `"8b                        88              88      "8b                                       88               aa
d8'                                  88              88      ,8P                                       88               88
88              ,adPPYba,    ,adPPYb,88   ,adPPYba,  88aaaaaa8P'   ,adPPYba,  8b,dPPYba,    ,adPPYba,  88,dPPYba,   aaaa88aaaa
88             a8"     "8a  a8"    `Y88  a8P_____88  88""""""8b,  a8P_____88  88P'   `"8a  a8"     ""  88P'    "8a  """"88""""
Y8,            8b       d8  8b       88  8PP"""""""  88      `8b  8PP"""""""  88       88  8b          88       88      88
Y8a.    .a8P  "8a,   ,a8"  "8a,   ,d88  "8b,   ,aa  88      a8P  "8b,   ,aa  88       88  "8a,   ,aa  88       88      ""
`"Y8888Y"'    `"YbbdP"'    `"8bbdP"Y8   `"Ybbd8"'  88888888P"    `"Ybbd8"'  88       88   `"Ybbd8"'  88       88
*/


const REGEX_ACAO = new RegExp(/\b(for[c\xE7]a|andar)\b/);// [1] contém a ação


/**
 * findCardWithMaxValue :: (String, String) -> {acao:a, max:b, id:c}
 * Utilizado para procurar a carta que
 * possui maior valor associado de acordo com a acao dada.
 * @param {string} tipoAcao - A ação buscada, deve ser "andar" ou "forca".
 * @param {string} selector - Seletor para as cartas do exercício corrente.
 * @return {object} - Objeto com as keys: "acao", "max" e "id" (da carta encontrada).
 * @api private
 */
function findCardWithMaxValue(tipoAcao, selector) {
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

/* eslint-disable camelcase */
/**
 * euQuero :: (String, String)
 * Utilizado para submeter uma questão e alterar.
 * @param {string} acao - A ação que as cartas deverão receber; casa com a RegEx `REGEX_ACAO`.
 * @param {string} [idExercicio = exercicio_id] - id da questão que será submetida.
 * @api private
 */
function euQuero(acao, idExercicio = exercicio_id) {
  if (!REGEX_ACAO.test(acao)) return;
  const exerciseSelector = '#block-result-' + idExercicio;

  const buscarEClicar = () => {
    const cardFound = findCardWithMaxValue(acao.replace('ç', 'c'), `${exerciseSelector} [data-cartaid]`);
    const card = $(`${exerciseSelector} span[data-cartaid=${cardFound.id}]`).parent();
    card.css('z-index', 100);// traz para o topo
    card.click();// "clica" na carta encontrada
  };

  $('#submeter-' + idExercicio).trigger('click');// ativa a ação submeter
  setTimeout(buscarEClicar, 3500);// esperar 3,5 segundos e executar o 'buscarEClicar'
}

/**
 * Cria um novo "botão" no menu e
 * uma caixa de texto para o novo tipo de submissão.
 * @api public
 */
function initSistema() {
  const ID_INPUT_TEXT    = 'hard-acao-';
  const ID_SUBMIT_BUTTON = 'menu-submeter-hard-';
  const menus = $('div.ide-menu .ide-menu-item:nth-child(4)');

  function inserirNosMenus() {
    const itensMenu   = $(this).find('div.dropdown-menu');
    const idExercicio = itensMenu.attr('aria-labelledby').match(/\d+$/)[0]; // mesmo que a variável global `id_exercicio` do sistema

    // Novos elementos para a página:
    const texto = `<a class="dropdown-item menu-encerrar">
        <input type="text" class="form-control" style="display:initial; text-transform:lowercase;" id="${ID_INPUT_TEXT}${idExercicio}" value="andar" title="'andar' ou 'força'" required>&nbsp;
      </a>`;
    const botao = $(`<a href="#" id=${ID_SUBMIT_BUTTON}${idExercicio} class="dropdown-item menu-execucao">
        <span style="float: left">Submeter</span>
        <span style="float: right; color:rgb(187, 187, 187);">F4</span> <span style="padding: .1em .4em .7em">
        <i class="fa fa-bolt" style="color:#D9534F;"/>&nbsp;Katiau</span>&nbsp;
      </a>`);

    const submeterHard = () => { // ação do evento de click do novo botão de submissão
      const acaoDesejada = $('#' + ID_INPUT_TEXT + idExercicio).val().trim();
      euQuero(acaoDesejada, idExercicio);
    };

    // Adicionando o evento de tecla de atalho para ativar o 'submeterHard'
    $(`div[id^=codigo-fonte][id$=${idExercicio}]`).keydown((e) => {
      if (e.which === 115) { // adicionar tecla de atalho (F4)
        e.preventDefault();
        e.stopImmediatePropagation();
        $('#' + ID_SUBMIT_BUTTON + idExercicio).click();
      }
    });

    // Adicionando ao HTML da página:
    itensMenu.append('<div class="dropdown-divider"></div>');// adicionar separador
    itensMenu.append(texto);
    itensMenu.append( () => botao.click(submeterHard) );
  }

  menus.each(inserirNosMenus);
}


(function iniciar() {
  // verifica se o trabalho ainda pode ser submetido
  if ( $('a[id^=menu-submeter-codigo-]').length > 0 ) {
    initSistema();
  }
}());
