function projectsCustomSlider() {
	const sliders = Array.from(document.querySelectorAll('[data-projects-slider]'))
	if (!sliders.length) return

	const mod = (n, m) => ((n % m) + m) % m

	sliders.forEach(root => {
		const slots = Array.from(root.querySelectorAll('[data-swipe-slot]'))
		const imgs = Array.from(root.querySelectorAll('img[data-swipe-src]'))
		const btnPrev = root.querySelector('[data-swipe-prev]')
		const btnNext = root.querySelector('[data-swipe-next]')

		if (!slots.length || !imgs.length) return

		let index = 0
		const total = imgs.length

		function render() {
			slots.forEach((slot, i) => {
				const img = imgs[mod(index + i, total)]
				slot.replaceChildren(img) // переносим сам <img>, классы/атрибуты сохраняются
			})
		}

		btnNext?.addEventListener('click', () => {
			index = mod(index + 1, total)
			render()
		})

		btnPrev?.addEventListener('click', () => {
			index = mod(index - 1, total)
			render()
		})

		render()
	})
}

function projectsMobSwipers() {
	if (typeof Swiper === 'undefined') return

	const roots = Array.from(document.querySelectorAll('[data-mob-project]'))
	if (!roots.length) return

	const GAP_REM = 1.8
	const remToPx = rem => {
		const fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
		return rem * fs
	}

	const instances = roots
		.map(root => {
			const el = root.querySelector('.projects__mob-swiper')
			const prevBtn = root.querySelector('.projects__mob-slider-prev')
			const nextBtn = root.querySelector('.projects__mob-slider-next')
			if (!el) return null

			return new Swiper(el, {
				slidesPerView: 1,
				spaceBetween: remToPx(GAP_REM),
				speed: 600,
				loop: true,
				navigation: {
					prevEl: prevBtn,
					nextEl: nextBtn
				}
			})
		})
		.filter(Boolean)

	// пересчёт spaceBetween при изменении root font-size
	window.addEventListener('resize', () => {
		const px = remToPx(GAP_REM)
		instances.forEach(sw => {
			sw.params.spaceBetween = px
			sw.update()
		})
	})
}

function dropdownToggle() {
	const buttons = Array.from(document.querySelectorAll('[data-toggle-btn]'))
	if (!buttons.length) return

	buttons.forEach(btn => {
		const targetSelector = btn.dataset.toggleTarget
		if (!targetSelector) return

		const targets = Array.from(document.querySelectorAll(targetSelector))
		if (!targets.length) return

		const openText = btn.dataset.toggleOpenText || 'скрыть'
		const closeText = btn.dataset.toggleCloseText || 'показать'

		btn.addEventListener('click', () => {
			const isOpen = btn.classList.toggle('is-open')

			targets.forEach(el => {
				el.classList.toggle('hidden', !isOpen)
			})

			const span = btn.querySelector('span')
			if (span) span.textContent = isOpen ? openText : closeText
		})
	})
}

dropdownToggle()
projectsCustomSlider()
projectsMobSwipers()
