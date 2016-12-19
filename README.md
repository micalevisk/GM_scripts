> [jQuery Selectors](https://www.w3.org/TR/CSS2/selector.html#matching-attrs) ×
> [jQuery Cheat Sheet](https://oscarotero.com/jquery/) ×
> [Markdown tips & tricks](https://daringfireball.net/projects/markdown/syntax) ×
> [JSON minifier/beautify](http://codebeautify.org/jsonviewer)


⨳ testeCreateGist.user.js
==========================

### [⩯][CREATEGIST] FIXME
- [ ]	privar dados de acesso = usar o **require** para exportar outro arquivo (privado com configs)
- [x]	usar o setTimeout para esperar a resposta do POST antes de redirecionar para a o login <!-- http://stackoverflow.com/questions/5100726/js-jquery-form-submit-delay -->
- [ ]	não criar novo Gist, apenas alterar _(PATCH incrementando o arquivo)_
- [ ]	__IN THE END__ refatorar código

### [⩲][CREATEGIST] TODO
- [ ]	implementar uma função usando o [gistachio.getFiles](https://github.com/stuartpb/gistachio#gistachiogetfilesgistid-opts-callback)
- [x]	alterar formato de publicação para um _JSON_ com um array principal contendo os objetos que serão os dados sobre o login
- [ ]	generalizar para gerenciamento de _gists_ no Gist (criar, editar e recuperar _gists_)
- [ ]	alterar nome do projeto/script para **managerGistJS** quando for tornar público
- [x]	implementar algoritmo que criptografa/descriptografa um texto dado uma chave (privada)
- [x]	criptografar senha antes de salvar
- [x]	identificar o click no ENTER
- [ ]	generalizar para identificar qualquer campo _login_ e não _email_ apenas
- [ ]	generalizar para identificar os campos de _login_ e _senha_ de qualquer página web (JS puro)
- [ ]	migrar com a mesma ideia, para o [PasteBin](http://pastebin.com/api) que posta realmente privado
- [x]	alterar modo de obtenção da data/horario corrente utilizar [Formatador de Data](http://jsfromhell.com/geral/date-format)
- [ ]	criar função que recebe uma String no formato JSON e converte para objeto com campo 'senha' descriptografado
- [ ]	utilizar o [GM_getValue](https://wiki.greasespot.net/GM_getValue) e [GM_setValue](https://wiki.greasespot.net/GM_setValue) para recuperar/salvar dados localmente ```(sem usar GIST)```


⨳ testePostPastebin.user.js
============================

### [⩯][POSTPASTEBIN] FIXME
- [ ]	na função **getAPI_USER_KEY** definir obtenção de argumentos para a função de _callback_
- [ ]	argumentos para o _callback_ deve ser um array

### [⩲][POSTPASTEBIN] TODO
- [ ]	generalizar para gerenciamento de _pastes_ no PasteBin
- [ ]	alterar nome do projeto/script para **managerPasteBinJS** quando for tornar público
- [x]	exportar configurações privadas de outro código _.js_
- [x]	como criar um post privado
- [ ]	função para "editar" um paste = mostrar conteúdo atual e alterá-lo
- [ ]	função para incrementar dados em um paste já existente = recuperar dado; apagar gist; criar um novo





[CREATEGIST]: https://raw.githubusercontent.com/micalevisk/GM_scripts/master/testeCreateGist/issues.log.md "issues testeCreateGist"
[POSTPASTEBIN]: https://raw.githubusercontent.com/micalevisk/GM_scripts/master/testePostPastebin/issues.log.md "issues testePostPastebin"

<!-- https://www.branah.com/braille-translator -->
