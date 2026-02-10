function mainSwiperInit() {
	if (typeof Swiper === 'undefined') return
	const mainSwiper = new Swiper('.main__swiper', {
		slidesPerView: 'auto',
		centeredSlides: true,
		loop: true,
		speed: 600,
		watchSlidesProgress: true,

		pagination: {
			el: '.main__swiper .swiper-pagination',
			clickable: false,
			type: 'custom',
			renderCustom: (swiper, current, total) => {
				const pad = n => String(n).padStart(2, '0')
				return `
				<div class="main__pg">
					<span class="main__pg-cur font-ibm textcol-grey-200 bp:text-1.6">${pad(current)}</span>
					<span class="main__pg-tot font-ibm textcol-grey-200 bp:text-1.6">${pad(total)}</span>
				</div>
			`
			}
		},

		navigation: {
			nextEl: '.main__swiper .swiper-button-next',
			prevEl: '.main__swiper .swiper-button-prev'
		}
	})
}
function mainToggleCategories() {
	const btn = document.querySelector('[data-categories-toggle]')
	const cards = Array.from(document.querySelectorAll('[data-category-extra]'))

	if (!btn || cards.length === 0) return

	const DURATION = 260
	const EASING = 'cubic-bezier(0.2, 0.8, 0.2, 1)'
	const isMobile = () => window.matchMedia('(max-width: 768px)').matches

	function prepareCard(el) {
		// ВАЖНО: убираем only-mobile, чтобы он не конфликтовал
		el.classList.remove('only-desktop')
	}

	function hideInstant(el) {
		el.style.display = 'none'
		el.style.opacity = ''
		el.style.transform = ''
		el.style.transition = ''
		el.style.overflow = ''
		el.style.willChange = ''
	}

	function showAnimated(el) {
		el.style.display = ''
		el.style.overflow = 'hidden'
		el.style.willChange = 'opacity, transform'
		el.style.opacity = '0'
		el.style.transform = 'translateY(0.1rem)'
		el.style.transition = 'none'
		void el.offsetHeight
		el.style.transition = `opacity ${DURATION}ms ${EASING}, transform ${DURATION}ms ${EASING}`
		el.style.opacity = '1'
		el.style.transform = 'translateY(0)'
		setTimeout(() => {
			el.style.overflow = ''
			el.style.willChange = ''
		}, DURATION)
	}

	function hideAnimated(el) {
		el.style.overflow = 'hidden'
		el.style.willChange = 'opacity, transform'
		el.style.transition = `opacity ${DURATION}ms ${EASING}, transform ${DURATION}ms ${EASING}`
		el.style.opacity = '0'
		el.style.transform = 'translateY(0.1rem)'
		setTimeout(() => hideInstant(el), DURATION)
	}

	// подготовка карточек
	cards.forEach(prepareCard)

	let opened = false
	if (isMobile()) cards.forEach(hideInstant)

	btn.addEventListener('click', () => {
		if (!isMobile()) return

		opened = !opened
		cards.forEach(el => (opened ? showAnimated(el) : hideAnimated(el)))

		const label = btn.querySelector('span')
		if (label) label.textContent = opened ? 'скрыть категории' : 'все категории'
	})

	window.addEventListener(
		'resize',
		() => {
			opened = false
			if (!isMobile()) {
				cards.forEach(el => {
					el.style.display = ''
					el.style.opacity = ''
					el.style.transform = ''
					el.style.transition = ''
					el.style.overflow = ''
					el.style.willChange = ''
				})
			} else {
				cards.forEach(hideInstant)
			}
			const label = btn.querySelector('span')
			if (label) label.textContent = 'все категории'
		},
		{ passive: true }
	)
}
mainSwiperInit()
mainToggleCategories()
