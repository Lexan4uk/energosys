const serviceSwiper = new Swiper('.service__swiper', {
	slidesPerView: 'auto',
	centeredSlides: false,
	loop: true,
	speed: 600,

	navigation: {
		nextEl: '.service__nav .swiper-button-next-custom',
		prevEl: '.service__nav .swiper-button-prev-custom'
	}
})
function serviceCategoriesToggle() {
	const BTN_SELECTOR = '[data-service-toggle]'
	const TARGET_SELECTOR = '.main__category-grid .hidden-on-mobile'
	const CLASS_OPEN = 'is-open'

	const btn = document.querySelector(BTN_SELECTOR)
	if (!btn) return

	const items = Array.from(document.querySelectorAll(TARGET_SELECTOR))
	if (!items.length) return

	btn.addEventListener('click', () => {
		const isOpen = btn.classList.toggle(CLASS_OPEN)

		items.forEach(el => {
			el.style.display = isOpen ? 'flex' : ''
		})

		const span = btn.querySelector('span')
		if (span) span.textContent = isOpen ? 'скрыть категории' : 'все категории'
	})
}
serviceCategoriesToggle()
