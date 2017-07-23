// ==UserScript==
// @name        BinaryPuzle++
// @description Features para o site binarypuzzle; JS Vanilla & airbnb Style Guide
// @namespace   www.binarypuzzle.com
// @author      Micael Levi
// @language    pt-br
// @include     *binarypuzzle.com/puzzles.php?size=*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @version     0.22-5 [update here when finish]
// @grant       none
// ==/UserScript==

// %%%%%%%%%%%%%%%%%%%%% TODO remover jQuery & AIRBNB Style Guide %%%%%%%%%%%%%%%%%%%%% //
// vide https://gist.github.com/micalevisk/efe29a2a5d1e6988975cbad794e82884
// checar em http://jshint.com/

// --------------------------------- EXTRAS --------------------------------- //

/**
 * @param {function} func - A função que será executada.
 * @param {number} times - (opcional) Quantidade de vezes.
 * @return {function} Função que será executada (passar parâmetros).
 */
function runAnyTimes( func, times = 1 ) {
  // cria um array contendo 'times' vezes o dado 'func'
  const fns = Array(times).fill(func);
  return ( ...args ) => fns.map(fn => fn(...args));
}

/**
 * @param {array} fns - Funções que serão executadas.
 */
function pipe( ...fns ) {
  const PIPE = ( f, g ) => ( ...args ) => g(f(...args));
  return fns.reduce(PIPE);
}

/**
 * @param {string} matrizStr - A matriz planada.
 */
function strToMatriz( matrizStr ) {
  const dividirLinhas  = arr => arr.split('\n');
  const retirarBrancos = arr => arr.filter(x => x.trim());
  const removerBrancos = arr => arr.map(x => x.trim());
  const separarCelulas = arr => arr.map(x => x.split(' '));

  return pipe(
    dividirLinhas,
    retirarBrancos,
    removerBrancos,
    separarCelulas,
  )(matrizStr);
}


// --------------------------------- AUXILIARES --------------------------------- //

/**
* @param {Number} ordem - Quantidade de linhas/colunas da matriz (quadrada);
* @return {String} A matriz formatada em HTML.
*/
function puzzleToStringHTML( ordem ) {
  const getElementsByClassName =  className => document.getElementsByClassName(className);
  const convertHTMLCollection  = collection => Array.from(collection); // [].slice.call(collection);
  const construirMatriz = ( arr ) => {
    const matrizHTML = arr.reduce(( acc, curr, i ) => {
      const cell = curr.textContent.trim().replace(/^$/, '2');
      return acc + cell + ( ((i + 1) % ordem) ? '&nbsp;' : '<br>' );
    }, '');

    return matrizHTML;
  };

  return pipe(
    getElementsByClassName,
    convertHTMLCollection,
    construirMatriz,
  )('puzzlecel');
}

/**
 * @param {String} strMatriz - A matriz planada.
 */
function preencherCom( strMatriz ) {
  if (!strMatriz.trim()) return;

  const celulaNaoEditavel = ( i, j ) => {
    const celula = document.getElementById(`cel_${i}_${j}`);
    return celula.style.color.includes('(0, 0, 0)');
  };

  const clicar = ( currVal, line, column ) => {
    // TODO remover func:
    // .text() [x]
    const currCell = $(`#celpar_${line}_${column}`).text().trim();
    // let currCell = $(`#celpar_${line}_${column}`).innerHTML.trim();

    const runCelClick = times => runAnyTimes(CelClick, times)(line, column);
    // f(currCell.length > 0, currVal) = argumento pra 'runCelClick'
    // f(false, 0) = f(true, 1) = 1
    // f(false, 1) = f(true, 0) = 2
    runCelClick(2 - ((currCell.length > 0) === !!Number(currVal)));
  };

  strToMatriz(strMatriz).forEach(( linha, i ) => {
    linha.forEach(( n, j ) => {
      const l = i + 1,
            c = j + 1;
      return celulaNaoEditavel(l, c) || clicar(n, l, c);
    });
  });
}


