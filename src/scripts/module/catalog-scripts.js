function catalogDropdown() {
	const BP_PX = 768 // <- замени на свой $bp в px

	const SELECTOR_TRIGGER = '[data-catalog-dropdown-trigger]'
	const SELECTOR_SLOT = '[data-catalog-dropdown-slot]'

	const CLASS_OPEN = 'is-open'
	const CLASS_COLLAPSED = 'is-collapsed'

	const homes = new Map() // id -> { parent, next }

	const isMobile = () => window.innerWidth <= BP_PX

	const rememberHome = holder => {
		if (!holder || !holder.id) return
		if (homes.has(holder.id)) return
		homes.set(holder.id, { parent: holder.parentElement, next: holder.nextElementSibling })
	}

	const restoreHome = holder => {
		const home = homes.get(holder.id)
		if (!home || !home.parent) return

		if (home.next && home.next.parentNode === home.parent) {
			home.parent.insertBefore(holder, home.next)
		} else {
			home.parent.appendChild(holder)
		}
	}

	const getSlot = id => document.querySelector(`${SELECTOR_SLOT}[data-catalog-dropdown-slot="${id}"]`)

	const ensurePlacement = holder => {
		if (!holder) return

		rememberHome(holder)

		if (isMobile()) {
			const slot = getSlot(holder.id)
			if (slot) slot.appendChild(holder)
		} else {
			restoreHome(holder)
		}
	}

	document.addEventListener('click', e => {
		const trigger = e.target.closest(SELECTOR_TRIGGER)
		if (!trigger) return

		e.preventDefault()

		const targetId = trigger.getAttribute('aria-controls')
		if (!targetId) return

		const holder = document.getElementById(targetId)
		if (!holder) return

		const wasOpen = holder.classList.contains(CLASS_OPEN)

		// если открываем и это мобилка — перекидываем под карточку (в слот)
		if (!wasOpen) ensurePlacement(holder)

		holder.classList.toggle(CLASS_OPEN, !wasOpen)
		holder.classList.toggle(CLASS_COLLAPSED, wasOpen)

		trigger.textContent = wasOpen ? 'подробнее' : 'скрыть'
		trigger.setAttribute('aria-expanded', String(!wasOpen))
	})

	window.addEventListener('resize', () => {
		document.querySelectorAll('.catalog__dropdown-list-holder[id]').forEach(holder => {
			rememberHome(holder)
			if (!isMobile()) restoreHome(holder)
		})
	})
}

function catalogListToggle() {
	const ITEMS_LIMIT = 4
	const SELECTOR_TOGGLE = '[data-catalog-toggle]'
	const SELECTOR_ITEM = '[data-catalog-item]'
	const CLASS_HIDDEN = 'is-hidden'

	const setCollapsed = holder => {
		const items = holder.querySelectorAll(SELECTOR_ITEM)
		items.forEach((el, i) => {
			el.classList.toggle(CLASS_HIDDEN, i >= ITEMS_LIMIT)
		})

		const btn = holder.querySelector(SELECTOR_TOGGLE)
		if (btn) {
			btn.setAttribute('aria-expanded', 'false')
			const span = btn.querySelector('span')
			if (span) span.textContent = 'смотреть все'
		}
	}

	const init = () => {
		document.querySelectorAll('.catalog__dropdown-list-holder').forEach(setCollapsed)
	}

	document.addEventListener('click', e => {
		const btn = e.target.closest(SELECTOR_TOGGLE)
		if (!btn) return

		e.preventDefault()

		const holder = btn.closest('.catalog__dropdown-list-holder')
		if (!holder) return

		const items = holder.querySelectorAll(SELECTOR_ITEM)
		const expanded = btn.getAttribute('aria-expanded') === 'true'
		const next = !expanded

		items.forEach((el, i) => {
			if (i >= ITEMS_LIMIT) el.classList.toggle(CLASS_HIDDEN, !next)
		})

		btn.setAttribute('aria-expanded', String(next))
		const span = btn.querySelector('span')
		if (span) span.textContent = next ? 'свернуть' : 'смотреть все'
	})

	init()
}
function catalogLineDropToggle() {
	const BTN_ID = 'dropdown-list-line-drop-btn'
	const TARGET_CLASS = 'catalog__dropdown-list-line-drop'
	const CLASS_OPEN = 'is-open'

	const btn = document.getElementById(BTN_ID)
	if (!btn) return

	btn.addEventListener('click', () => {
		const isOpen = btn.classList.toggle(CLASS_OPEN)

		document.querySelectorAll(`.${TARGET_CLASS}`).forEach(el => {
			el.style.display = isOpen ? 'flex' : ''
		})

		const span = btn.querySelector('span')
		if (span) span.textContent = isOpen ? 'скрыть категории' : 'все категории'
	})
}

catalogLineDropToggle()
catalogDropdown()
catalogListToggle()
