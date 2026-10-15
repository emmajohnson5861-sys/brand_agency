import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { isWelcomeSuppressed, saveWelcomePreference } from '../lib/welcomePreference'
import InquiryForm from './InquiryForm'
import './ProjectInquiry.css'
import './WelcomeInquiry.css'

export default function WelcomeInquiry() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const exitRef = useRef<gsap.core.Tween | null>(null)
  const closingRef = useRef(false)
  const [open, setOpen] = useState(false)
  const [preferenceError, setPreferenceError] = useState('')

  useEffect(() => {
    if (isWelcomeSuppressed()) return
    let delay: ReturnType<typeof setTimeout> | undefined
    function welcome() {
      delay = setTimeout(() => { if (!isWelcomeSuppressed()) setOpen(true) }, 2500)
    }
    if (document.readyState === 'complete') welcome()
    else window.addEventListener('load', welcome, { once: true })
    return () => { window.removeEventListener('load', welcome); clearTimeout(delay) }
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    const dialog = dialogRef.current!
    const previousFocus = document.activeElement as HTMLElement | null
    closingRef.current = false
    dialog.showModal()
    window.dispatchEvent(new CustomEvent('algofort:popup-state', { detail: true }))
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        gsap.timeline()
          .fromTo(dialog, { x: () => (window.innerWidth + dialog.offsetWidth) / 2 + 40, autoAlpha: 0 }, {
            x: 0, autoAlpha: 1, duration: 0.9, ease: 'power3.out',
          })
          .from('.welcome-header > *', { y: 12, autoAlpha: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' }, 0.3)
      }, dialog)
      return () => context.revert()
    })
    return () => {
      exitRef.current?.kill()
      exitRef.current = null
      media.revert()
      dialog.close()
      window.dispatchEvent(new CustomEvent('algofort:popup-state', { detail: false }))
      if (previousFocus?.isConnected) previousFocus.focus({ preventScroll: true })
    }
  }, [open])

  function closePopup() {
    if (closingRef.current) return
    closingRef.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setOpen(false); return }
    const dialog = dialogRef.current!
    exitRef.current = gsap.to(dialog, {
      x: (window.innerWidth + dialog.offsetWidth) / 2 + 40,
      autoAlpha: 0, duration: 0.45, ease: 'power3.in', overwrite: 'auto',
      onComplete: () => setOpen(false),
    })
  }

  function dismissPermanently() {
    if (saveWelcomePreference(true)) {
      setPreferenceError('')
      closePopup()
    } else {
      setPreferenceError('Your browser couldn’t save this preference. Please allow site storage and try again.')
    }
  }

  return <dialog className="welcome-inquiry" ref={dialogRef} aria-labelledby="welcome-heading" onCancel={event => { event.preventDefault(); closePopup() }} onClick={event => {
    if (event.target !== event.currentTarget) return
    const bounds = event.currentTarget.getBoundingClientRect()
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closePopup()
  }}>
    <button className="welcome-close" type="button" aria-label="Close project inquiry" autoFocus onClick={closePopup}>
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.5" /></svg>
    </button>
    <div className="welcome-photo" aria-hidden="true">
      {open && <img
        src="/images/inquiry-creative-workspace-960.webp"
        srcSet="/images/inquiry-creative-workspace-480.webp 480w, /images/inquiry-creative-workspace-960.webp 960w"
        sizes="(max-width: 760px) calc(100vw - 32px), (max-width: 1192px) calc(43vw - 31px), 482px"
        alt=""
        width="960"
        height="1280"
        decoding="async"
      />}
    </div>
    <div className="welcome-content" data-lenis-prevent>
      <header className="welcome-header">
        <p className="welcome-kicker"><span aria-hidden="true">+</span> Let’s talk</p>
        <h2 id="welcome-heading">Have a project in mind?</h2>
        <p>Tell us a little about it. A new brand, a fresh identity, or a new chapter for your business — we’d like to hear it.</p>
      </header>
      {open && <InquiryForm idPrefix="welcome" variant="popup" preserveHeight={false} />}
      <div className="welcome-preferences">
        <button className="welcome-dismiss" type="button" onClick={dismissPermanently}>Don’t show again</button>
        {preferenceError && <p className="welcome-preference-error" role="alert">{preferenceError}</p>}
      </div>
    </div>
  </dialog>
}
