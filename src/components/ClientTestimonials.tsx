import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ActionButton from './ActionButton'
import './ClientTestimonials.css'

gsap.registerPlugin(ScrollTrigger)

// Existing feedback summaries from the SaaS landing page's config/ending.ts.
const reviews = [
  { name: 'Ahsan Raza', role: 'CEO', company: 'QuickBasket · Karachi', summary: 'Algofort helped QuickBasket turn an idea into a working app faster than expected. A responsive, professional team and skilled engineering made the experience feel like a true technology partnership.' },
  { name: 'Bilal Shahid', role: 'CTO', company: 'PayWell Solutions · Islamabad', summary: 'The team understood the complexity behind PayWell’s fintech product and delivered a secure, scalable solution on time. Clear understanding of the requirements made a real difference to the project.' },
  { name: 'Hira Javed', role: 'Marketing Head', company: 'Al-Karim Fabrics · Faisalabad', summary: 'Algofort’s website revamp brought Al-Karim Fabrics a sleek, fast, mobile-friendly experience. The result matched what the team wanted for its customers and gave the website a fresh direction.' },
  { name: 'Zainab Fatima', role: 'Founder', company: 'GlamNest · Lahore', summary: 'The branding work transformed GlamNest’s online presence. A more premium, professional look brought a clearer identity to the business and changed how the brand presented itself online.' },
]

function QuoteMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M10 4H4v8h4c0 3-1 4-4 5v3c5-1 7-4 7-9V4h-1Zm12 0h-6v8h4c0 3-1 4-4 5v3c5-1 7-4 7-9V4h-1Z" /></svg>
}

export default function ClientTestimonials() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const media = gsap.matchMedia()
    media.add('(min-width: 1200px) and (prefers-reduced-motion: no-preference)', () => {
      const section = sectionRef.current!
      const cards = [...section.querySelectorAll('.client-review')]
      const reviewsButton = section.querySelector('.client-reviews-button')!
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: '+=400%',
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })

      gsap.to('.client-testimonials-heading', {
        opacity: 0,
        filter: 'blur(10px)',
        ease: 'power1.out',
        scrollTrigger: { trigger: section, start: 'top top', end: '+=200%', scrub: true },
      })

      // Preserve the reference's pause, card stagger and final reading interval.
      timeline.to({}, { duration: 0.5 })
      timeline.add('startItems', '+=0.9')
      cards.forEach((card, index) => {
        timeline.fromTo(card, { xPercent: 450 }, { xPercent: 0, duration: 1, ease: 'power1.out' }, `startItems+=${index * 0.6}`)
      })
      timeline.addLabel('cardsVisible')
      timeline.fromTo(reviewsButton, { y: 35, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, ease: 'power2.out' }, 'cardsVisible')
      timeline.to({}, { duration: 1.5 })
    }, sectionRef)

    media.add('(max-width: 1199px) and (prefers-reduced-motion: no-preference)', () => {
      gsap.from('.client-reviews-button', {
        y: 45,
        autoAlpha: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: { trigger: '.client-review:last-child', start: 'bottom 90%', once: true },
      })
    }, sectionRef)

    return () => media.revert()
  }, [])

  return (
    <section className="client-testimonials" id="testimonials" ref={sectionRef} aria-labelledby="client-testimonials-title">
      <div className="page-inset client-testimonials-main">
        <div className="client-testimonials-heading">
          <h2 id="client-testimonials-title">Client’s<br />Testimonial</h2>
          <div className="client-testimonials-count">
            <span className="client-testimonials-total">04</span>
            <p>Client stories<br /><span>From our clients</span></p>
          </div>
        </div>
        <div className="client-testimonials-results">
          <div className="client-testimonials-cards">
          {reviews.map(({ name, role, company, summary }) => (
            <figure className="client-review" key={name}>
              <blockquote cite="https://algoforts.vercel.app/#sec-testimonials">{summary}</blockquote>
              <figcaption className="client-review-author">
                <div>
                  <h3>{name}</h3>
                  <p>{role}<br />{company}</p>
                </div>
                <span className="client-review-quote"><QuoteMark /></span>
              </figcaption>
            </figure>
          ))}
          </div>
          <ActionButton className="client-reviews-button" href="https://algoforts.vercel.app/#sec-testimonials" target="_blank" rel="noopener noreferrer" arrow>View All Reviews</ActionButton>
        </div>
      </div>
    </section>
  )
}
