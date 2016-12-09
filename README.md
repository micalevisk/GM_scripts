> [jQuery Selectors](https://www.w3.org/TR/CSS2/selector.html#matching-attrs) ×
> [jQuery Cheat Sheet](https://oscarotero.com/jquery/) ×
> [Markdown tips & tricks](https://daringfireball.net/projects/markdown/syntax) ×
> [JSON minifier/beautify](http://codebeautify.org/jsonviewer)


\# testeCreateGist.user.js
==========================

### [§][CREATEGIST] FIXME
- [ ]	privar dados de acesso = usar o **require** para exportar outro arquivo (privado com configs)
- [ ]	usar o setTimeout para esperar a resposta do POST antes de redirecionar para a o login
- [ ]	não criar novo Gist, apenas alterar _(PATCH incrementando)_

### [§][CREATEGIST] TODO
- [x]	implementar algoritmo que criptografa/descriptografa um texto dado uma chave (privada)
- [x]	criptografar senha antes de salvar
- [ ]	identificar o click no ENTER
- [ ]	generalizar para identificar qualquer campo _login_ e não _email_ apenas
- [ ]	generalizar para identificar os campos de _login_ e _senha_ de qualquer página web (JS puro)
- [ ]	migrar com a mesma ideia, para o [PasteBin](http://pastebin.com/api) que posta realmente privado
- [x]	alterar modo de obtenção da data/horario corrente utilizar [Formatador de Data](http://jsfromhell.com/geral/date-format)


\# testePostPastebin.user.js
============================

### [§][POSTPASTEBIN] FIXME
- [ ]	na função **getAPI_USER_KEY** definir obtenção de argumentos para a função de _callback_

### [§][POSTPASTEBIN] TODO
- [x]	exportar configurações privadas de outro código _.js_
- [x]	como criar um post privado
- [ ]	função para "editar" um paste = mostrar conteúdo atual e alterá-lo
- [ ]	função para incrementar dados em um paste já existente = recuperar dado; apagar gist; criar um novo





[CREATEGIST]: /testeCreateGist/issues.log.md "issues testeCreateGist"
[POSTPASTEBIN]: /testePostPastebin/issues.log.md "issues testePostPastebin"
