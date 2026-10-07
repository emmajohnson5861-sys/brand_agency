import { useLayoutEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import './SiteFooter.css'

// Contact and social details from the existing SaaS landing page configuration.
const contact = {
  email: 'hello@algofort.com',
  phone: '+92 333 7198686',
  phoneHref: 'tel:+923337198686',
  privacy: 'https://algoforts.vercel.app/#privacy',
}
const companyLinks = [
  { label: 'Agency', href: '#studio' },
  { label: 'Solutions', href: '#services' },
  { label: 'Work', href: '#latest-work' },
  { label: 'Our process', href: '#process' },
  { label: 'Client stories', href: '#testimonials' },
]
const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/company/algofort' },
  { label: 'Instagram', href: 'https://instagram.com/algofort' },
  { label: 'Facebook', href: 'https://facebook.com/algofort' },
]
const copyrightYear = new Date().getFullYear()

function EmailArrow() {
  return <svg viewBox="0 0 24 24" fill="none"><path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
}

export default function SiteFooter() {
  const footerRef = useRef<HTMLElement>(null)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function subscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'pending') return
    const endpoint = import.meta.env.VITE_NEWSLETTER_ENDPOINT
    if (!endpoint) {
      setStatus('error')
      setMessage('Newsletter signup is coming soon. Please check back shortly.')
      return
    }

    setStatus('pending')
    setMessage('Subscribing…')
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      })
      if (!response.ok) throw new Error('Subscription failed')
      setStatus('success')
      setMessage('Thanks for subscribing! Check your inbox for the next steps.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('We couldn’t complete your subscription. Please try again.')
    }
  }

  useLayoutEffect(() => {
    const setWidth = () => footerRef.current?.style.setProperty('--footer-viewport-width', `${document.documentElement.clientWidth}px`)
    setWidth()
    window.addEventListener('resize', setWidth)
    return () => window.removeEventListener('resize', setWidth)
  }, [])

  return (
    <footer className="site-footer" ref={footerRef} id="contact" aria-label="Algofort footer">
      <div className="footer-top">
        <div className="footer-layout">
          <div className="footer-conversation">
            <form className="footer-email" onSubmit={subscribe} aria-label="Newsletter subscription" aria-busy={status === 'pending'}>
              <input type="email" name="email" aria-label="Email address" placeholder="Enter your email" autoComplete="email" required maxLength={254} value={email} disabled={status === 'pending'} onChange={event => { setEmail(event.target.value); setStatus('idle'); setMessage('') }} />
              <button className="footer-subscribe" type="submit" aria-label={status === 'pending' ? 'Subscribing' : 'Subscribe to newsletter'} disabled={status === 'pending'}>
                <span className="button-arrows" aria-hidden="true">
                  <span className="button-arrow"><EmailArrow /></span>
                  <span className="button-arrow button-arrow-next"><EmailArrow /></span>
                </span>
              </button>
            </form>
            {message && <p className="footer-subscribe-status" role="status">{message}</p>}
            <p>By subscribing you agree with our</p>
            <a className="footer-privacy" href={contact.privacy} target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          </div>

          <div className="footer-columns">
            <nav className="footer-column" aria-label="Company">
              <h2>Company</h2>
              <ul>{companyLinks.map(({ label, href }) => <li key={label}><a href={href}>{label}</a></li>)}</ul>
            </nav>
            <nav className="footer-column" aria-label="Social">
              <h2>Social</h2>
              <ul>{socialLinks.map(({ label, href }) => <li key={label}><a href={href} target="_blank" rel="noopener noreferrer">{label}</a></li>)}</ul>
            </nav>
            <div className="footer-column footer-contact">
              <h2>Contact</h2>
              <ul>
                <li><a href={`mailto:${contact.email}`}>{contact.email}</a></li>
                <li><a href={contact.phoneHref}>{contact.phone}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {copyrightYear} <a href="#top">Algofort</a> All rights reserved.</p>
        <a className="footer-back-top" href="#top" aria-label="Back to top">
          <span className="footer-top-arrows" aria-hidden="true">
            <span className="footer-top-arrow"><EmailArrow /></span>
            <span className="footer-top-arrow footer-top-arrow-next"><EmailArrow /></span>
          </span>
        </a>
      </div>
    </footer>
  )
}
