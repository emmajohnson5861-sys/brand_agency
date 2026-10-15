import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import InquiryForm from './InquiryForm'
import './ProjectInquiry.css'

gsap.registerPlugin(ScrollTrigger)

export default function ProjectInquiry() {
  const sectionRef = useRef<HTMLElement>(null)
  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const context = gsap.context(() => {
        const timeline = gsap.timeline({ scrollTrigger: { trigger: sectionRef.current, start: 'top 82%', once: true } })
        timeline.from('.inquiry-title-line > span', { yPercent: 110, duration: 0.9, stagger: 0.1, ease: 'power3.out' })
          .from('.inquiry-reveal', { y: 22, autoAlpha: 0, duration: 0.7, stagger: 0.09, ease: 'power2.out' }, 0.15)
      }, sectionRef)
      return () => context.revert()
    })
    return () => media.revert()
  }, [])

  return (
    <section className="project-inquiry page-inset" id="contact" ref={sectionRef} aria-labelledby="inquiry-heading">
      <div className="inquiry-layout">
        <div className="inquiry-intro">
          <p className="studio-label inquiry-reveal">// Your next chapter</p>
          <h2 id="inquiry-heading" tabIndex={-1}>
            <span className="inquiry-title-line"><span>Let’s make</span></span>
            <span className="inquiry-title-line"><span>it happen</span></span>
          </h2>
          <p className="inquiry-description inquiry-reveal">A new brand. A fresh direction.<br />Tell us what you have in mind.</p>
          <a className="inquiry-direct inquiry-reveal" href="mailto:hello@algofort.com">
            <span>hello@algofort.com</span>
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" /></svg>
          </a>
        </div>

        <div className="inquiry-reveal"><InquiryForm idPrefix="contact" /></div>
      </div>
    </section>
  )
}
