import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import ActionButton from './ActionButton'
import './MobileMenu.css'

const links = [
  { label: 'Home', href: '#top' },
  { label: 'Work', href: '#latest-work' },
  { label: 'About', href: '#studio' },
  { label: 'Contact', href: '#contact' },
]

type MobileMenuProps = {
  onProject: () => void
  onActiveChange: (active: boolean) => void
}

export default function MobileMenu({ onProject, onActiveChange }: MobileMenuProps) {
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const afterCloseRef = useRef<(() => void) | null>(null)
  const backgroundRef = useRef<{ element: HTMLElement; inert: boolean }[]>([])

  function unlockPage() {
    backgroundRef.current.forEach(({ element, inert }) => { element.inert = inert })
    backgroundRef.current = []
    window.dispatchEvent(new CustomEvent('algofort:menu-state', { detail: false }))
  }

  function closeMenu(afterClose?: () => void) {
    afterCloseRef.current = afterClose ?? null
    setOpen(false)
  }

  function navigate(href: string) {
    closeMenu(() => {
      history.pushState(null, '', href)
      const navigation = new CustomEvent('algofort:navigate', { detail: href, cancelable: true })
      if (window.dispatchEvent(navigation)) {
        document.querySelector(href)?.scrollIntoView({ behavior: 'auto', block: 'start' })
      }
    })
  }

  useLayoutEffect(() => {
    const panel = panelRef.current!
    const header = panel.closest<HTMLElement>('.site-header')!
    const logo = header.querySelector<HTMLElement>('.wordmark')!
    const toggle = toggleRef.current!
    const backdrop = backdropRef.current!
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const context = gsap.context(() => {
      timelineRef.current = gsap.timeline({
        paused: true,
        onReverseComplete: () => {
          panel.hidden = true
          backdrop.hidden = true
          unlockPage()
          onActiveChange(false)
          const afterClose = afterCloseRef.current
          afterCloseRef.current = null
          if (afterClose) afterClose()
          else toggle.focus({ preventScroll: true })
        },
      })
        .fromTo(logo, { x: 0, y: 0 }, {
          x: () => panel.getBoundingClientRect().left + 24 - logo.getBoundingClientRect().left,
          y: 0,
          duration: reducedMotion ? 0.01 : 0.35, ease: 'power3.inOut',
        }, 0)
        .fromTo(toggle, { x: 0, y: 0 }, {
          x: () => panel.getBoundingClientRect().right - 56 - toggle.getBoundingClientRect().left,
          y: 0,
          duration: reducedMotion ? 0.01 : 0.35, ease: 'power3.inOut',
        }, 0)
        .fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: reducedMotion ? 0.01 : 0.35 }, 0)
        .fromTo(panel, { autoAlpha: 1, clipPath: 'inset(0 0 100% 0 round 28px)' }, {
          clipPath: 'inset(0 0 0% 0 round 28px)', duration: reducedMotion ? 0.01 : 0.5, ease: 'power3.inOut',
        }, reducedMotion ? 0 : 0.08)
        .fromTo('.mobile-menu-link > span', { yPercent: 115 }, {
          yPercent: 0, duration: reducedMotion ? 0.01 : 0.45, stagger: reducedMotion ? 0 : 0.06, ease: 'power3.out',
        }, reducedMotion ? 0 : 0.58)
        .fromTo('.mobile-menu-contacts', { autoAlpha: 0, y: 14 }, {
          autoAlpha: 1, y: 0, duration: reducedMotion ? 0.01 : 0.35,
        }, reducedMotion ? 0 : 0.76)
        .fromTo('.mobile-menu-cta', { autoAlpha: 0, y: 24 }, {
          autoAlpha: 1, y: 0, duration: reducedMotion ? 0.01 : 0.45, ease: 'power3.out',
        }, reducedMotion ? 0 : 0.84)
    }, header)

    const onKeyDown = (event: KeyboardEvent) => {
      if (panel.hidden) return
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMenu()
      }
      if (event.key === 'Tab') {
        const focusable = [...header.querySelectorAll<HTMLElement>('a[href], button:not(:disabled)')]
          .filter((element) => element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden')
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last?.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first?.focus()
        }
      }
    }
    const onLogoClick = (event: MouseEvent) => {
      if (!panel.hidden) { event.preventDefault(); navigate('#top') }
    }
    const mobile = window.matchMedia('(max-width: 700px)')
    const onResize = () => { if (!mobile.matches && !panel.hidden) closeMenu() }
    mobile.addEventListener('change', onResize)
    document.addEventListener('keydown', onKeyDown)
    logo.addEventListener('click', onLogoClick)
    return () => {
      mobile.removeEventListener('change', onResize)
      document.removeEventListener('keydown', onKeyDown)
      logo.removeEventListener('click', onLogoClick)
      context.revert()
      panel.hidden = true
      backdrop.hidden = true
      unlockPage()
    }
  }, [onActiveChange])

  useLayoutEffect(() => {
    const panel = panelRef.current!
    if (open) {
      panel.hidden = false
      backdropRef.current!.hidden = false
      if (backgroundRef.current.length === 0) {
        backgroundRef.current = [...document.querySelectorAll<HTMLElement>('main, .site-footer')]
          .map((element) => ({ element, inert: element.inert }))
      }
      backgroundRef.current.forEach(({ element }) => { element.inert = true })
      onActiveChange(true)
      window.dispatchEvent(new CustomEvent('algofort:menu-state', { detail: true }))
      if (timelineRef.current?.progress() === 0) timelineRef.current.invalidate()
      timelineRef.current?.timeScale(1).play()
    } else if (!panel.hidden) {
      timelineRef.current?.timeScale(1.5).reverse()
    }
  }, [open, onActiveChange])

  return <>
    <button ref={toggleRef} className={`mobile-menu-toggle${open ? ' is-open' : ''}`} type="button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation" onClick={() => open ? closeMenu() : setOpen(true)}>
      <svg className="menu-grid-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
    </button>
    <div ref={backdropRef} className="mobile-menu-backdrop" hidden aria-hidden="true" onClick={() => closeMenu()} />
    <div ref={panelRef} className="mobile-menu-dialog" id="mobile-navigation" hidden data-lenis-prevent>
      <nav className="mobile-menu-links" aria-label="Mobile main navigation">
        {links.map(({ label, href }) => <a className="mobile-menu-link" href={href} key={label} onClick={(event) => { event.preventDefault(); navigate(href) }}><span>{label}</span></a>)}
      </nav>
      <div className="mobile-menu-contacts">
        <p>Contacts</p>
        <a href="tel:+923337198686">+92 333 7198686</a>
        <a href="mailto:hello@algofort.com">hello@algofort.com</a>
      </div>
      <ActionButton className="mobile-menu-cta" arrow onClick={() => closeMenu(onProject)}>Get in touch</ActionButton>
    </div>
  </>
}
