function productPdfDownload() {
	const button = document.getElementById('product-download-pdf')
	if (!button) return

	button.addEventListener('click', () => {
		const pdfUrl = button.getAttribute('data-pdf')
		if (!pdfUrl) return

		const link = document.createElement('a')
		link.href = pdfUrl
		link.download = ''
		link.rel = 'noopener'
		document.body.appendChild(link)
		link.click()
		link.remove()
	})
}
function productPresentationSwiper() {
	if (typeof Swiper === 'undefined') return

	const el = document.querySelector('.product__presentation-swiper')
	const thumbsEl = document.querySelector('.product__thumbs-swiper')
	if (!el || !thumbsEl) return

	const prevBtn = document.querySelector('.product__mob-slider-prev')
	const nextBtn = document.querySelector('.product__mob-slider-next')

	const GAP_REM_MAIN = 1
	const GAP_REM_THUMBS = 2

	const remToPx = rem => {
		const fs = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
		return rem * fs
	}
	const thumbs = new Swiper(thumbsEl, {
		slidesPerView: 3,
		spaceBetween: remToPx(GAP_REM_THUMBS),
		watchSlidesProgress: true
	})

	const swiper = new Swiper(el, {
		speed: 600,
		loop: true,
		slidesPerView: 1,

		spaceBetween: remToPx(GAP_REM_MAIN),

		navigation: {
			prevEl: prevBtn,
			nextEl: nextBtn
		},
		thumbs: {
			swiper: thumbs
		}
	})
}

productPresentationSwiper()

productPdfDownload()