(function initSistema( $ ) {
  // const $ = (query) => document.querySelector(query);

  // TODO remover func:
  // .attr [x]
  const getAttrAction = el => el.attr('action');
  // const getAttrAction   = el => el.getAttribute('action');
  const matchSize = str => str.match(/size=(\d+)/);
  const removeFirstElem = arr => arr.slice(1);
  const strToInt = str => parseInt(str, 10);

  // ================================ GLOBAL ================================ //
  const ORDEM_MATRIZ = pipe(
    getAttrAction,
    matchSize,
    removeFirstElem,
    strToInt,
  )( $('form#selectpuzzle') );
  // ======================================================================== //

  /*
  const removeElement = (query) => {
    const el = $(query);
    el.parentNode.removeChild(el);
  };
  */

  // TODO remover funcs:
  // .length [x]
  // .remove [x]
  // .insertBefore
  function addPuzzlePlainText() {
    if ($('#puzzle-plain').length > 0) {
      $('#puzzle-plain').remove();
      // if( $('#puzzle-plain') !== null ) removeElement('#puzzle-plain');
    }

    const puzzleHTML = puzzleToStringHTML(ORDEM_MATRIZ);
    $(`<p id="puzzle-plain" class="center">${puzzleHTML}`).insertBefore($('#deleteall').next());
  }

  // TODO remover funcs:
  // .append
  // .on
  // .slideToggle
  // .val
  // .hide
  (function initElementos() {
    const TITLE       = 'insira a matriz resultante',
          PLACEHOLDER = `escrever matriz ${ORDEM_MATRIZ}x${ORDEM_MATRIZ} de 0s e 1s separados por espaços e quebras de linha`,
          MARGINRIGHT = 500,
          MARGINTOP   = 131;

    $('head').append(`<style>
    .botao { color: black; font-weight: bold; background: white; border: solid black 1px; }
    .botao:hover { background: #ebebeb; text-decoration: none; }
    #area-matriz { width:200px; display:flex; flex-flow:row wrap; align-items:baseline; position:fixed; right:${MARGINRIGHT}px; top: ${MARGINTOP}px; padding: 0 5px 20px 5px; background-color: rgb(255, 255, 255); box-shadow: 0 1px 1px 0 rgba(0,0,0,.1); border: 1px solid #e8e8e8; border-top: 0; }
    #area-matriz div { box-sizing: border-box; padding: 3px; }
    #area-matriz .textarea div { width: 100%;  text-align: center; font-weight: 500; }
    #area-matriz .textarea textarea { resize: vertical; width: 100%; padding: 4px; border: 2px solid rgba(0,0,0,.13); box-sizing: border-box; margin-top:5px; margin-bottom:0px; }
    #area-matriz .textarea.wl { width: 100%; }
    #btnDefinirValores { cursor:pointer; font-size:10px; height: 25px; width: 200px; margin: 5px; }
    #lbltextarea { color: #61B9A9; text-shadow: 1px 1px 1px rgba(6, 94, 78, 0.40); }
    </style>`);

    $('body').append('<div id="area-matriz" style="display: none">' +
    '<input id="btnDefinirValores" title="preencher o quebra-cabeça" value="DEFINIR VALORES" type="submit" class="botao">' +
    `<div class="textarea wl"><div id="lbltextarea">Matriz Completa</div><textarea placeholder="${PLACEHOLDER}" rows="${ORDEM_MATRIZ}" id="valores-matriz" title="${TITLE}">` +
    '</textarea></div>' +
    '</div>');

    $('#Menu>p').append('<a href="#" id="btnInserirSolucao">[Inserir Solução]</a>');

    $('#btnInserirSolucao').on('click', () => $('#area-matriz').slideToggle());
    $('#btnDefinirValores').on('click', () => {
      const matriz = $('#valores-matriz').val().trim();
      preencherCom(matriz);
    });

    window.onscroll = function esconderPainel() {
      if (window.pageYOffset > 0) {
        $('#area-matriz').hide();
      }
    };
  }());

  // ------------------------------------------------------------------------ //
  // TODO remover func:
  // .insertAfter
  $('<p class="center"><a href="#" id="btnToString" title="converter">To String</a></p>')
    .insertAfter('#deleteall');

  // TODO remover func:
  // .on
  $('#btnToString')
    .on('click', addPuzzlePlainText);
  // ------------------------------------------------------------------------ //
}(jQuery));
// })(document.querySelector);
