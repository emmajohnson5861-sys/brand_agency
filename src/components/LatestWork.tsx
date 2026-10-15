import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ActionButton from './ActionButton'
import './LatestWork.css'

gsap.registerPlugin(ScrollTrigger)

// Original illustrative brand identity concept studies.
const projects = [
  { image: 'concept-petpals', title: 'Jack Petpals', category: 'Concept study · Packaging & Identity', alt: 'Orange and cream Jack Petpals brand board with pet treat packaging, stationery and signage' },
  { image: 'concept-whisky', title: 'Whisky Solutions', category: 'Concept study · Luxury Branding', alt: 'Charcoal and copper Whisky Solutions brand board with bottle, packaging and embossed stationery' },
  { image: 'concept-goosebump', title: 'Goosebump Studio', category: 'Concept study · Visual Identity', alt: 'Green and black Goosebump Studio identity board with logo, cards, poster and tote bag' },
  { image: 'concept-herzog', title: 'Herzog Architecture', category: 'Concept study · Architectural Identity', alt: 'Cobalt and limestone Herzog Architecture brand board with monogram, stationery, booklet and signage' },
  { image: 'concept-brain', title: 'Brain Bouncer', category: 'Concept study · Wellness Branding', alt: 'Lavender and plum Brain Bouncer identity board with journal, packaging, poster and brand palette' },
  { image: 'concept-clarity', title: 'Clarity & Growth', category: 'Concept study · Brand Collateral', alt: 'Olive and ivory Clarity and Growth identity board with stationery, notebook, poster and tote bag' },
]

export default function LatestWork({ onProject }: { onProject: () => void }) {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.latest-work-title-line > span', {
        yPercent: 105,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.latest-work-heading',
          start: 'top 95%',
          end: 'bottom 65%',
          scrub: 0.5,
        },
      })

      sectionRef.current!.querySelectorAll<HTMLElement>('.latest-project-media').forEach((frame) => {
        const image = frame.querySelector('img')!
        const reveal = gsap.timeline({
          defaults: { duration: 1, ease: 'power1.out' },
          scrollTrigger: {
            trigger: frame,
            start: 'top 95%',
            end: 'bottom top',
            toggleActions: 'play reverse play reverse',
          },
        })
        reveal.fromTo(frame, { scale: 0.9 }, { scale: 1 }, 0)
        reveal.fromTo(image, { scale: 1.3 }, { scale: 1 }, 0)
      })
    }, sectionRef)

    return () => media.revert()
  }, [])

  return (
    <section ref={sectionRef} className="latest-work" id="latest-work" aria-labelledby="latest-work-heading">
      <div className="page-inset">
        <div className="latest-work-heading">
          <p className="studio-label">// Selected work</p>
          <h2 className="latest-work-title" id="latest-work-heading">
            <span className="latest-work-title-line"><span>Take a look at</span></span>{' '}
            <span className="latest-work-title-line"><span>our projects</span></span>
          </h2>
        </div>
        <div className="latest-work-intro">
          <p>Thoughtful identities, distinctive packaging and considered details. Explore our brand concepts, from the first mark to the way a brand lives in the world.</p>
          <ActionButton className="latest-work-cta" arrow onClick={onProject}>Build Your Brand</ActionButton>
        </div>
        <div className="latest-work-grid">
          {projects.map(({ image, title, category, alt }, index) => (
            <article className="latest-project" key={image}>
              <div className="latest-project-media">
                <img
                  src={`/images/latest-work/${image}-800.webp`}
                  srcSet={`/images/latest-work/${image}-480.webp 480w, /images/latest-work/${image}-800.webp 800w, /images/latest-work/${image}-1280.webp 1280w`}
                  sizes="(max-width: 700px) calc(100vw - 48px), (max-width: 1700px) calc(46.55vw - 12px), 780px"
                  alt={alt}
                  width="1280"
                  height="768"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="latest-project-caption">
                <div>
                  <h3>{title}</h3>
                  <p>{category}</p>
                </div>
                <span className="latest-project-number" aria-hidden="true">({String(index + 1).padStart(2, '0')})</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
