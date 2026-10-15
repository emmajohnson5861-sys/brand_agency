import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { brandingServices as services } from '../lib/brandingServices'

export default function StudioServiceList({ onProject }: { onProject: () => void }) {
  const listRef = useRef<HTMLOListElement>(null)

  useLayoutEffect(() => {
    const media = gsap.matchMedia()

    media.add({
      desktop: '(min-width: 1025px) and (hover: hover) and (pointer: fine)',
      reducedMotion: '(prefers-reduced-motion: reduce)',
    }, (context) => {
      if (!context.conditions?.desktop) return
      const reducedMotion = context.conditions.reducedMotion
      const cleanups: (() => void)[] = []

      listRef.current!.querySelectorAll<HTMLButtonElement>('.studio-service-row').forEach((row) => {
        const image = row.querySelector<HTMLElement>('.studio-service-preview')!
        const duration = reducedMotion ? 0 : 0.6
        const setX = gsap.quickTo(image, 'x', { duration, ease: 'power3.out' })
        const setY = gsap.quickTo(image, 'y', { duration, ease: 'power3.out' })
        let hovered = false
        let focused = false

        gsap.set(image, { xPercent: -50, yPercent: -50, autoAlpha: 0, scale: 0 })
        const reveal = gsap.to(image, {
          autoAlpha: 1,
          scale: 1,
          duration: reducedMotion ? 0 : 0.4,
          ease: 'power3.out',
          paused: true,
          onReverseComplete: () => { row.classList.remove('is-previewing') },
        })

        const position = (clientX: number, clientY: number, immediate = false) => {
          const rect = row.getBoundingClientRect()
          const halfWidth = image.offsetWidth / 2
          const halfHeight = image.offsetHeight / 2
          const x = Math.min(window.innerWidth - halfWidth - 24, Math.max(halfWidth + 24, clientX)) - rect.left
          const y = Math.min(window.innerHeight - halfHeight - 16, Math.max(halfHeight + 16, clientY)) - rect.top
          if (immediate) {
            setX(x, x)
            setY(y, y)
          } else {
            setX(x)
            setY(y)
          }
        }
        const show = () => {
          row.classList.add('is-previewing')
          reveal.play()
        }
        const hide = () => { if (!hovered && !focused) reveal.reverse() }
        const enter = (event: PointerEvent) => {
          if (event.pointerType === 'touch') return
          hovered = true
          position(event.clientX, event.clientY, true)
          show()
        }
        const move = (event: PointerEvent) => {
          if (hovered) position(event.clientX, event.clientY)
        }
        const leave = () => { hovered = false; hide() }
        const focus = () => {
          focused = true
          if (!hovered) {
            const rect = row.getBoundingClientRect()
            position(rect.left + rect.width * 0.75, rect.top + rect.height / 2, true)
          }
          show()
        }
        const blur = () => { focused = false; hide() }

        row.addEventListener('pointerenter', enter)
        row.addEventListener('pointermove', move)
        row.addEventListener('pointerleave', leave)
        row.addEventListener('focus', focus)
        row.addEventListener('blur', blur)
        cleanups.push(() => {
          row.removeEventListener('pointerenter', enter)
          row.removeEventListener('pointermove', move)
          row.removeEventListener('pointerleave', leave)
          row.removeEventListener('focus', focus)
          row.removeEventListener('blur', blur)
          row.classList.remove('is-previewing')
        })
      })

      return () => cleanups.forEach((cleanup) => cleanup())
    }, listRef)

    return () => media.revert()
  }, [])

  return (
    <ol ref={listRef} className="studio-service-list" aria-label="Brand services">
      {services.map(({ title, image }, index) => (
        <li key={title}>
          <button className="studio-service-row" type="button" onClick={onProject}>
            <span className="studio-service-number">{String(index + 1).padStart(2, '0')}</span>
            <span className="studio-service-name">{title}</span>
            <span className="studio-service-preview" aria-hidden="true">
              <img src={image} alt="" width="400" height="272" loading="lazy" decoding="async" />
            </span>
          </button>
        </li>
      ))}
    </ol>
  )
}
