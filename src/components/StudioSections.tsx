import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import StudioAsterisk from './StudioAsterisk'
import StudioServiceList from './StudioServiceList'
import LatestWork from './LatestWork'
import BrandProcess from './BrandProcess'
import ClientTestimonials from './ClientTestimonials'
import './StudioSections.css'

gsap.registerPlugin(ScrollTrigger)

const centreMoveDuration = 0.36
const otherPhasesDuration = 0.22 + 0.62 + 0.3
// Add scroll space to the centre move while preserving the other phases' existing pace.
const studioScrollDistanceMultiplier = 2.2 * (otherPhasesDuration + centreMoveDuration) / (otherPhasesDuration + 0.2)
const logos = Array.from({ length: 9 }, (_, index) => `/images/studio/brand-${index + 12}.png`)

export default function StudioSections({ onProject }: { onProject: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const root = rootRef.current!
    const media = gsap.matchMedia()
    let disposed = false
    // Break out of the page's 1700px frame without including the scrollbar width.
    const syncViewportWidth = () => {
      root.style.setProperty('--studio-viewport-width', `${document.documentElement.clientWidth}px`)
    }
    syncViewportWidth()
    window.addEventListener('resize', syncViewportWidth)

    void document.fonts.ready.then(() => {
      if (disposed) return

      media.add('(prefers-reduced-motion: no-preference)', () => {
        root.classList.add('studio-motion')
        const scene = root.querySelector<HTMLElement>('.studio-scene')!
        const content = root.querySelector<HTMLElement>('.studio-copy-layer')!
        const slot = root.querySelector<HTMLElement>('.studio-shape-slot')!
        const shape = root.querySelector<SVGSVGElement>('.studio-moving-shape')!
        const shapePath = root.querySelector<SVGGElement>('.studio-shape-path')!
        const lastLine = root.querySelector<HTMLElement>('.studio-title-last')!
        const heading = root.querySelector<HTMLElement>('.studio-title')!

        // Measure in the content's coordinate space, independent of its scroll transform.
        const origin = () => {
          const slotRect = slot.getBoundingClientRect()
          const contentRect = content.getBoundingClientRect()
          return {
            x: slotRect.left - contentRect.left + slotRect.width / 2,
            y: slotRect.top - contentRect.top + slotRect.height / 2,
          }
        }
        const travel = () => Math.max(0, content.offsetHeight - scene.clientHeight)
        const scrollDistance = () => (travel() + scene.clientHeight * 1.45) * studioScrollDistanceMultiplier
        const centreX = () => scene.clientWidth / 2
        const centreY = () => scene.clientHeight / 2
        const coverSize = () => Math.hypot(scene.clientWidth, scene.clientHeight) / 0.15
        const motion = { x: 0, y: 0, size: 0, rotation: 0 }
        // Transform vector geometry inside a viewport-sized SVG, never a rasterized image layer.
        const drawShape = () => {
          shapePath.setAttribute('transform', `translate(${motion.x} ${motion.y}) rotate(${motion.rotation}) scale(${motion.size / 140}) translate(-70 -70)`)
        }
        const syncGeometry = () => {
          syncViewportWidth()
          shape.setAttribute('viewBox', `0 0 ${scene.clientWidth} ${scene.clientHeight}`)
          drawShape()
        }

        gsap.set(slot, { visibility: 'hidden' })
        gsap.set(shape, { visibility: 'visible' })
        syncGeometry()
        ScrollTrigger.addEventListener('refreshInit', syncGeometry)

        const story = gsap.timeline({
          defaults: { ease: 'none' },
          onUpdate: drawShape,
          scrollTrigger: {
            trigger: scene,
            start: 'top top',
            end: () => `+=${scrollDistance()}`,
            pin: true,
            // Lenis smooths scrolling; direct scrubbing finishes the icon before the pin releases.
            scrub: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        })

        // Clear the icon's path before either the content or the icon moves down.
        story.fromTo(lastLine, { x: 0 }, {
          x: () => {
            const fontSize = parseFloat(getComputedStyle(heading).fontSize)
            const clearance = slot.getBoundingClientRect().right - heading.getBoundingClientRect().left + fontSize * 0.15
            return Math.min(Math.max(fontSize * 1.4, clearance), heading.clientWidth - lastLine.offsetWidth)
          },
          duration: 0.22,
          ease: 'power2.out',
        }, 0)
        story.addLabel('descend', 0.22)
        story.fromTo(content, { y: 0 }, { y: () => -travel(), duration: 0.62 }, 'descend')
        story.fromTo(motion, {
          x: () => origin().x,
          y: () => origin().y,
          size: () => slot.offsetWidth,
          rotation: 0,
        }, {
          x: () => origin().x + (scene.clientWidth <= 700 ? 0 : 50),
          y: () => scene.clientWidth <= 700 ? origin().y : centreY(),
          size: () => slot.offsetWidth / 3,
          rotation: 180,
          duration: 0.62,
        }, 'descend')
        story.addLabel('centre', 'descend+=0.62')
        story.to(motion, { x: centreX, y: centreY, duration: centreMoveDuration, ease: 'power1.inOut' }, 'centre')
        story.to(motion, { size: coverSize, rotation: 270, duration: 0.3, ease: 'power2.in' })

        gsap.from('.studio-services-title-line > span', {
          yPercent: 105,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: '.studio-services-heading',
            start: 'top 95%',
            end: 'bottom 60%',
            scrub: 0.5,
          },
        })

        gsap.from('.studio-service-list > li', {
          y: 30,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.studio-service-list', start: 'top 90%' },
        })

        ScrollTrigger.sort()
        ScrollTrigger.refresh()

        return () => {
          ScrollTrigger.removeEventListener('refreshInit', syncGeometry)
          shapePath.removeAttribute('transform')
          root.classList.remove('studio-motion')
        }
      }, root)
    })

    return () => {
      disposed = true
      media.revert()
      window.removeEventListener('resize', syncViewportWidth)
      root.style.removeProperty('--studio-viewport-width')
    }
  }, [])

  return (
    <div ref={rootRef} className="studio-sections" id="studio">
      <section className="studio-scene" aria-labelledby="studio-heading">
        <div className="studio-copy-layer">
          <div className="studio-intro page-inset">
            <div className="studio-orbit" aria-hidden="true" />
            <h2 className="studio-title" id="studio-heading">
              <span className="studio-title-first">We're</span>
              <span className="studio-title-middle">
                <span className="studio-shape-slot" aria-hidden="true"><img src="/images/studio/asterisk.svg" alt="" /></span>
                Design
              </span>
              <span className="studio-title-last">Agency</span>
            </h2>
            <div className="studio-who">
              <p className="studio-label">// Who we are</p>
              <div className="studio-who-copy">
                <p>We’re Algofort, a strategy and design studio. We bring clear thinking and distinctive creativity together to build brands with character, purpose, and a presence people remember.</p>
                <button className="studio-text-link" type="button" onClick={onProject} aria-label="Let’s build your brand">
                  <span className="studio-link-label" aria-hidden="true">
                    <span className="studio-link-text">Let’s build your brand</span>
                    <span className="studio-link-text studio-link-text-next">Let’s build your brand</span>
                  </span>
                  <span className="studio-link-arrows" aria-hidden="true">
                    <svg className="studio-link-arrow" viewBox="0 0 24 24" fill="none"><path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    <svg className="studio-link-arrow studio-link-arrow-next" viewBox="0 0 24 24" fill="none"><path d="M4 12h16m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
          <div className="studio-logos" role="img" aria-label="A moving collection of sample brand wordmarks">
            <div className="studio-logo-track" aria-hidden="true">
              {[0, 1].map((copy) => (
                <div className="studio-logo-group" key={copy}>
                  {logos.map((src) => <div className="studio-logo" key={src}><img src={src} alt="" width="160" height="50" /></div>)}
                </div>
              ))}
            </div>
          </div>
        </div>
        <StudioAsterisk />
      </section>

      <section className="studio-services" id="services" aria-labelledby="studio-services-heading">
        <div className="page-inset">
          <div className="studio-services-heading">
            <p className="studio-label">// What we do</p>
            <h2 className="studio-services-title" id="studio-services-heading"><span className="studio-services-title-line"><span>We think out of the box</span></span>{' '}<span className="studio-services-title-line"><span>for tailor-made service</span></span></h2>
          </div>
          <div className="studio-services-body" id="studio-service-list">
            <p className="studio-services-description">We help businesses create strong, memorable brands through strategy, design and storytelling. From identity to digital, we craft everything your brand needs to look, feel and perform its best.</p>
            <StudioServiceList onProject={onProject} />
          </div>
        </div>
      </section>
      <LatestWork onProject={onProject} />
      <BrandProcess />
      <ClientTestimonials />
    </div>
  )
}
