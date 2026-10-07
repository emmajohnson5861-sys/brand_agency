import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ActionButton from './ActionButton'
import './LatestWork.css'

gsap.registerPlugin(ScrollTrigger)

// Temporary reference projects: replace images and captions here when final work is supplied.
const projects = [
  { image: 'project-16.jpg', title: 'Public Domain Archive', category: 'Digital experience', alt: 'Editorial image archive displayed on a laptop in a warm, sunlit interior' },
  { image: 'project-17.jpg', title: 'A fresh perspective', category: 'Packaging design', alt: 'Blue beverage can with a copper lid and illustrated botanical identity' },
  { image: 'project-18.jpg', title: 'DevDay', category: 'Visual identity · Digital design', alt: 'Green event identity for DevDay displayed on a phone' },
  { image: 'project-19.jpg', title: 'Designed for the everyday', category: 'Brand experience', alt: 'Violet digital interface on a phone surrounded by sculptural dark shapes' },
  { image: 'project-20.jpg', title: 'SENU', category: 'Art direction · Brand communication', alt: 'SENU music identity with bold yellow typography over a red and green portrait' },
  { image: 'project-21.jpg', title: 'A clearer connection', category: 'Digital identity · Website design', alt: 'Minimal editorial website displayed on a tablet on a dark leather surface' },
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
          <p>Thoughtful identities, distinctive packaging and digital experiences. A selection of work that brings a brand’s story to life.</p>
          <ActionButton className="latest-work-cta" arrow onClick={onProject}>Build Your Brand</ActionButton>
        </div>
        <div className="latest-work-grid">
          {projects.map(({ image, title, category, alt }, index) => (
            <article className="latest-project" key={image}>
              <div className="latest-project-media">
                <img src={`/images/latest-work/${image}`} alt={alt} width="900" height="630" loading="lazy" decoding="async" />
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
