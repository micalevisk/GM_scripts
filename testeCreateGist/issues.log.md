----------
12/07/2016
----------

Para capturar o campo do email/login ou senha:
==============================================
~~~js
$('input[type="email"], input[name="email"]')
$('input[type="password"], input[name="password"]')
$('input').filter('[type="email"], [name="email"]') // com jQuery
~~~
> (c) http://stackoverflow.com/questions/9005361/jquery-attribute-selector-for-multiple-values

- [x] https://accounts.google.com/
- [x] https://login.live.com/
- [x] https://www.netflix.com/


Algoritmo para criptografar um texto:
=====================================
1. dado o texto alvo **texto_str** converter caracteres para ASCII => **texto_ascii**
2. dado uma chave de tamanho N bytes (caracteres) **chave_str** converter caracteres para ASCII => **chave_ascii**
3. multiplicar cada elemento de **texto_ascii** por um elemento de **chave_ascii** na posição associada _(usar mod)_

> DRAFT e.g.:
> ~~~js
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
> ~~~


----------
12/08/2016
----------

Para editar um arquivo, usar:
=============================
~~~js
function editarGist(gistid){
	return function(filename){
		// procurar pelo {gistid}
		// editar o arquivo de nome {filename}
		return 'string com o conteúdo alterado';
        };
}

var editarArquivo = editarGist('id do gist');
let conteudoEditado = editarArquivo('nome do arquivo nesse gist');
~~~
