function projectPresentationSwiper() {
	if (typeof Swiper === 'undefined') return

	const el = document.querySelector('.project__presentation-swiper')
	if (!el) return

	const prevBtn = document.querySelector('.projects__mob-slider-prev')
	const nextBtn = document.querySelector('.projects__mob-slider-next')

	const GAP_REM_DESKTOP = 4
	const GAP_REM_MOBILE = 1.2

	const remToPx = rem => {
		const fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
		return rem * fs
	}

	const swiper = new Swiper(el, {
		speed: 600,
		loop: true,
		slidesPerView: 3,
		grid: {
			rows: 2,
			fill: 'column'
		},
		spaceBetween: remToPx(GAP_REM_DESKTOP),

		navigation: {
			prevEl: prevBtn,
			nextEl: nextBtn
		},

		breakpoints: {
			0: {
				slidesPerView: 2,
				grid: {
					rows: 3,
					fill: 'column'
				},
				spaceBetween: remToPx(GAP_REM_MOBILE)
			},
			769: {
				slidesPerView: 3,
				grid: {
					rows: 2,
					fill: 'row'
				},
				spaceBetween: remToPx(GAP_REM_DESKTOP)
			}
		}
	})

	// пересчитываем gap при resize (root font-size может меняться)
	window.addEventListener('resize', () => {
		const isMobile = window.innerWidth <= 768
		swiper.params.spaceBetween = remToPx(isMobile ? GAP_REM_MOBILE : GAP_REM_DESKTOP)
		swiper.update()
	})
}

projectPresentationSwiper()
