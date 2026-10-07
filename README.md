# Algofort landing page

React, TypeScript, and Vite landing page for Algofort. Includes a responsive header, a large DM Sans heading reading designing brand stories, and a call to action. Hero dividers and CTA borders are removed; CTA hover fills use the orange accent.

Below the hero gallery, `BrandSentence` recreates the pinned horizontal sentence effect from Made With GSAP: individual letters enter from scattered vertical positions and rotations, then settle with elastic easing as the visitor scrolls. Rounded orange backgrounds highlight “trouble” and “brand story” and reveal alongside the letters. It uses GSAP ScrollTrigger, adapts to mobile sizes, and shows a static heading when reduced motion is enabled.

`SmoothScroll` uses Lenis, synchronized with the GSAP ticker, for smooth wheel scrolling and anchor navigation. Reduced motion uses native scrolling. The sentence moves at 2.4 times its original rate, shortening the vertical scroll distance required to read the complete question.

HeroGallery replaces the original image grid with the Adon marketing moving gallery: four local portrait images repeated twice, rounded corners, a scroll-driven horizontal translation with scrub 1, and an entrance reveal. Image assets live in public/images/hero-slider and can be replaced independently. Responsive card widths match the reference, while reduced motion exposes a manually scrollable strip.

The reference image is stored locally in `public/images/algofort-reference.png` and framed with CSS for the logo and project visuals. The project buttons currently open a temporary inquiry notice; a contact destination can be connected when provided.

`BrandApproach` follows the animated question with the client answer, a brand image, and five plain service labels below the statement, without borders or hover styles. The small section label is removed. On desktop, the image follows the text column height with 24px of extra height; mobile uses a compact landscape crop. SplitText adapts to the rendered lines. Each line independently wipes from 30% grey to black as it moves from 85% of the viewport toward the center, reproducing the reference with overlapping progress and scrub 1. The reveal end is clamped to the page's available scroll distance. Reduced motion shows the complete statement. The sentence pin refreshes first so later scroll effects use the correct positions.

`ActionButton` recreates the Adon reference button's rounded rectangle, bottom-up background fill, and rolling label hover. Primary buttons share this style and support the same effect on keyboard focus. The workflow section has been removed.

`StudioSections` adds the Adon Design Studio reference's oversized three-line title, who-we-are copy, automatic logo strip, and dark service section. The logos move continuously in a seamless 40-second loop, independently of page scrolling. Two equal groups preserve spacing at the loop boundary and fill even wide screens; reduced motion shows one static group. A single pinned timeline shrinks and rotates the asterisk, moves it to the centre, and expands it into the next section. `StudioAsterisk` renders a vector path inside a viewport-sized inline SVG; its geometry is transformed without enlarging a cached image layer, keeping the expansion sharp. Who-we-are content and logos stay fully opaque and are covered naturally by the shape. The services section follows the pinned scene in normal document flow and enters from below only after the icon has fully expanded, without an opacity switch or an overlapping margin. Direct scrubbing keeps the icon synchronized with Lenis's smooth scroll so it finishes before the scene unpins. Distances and the covering size are measured from the current viewport, including mobile. The scroll sequence reverses with scrolling, cleans up on unmount, and is replaced with a readable static layout for reduced motion. The nine reference logos in `public/images/studio` are sample assets to replace with Algofort's own client logos.

The studio scene and dark services background span the full viewport, including screens wider than the page's 1700px frame. Text remains in a centred content area. The scroll sequence first completes the STUDIO title's rightward slide, with clearance around the icon, before the icon descends and the content scrolls. The icon's SVG viewport uses the full scene width when expanding.

The studio transition uses an extended scroll distance. The left-to-centre move has 80% more scroll space and gentler acceleration, with the overall scroll distance adjusted to preserve the existing pace of the title slide, descent, and expansion. The final scale-up retains its longer scroll interval and finishes before the dark services section enters.

The dark “What we do” section pairs a brand introduction with six numbered services: Brand Strategy, Logo Design, Visual Identity, Brand Experience, Packaging Design, and Brand Collateral. `StudioServiceList` recreates the Cubex cursor-following preview: each row shows a different image with a 0.4-second scale reveal and a 0.6-second eased cursor follow. All six original Cubex preview images are stored locally in `public/images/services` and cropped consistently into smaller 200 × 136px frames. Keyboard focus also reveals the preview; touch layouts retain a clean service list, and reduced motion removes the animation. Service buttons open the existing project inquiry.

`LatestWork` follows the services section on the same full-width dark background. It uses the current large heading style, a short introduction, and a Build Your Brand button linked to the existing inquiry. Six temporary Adon project images are stored in `public/images/latest-work` and displayed in a two-column grid, changing to one column on mobile. The reference scale reveal animates each image frame from 90% to full size while its image zooms out from 130%. Reduced motion shows static images. Project captions and images contain no links, project buttons, or cursor labels. Replace the image and caption data at the top of `src/components/LatestWork.tsx` when final project assets are provided.

`BrandProcess` follows the portfolio with a full-width light section and three stages: Discover, Define, and Design & Deliver. A simple workspace photograph stays sticky on desktop and uses the same frame scale and image zoom-out reveal as the featured projects. The numbered steps include growing orange progress lines, explanations and deliverable pills. Mobile places the image above the stacked steps. Reduced motion keeps the image static. The temporary photograph is stored at public/images/process/brand-process.jpg. All ScrollTriggers clean up on unmount.

ClientTestimonials follows the process with a centered heading, gray background, alternating white and dark cards, and quote badges matching the Adon marketing reference. On desktop, the heading fades and blurs while four cards enter from the right during a four-screen pin. Below 1200px, cards use a two-column or single-column layout. Reduced motion avoids pinning and animation. Content comes from the existing SaaS landing page feedback summaries; the reference Clutch rating is replaced by the actual four-story count.

## Run locally

`SiteFooter` uses the Adon marketing footer layout with Algofort contact details and social links. The rounded newsletter form includes email validation, an animated submit arrow and orange hover. Set `VITE_NEWSLETTER_ENDPOINT` to a subscription endpoint accepting a JSON POST body with an `email` field to enable subscriptions. Company links point to this page, the footer displays the phone number and existing privacy link, and Back to top uses smooth anchor navigation. The layout switches from four columns to stacked groups on smaller screens.

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```
