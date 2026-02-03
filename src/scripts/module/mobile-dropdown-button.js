function mobileDropdownButton() {
	const menuButton = document.getElementById('menu-open-button')
	const dropdown = document.getElementById('mobile-dropdown')
	const nav = document.getElementById('nav')
	const navContact = document.getElementById('nav-contact')
	const mobileBp = window.matchMedia('(max-width: 48em)')
	const menuIconUse = menuButton?.querySelector('use')
	const ICON_MENU = '/images/svg/svgs.svg#icon-menu'
	const ICON_CROSS = '/images/svg/svgs.svg#icon-close'

	if (menuButton && dropdown && nav) {
		// nav
		const clonedNav = nav.cloneNode(true)
		clonedNav.classList.remove('only-desktop')
		clonedNav.classList.add('mobile-dropdown__nav')
		clonedNav.removeAttribute('id')
		dropdown.appendChild(clonedNav)

		// nav-contact (ниже nav)
		if (navContact) {
			const clonedContact = navContact.cloneNode(true)
			clonedContact.classList.remove('only-desktop')
			clonedContact.classList.add('mobile-dropdown__contact')
			clonedContact.removeAttribute('id')
			dropdown.appendChild(clonedContact)
		}

		const closeDropdown = () => {
			dropdown.classList.remove('is-open')
			dropdown.hidden = true
			menuButton.setAttribute('aria-expanded', 'false')
			menuIconUse?.setAttribute('href', ICON_MENU)
		}

		const openDropdown = () => {
			dropdown.hidden = false
			requestAnimationFrame(() => dropdown.classList.add('is-open'))
			menuButton.setAttribute('aria-expanded', 'true')
			menuIconUse?.setAttribute('href', ICON_CROSS)
		}

		const toggleDropdown = () => {
			if (!mobileBp.matches) {
				closeDropdown()
				return
			}
			dropdown.classList.contains('is-open') ? closeDropdown() : openDropdown()
		}

		menuButton.addEventListener('click', toggleDropdown)

		document.addEventListener('click', event => {
			if (!dropdown.classList.contains('is-open')) return
			const target = event.target
			if (target instanceof Node && !dropdown.contains(target) && !menuButton.contains(target)) {
				closeDropdown()
			}
		})

		mobileBp.addEventListener('change', () => {
			if (!mobileBp.matches) closeDropdown()
		})

		dropdown.addEventListener('click', event => {
			const target = event.target
			if (target instanceof HTMLAnchorElement) closeDropdown()
		})
	}
}
mobileDropdownButton()
