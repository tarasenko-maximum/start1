---
name: Phygital Editorial
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#44474b'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#74777b'
  outline-variant: '#c4c6cb'
  surface-tint: '#575f68'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#141c23'
  on-primary-container: '#7c858e'
  inverse-primary: '#bfc7d1'
  secondary: '#506070'
  on-secondary: '#ffffff'
  secondary-container: '#d3e4f8'
  on-secondary-container: '#566676'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1a1c18'
  on-tertiary-container: '#83847e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe3ed'
  primary-fixed-dim: '#bfc7d1'
  on-primary-fixed: '#141c23'
  on-primary-fixed-variant: '#404850'
  secondary-fixed: '#d3e4f8'
  secondary-fixed-dim: '#b8c8db'
  on-secondary-fixed: '#0c1d2b'
  on-secondary-fixed-variant: '#384858'
  tertiary-fixed: '#e3e3dc'
  tertiary-fixed-dim: '#c7c7c0'
  on-tertiary-fixed: '#1a1c18'
  on-tertiary-fixed-variant: '#464742'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
typography:
  display-lg:
    fontFamily: Literata
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Literata
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Literata
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-sm:
    fontFamily: Hanken Grotesk
    fontSize: 13px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 32px
  margin-mobile: 20px
  section-gap: 80px
---

## Brand & Style
The design system is built on the concept of "Phygital Minimalism"—the intersection of tactile book-making traditions and high-performance digital interfaces. It targets authors, collectors, and readers who value literary quality and modern efficiency. 

The aesthetic is intentionally understated to allow book cover art to remain the focal point. By utilizing a "Paper-First" philosophy, the UI mimics the physical qualities of premium stationery: high-contrast "ink" on off-white "paper," generous margins, and a structured, editorial grid. The emotional goal is to evoke trust, intellectual depth, and the quiet focus of a library, while maintaining the snappy responsiveness of a 2026 web application.

## Colors
The palette is rooted in the "Ink and Paper" metaphor. 

- **Primary (Ink):** A deep charcoal-blue used for primary actions, headlines, and high-contrast UI elements. It ensures maximum accessibility and a serious, authoritative tone.
- **Secondary (Slate):** A muted blue-grey for secondary information, meta-data, and icons.
- **Background (Paper):** A soft, warm off-white (#F9F9F7) that reduces eye strain compared to pure white and provides a sophisticated backdrop for vibrant book covers.
- **Accents:** High-contrast monochromatic scales. Success and warning states should use desaturated versions of green and gold to maintain the refined, non-distracting aesthetic.

## Typography
The typography system employs a "Dual-Role" hierarchy:
1. **Literata (Serif):** Reserved for book titles, editorial quotes, and section headers. Its scholarly and warm character reinforces the platform's literary roots.
2. **Hanken Grotesk (Sans-Serif):** Used for all functional UI components, including navigation, pricing, data, and form fields. It provides a sharp, contemporary contrast to the serif headings.

Line heights are intentionally generous to improve legibility and reinforce the minimalist, airy feel of the layout.

## Layout & Spacing
This design system utilizes a strictly structured 12-column grid. 

- **Desktop:** 12 columns with wide 32px gutters to prevent content density and maintain an editorial feel.
- **Tablet:** 8 columns with 24px gutters.
- **Mobile:** 4 columns with 20px margins.

Spacing follows an 8px incremental scale, but emphasizes "Negative Space" as a functional element. Hero sections and book detail pages should use the `section-gap` token to create distinct visual pauses between different types of content, ensuring the interface never feels cluttered.

## Elevation & Depth
Depth is communicated through **Tonal Layering** and **Subtle Materiality** rather than heavy shadows.

- **Surface Tiers:** Background is the lowest layer (#F9F9F7). Cards and containers use #FFFFFF with a very thin (0.5px) border in a light grey-beige to define edges.
- **Micro-Shadows:** When an element requires elevation (e.g., a hovered book cover), use a long, soft, low-opacity shadow (e.g., `0 20px 40px rgba(18, 26, 33, 0.05)`) to simulate the way a physical book sits on a table.
- **Glassmorphism:** Use sparingly for sticky navigation bars with a high-intensity backdrop blur (20px) and a subtle #FFFFFF 40% tint to maintain the "airy" quality of the UI.

## Shapes
The shape language is "Refined-Soft." 

A `roundedness` of `1` (0.25rem) is the standard for buttons and input fields, mimicking the slightly rounded corners of a high-quality hardcover book or thick-cut paper. Book cover images should retain their natural aspect ratios and use a slightly higher `rounded-lg` (0.5rem) to differentiate "Content" from "Interface." Avoid fully circular "pill" shapes for primary buttons to maintain the structured, architectural integrity of the design system.

## Components
- **Buttons:** Primary 'Pre-order & Print' CTAs are solid Ink Blue (#121A21) with white Hanken Grotesk text. They feature a slight "press" interaction (scale 0.98) to feel tactile.
- **Progress Bars:** Crowdfunding progress bars are sleek and thin (4px height). The background is a light parchment grey, while the fill is a high-contrast charcoal. Use a micro-animation that "inks" in from left to right.
- **Cards:** Book cards feature the cover as the hero element. Text information is placed below with significant padding. On hover, the cover image should lift slightly and the border should darken.
- **Input Fields:** Use "Line-style" inputs or very subtle borders. Focus states should be indicated by a weight increase in the bottom border or a subtle shift in background tint to #F0F0EB.
- **Chips/Labels:** Small, rectangular tags with 2px corner radius and light slate backgrounds, used for genres or campaign status (e.g., "90% Funded").
- **CTAs:** 'Pre-order' buttons should always be accompanied by a "Print Progress" indicator to bridge the gap between digital transaction and physical production.