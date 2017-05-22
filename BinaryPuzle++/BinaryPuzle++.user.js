// ==UserScript==
// @name        BinaryPuzle++
// @description Features para o site binarypuzzle
// @namespace   www.binarypuzzle.com
// @author      Micael Levi
// @language    pt-br
// @include     *binarypuzzle.com/puzzles.php?size=*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
// @version     0.21-5
// @grant       none
// ==/UserScript==

(function($){

	// =============================== GLOBAL =============================== //
	const ORDEM_MATRIZ = parseInt(
		$('form#selectpuzzle')
			.attr('action')
			.match(/size=(\d+)/)
			.slice(1)
	)
	//========================================================================//


	function addPuzzlePlainText(){
		if( $('#puzzle-plain').length > 0 ) $('#puzzle-plain').remove();

		const puzzleHTML = puzzleToStringHTML(ORDEM_MATRIZ)
		$('<p id="puzzle-plain" class="center">' + puzzleHTML)
			.insertBefore( $('#deleteall').next() )
	}

	(function initElementos(){
		const TITLE = "insira a matriz resultante"
		const PLACEHOLDER = `escrever matriz ${ORDEM_MATRIZ}x${ORDEM_MATRIZ} de 0s e 1s separados por espaços e quebras de linha`
		const MARGINTOP = 131;

		$('head').append('<style>' +
						'.botao { color: black; font-weight: bold; background: white; border: solid black 1px; }' +
						'.botao:hover { background: #ebebeb; text-decoration: none; }' +
						'#area-matriz { width: 200px; display: flex; flex-flow: row wrap; align-items: baseline; position: fixed; right: 500px; top:' + MARGINTOP + 'px; padding: 0 5px 20px 5px; background-color: rgb(255, 255, 255); box-shadow: 0 1px 1px 0 rgba(0,0,0,.1); border: 1px solid #e8e8e8; border-top: 0; }' +
						'#area-matriz div { box-sizing: border-box; padding: 3px; }' +
						'#area-matriz .textarea div { width: 100%;  text-align: center; font-weight: 500; }' +
						'#area-matriz .textarea textarea { resize: vertical; width: 100%; padding: 4px; border: 2px solid rgba(0,0,0,.13); box-sizing: border-box; margin-top:5px; margin-bottom:0px; }' +
						'#area-matriz .textarea.wl { width: 100%; }' +
						'#btnDefinirValores { cursor:pointer; font-size:10px; height: 25px; width: 200px; margin: 5px; }' +
						'#lbltextarea { color: #61B9A9; text-shadow: 1px 1px 1px rgba(6, 94, 78, 0.40); }' +
						'</style>')

		$('body').append('<div id="area-matriz" style="display: none">' +
						'<input id="btnDefinirValores" title="preencher o quebra-cabeça" value="DEFINIR VALORES" type="submit" class="botao">' +
						`<div class="textarea wl"><div id="lbltextarea">Matriz Completa</div><textarea placeholder="${PLACEHOLDER}" rows="${ORDEM_MATRIZ}" id="valores-matriz" title="${TITLE}">` + '</textarea></div>' +
						'</div>')

		$('#Menu>p').append('<a href="#" id="btnInserirSolucao">[Inserir Solução]</a>')

		$('#btnInserirSolucao').on('click', () => $('#area-matriz').slideToggle())
		$('#btnDefinirValores').on('click', () => {
			const matriz = $('#valores-matriz').val().trim()
			preencherCom(matriz)
		})

		window.onscroll = function(ev){
			if(window.pageYOffset > 0)
				$('#area-matriz').hide()
		};
	})()


	//------------------------------------------------------------------------//
	$('<p class="center"><a href="#" id="btnToString" title="converter">To String</a></p>')
		.insertAfter('#deleteall')

	$('#btnToString')
		.on("click", addPuzzlePlainText)
	//------------------------------------------------------------------------//

})(jQuery);


function puzzleToStringHTML(ordem){
	const arr = document.getElementsByClassName('puzzlecel')
	let convertido=""
	for(let i=1; i <= arr.length; ++i ){
		let cell = arr[i-1].textContent.trim().replace(/^$/, '2')
		convertido += cell
		if(i%ordem == 0) convertido += '<br>'
		else convertido += '&nbsp;'
	}
	return convertido;
}


function preencherCom(strMatriz){
	const strToMatriz = (m) => {
		return m.split('\n')
			.filter(x => x.trim())
			.map(x => x.trim())
			.map(x => x.split(' '))
	}

	const celulaNaoEditavel = (i,j) => {
		const celula = document.getElementById(`cel_${i}_${j}`)
		return (celula.style.color === 'rgb(0, 0, 0)')
	}

	const valores = { '':'0' , '0':'1' , '1':'' }
	const matriz = strToMatriz(strMatriz)

	matriz.forEach((linha, i) => {
		linha.forEach((n, j) => {
			let l=i+1, c=j+1
			if(celulaNaoEditavel(l,c)) return false

			let currVal = $(`#celpar_${l}_${c}`).text().trim()
			switch(currVal){
				case '':{
					currVal = valores[currVal]
					CelClick(l,c)
				}
				case '0':{
					if(n === '1') CelClick(l,c)
					break;
				}
				case '1':{
					if(n === '0'){
						CelClick(l,c)
						CelClick(l,c)
					}
					break;
				}
			}

		})
	})
}
