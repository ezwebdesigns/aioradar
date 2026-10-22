---
name: Expressive Vivid System
colors:
  surface: '#fff7fb'
  surface-dim: '#efd0f7'
  surface-bright: '#fff7fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#ffefff'
  surface-container: '#fde7ff'
  surface-container-high: '#fae0ff'
  surface-container-highest: '#f8d8ff'
  on-surface: '#281330'
  on-surface-variant: '#57414a'
  inverse-surface: '#3e2846'
  inverse-on-surface: '#feebff'
  outline: '#8a707b'
  outline-variant: '#ddbfca'
  surface-tint: '#b2107b'
  primary: '#af0a78'
  on-primary: '#ffffff'
  primary-container: '#cf3192'
  on-primary-container: '#fffbff'
  inverse-primary: '#ffafd5'
  secondary: '#744aa2'
  on-secondary: '#ffffff'
  secondary-container: '#cda0fe'
  on-secondary-container: '#5a3086'
  tertiary: '#006388'
  on-tertiary: '#ffffff'
  tertiary-container: '#007dab'
  on-tertiary-container: '#fcfcff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd8e8'
  primary-fixed-dim: '#ffafd5'
  on-primary-fixed: '#3d0027'
  on-primary-fixed-variant: '#8a005e'
  secondary-fixed: '#efdbff'
  secondary-fixed-dim: '#dbb8ff'
  on-secondary-fixed: '#2b0052'
  on-secondary-fixed-variant: '#5b3188'
  tertiary-fixed: '#c5e7ff'
  tertiary-fixed-dim: '#7ed0ff'
  on-tertiary-fixed: '#001e2d'
  on-tertiary-fixed-variant: '#004c6a'
  background: '#fff7fb'
  on-background: '#281330'
  surface-variant: '#f8d8ff'
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

# Design System

## Brand & Style
The design system embraces an **expressive** design style, characterized by a vibrant and bold palette, highly rounded forms, and contemporary typography that creates a friendly yet dynamic user experience. The aesthetic is energetic and modern, appealing to creative audiences and consumer-facing applications that value personality and distinct visual impact.

## Colors
The color palette is built for high visual engagement and semantic clarity:
- **Primary Color (`#e040a0`)**: A vivid magenta that anchors primary actions, key interactive elements, and focal points.
- **Secondary Color (`#7c52aa`)**: A rich purple providing harmonious contrast for supportive UI elements and secondary states.
- **Tertiary Color (`#0096cc`)**: A bright cyan accent used for highlights and specialized calls to action.
- **Neutral Color (`#604868`)**: A muted, cool-toned dark plum/slate used for text, borders, and structured backgrounds, ensuring readability and cohesion.

## Typography
The typography utilizes a curated multi-typeface approach: **Geist** powers the prominent headlines with a clean, high-performance aesthetic; **Plus Jakarta Sans** provides a warm, highly legible foundation for body text; and **JetBrains Mono** introduces a precise, technical edge for labels and metadata. Font weights range from regular (400) for comfortable body reading to bold (700) for impactful headlines.

## Layout & Spacing
A balanced spacing scale ensures ample breathing room and structured alignment. Margins are set to `1.5rem` and gutters to `1rem`, supporting a responsive fluid grid that scales cleanly from mobile to desktop environments.

## Elevation & Depth
Elevation is achieved through soft, diffused ambient shadows tinted with the neutral color palette, alongside tonal layering. This creates a welcoming, tactile depth that complements the rounded and expressive nature of the components.

## Shapes
The shape language uses a **pill-shaped** configuration (`roundedness: 3`). UI elements feature large border radii (starting at 1rem for base elements and scaling up to 2rem and 3rem for larger containers), projecting a friendly, soft, and approachable character.

## Components
Components are styled to align with the expressive and pill-shaped design system:
- **Buttons**: Fully rounded (pill-shaped) with high-impact primary background colors (`#e040a0`) and clear label typography in JetBrains Mono.
- **Chips & Badges**: Soft pill containers using secondary and tertiary accents for tagging and categorization.
- **Input Fields**: Generous padding, fully rounded borders using the neutral color palette for subtle boundaries, and Plus Jakarta Sans text.
- **Cards**: Softly elevated containers with large border radii, housing structured content with ample internal spacing.
- **Checkboxes & Radios**: Smooth, rounded geometry reflecting the overall playful aesthetic.