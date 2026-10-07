import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import './BrandApproach.css'

gsap.registerPlugin(ScrollTrigger, SplitText)

const services = ['Strategy', 'Brand Identity', 'Research', 'Consultation', 'Communication']
const statement = 'Together we build a strong brand with which you make a distinctive impression on your target group and claim a powerful position in the market.'

export default function BrandApproach() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      const heading = headingRef.current!
      let lineReveals: gsap.core.Tween[] = []

      const split = SplitText.create(heading, {
        type: 'lines',
        linesClass: 'answer-line',
        autoSplit: true,
        onSplit: (self) => {
          lineReveals.forEach(reveal => {
            reveal.scrollTrigger?.kill()
            reveal.kill()
          })
          // Each line follows its own viewport position, allowing adjacent reveals to overlap.
          lineReveals = self.lines.map((line) => gsap.fromTo(line, { backgroundPositionX: '100%' }, {
              backgroundPositionX: '0%',
              ease: 'none',
              scrollTrigger: {
                trigger: line,
                start: 'top 85%',
                end: 'clamp(bottom center)',
                scrub: 1,
                invalidateOnRefresh: true,
              },
            }))
        },
      })

      const frame = sectionRef.current!.querySelector<HTMLElement>('.answer-photo')!
      const imageReveal = gsap.timeline({
        defaults: { duration: 1, ease: 'power1.out' },
        scrollTrigger: {
          trigger: frame,
          start: 'top 95%',
          end: 'bottom top',
          toggleActions: 'play reverse play reverse',
        },
      })
      imageReveal.fromTo(frame, { scale: 0.9 }, { scale: 1 }, 0)
      imageReveal.fromTo(frame.querySelector('img'), { scale: 1.3 }, { scale: 1 }, 0)

      gsap.from('.service-item', {
        y: 16,
        opacity: 0,
        stagger: 0.07,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.services-list', start: 'top 95%' },
      })

      return () => {
        lineReveals.forEach(reveal => {
          reveal.scrollTrigger?.kill()
          reveal.kill()
        })
        split.revert()
      }
    }, sectionRef)

    return () => media.revert()
  }, [])

  return (
    <section ref={sectionRef} className="brand-answer page-inset" id="approach" aria-labelledby="answer-heading">
      <div className="answer-layout">
        <div className="answer-copy">
          <h2 ref={headingRef} className="answer-statement" id="answer-heading">{statement}</h2>
          <ul className="services-list" aria-label="Our services">
            {services.map((service) => <li className="service-item" key={service}>{service}</li>)}
          </ul>
        </div>
        <div className="answer-visual">
          <div className="answer-photo">
            <img src="/images/services/brand-strategy.jpg" alt="Voxera brand identity with a white wordmark on flowing deep blue forms" width="591" height="591" loading="lazy" decoding="async" />
          </div>
        </div>
      </div>
    </section>
  )
}
