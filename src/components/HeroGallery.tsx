import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HeroGallery.css'

gsap.registerPlugin(ScrollTrigger)

const images = [
  { file: 'hero-brand-1.webp', alt: 'The Project Firm multi-service property and development brand identity and stationery' },
  { file: 'hero-brand-3.webp', alt: 'Nexora Design Studio modern minimalist logo design and branding kit' },
  { file: 'hero-brand-4.webp', alt: 'Maxora corporate strategy, digital platform and branded merchandise identity' },
  { file: 'hero-brand-5.webp', alt: 'Addiba smart logistics brand identity, mobile app and fleet design' },
  { file: 'hero-brand-6.webp', alt: 'Mujica Arquitectura visual identity, construction gear and stationery' },
  { file: 'hero-brand-7.webp', alt: 'Ship In The Box editorial typography and bold brand aesthetics' },
]

export default function HeroGallery() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current!
    const setWidth = () => section.style.setProperty('--gallery-viewport-width', `${document.documentElement.clientWidth}px`)
    setWidth()
    window.addEventListener('resize', setWidth)

    const media = gsap.matchMedia()
    media.add('(prefers-reduced-motion: no-preference)', () => {
      const viewport = section.querySelector<HTMLElement>('.hero-gallery-window')!
      const track = section.querySelector<HTMLElement>('.hero-gallery-track')!
      gsap.fromTo(track, { x: 0 }, {
        x: () => Math.min(0, viewport.clientWidth - track.scrollWidth),
        ease: 'power1.out',
        scrollTrigger: {
          trigger: viewport,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
      gsap.from(viewport, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: section, start: 'top 95%', once: true },
      })
    }, sectionRef)

    return () => {
      media.revert()
      window.removeEventListener('resize', setWidth)
    }
  }, [])

  return (
    <section className="hero-gallery" id="work" ref={sectionRef} aria-label="Brand design inspiration">
      <div className="hero-gallery-window">
        <ul className="hero-gallery-track">
          {[0, 1].map(copy => images.map(({ file, alt }, index) => (
            <li className="hero-gallery-slide" key={`${copy}-${file}`} aria-hidden={copy === 1}>
              <img src={`/images/hero-slider/${file}`} alt={copy === 0 ? alt : ''} width="460" height="640" loading={copy === 0 && index < 3 ? 'eager' : 'lazy'} decoding="async" />
            </li>
          )))}
        </ul>
      </div>
    </section>
  )
}
