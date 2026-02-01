const menuButton = document.getElementById('menu-open-button')
const dropdown = document.getElementById('mobile-dropdown')
const nav = document.getElementById('nav')
const mobileBp = window.matchMedia('(max-width: 48em)')

if (menuButton && dropdown && nav) {
	const clonedNav = nav.cloneNode(true)
	clonedNav.classList.remove('only-desktop')
	clonedNav.classList.add('mobile-dropdown__nav')
	clonedNav.removeAttribute('id')
	dropdown.appendChild(clonedNav)

	const closeDropdown = () => {
		dropdown.classList.remove('is-open')
		dropdown.hidden = true
		menuButton.setAttribute('aria-expanded', 'false')
	}

	const openDropdown = () => {
		dropdown.hidden = false
		requestAnimationFrame(() => dropdown.classList.add('is-open'))
		menuButton.setAttribute('aria-expanded', 'true')
	}

	const toggleDropdown = () => {
		if (!mobileBp.matches) {
			closeDropdown()
			return
		}

		if (dropdown.classList.contains('is-open')) {
			closeDropdown()
		} else {
			openDropdown()
		}
	}

	menuButton.addEventListener('click', toggleDropdown)

	document.addEventListener('click', event => {
		if (!dropdown.classList.contains('is-open')) {
			return
		}
		const target = event.target
		if (target instanceof Node && !dropdown.contains(target) && !menuButton.contains(target)) {
			closeDropdown()
		}
	})

	mobileBp.addEventListener('change', () => {
		if (!mobileBp.matches) {
			closeDropdown()
		}
	})

	dropdown.addEventListener('click', event => {
		const target = event.target
		if (target instanceof HTMLAnchorElement) {
			closeDropdown()
		}
	})
}
