// ==UserScript==
// @name        URI Feature
// @description adiciona botão "enviar" na tela cheia da questão
// @namespace   https://github.com/micalevisk/GM_scripts
// @author      Micael Levi
// @locale      pt-br
// @include     *://www.urionlinejudge.com.br/repository/*
// @include     *://www.urionlinejudge.com.br/judge/pt/problems/view/*
// @version     1.10-2
// @grant       none
// @run-at      document-end
// ==/UserScript==

(function() {
	'use strict';

	var id=document.URL.replace(/^.+\/([^/]+$)/, "$1").replace(/[^_]+_(\d+).+$/,"$1");
	if(!id) return;
	var anode = document.createElement("A");
	anode.href=`../../judge/pt/runs/add/${id}`;
// 	anode.target='_blank';
	var cont = document.createTextNode("enviar");
	anode.appendChild(cont);

	var para = document.createElement("P");
	para.appendChild(anode);

	document.getElementsByTagName('strong')[0].append(para)

	if($('a.place-view'))
		$('a.place-view').removeAttr("target")

})();
