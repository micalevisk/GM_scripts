// ==UserScript==
// @name        YoutubeTags
// @namespace   https://gist.github.com/micalevisk/8cf208b3522ab935eec65c10ba13cd13
// @supportURL  https://gist.github.com/micalevisk/8cf208b3522ab935eec65c10ba13cd13
// @version     1.04-2
// @description Show tags on Youtube videos.
// @author      Micael Levi
// @match       *://www.youtube.com/*
// @grant       GM_getResourceText
// @resource 	spfremove https://greasyfork.org/scripts/16935-disable-spf-youtube/code/Disable%20SPF%20Youtube.user.js
// @locale		pt-br
// ==/UserScript==

// TODO		traduzir para inglês
// TODO		identificar (e indicar) que não há tags
// FIXME	Usar o GM_getValue(?) para obter o json respectivo
// FIXME	melhorar código (se baser no Block Youtube Users)
// TODO		alterar separação das tags



(function () {
	"use strict";
	eval(GM_getResourceText("spfremove"));

	var YouTags = {

		// loadJSON
		loadJSON: function (path, success, error){
			var xhr = new XMLHttpRequest();
			xhr.onreadystatechange = function(){
				if(xhr.readyState === XMLHttpRequest.DONE){
					if(xhr.status === 200)
						if(success) success(JSON.parse(xhr.responseText));
					else
						if(error) error(xhr);
				}
			};

			xhr.open("GET", path, true);
			xhr.send();
		},

		// getTags
		getTags: function (json){
			var tags = json.items[0].snippet.tags;

			if(tags === null) return null;
			return {
				"tags": tags.toString().replace(/,/g, "; "),
				"quantidade": tags.length
			};
		},

		// viewTags
		viewTags: function(data){
			var tagsArray = YouTags.getTags(data);
			if(tagsArray === null) return;
			var qtdTags = tagsArray.quantidade;
			var tagsStr = tagsArray.tags;

			var titleTags = qtdTags+" Tags";
			if(tagsStr.length === 0) tagsStr = "[nenhuma]";

			var elementoTags = document.getElementById('tags-field');
			if( elementoTags === null ){
				var lix = document.createElement("LI");
				lix.className = "watch-meta-item yt-uix-expander-body";
				//   lix.id = "info-tags";

				var titulo = document.createElement("H4");
				titulo.className = "title";
				titulo.id = 'tag-title';
				titulo.appendChild( document.createTextNode(titleTags) );

				var luy = document.createElement("UL");
				luy.className = "content watch-info-tag-list";

				var liy = document.createElement("LI");
				liy.id = 'tags-field';


				liy.appendChild( document.createTextNode(tagsStr) ); // document.getElementById('tags-field').innerHTML = getTags(data)
				luy.appendChild(liy);

				lix.appendChild(titulo);
				lix.appendChild(luy);
				document.getElementsByClassName('watch-extras-section')[0].appendChild(lix);
			}
			else{
				document.getElementById('tag-title').innerHTML = titleTags;
				elementoTags.innerHTML = tagsStr;
			}
		},

		//
		showTags: function (){
			var videoID = document.querySelector("meta[itemprop='videoId'").getAttribute("content"); // = $("meta[itemprop='videoId']").getAttribute("content");
			var jsonLink = 'https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAZiST8vkBnAbxFIZO_KfhQ7YU0amBv0To&fields=items(snippet(tags))&part=snippet&id='+videoID;
			YouTags.loadJSON(jsonLink, YouTags.viewTags, function(xhr) { console.error(xhr); });
		}

	};

	if(/^.+watch\?v=.+$/i.test(document.location.href))
		YouTags.showTags();
}());



// (c) http://tutorialzine.com/2014/06/10-tips-for-writing-javascript-without-jquery/
// (c) http://blog.garstasio.com/you-dont-need-jquery/ajax/#jsonp
// (c) http://stackoverflow.com/questions/9838812/how-can-i-open-a-json-file-in-javascript-without-jquery
/*
var videoID = $("meta[itemprop='videoId']").attr("content");
// don't work on Youtube:
$.get('https://www.googleapis.com/youtube/v3/videos?key=AIzaSyAZiST8vkBnAbxFIZO_KfhQ7YU0amBv0To&fields=items(snippet(title,description,tags))&part=snippet&id='+videoID).then(function(json) {
	console.log( json.items[0]['snippet'].title );
	console.log( json.items[0]['snippet'].description );
	console.log( json.items[0]['snippet'].tags.toString() );
});
*/