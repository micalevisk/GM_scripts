// ==UserScript==
// @name     Registrar Caminho
// @description Adiciona marcações em itens e ajusta o scroll para o último item feito.
// @include  http*://javascript.info/
// @include  http*://interactivepython.org/runestone/static/CS152f17/index.html*
// @include  http*://eloquentjavascript.net/index.html*
// @version  2.1
// @grant    none
// ==/UserScript==

(function (domain){

  const __storage = unsafeWindow.localStorage
  const updateKeyOnStorage = (key, value) => __storage.setItem(key, JSON.stringify(value))
  const loadFromStorage = key => __storage.getItem(key)

  const getKeyById = id => `__checkbox:${id}`

  function onChange(evt) {
    const self = evt.target
    const id = self.getAttribute('id')
    updateKeyOnStorage(getKeyById(id), self.checked)
    if (self.checked) self.parentNode.style.opacity = 0.5
    else self.parentNode.style.opacity = 1
  }


  // domain -> [itemSelector, fnNodeToScroll]
  const itemsSelectors = {
           'javascript.info': ['div.list-sub__title', node => node.parentElement.closest('div')],
     'interactivepython.org': ['li.toctree-l2',       node => node.parentElement.parentElement.childNodes[0]],
    'eloquentjavascript.net': ['.toc>li'],
  }

  if (domain in itemsSelectors) {
    const input = document.createElement('input')
		input.type = 'checkbox'
    let lastCheckedNode;

    Array.prototype.map.call(
      document.querySelectorAll( itemsSelectors[domain][0] ),
      (targetNode, idx) => {
        const checkbox = input.cloneNode(false)
        checkbox.id = idx
        checkbox.checked = loadFromStorage( getKeyById(idx) )
        checkbox.addEventListener('change', onChange)

        if (checkbox.checked) {
          lastCheckedNode = targetNode
          targetNode.style.opacity = 0.5
        } else {
          targetNode.firstElementChild.after(checkbox)
        }
   	 }
    )

    if (lastCheckedNode && itemsSelectors[domain][1]) itemsSelectors[domain][1](lastCheckedNode).scrollIntoView()
  }

}(document.domain))
