// ==UserScript==
// @name        questoesColab
// @description features for TAP colabweb (issue1 branch).
// @namespace   http://bit.ly/colabhack
// @author      Micael Levi
// @locale      pt-br
// @include     https://webdev.icomp.ufam.edu.br/lab/
// @version     1.03-2
// @run-at      document-end
// @icon	https://raw.githubusercontent.com/micalevisk/GM_scripts/master/questoesColab/littlehead.ico
// @grant       none
// ==/UserScript==


/////////////////////////////////////////// [ MAIN SOURCE ] ///////////////////////////////////////////
const gitsrc = 'https://raw.githubusercontent.com/micalevisk/TAP_feelings/issue1/gist/questoesColab.js';
////////////////////////////////////////////////////////////////////////////////////////////////////////

const REGEX_RAW_REPO_URL = /^https?:\/\/raw\.github(?:usercontent)?\.com\/([^/]+\/[^/]+\/[^/]+|[0-9A-Za-z-]+\/[0-9a-f]+\/raw)\/(.+\..+)/i;

var script = document.createElement('SCRIPT');
script.type= 'text/javascript';
script.src = gitsrc.replace(REGEX_RAW_REPO_URL, 'https://' + 'rawgit.com' + '/$1/$2');
document.head.appendChild(script);
