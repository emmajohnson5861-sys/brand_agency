import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './BrandSentence.css'

gsap.registerPlugin(ScrollTrigger)

const segments = [
  { text: 'Are are you having ', highlight: false },
  { text: 'trouble', highlight: true },
  { text: ' to explain your ', highlight: false },
  { text: 'brand story', highlight: true },
  { text: '?', highlight: false },
]
const sentence = segments.map(({ text }) => text).join('')
const scrollSpeed = 2.4

export default function BrandSentence() {
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const media = gsap.matchMedia()
    let disposed = false

    // Wait for font metrics before measuring the horizontal track.
    void document.fonts.ready.then(() => {
      if (disposed) return

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const viewport = section.querySelector<HTMLElement>('.sentence-viewport')!
        const track = section.querySelector<HTMLElement>('.sentence-track')!
        const letters = gsap.utils.toArray<HTMLElement>('.sentence-letter', section)
        const distance = () => track.scrollWidth - viewport.clientWidth

        const horizontal = gsap.to(track, {
          x: () => -distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: viewport,
            start: 'top top',
            end: () => `+=${distance() / scrollSpeed}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            refreshPriority: 1,
          },
        })

        letters.forEach((letter, index) => {
          // Stable variation keeps the same choreography after resize or remount.
          const direction = index % 2 === 0 ? 1 : -1
          const offset = (10 + ((index * 11 + 3) % 7)) * 10 * direction
          const rotation = (10 + ((index * 13 + 5) % 11)) * direction

          gsap.fromTo(letter, {
            yPercent: offset,
            rotation,
          }, {
            yPercent: 0,
            rotation: 0,
            ease: 'elastic.out(1.2, 1)',
            scrollTrigger: {
              trigger: letter,
              containerAnimation: horizontal,
              start: 'left 100%',
              end: 'left 0%',
              scrub: 0.3,
            },
          })
        })

        section.querySelectorAll<HTMLElement>('.sentence-highlight').forEach((highlight) => {
          gsap.fromTo(highlight.querySelector('.sentence-highlight-bg'), {
            width: '0%',
          }, {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: highlight,
              containerAnimation: horizontal,
              start: 'left 95%',
              end: 'left 35%',
              scrub: 0.3,
            },
          })
        })

        // This pin initializes after fonts load; refresh it before later sections.
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      }, section)
    })

    return () => {
      disposed = true
      media.revert()
    }
  }, [])

  return (
    <section className="l-sentence" ref={sectionRef} aria-labelledby="brand-question">
      <div className="sentence-viewport">
        <h2 className="sentence-track" id="brand-question" aria-label={sentence}>
          {segments.map(({ text, highlight }, segmentIndex) => (
            <span className={highlight ? 'sentence-segment sentence-highlight' : 'sentence-segment'} key={segmentIndex} aria-hidden="true">
              {highlight && <span className="sentence-highlight-bg" />}
              {Array.from(text).map((character, characterIndex) => (
                <span
                  className={character === ' ' ? 'sentence-space' : 'sentence-letter'}
                  key={`${segmentIndex}-${characterIndex}`}
                >
                  {character === ' ' ? '\u00a0' : character}
                </span>
              ))}
            </span>
          ))}
        </h2>
      </div>
    </section>
  )
}
