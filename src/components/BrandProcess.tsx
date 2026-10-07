import { useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './BrandProcess.css'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    title: 'Discover',
    description: 'We listen, ask the right questions and look closely at your business, audience and ambitions. Together, we uncover what makes your brand matter.',
    deliverables: ['Brand workshop', 'Audience research', 'Brand audit'],
  },
  {
    title: 'Define',
    description: 'We turn those insights into a clear strategy. Your positioning, personality and story become the foundation for a distinctive creative direction.',
    deliverables: ['Brand positioning', 'Tone of voice', 'Creative direction'],
  },
  {
    title: 'Design & Deliver',
    description: 'We bring your brand to life through identity, design and the details that connect it all. You leave with a cohesive system and everything you need to launch confidently.',
    deliverables: ['Visual identity', 'Brand guidelines', 'Launch assets'],
  },
]

export default function BrandProcess() {
  const sectionRef = useRef<HTMLElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  useLayoutEffect(() => {
    const media = gsap.matchMedia()

    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.process-title-line > span', {
        yPercent: 105,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.process-heading', start: 'top 95%', end: 'bottom 65%', scrub: 0.5 },
      })

      sectionRef.current!.querySelectorAll<HTMLElement>('.process-step').forEach((step, index) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'clamp(top 55%)',
          end: 'clamp(bottom 55%)',
          onEnter: () => setActiveStep(index),
          onEnterBack: () => setActiveStep(index),
        })
        gsap.fromTo(step.querySelector('.process-step-rule'), { scaleX: 0 }, {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: step, start: 'top 85%', end: 'clamp(bottom 55%)', scrub: 0.5 },
        })
        gsap.from(step.querySelector('.process-step-copy'), {
          y: 30,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: step, start: 'top 90%' },
        })
      })

      const frame = sectionRef.current!.querySelector<HTMLElement>('.process-photo')!
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
      reveal.fromTo(frame.querySelector('img'), { scale: 1.3 }, { scale: 1 }, 0)
    }, sectionRef)

    // The active step remains meaningful even when the visitor prefers static visuals.
    media.add('(prefers-reduced-motion: reduce)', () => {
      sectionRef.current!.querySelectorAll<HTMLElement>('.process-step').forEach((step, index) => {
        ScrollTrigger.create({ trigger: step, start: 'clamp(top 55%)', end: 'clamp(bottom 55%)', onEnter: () => setActiveStep(index), onEnterBack: () => setActiveStep(index) })
      })
    }, sectionRef)

    return () => media.revert()
  }, [])

  return (
    <section ref={sectionRef} className="brand-process" id="process" aria-labelledby="process-heading">
      <div className="page-inset">
        <div className="process-heading">
          <p className="studio-label">// Our process</p>
          <h2 className="process-title" id="process-heading">
            <span className="process-title-line"><span>How we build</span></span>{' '}
            <span className="process-title-line"><span>your brand.</span></span>
          </h2>
          <p className="process-intro">A clear direction. A collaborative journey.<br />Three thoughtful steps to a brand that feels like you.</p>
        </div>

        <div className="process-body">
          <div className="process-visual">
            <div className="process-photo">
              <img
                src="/images/process/brand-process.jpg"
                alt="A creative workspace with a laptop, coffee and warm neutral textures"
                width="1600"
                height="833"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
          <ol className="process-steps">
            {steps.map(({ title, description, deliverables }, index) => (
              <li className={`process-step${activeStep === index ? ' is-active' : ''}`} key={title}>
                <span className="process-step-rule" aria-hidden="true" />
                <span className="process-step-number" aria-hidden="true">0{index + 1}</span>
                <div className="process-step-copy">
                  <h3>{title}</h3>
                  <p>{description}</p>
                  <ul className="process-deliverables" aria-label={`${title} deliverables`}>
                    {deliverables.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
