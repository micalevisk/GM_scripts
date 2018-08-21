// ==UserScript==
// @name     PergamumUFAM+
// @description Adiciona um botão para (tentar) renovar todos os títulos emprestados e um botão para agendar no Todoist a próxima renovação.
// @version  0.20-8
// @include  *://pergamum.ufam.edu.br/pergamum/biblioteca_s/meu_pergamum/index.php*
// @grant    none
// @run-at   document-end
// ==/UserScript==


const unsafeWindow = window.wrappedJSObject;

(function (fetch){

  //#region private
  const TODOIST_TOKEN = '---------MY-----API-------TOKEN---------'; // https://todoist.com/prefs/integrations
  //#endregion

  //#region DOM injection
  document.getElementsByClassName('t1')[0].innerHTML += `<button id="btnRenovarTudo" class=btn_renovar>Todos</button>
                                                         <button id="btnEnviarFeedback" class=btn_email>Criar task Todoist</button>`;
  document.getElementById('btnEnviarFeedback').onclick = enviarFeedback;
  document.getElementById('btnRenovarTudo').onclick = function(){
    Array.from( document.getElementsByClassName('btn_renovar') )
         .forEach(x => x.click());
  };
  //#endregion

  function subDaysToDate(d, days) {
    const date = new Date(d.valueOf());
    date.setDate(date.getDate() - days);
    return date;
  }

  function toggleFeedbackButton() {
    const btn = document.getElementById('btnEnviarFeedback');
    btn.disabled = !btn.disabled;
    btn.style.opacity = 1 - 0.5 * btn.disabled;
  }

  // WORKING ONLY ON TAMPERMONKEY:
  // Todoist REST API Reference https://developer.todoist.com/rest/v8
  function createTaskOnTodoist(content, dueDate, priority = 2) {
    // UUID v4 generator non RFC4122 compliant
    function uuidgen() {
      const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    const data = {
      content: content,
      due_date: dueDate, // YYYY-MM-DD
      priority: priority,
    };

    fetch('https://beta.todoist.com/API/v8/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Request-Id': `${uuidgen()}`,
        'Authorization': `Bearer ${TODOIST_TOKEN}`
      },
      body: JSON.stringify(data)
    }).then((resp) => { toggleFeedbackButton(); }).catch(console.info);
  }

  function recuperarDatasDevolucao() {
    const nodes = Array.from( document.querySelectorAll('td.txt_cinza_10[bgcolor="#ffffff"]') );
    const node2Date = (node) => {
      const dateStr = node.innerHTML.split('/');
      return new Date(dateStr[2], dateStr[1] - 1, dateStr[0]); // ISO YYYY-MM-DDTHH:MM:SS
    };

    return [ nodes[3], nodes[6], nodes[9], nodes[12] ].map(node => node2Date(node));
  }

  function enviarFeedback() {
    toggleFeedbackButton();

    const datasDevolucaoOrdenadas = recuperarDatasDevolucao().sort();
    const dataMaisProxima = datasDevolucaoOrdenadas[ datasDevolucaoOrdenadas.length - 1 ];
    const dataProximaRenovacao = subDaysToDate(dataMaisProxima, 1).toLocaleDateString();

    const dueDate = dataProximaRenovacao.replace(/(\d+)\/(\d+)\/(\d+)/, '$3-$2-$1');
    return createTaskOnTodoist('renovar empréstimos pergamum', dueDate);
  }

}(unsafeWindow.fetch));
