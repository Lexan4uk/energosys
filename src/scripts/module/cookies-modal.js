function cookiesModal() {
	const modal = document.getElementById('cookies-modal')
	if (!modal) return

	const KEY = 'cookies-accepted'

	const open = () => modal.classList.add('is-open')
	const close = () => modal.classList.remove('is-open')

	// показать при загрузке, если ещё не приняли
	if (localStorage.getItem(KEY) !== 'true') open()

	// принять
	const acceptBtn = modal.querySelector('[data-cookies-open]')
	if (acceptBtn) {
		acceptBtn.addEventListener('click', e => {
			e.preventDefault()
			localStorage.setItem(KEY, 'true')
			close()
		})
	}

	// закрыть крестиком (без сохранения)
	const closeBtn = modal.querySelector('#cookies-modal-close-btn')
	if (closeBtn) closeBtn.addEventListener('click', close)
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', cookiesModal)
} else {
	cookiesModal()
}
