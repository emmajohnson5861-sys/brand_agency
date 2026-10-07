import { useState } from 'react'
import BrandSentence from './components/BrandSentence'
import SmoothScroll from './components/SmoothScroll'
import BrandApproach from './components/BrandApproach'
import ActionButton from './components/ActionButton'
import StudioSections from './components/StudioSections'
import HeroGallery from './components/HeroGallery'
import SiteFooter from './components/SiteFooter'
import './App.css'

function MenuLabel({ text }: { text: string }) {
  return <span className="button-label" aria-hidden="true"><span className="button-text button-text-one">{text}</span><span className="button-text button-text-two">{text}</span></span>
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [inquiryOpen, setInquiryOpen] = useState(false)

  return (
    <>
      <SmoothScroll />
      <header className="site-header page-inset" id="top">
        <a className="wordmark" href="#" aria-label="Algofort home"><img src="/brand/algofort-dark.png" alt="Algofort" width="220" height="35" /></a>
        <button className="menu-toggle" type="button" aria-expanded={menuOpen} aria-controls="main-navigation" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? 'Close' : 'Menu'}
        </button>
        <nav id="main-navigation" className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">
          <a className="nav-roll" href="#work" aria-label="Work" onClick={() => setMenuOpen(false)}><MenuLabel text="Work" /></a>
          <a className="nav-roll" href="#approach" aria-label="Approach" onClick={() => setMenuOpen(false)}><MenuLabel text="Approach" /></a>
          <button className="nav-contact nav-roll" type="button" aria-label="Contact" onClick={() => { setInquiryOpen(true); setMenuOpen(false) }}><MenuLabel text="Contact" /></button>
          <ActionButton className="header-cta" onClick={() => { setInquiryOpen(true); setMenuOpen(false) }}>Start a project</ActionButton>
        </nav>
      </header>

      <main>
        <section className="hero page-inset" aria-labelledby="hero-heading">
          <div className="hero-layout">
            <h1 id="hero-heading">
              <span>Designing</span>
              <span>Brand Stories</span>
            </h1>
            <div className="hero-aside">
              <p>Thoughtful strategy. Distinctive design.<br />An identity that brings your business into focus.</p>
              <ActionButton className="hero-cta" arrow onClick={() => setInquiryOpen(true)}>Build Your Brand</ActionButton>
            </div>
          </div>
        </section>

        <HeroGallery />
        <BrandSentence />
        <BrandApproach />
        <StudioSections onProject={() => setInquiryOpen(true)} />
      </main>
      <SiteFooter />

      {inquiryOpen && (
        <div className="dialog-backdrop" onClick={(event) => { if (event.target === event.currentTarget) setInquiryOpen(false) }}>
          <dialog className="inquiry-dialog" open aria-labelledby="inquiry-heading" onKeyDown={(event) => { if (event.key === 'Escape') setInquiryOpen(false) }}>
            <button className="dialog-close" type="button" aria-label="Close project inquiry" onClick={() => setInquiryOpen(false)} autoFocus>×</button>
            <p className="eyebrow">Let's make it yours</p>
            <h2 id="inquiry-heading">Build your <em>brand.</em></h2>
            <p>We’re getting ready to welcome new projects. Our project inquiry form will be available soon.</p>
            <ActionButton onClick={() => setInquiryOpen(false)}>Back to Algofort</ActionButton>
          </dialog>
        </div>
      )}
    </>
  )
}

export default App
