// ==UserScript==
// @name        CodeBench+
// @namespace   https://github.com/micalevisk/GM_scripts/tree/master/CodeBench+
// @description	Aumenta em 100% as chances de a carta sorteada ser a desejada. (ES6)
// @author      Micael Levi
// @language    pt-br
// @include     *//codebench.icomp.ufam.edu.br/index.php?r=trabalho%2Fview&id=*&turma=*
// @version     0.06-4
// @grant       none
// @run-at		document-end
// ==/UserScript==

(function() {

	/////////////////////////////////// [ ADICIONA AS PARADAS ] ///////////////////////////////////
	$("div.ide-menu .ide-menu-item:nth-child(4)").each(function(){
		let pai = $(this).find('ul.dropdown-menu');
		const exercicio_id = pai.attr('aria-labelledby').match(/\d+$/)[0];

		const texto = '<li>'+ '<a>' + `<input type="text" id="hard_acao_${exercicio_id}" value="andar=5">&nbsp;` + '</a>' +'</li>';
		const botao = $( '<li>'+ `<a href="#" id=menu_submeter_hard_${exercicio_id}>`+ '<span style="float: left">Submeter Hard</span>&nbsp;'+ '</a>'+ '</li>' );


		function submeter_hard(){
			let acao = $('#hard_acao_' + exercicio_id).val();
			euQuero(acao);
		}

		if(! $('a[id^=menu_submeter_codigo_]').length ) return;//verifica se o trabalho ainda pode ser submetido
		pai.append(texto);
		pai.append( () => botao.click(submeter_hard) );
	});


	///////////////////////////////////
	function euQuero(acao){
		if(!acao || typeof acao !== 'string') return;
		if(!/(andar|forca)=\d+/.test(acao)) return;
		$('#submeter_' + exercicio_id).trigger('click');

		let editarCartas = function(){
			$('#block_result_' + exercicio_id + ' .card').each(function(){
				let card = $(this);
				let $dados= $('span[data-cartaid]', this);
				$dados.attr('data-acao', acao)
				$dados.attr('data-title', ___formatar___(acao))
			});
		};

		setTimeout(editarCartas, 1000);
	}

	function ___formatar___(acao){
		const _acao = acao.match(/(andar|forca)=(\d+)/); if(!_acao) return;
		const layout = {
			 andar:(num) => `Parabéns! Sua habilidade na resolução desta questão lhe deu o direito de andar ${num} casas!`
			,forca:(num) => `Parabéns! Você encontrou uma poção mágica e ganhou ${num} unidade de força!`
		};

		let num = _acao[2];
		return (_acao[1] === 'forca') ? layout.forca(num) : layout.andar(num);
	}
	///////////////////////////////////


})();

/*
window.addEventListener ("load", GM_main, false);
function GM_main(){}
*/
