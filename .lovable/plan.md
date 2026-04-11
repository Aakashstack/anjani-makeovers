

# Anjani Makeovers — Full Website Build

Building the complete website from scratch with a brands carousel and rich animations throughout.

## Design System

- **Palette**: Soft pink `#F5E6E0`, nude `#E8D5C4`, gold `#C9A96E`, white, black `#1A1A1A`
- **Fonts**: Playfair Display (headings) + Inter (body) via Google Fonts
- **Animations**: Scroll-triggered fade-ins, parallax hero, staggered card reveals, hover lifts, counter animations, infinite brand carousel scroll

## File Structure

### Components (~15 files in `src/components/`)
- `Navbar.tsx` — Sticky, transparent-to-solid on scroll, mobile hamburger
- `HeroSection.tsx` — Full-screen with parallax, animated tagline, shimmer CTA buttons
- `AboutSection.tsx` — Split layout with fade-in-left/right animations
- `ServicesSection.tsx` — 4 staggered-reveal service cards with gold accents and hover lift
- `PortfolioSection.tsx` — Filterable masonry grid with scale-in animations
- `Lightbox.tsx` — Modal image viewer
- `BeforeAfter.tsx` — Drag slider for transformation comparisons
- `BrandsCarousel.tsx` — **Infinite auto-scrolling logo carousel** with grayscale-to-color hover, smooth CSS animation, pause on hover
- `TestimonialsSection.tsx` — Carousel with fade transitions, star ratings
- `BookingSection.tsx` — Animated form with date picker, floating labels
- `ContactSection.tsx` — Info cards with staggered reveal
- `WhatsAppButton.tsx` — Floating pulse-animated button
- `StatsCounter.tsx` — Animated counting numbers (years experience, happy clients, etc.)
- `Footer.tsx` — Elegant footer with social links

### Pages
- `Index.tsx` — Composes all sections into a single-page scrolling site
- `Services.tsx`, `Portfolio.tsx`, `Booking.tsx` — Dedicated route pages

### Animation System (in `tailwind.config.ts`)
- `fade-in-up`, `fade-in-left`, `fade-in-right` with intersection observer triggers
- `float` (gentle up/down), `shimmer` (gold shimmer on CTAs)
- `scroll-left` — infinite horizontal scroll for brands carousel
- `scale-in`, `slide-up` with staggered delays
- Custom `useScrollAnimation` hook for scroll-triggered reveals

## Brands Carousel Details
- Logos of cosmetic brands (MAC, Lakme, Bobbi Brown, Charlotte Tilbury, etc.) as styled text/SVG placeholders
- Infinite seamless CSS scroll animation (duplicated items trick)
- Grayscale by default, full color on hover
- Subtle separator line above/below
- "Trusted Brands We Use" heading with gold accent

## Key Animation Highlights
- Hero text: letter-by-letter or word-by-word reveal
- Scroll-triggered section reveals with staggered children
- Service cards: hover lift + gold border glow
- Portfolio images: scale on hover with overlay
- Stats section: counting number animation on scroll
- Testimonial cards: smooth carousel with dots
- Smooth page transitions

