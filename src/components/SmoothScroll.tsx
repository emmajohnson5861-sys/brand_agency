import { useEffect, useLayoutEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import 'lenis/dist/lenis.css'

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll() {
  useEffect(() => {
    let lastScroll = window.scrollY
    let lastDirection = ''
    const updateScrollbar = () => {
      const nextScroll = Math.max(0, window.scrollY)
      if (nextScroll === lastScroll) return
      const direction = nextScroll > lastScroll ? 'top center' : 'bottom center'
      if (direction !== lastDirection) document.documentElement.style.setProperty('--scrollbar-gradient', direction)
      lastDirection = direction
      lastScroll = nextScroll
    }
    window.addEventListener('scroll', updateScrollbar, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateScrollbar)
      document.documentElement.style.removeProperty('--scrollbar-gradient')
    }
  }, [])

  useLayoutEffect(() => {
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const lenis = new Lenis({
        lerp: 0.12,
        smoothWheel: true,
        wheelMultiplier: 1.15,
        anchors: true,
      })

      const tick = (seconds: number) => lenis.raf(seconds * 1000)
      let menuOpen = false
      let popupOpen = false
      const syncScroll = () => { if (menuOpen || popupOpen) lenis.stop(); else lenis.start() }
      const onMenuState = (event: Event) => { menuOpen = (event as CustomEvent<boolean>).detail; syncScroll() }
      const onPopupState = (event: Event) => { popupOpen = (event as CustomEvent<boolean>).detail; syncScroll() }
      const onNavigate = (event: Event) => {
        event.preventDefault()
        lenis.scrollTo((event as CustomEvent<string>).detail)
      }

      lenis.on('scroll', ScrollTrigger.update)
      window.addEventListener('algofort:menu-state', onMenuState)
      window.addEventListener('algofort:popup-state', onPopupState)
      window.addEventListener('algofort:navigate', onNavigate)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)

      return () => {
        gsap.ticker.remove(tick)
        lenis.off('scroll', ScrollTrigger.update)
        window.removeEventListener('algofort:menu-state', onMenuState)
        window.removeEventListener('algofort:popup-state', onPopupState)
        window.removeEventListener('algofort:navigate', onNavigate)
        lenis.destroy()
      }
    })

    return () => media.revert()
  }, [])

  return null
}
