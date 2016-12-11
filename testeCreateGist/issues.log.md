----------
12/07/2016
----------

Para capturar o campo do email/login ou senha:
==============================================
```js
$('input[type="email"], input[name="email"]')
$('input[type="password"], input[name="password"]')
$('input').filter('[type="email"], [name="email"]') // com jQuery
```
> (c) http://stackoverflow.com/questions/9005361/jquery-attribute-selector-for-multiple-values
<!--  
- [x] https://accounts.google.com/
- [x] https://login.live.com/
- [x] https://www.netflix.com/
-->


Algoritmo para criptografar um texto:
=====================================
1. dado o texto alvo **texto_str** converter caracteres para ASCII => **texto_ascii**
2. dado uma chave de tamanho N bytes (caracteres) **chave_str** converter caracteres para ASCII => **chave_ascii**
3. multiplicar cada elemento de **texto_ascii** por um elemento de **chave_ascii** na posição associada _(usar mod)_

> DRAFT e.g.:
> ```js
> Array.prototype.toString = function() { return this.join(' '); }
>
> var texto_str = "O teste master"
> var chave_str  = "AbCd"
>
> // se 'texto' for String então tratar como criptografia, senão, tratar como descriptografia
> function codificar(texto, strKey){
> 	if(Array.prototype.slice.call(arguments).length != 2) return [];
>
> 	const arrayMap = Array.prototype.map;
> 	const toASCII  = x => x.charCodeAt(0);
> 	const arrKey = arrayMap.call(strKey, toASCII);
> 	var j = arrKey.length;
>
> 	// criptografando:
> 	if(typeof texto === "string"){
> 		var arrText = arrayMap.call(texto, toASCII);
> 		return arrText.map( (ascii, i) => ascii * arrKey[i % j] );
> 	}
> 	// descriptografando:
> 	return texto.map( (ascii, i) => ascii / arrKey[i % j] );
> }
>
> var arrText = Array.prototype.map.call(texto_str, x => x.charCodeAt(0));
> console.log('original        ', arrText);
>
> var criptografado = codificar(texto_str, chave_str);
> console.info('criptografado   ',criptografado);
>
> var descriptografado = codificar(criptografado, chave_str);
> console.info('descriptografado',descriptografado);
> ```


----------
12/08/2016
----------

Para editar um arquivo, usar:
=============================
```js
function editarGist(gistid){
	return function(filename){
		// procurar pelo {gistid}
		// editar o arquivo de nome {filename}
		return 'string com o conteúdo alterado';
	};
}

var editarArquivo = editarGist('id do gist');
let conteudoEditado = editarArquivo('nome do arquivo nesse gist');
```

Para usar dados externos:
=========================
> ```js
> // @grant    GM_getResourceText
> // @resource authentication /path/to/privatedfile.js
> // ...
> eval(GM_getResourceText("authentication"));
> const AUTH = gist_privateData;
> GIST_USERNAME = AUTH.username;
> PERSONAL_ACCESS_TOKEN = AUTH.useroauth;
> ```



----------
12/09/2016
----------

Para descriptografar após recuperar:
====================================
> ```js
> function(senhaprivada, callback_tratarsenha){
>  var response = '{ "nome":"mynome", "senha":"mysenha" }';
>  response = JSON.parse(response);
>  response.senha = callback_tratarsenha(response.senha);  
>  return response;
> }
> ```



----------
12/11/2016
----------

Para descriptografar uma String (novo GM):
==========================================
```js
String.prototype.isEmpty = function() {
	return !(this.trim());
}
/**
 * @param {?} texto - o texto a ser (de)codificado.
 * @param {String} strKey - a chave de (de)codificação.
 * @param {String} delim - o seprador (considerando 'texto' como {String})
 */
function conversor(texto, strKey, delim="/"){
	/**
	 * @param {?} texto - se for {String} então codifica, senão ({Array}), descodifica.
	 * @return {Array} Os caracteres após a (de)codificação para código ASCII.
	 */
	this.codificar = function(){
		if(strKey.isEmpty()) return [];

		const arrayMap = Array.prototype.map;
		const toASCII  = x => x.charCodeAt(0);
		const arrKey = arrayMap.call(strKey, toASCII);
		var j = arrKey.length;

		// criptografando:
		if(typeof texto === "string"){
			var arrText = arrayMap.call(texto, toASCII);
			return arrText.map( (ascii, i) => ascii * arrKey[i % j] );
		}
		// descriptografando:
		return texto.map( (ascii, i) => ascii / arrKey[i % j] );
	};

	/**
	 * @param {?} texto - {Array} ou {String} (com separador) que armazenam os códigos ASCII que serão convertidos.
	 * @return {String} A conversão dos valores do argumento (ASCII) para caracteres.
	 */
	this.traduzir = function() { // lida com 'texto' como {String} dos ASCIIs criptografados separados por 'delim'
		if(strKey.isEmpty()) return "";
		var asciiValues = texto;
		if(typeof texto === "string" ) texto = texto.split(delim);
		asciiValues = this.codificar();
		return String.fromCharCode(...asciiValues);
	}
}

/* TESTES:
new conversor("1234", "A").codificar()			 // Array [ 3185, 3250, 3315, 3380 ]
new conversor("4225/4290/4355/4420", "A").traduzir() 	 // "ABCD"
new conversor([ 4225, 4290, 4355, 4420 ], "A").traduzir() // "ABCD"
*/
```
