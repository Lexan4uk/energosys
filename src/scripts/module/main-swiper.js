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
