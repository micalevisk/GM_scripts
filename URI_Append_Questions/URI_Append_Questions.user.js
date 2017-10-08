// ==UserScript==
// @name        URI Append Questions
// @description Adiciona questões na página Academic
// @version     1.25-2
// @namespace   https://github.com/micalevisk/GM_scripts
// @supportURL  https://github.com/micalevisk/
// @author      Micael Levi
// @language    pt-BR
// @include     *://www.urionlinejudge.com.br/judge/pt/disciplines/view/*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// ==/UserScript==

/**************************************************************************
WORKS ON
========
→ Firefox 50.1.0
→ Edge 38.14393.0.0
→ Chrome 55.0.2883.87
→ Opera


FIXME
====
→ tratar caso onde a mesma questão já foi listada
→ verificar (corretamente) a formatação do texto (tratar linhas em branco)
TODO
====
→ opção de "comentar" questão/linha (para não exibi-lá)
→ implementar escolha do separador (1 caractere)
***************************************************************************/


(function initSistema($) {
  let questoesSalvas;
  let banco = [];
  const sep = ',';

  String.prototype.isEmpty = function isEmpty() { return !(this.trim()); };
  String.prototype.isValid = function isValid() { return this.isEmpty() || (/^\d{4}.\d{4}..+$/m).test(this); };// FIXME o multiline não funciona.
  String.prototype.formatLikeDate = function formatLikeDate(lang) {
    const anoAtual = new Date().getFullYear().toString();
    return this.replace(/(.{2})(.{2})/, (lang === 'en') ? `$2/$1/${anoAtual}` : `$1/$2/${anoAtual}`);
  };


  /**
  * Recupera a listagem salva no banco de dados local.
  */
  function getSavedValues() {
    questoesSalvas = GM_getValue('savedquestions', '');
    // TODO ao recuperar as questões, filtrar apenas elementos válidos (sem tag de comentário e corretamente formatado).
    banco = questoesSalvas.isValid() ? questoesSalvas.split('\n') : []; // FIXME remover verificação aqui.
  }

  /**
   * Cria e adiciona os estilos do campo de texto e botão extra na página.
   */
  function botaoPrincipalAdicionarEstilo() {
    const caixaPlaceholder = `id${sep}ddmm${sep}autor`;
    /// CRIANDO E ADICIONANDO CSS
    const margintop = $('.ribbon').height() + parseInt( $('.ribbon').css('padding-top') ) + parseInt( $('.ribbon').css('padding-bottom') );
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
    `<div class="textarea wl"><div id="lbltextarea">Atividades Requisitadas</div><textarea placeholder=${caixaPlaceholder} rows="4" id="whitelist-words" title="uma questão por linha">` + questoesSalvas + '</textarea></div>' +
    '</div>');

    /// OBJETO PRINCIPAL, A BARRA
    $('#menu').append('<li><a href="#" class="uri-skill" id="btnmain">banco</a></li>');
  }

  /**
  * Define os eventos de cliques dos novos objetos criados.
  */
  function botaoPrincipalInitEventos() {
    const $saved = $('<span style="font-size: 90%; color:green">salvo!</span>');
    /// OBJETO QUE SERÁ CONSTRUÍDO
    $('#btnmain').on('click', () => $('#lista-bloco-questoes').slideToggle());

    $('#btnsave').on('click', function () {
      // save new values
      const listagem = $('#whitelist-words').val().replace(/ /g, '').trim();
      if ( listagem.isValid() ) { // FIXME arrumar identificação
        if ( listagem.isEmpty() ) GM_deleteValue('savedquestions');
        else GM_setValue('savedquestions', listagem);

        // add notification
        $(this).before($saved);
        $saved.fadeOut('slow');
        setTimeout(() => location.reload(), 650); // refresh after 650 ms
      }
    });
  }


  //|||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| [ LESS jQuery ] ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||//

  const links = {
    questao(id) {
      return 'https://www.urionlinejudge.com.br/judge/pt/problems/view/' + id;
    },
    raw_questao(id) {
      return `https://www.urionlinejudge.com.br/repository/UOJ_${id}.html`;
    },
    enviar_questao(id) {
      return 'https://www.urionlinejudge.com.br/judge/pt/runs/add/' + id;
    },
  };

  /**
   * @param {String} id - O identificador exclusivo da questão do URI
   * @param {String} data - A data de início da atividade, no formato 'ddmm'
   * @param {String} profAutor - O nome do professor que lançou a atividade
   */
  function inserirQuestao(id, data, profAutor) {
    const elemento = questaoHTML(id, data, profAutor);
    const linha = getElementoAlvo();
    if (elemento) linha.html(elemento);
  }

  /**
   * Itera entre a tabela que contém as questões (na página) até encontrar uma TR "vazia"
   * @return {Object} A primeira table row sem questão
   */
  function getElementoAlvo() {
    const tabela = $('table');
    let alvo = null;

    if (tabela) {
      tabela.find('tbody')
        .children()
        .each(function findFirstEmptyRow() {
          alvo = $(this);
          return !($(this).children().length <= 1); // encontra a primeira linha "vazia".
        });
    }

    return alvo;
  }

  /**
   * Define o código HTML que será inserido.
   * @param {String} idQuestao - O identificador exclusivo da questão do URI
   * @param {String} dia_inicio - A data de início da atividade, no formato 'ddmm'
   * @param {String} prof - O nome do professor que lançou a atividade
   * @param {number} [qtdDiasUteis=7] - O número de dias em que a questão deve ser feita
   * @return {String} O objeto HTML que será inserido.
   */
  function questaoHTML(idQuestao, diaInicio, prof, qtdDiasUteis = 7) {
    const rotulo = `Autor: ${prof}`;
    const dataInicio = diaInicio.formatLikeDate(); // (ddmmyy) -> dd/mm/yyyy
    const dataFinal = (() => {
      const diaFinal = new Date( diaInicio.formatLikeDate('en') ); // (ddmmyy) -> mm/dd/yyyy

      diaFinal.setDate(diaFinal.getDate() + qtdDiasUteis);
      return diaFinal.toLocaleDateString('pt-BR');
    })();

    return '' +
    `<td class='id'><a target='_blank' href=${links.questao(idQuestao)} title="abrir descrição">${idQuestao}</a></td>` +
    `<td class='large' id=${idQuestao}><a target='_blank' alt="${rotulo}" href=${links.enviar_questao(idQuestao)}>${rotulo}</a></td>` +
    `<td class='medium'>${dataInicio}</td>` +
    `<td class='medium'>${dataFinal}</td>`
    ;
  }

  //////////////////////////////////////////// [ MAIN ] ////////////////////////////////////////////
  (function main() {
    getSavedValues();
    botaoPrincipalAdicionarEstilo();
    botaoPrincipalInitEventos();

    banco = banco.map(x => x.replace(/ /g, '').split(','));
    banco.map(arrDadosQuestao => inserirQuestao(...arrDadosQuestao) );

    banco.forEach((x) => {
      let id = x[0];
      const link = links.questao(id);
      const rawlink = links.raw_questao(id);
      id = '#' + x[0];

      /// Definindo os títulos nas linhas adicionadas:
      $.get(rawlink, null).done((text) => {
        let tituloQuestao = $(text).find('h1').html();
        tituloQuestao = `&nbsp;&#187;&nbsp;<a target='_blank' href=${rawlink} style='color:#af5302;' title="abrir em tela cheia">${tituloQuestao}</a>&nbsp;`;
        $(id).append(tituloQuestao);
      }).fail((xhr, status, error) => {
        console.error(`Erro questão ${id}: ${error}`);
        $(id).parent().children().remove();
      });

      /// Definindo o status de cada questão:
      $.get(link, null).done((text) => {
        const qStatus = $(text).find('#place').find('h3');
        const nivelQuestao = $(text).find('h3').first().parents()
                                    .find('span')
                                    .html()
                                    .replace(/.+(\d)\s*\/.+/, '$1');
        const cor = (qStatus.length === 0) ? 'rgba(221, 0, 0, 0.5)' : 'rgba(16, 143, 18, 0.5)';
        const lblStatus = `&nbsp;<b style="color:${cor};">(${nivelQuestao})</b>`;

        $(id).append(lblStatus);
        $(id).addClass(qStatus);
      });

      /// extra:
      $(id).find('a[alt]').hover(
        function actEnviar() { $(this).html('enviar'); },
        function addAlt() { $(this).html($(this).attr('alt')); }
      );
    });
  }());
}(jQuery));
