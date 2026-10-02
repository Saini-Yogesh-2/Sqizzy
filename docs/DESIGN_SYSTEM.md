# SQIZZY — DESIGN SYSTEM & VISUAL IDENTITY SPECIFICATION

## 1. Color Palette Tokens

| Token Name | Hex Value | Usage |
|---|---|---|
| `--sqizzy-peanut` | `#D97706` | Primary brand amber, key buttons, icons, highlights |
| `--sqizzy-peanut-light` | `#F59E0B` | Creamy honey gold, hover states, hero gradients |
| `--sqizzy-peanut-dark` | `#B45309` | Deep roasted amber, borders, shadow accents |
| `--sqizzy-chocolate` | `#29150B` | Rich cocoa plum, main text, dark cards, footer |
| `--sqizzy-chocolate-dark`| `#190B05` | Deep espresso, dark sections, admin background |
| `--sqizzy-cream` | `#FFFBEB` | Soft organic milk cream, card backgrounds |
| `--sqizzy-sand` | `#FEF3C7` | Warm beige, badges, icon containers, tags |
| `--sqizzy-surface` | `#FFFFFF` | Form inputs, popover surfaces |
| `--sqizzy-zest` | `#F97316` | Energetic citrus orange accent, secondary CTAs |
| `--sqizzy-zest-dark` | `#EA580C` | Deep tangerine, active click states |
| `--sqizzy-muted` | `#785A48` | Secondary body text, captions, subtitles |
| `--sqizzy-border` | `#E8DCCF` | Primary subtle card and separator borders |

---

## 2. Typography Hierarchy

### Display Font
- **Family:** `Outfit`, `Cabinet Grotesk`, sans-serif
- **Usage:** Headings (`h1`, `h2`, `h3`), Product titles, Numerical stats, Hero headlines
- **Weights:** Bold (700), Extra Bold (800), Black (900)

### Body Font
- **Family:** `Plus Jakarta Sans`, `Inter`, sans-serif
- **Usage:** Paragraphs, Button labels, Form fields, Tooltips, Navigation links
- **Weights:** Regular (400), Medium (500), SemiBold (600), Bold (700)

### Editorial Accent Font
- **Family:** `Instrument Serif`, serif
- **Usage:** Italic storytelling subheadings, quotes, editorial flourishes

---

## 3. Elevation & Shadows
- `shadow-sqizzy`: `0 10px 30px -5px rgba(41, 21, 11, 0.08), 0 4px 12px -2px rgba(41, 21, 11, 0.04)`
- `shadow-sqizzy-lg`: `0 20px 40px -10px rgba(41, 21, 11, 0.14), 0 8px 16px -4px rgba(41, 21, 11, 0.06)`
- `shadow-sqizzy-glow`: `0 0 35px -5px rgba(217, 119, 6, 0.35)`

---

## 4. UI Components

### Primary Button
- **Styles:** `bg-gradient-to-r from-[#F59E0B] via-[#D97706] to-[#EA580C] text-[#29150B] font-extrabold uppercase rounded-2xl shadow-lg`
- **Microinteraction:** Slight scale up on hover (`brightness-105`), active press `scale-95`.

### Secondary Button
- **Styles:** `bg-white border-2 border-[#E8DCCF] text-[#29150B] font-bold rounded-2xl`
- **Microinteraction:** Subtle background tint to `#FEF3C7` on hover.

### Product Cards
- **Styles:** `bg-[#FFFBEB] rounded-3xl p-6 border border-[#E8DCCF] shadow-sqizzy`
- **Hover:** `-translate-y-2`, shadow expansion to `shadow-sqizzy-lg`.

---

## 5. Animation Philosophy
- **Framer Motion:** Used for smooth entrance reveals, layout transitions, and accordion drawers.
- **Timing:** Fast and purposeful (200ms - 400ms duration with spring damping).
- **Reduced Motion:** Fully honors `prefers-reduced-motion: reduce` by defaulting to instant transitions.
