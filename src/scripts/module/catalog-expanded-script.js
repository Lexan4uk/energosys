function initCatalogExpandedToggle() {
	const btn = document.getElementById('dropdown-catalog-expanded-btn')
	const items = document.querySelectorAll('[data-catalog-expanded-hidden]')
	if (!btn || !items.length) return

	const labelEl = btn.querySelector('span')
	const defaultText = (labelEl?.textContent || 'смотреть все').trim()
	const expandedText = 'свернуть'

	let isOpen = false

	// default: hidden
	items.forEach(el => (el.style.display = 'none'))

	const update = () => {
		items.forEach(el => (el.style.display = isOpen ? '' : 'none'))
		if (labelEl) labelEl.textContent = isOpen ? expandedText : defaultText
		btn.setAttribute('aria-expanded', String(isOpen))
	}

	btn.addEventListener('click', e => {
		e.preventDefault()
		isOpen = !isOpen
		update()
	})

	update()
}
initCatalogExpandedToggle()
