;(() => {
	const CONFIG = {
		side: 'right',
		offset: 1, // отступ от края
		trackWidth: 28, // ширина области (под 23px big tick + запас)
		tickGap: 8, // расстояние между палочками
		small: { w: 12, h: 1 },
		big: { w: 23, h: 1 },
		patternSmallCount: 5, // 5 маленьких -> 1 большая
		colorVar: 'var(--color-grey-200)',
		zIndex: 9999
	}

	let els = {
		root: null,
		track: null,
		indicator: null
	}

	const clamp = (v, a, b) => Math.max(a, Math.min(b, v))

	function injectCss() {
		const css = `
      /* hide native scrollbar */
      html { scrollbar-width: none; -ms-overflow-style: none; }
      html::-webkit-scrollbar, body::-webkit-scrollbar { width: 0 !important; height: 0 !important; }
      body { overflow-y: auto; }

      .csb-root{
        position: fixed;
        top: 0;
        bottom: 0;
        ${CONFIG.side}: ${CONFIG.offset}px;
        width: ${CONFIG.trackWidth}px;
        z-index: ${CONFIG.zIndex};
        pointer-events: none;
      }

      .csb-track{
        position: absolute;
        inset: 0;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        justify-content: flex-start;
        gap: ${CONFIG.tickGap}px;
      }

      .csb-tick{
        height: 1px;
        background: ${CONFIG.colorVar};
        opacity: 1;
        flex: 0 0 auto;
      }
      .csb-tick--small{ width: ${CONFIG.small.w}px; }
      .csb-tick--big{ width: ${CONFIG.big.w}px; }

      .csb-indicator{
        position: absolute;
        ${CONFIG.side}: 0;
        top: 0;
        transform: translateY(0);
        width: 18px;
        height: 18px;
				margin-right: 28px;
        display: grid;
        place-items: center;
        pointer-events: auto; /* чтобы можно было перетаскивать */
        cursor: grab;
        user-select: none;
        touch-action: none;
      }
      .csb-indicator:active{ cursor: grabbing; }

      .csb-indicator svg{
        width: 2rem;
        height: 2rem;
        display: block;
        fill: none;
        /* если твоя стрелка смотрит не туда — подправь rotate */
        transform: rotate(0deg);
      }
    `
		const style = document.createElement('style')
		style.setAttribute('data-custom-scrollbar', '1')
		style.textContent = css
		document.head.appendChild(style)
	}

	function buildDom() {
		els.root = document.createElement('div')
		els.root.className = 'csb-root'
		els.root.setAttribute('aria-hidden', 'true')

		els.track = document.createElement('div')
		els.track.className = 'csb-track'

		els.indicator = document.createElement('div')
		els.indicator.className = 'csb-indicator'
		els.indicator.innerHTML = `
      <svg class="icon w-2 h-2" aria-hidden="true">
        <use href="/images/svg/svgs.svg#icon-navigation-arrow"></use>
      </svg>
    `

		els.root.appendChild(els.track)
		els.root.appendChild(els.indicator)
		document.body.appendChild(els.root)
	}

	function clearTicks() {
		els.track.textContent = ''
	}

	function renderTicks() {
		clearTicks()

		const trackRect = els.track.getBoundingClientRect()
		const usableHeight = trackRect.height // padding уже учтен layout'ом
		const step = CONFIG.tickGap + 1 // 1px высота палочки
		const count = Math.max(1, Math.floor(usableHeight / step))

		// первая — маленькая, дальше: 5 маленьких -> 1 большая -> повтор
		// индекс big: 6-я, 12-я, 18-я... (если считать с 1)
		for (let i = 1; i <= count; i++) {
			const tick = document.createElement('div')
			const isBig = i % (CONFIG.patternSmallCount + 1) === 0
			tick.className = 'csb-tick ' + (isBig ? 'csb-tick--big' : 'csb-tick--small')
			els.track.appendChild(tick)
		}

		updateIndicator()
	}

	function getScrollProgress() {
		const doc = document.documentElement
		const max = Math.max(0, doc.scrollHeight - window.innerHeight)
		if (max === 0) return 0
		return clamp(window.scrollY / max, 0, 1)
	}

	function updateIndicator() {
		if (!els.root) return
		const prog = getScrollProgress()

		const rootRect = els.root.getBoundingClientRect()
		const indRect = els.indicator.getBoundingClientRect()

		const topPad = 10 // совпадает с .csb-track padding
		const bottomPad = 10

		const minY = topPad
		const maxY = Math.max(minY, rootRect.height - bottomPad - indRect.height)

		const y = minY + prog * (maxY - minY)
		els.indicator.style.top = `${y}px`
	}

	function enableDrag() {
		let dragging = false

		const onPointerMove = e => {
			if (!dragging) return
			const doc = document.documentElement

			const rootRect = els.root.getBoundingClientRect()
			const indH = els.indicator.getBoundingClientRect().height

			const topPad = 10
			const bottomPad = 10
			const minY = rootRect.top + topPad
			const maxY = rootRect.bottom - bottomPad - indH

			const y = clamp(e.clientY - indH / 2, minY, maxY)
			const prog = (y - minY) / Math.max(1, maxY - minY)

			const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight)
			window.scrollTo({ top: prog * maxScroll, behavior: 'auto' })
		}

		const onPointerUp = () => {
			dragging = false
			try {
				els.indicator.releasePointerCapture?.(1)
			} catch {}
			window.removeEventListener('pointermove', onPointerMove)
			window.removeEventListener('pointerup', onPointerUp)
		}

		els.indicator.addEventListener('pointerdown', e => {
			dragging = true
			els.indicator.setPointerCapture?.(e.pointerId)
			window.addEventListener('pointermove', onPointerMove, { passive: true })
			window.addEventListener('pointerup', onPointerUp, { passive: true })
		})

		// клик по треку — прыгнуть
		els.root.addEventListener(
			'click',
			e => {
				// не обрабатываем клик по самой стрелке (drag)
				if (e.target.closest('.csb-indicator')) return

				const doc = document.documentElement
				const rootRect = els.root.getBoundingClientRect()
				const topPad = 10
				const bottomPad = 10
				const usable = rootRect.height - topPad - bottomPad

				const y = clamp(e.clientY - rootRect.top - topPad, 0, usable)
				const prog = usable <= 0 ? 0 : y / usable

				const maxScroll = Math.max(0, doc.scrollHeight - window.innerHeight)
				window.scrollTo({ top: prog * maxScroll, behavior: 'auto' })
			},
			{ passive: true }
		)
	}

	function init() {
		// не создавать второй раз
		if (document.querySelector('[data-custom-scrollbar="1"]')) return

		injectCss()
		buildDom()
		renderTicks()
		enableDrag()

		window.addEventListener('scroll', updateIndicator, { passive: true })
		window.addEventListener(
			'resize',
			() => {
				// на ресайзе пересчитать количество палочек
				renderTicks()
			},
			{ passive: true }
		)

		// если контент меняет высоту (SPA/ленивая подгрузка)
		const ro = new ResizeObserver(() => updateIndicator())
		ro.observe(document.documentElement)
	}

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init)
	} else {
		init()
	}
})()
