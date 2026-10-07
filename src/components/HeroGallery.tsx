import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './HeroGallery.css'

gsap.registerPlugin(ScrollTrigger)

const images = [
  { file: 'hero-r-1.jpg', alt: 'Bold black and ochre typography displayed on a phone' },
  { file: 'hero-r-2.jpg', alt: 'A creative professional working on a laptop in a warm interior' },
  { file: 'hero-r-3.jpg', alt: 'A laptop workspace with warm neutral fabrics and textures' },
  { file: 'hero-r-4.jpg', alt: 'Minimal Typology packaging with distinctive monochrome labels' },
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
          {[0, 1].map(copy => images.map(({ file, alt }) => (
            <li className="hero-gallery-slide" key={`${copy}-${file}`} aria-hidden={copy === 1}>
              <img src={`/images/hero-slider/${file}`} alt={copy === 0 ? alt : ''} width="460" height="640" decoding="async" />
            </li>
          )))}
        </ul>
      </div>
    </section>
  )
}
