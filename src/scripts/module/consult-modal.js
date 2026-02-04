function consultModal() {
	const modal = document.getElementById('consult-modal')
	if (!modal) return

	const lockScroll = () => {
		document.documentElement.style.overflow = 'hidden'
		document.body.style.overflow = 'hidden'
	}

	const unlockScroll = () => {
		document.documentElement.style.overflow = ''
		document.body.style.overflow = ''
	}

	const open = () => {
		modal.classList.add('is-open')
		lockScroll()
	}

	const close = () => {
		modal.classList.remove('is-open')
		unlockScroll()
	}

	document.addEventListener('click', e => {
		const target = e.target

		if (target instanceof Element && target.closest('[data-consult-open]')) {
			e.preventDefault()
			open()
			return
		}

		if (target instanceof Element && (target.closest('#consult-modal-close-btn') || target.closest('[data-consult-close]'))) {
			close()
		}
	})

	document.addEventListener('keydown', e => {
		if (e.key === 'Escape' && modal.classList.contains('is-open')) {
			close()
		}
	})
}

if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', consultModal)
} else {
	consultModal()
}
