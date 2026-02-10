function initContactsMap() {
	const mapElement = document.getElementById('contacts-map')
	if (!mapElement) return

	let point = mapElement.getAttribute('data-point')
	if (!point) return

	point = point.split(',').map(f => parseFloat(f))

	ymaps.ready(() => {
		const map = new ymaps.Map('contacts-map', {
			center: point,
			zoom: 14,
			controls: []
		})

		const placemark = new ymaps.Placemark(
			point,
			{},
			{
				iconLayout: 'default#image',
				iconImageHref: '/images/map-icon.png',
				iconImageSize: [40, 40],
				iconImageOffset: [-20, -40]
			}
		)

		map.geoObjects.add(placemark)
	})
}
initContactsMap()
