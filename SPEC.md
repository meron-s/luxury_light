# Luxury Lighting / Luxury Electrical — Website Specification

Version 1.0 · Static website · Hosted on Vercel · Built with Antigravity · UI designed in Stitch (via MCP)

---

## 1. Project Overview

**Business:** Luxury Lighting (brand/logo name) trading as "Luxury Electrical" (hero headline in the mockup). Supplier of electrical and lighting products in Addis Ababa, Ethiopia.

**Location:** Sosa Merkato (Merkato Sosa Building), Addis Ababa. Landmarks on the map: Harere Hotel (north), Derba Lime and Chemicals (south).

**Tagline(s):** "Lighting Your World", "Quality Products, Brighter Future", "Luxury ይገባዎታል!"

**Goal:** A fast, mobile-first brochure website that presents the product range and turns visitors into phone calls and Telegram messages.

**Primary conversions (in priority order):**
1. Tap-to-call (4 numbers)
2. Telegram message / channel join
3. Get directions to the shop (Google Maps)

**Out of scope (v1):** online payment, cart, user accounts, admin panel, backend database, contact form with server processing.

---

## 2. Brand Identity (derived from the logo and mockup)

| Token | Value | Use |
|---|---|---|
| `--brand-green` | `#5BE584` (sample from the logo, confirm with eyedropper on the file) | Logo, CTAs, accents, icons |
| `--brand-green-strong` | `#2FD468` | Button hover/active |
| `--bg-black` | `#050807` | Header, hero, footer |
| `--bg-dark` | `#0B1210` | Dark sections (About, contact bar) |
| `--bg-light` | `#F4F7F6` | Light sections (Categories, Why Us) |
| `--text-on-dark` | `#FFFFFF` / `#C9D3CF` | Headings / body on dark |
| `--text-on-light` | `#0B1210` / `#4B5A55` | Headings / body on light |
| `--telegram` | `#2AABEE` | Telegram buttons only |

**Typography**
- Headings and body: Inter (self-hosted, variable font, `font-display: swap`).
- Logo wordmark is an image; never recreate it in text.
- Amharic (phase 2): Noto Sans Ethiopic, self-hosted subset.
- Script accent ("Quality Products, Brighter Future"): use only as an image overlay or a single self-hosted script font; keep it decorative.

**Style:** premium dark theme with a green glow accent, rounded cards (16px), soft shadows, lots of product photography.

---

## 3. Functional Requirements

### 3.1 Pages

| Route | Purpose |
|---|---|
| `/` | Home: hero, top categories, about teaser, why choose us, contact bar |
| `/products` | All categories overview with search/filter-by-category |
| `/products/[category]` | One page per category (SEO landing pages) with product cards |
| `/about` | Company story, values, store photos |
| `/gallery` | Photo grid with lightbox |
| `/contact` | Phones, Telegram, TikTok, address, embedded map, opening hours |
| `/404` | Branded not-found page |

### 3.2 Product categories (from mockup)
1. LED Strip Lights
2. LED Panel Lights
3. LED Street Lights
4. Electrical Accessories (breakers, sockets, switches)
5. Cables & Wires
6. Fans & Ventilation

Further categories may be added by editing a data file only (no code changes).

### 3.3 Home page sections (match the mockup order)
1. **Sticky header:** logo, nav (Home, Products, About Us, Gallery, Contact), search icon, green "Call Now" button.
2. **Hero:** eyebrow "LIGHTING YOUR WORLD", H1 "LUXURY ELECTRICAL", short description, 3 trust badges (High Quality Products, Fast Delivery in Addis Ababa, Trusted & Reliable), "Shop Now" button, hero photo.
3. **Top Categories:** 6 cards + "View All Products".
4. **About Us:** logo, copy, 3 badges (Original Products, Professional Service, Customer Satisfaction), photo collage, "Learn More".
5. **We Deliver More:** 4 value props (Premium Quality, Affordable Price, Fast & Safe Delivery, After Sales Support) next to a lifestyle image.
6. **Contact bar:** "Order by Call" with 4 numbers, Telegram inbox (@Rezured) and join button, address.
7. **Footer:** logo, slogans, social icons (Telegram, TikTok; add Facebook/Instagram only when URLs are provided), skyline illustration.

### 3.4 Behaviours
- **Call Now button:** on mobile opens the dialer. If several numbers exist, open a small sheet listing all four numbers. On desktop it scrolls to the contact bar.
- All phone numbers are `tel:` links in international format (see section 6).
- Telegram links open in a new tab with `rel="noopener noreferrer"`.
- "Get Directions" opens Google Maps with the shop as destination.
- Category filter and product search run client-side on pre-built JSON (no server).
- Gallery lightbox: keyboard accessible, swipe on mobile, closes with Esc.
- Optional floating "Call" button on mobile.

### 3.5 Non-functional requirements
| Area | Target |
|---|---|
| Performance | Lighthouse mobile ≥ 90 (Performance), LCP < 2.5 s on 4G, total JS < 100 KB per page |
| Bandwidth | Designed for slower mobile networks: AVIF/WebP, lazy loading, hero image < 200 KB |
| Responsive | 360 px phones first, then tablet and desktop |
| Accessibility | WCAG 2.1 AA: contrast, focus states, alt text, reduced-motion support |
| SEO | Lighthouse SEO ≥ 95, structured data, sitemap |
| Browser support | Last 2 versions of Chrome, Safari, Firefox, Edge, and Samsung Internet |
| Availability | Static hosting on Vercel's CDN |
| Maintainability | All text, products, and contact info edited in `src/data/*.json`, not in components |

---

## 4. System Architecture

### 4.1 Overview

```
 Developer (Antigravity)  ──git push──►  GitHub repo  ──webhook──►  Vercel build
        ▲                                                              │
        │ MCP                                                          ▼
   Stitch (UI designs)                                   Static files on Vercel Edge CDN
                                                                       │
                                                                       ▼
                                  Visitor browser (phone / desktop) ◄──┘
                                       │         │          │
                                       ▼         ▼          ▼
                                   tel: dialer  Telegram   Google Maps
```

No server, no database, no API keys at runtime. Every page is pre-rendered HTML at build time.

### 4.2 Tech stack (chosen)

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro 5 (static output)** | Ships zero JS by default, built-in image optimization, file-based routing, easy to deploy on Vercel |
| Language | TypeScript (strict) | Safer data files and components |
| Styling | **Tailwind CSS v4** + CSS variables for brand tokens | Fast to build from the Stitch design, small output |
| Interactivity | Vanilla TS "islands" (or Alpine-free plain scripts) | Only for mobile menu, call sheet, filter, lightbox |
| Content | JSON / Astro Content Collections validated with Zod | Non-developers can edit products |
| Images | `astro:assets` (Sharp) → AVIF/WebP, responsive `srcset` | Automatic optimization of the folder you provide |
| Icons | Inline SVG (Lucide, tree-shaken) | No icon font, no extra requests |
| Fonts | Self-hosted Inter via `@fontsource-variable/inter` | No third-party font requests (privacy and speed) |
| SEO | `@astrojs/sitemap`, JSON-LD, Open Graph | Local-business visibility |
| i18n (phase 2) | Astro i18n routing: `en` default, `am` Amharic | Many Ethiopian customers prefer Amharic |
| Quality | ESLint, Prettier, `astro check`, Lighthouse CI (optional) | Catch issues before deploy |
| Hosting | **Vercel** (Hobby or Pro) | As requested |
| Analytics | Vercel Web Analytics (cookie-free) | Simple, privacy-friendly |
| Package manager | pnpm (or npm) with committed lockfile | Reproducible builds |

> Why not plain HTML? It would work, but Astro gives image optimization, reusable components, and data-driven product pages with the same static output.

### 4.3 Repository structure

```
luxury-lighting/
├─ public/
│  ├─ favicon.svg, favicon.ico, apple-touch-icon.png
│  ├─ og-image.jpg            (1200×630)
│  ├─ robots.txt
│  └─ site.webmanifest
├─ src/
│  ├─ assets/                 ← the user's image folder is copied here
│  │  ├─ brand/               logo (full, icon-only, mono)
│  │  ├─ hero/
│  │  ├─ categories/          one cover image per category
│  │  ├─ products/<category>/
│  │  ├─ gallery/
│  │  ├─ about/
│  │  └─ misc/                skyline, lifestyle, etc.
│  ├─ components/
│  │  ├─ layout/  Header, Footer, MobileMenu, FloatingCall
│  │  ├─ sections/ Hero, TopCategories, AboutTeaser, WhyUs, ContactBar
│  │  └─ ui/      Button, Card, Badge, SectionHeading, Lightbox, CallSheet
│  ├─ data/
│  │  ├─ site.json            name, tagline, phones, socials, address, hours
│  │  ├─ categories.json
│  │  ├─ products.json
│  │  └─ gallery.json
│  ├─ layouts/  BaseLayout.astro
│  ├─ pages/    index, products/index, products/[category], about, gallery, contact, 404
│  ├─ scripts/  menu.ts, call-sheet.ts, filter.ts, lightbox.ts
│  ├─ styles/   global.css (tokens + Tailwind)
│  └─ content.config.ts       Zod schemas
├─ astro.config.mjs
├─ vercel.json                security headers + cache rules
├─ package.json, pnpm-lock.yaml
├─ AGENTS.md                  rules for Antigravity (see PROMPTS.md)
└─ README.md
```

### 4.4 Data model (JSON)

`site.json`
```json
{
  "name": "Luxury Electrical",
  "brand": "Luxury Lighting",
  "tagline": "Lighting Your World",
  "slogan": "Quality Products, Brighter Future",
  "slogan_am": "Luxury ይገባዎታል!",
  "phones": ["0911948627", "0935021157", "0910404241", "0910210089"],
  "telegram": { "channel": "https://t.me/luxuryelectrical", "inbox": "https://t.me/Rezured", "inboxHandle": "@Rezured" },
  "tiktok": "https://www.tiktok.com/@luxuryelectrical",
  "address": { "line": "Sosa Merkato, Merkato Sosa Building", "city": "Addis Ababa", "country": "Ethiopia" },
  "map": { "shareUrl": "<PASTE GOOGLE MAPS SHARE LINK>", "embedUrl": "<PASTE EMBED URL>" },
  "hours": "<TO CONFIRM WITH OWNER>"
}
```

`categories.json` item: `{ "slug", "name", "name_am", "tagline", "image", "description" }`

`products.json` item: `{ "id", "category", "name", "description", "image", "specs": {"watt": "", "ip": "", "color": ""}, "badge": "New|Popular|null" }`

Pricing is intentionally excluded (static site, prices change). Product cards use "Call to order" and "Ask on Telegram" buttons, with the product name prefilled in the Telegram link text where possible.

---

## 5. Technical Design Notes

### 5.1 Rendering
- `output: 'static'`. `[category]` pages generated with `getStaticPaths()` from `categories.json`.
- Interactive pieces are small scripts loaded with `defer`; no framework runtime.

### 5.2 Image pipeline
1. Antigravity inventories the supplied folder and writes `docs/asset-manifest.md` (filename → intended use → suggested alt text).
2. Images are imported through `astro:assets` `<Image />`/`<Picture />` with `widths`, `sizes`, `format: ['avif','webp']`.
3. Hero image: `loading="eager"` + `fetchpriority="high"`; all others lazy.
4. Always set `width`/`height` to avoid layout shift.
5. Source images over 2000 px wide are downscaled at build.
6. Logo: use the SVG if available; otherwise PNG at 2x, with a transparent-background version for the light header variant if needed.

### 5.3 Phone and link handling
Ethiopian numbers are stored in local format and converted for links:
`0911948627` → `tel:+251911948627`, displayed as `0911 948 627`.
Helper `formatPhone()` and `toTel()` in `src/lib/phone.ts`.

Telegram link with prefilled text: `https://t.me/Rezured?text=Hello%2C%20I%20am%20interested%20in%20...` (works for user accounts; the page should also show the plain @handle).

### 5.4 SEO and local discovery
- Unique `<title>` and meta description per page.
- JSON-LD `ElectricalStore` (LocalBusiness) with name, address, phone numbers, sameAs (Telegram, TikTok), and geo coordinates **once the owner supplies them**.
- Open Graph and Twitter card images.
- `sitemap-index.xml`, `robots.txt`, canonical URLs.
- Reminder to the owner: create and verify a **Google Business Profile** at the Sosa Merkato pin; this drives most local "near me" traffic.

### 5.5 Accessibility
Semantic landmarks, skip link, visible focus ring in brand green, 4.5:1 contrast (the green on black passes; green text on white does **not**, so use dark text on green buttons and never green body text on light sections), `prefers-reduced-motion` respected, all images have alt text, tap targets ≥ 44 px.

### 5.6 Map
Use a **link-out button** ("Get Directions") as the default, plus an optional lazy-loaded Google Maps iframe on `/contact` (`loading="lazy"`, `referrerpolicy="no-referrer-when-downgrade"`). Exact coordinates must come from the owner's Google Maps share link; do not guess them.

---

## 6. Security Design

A static site has a small attack surface. The main risks are supply chain, account takeover, content injection via third-party embeds, and link abuse.

### 6.1 Controls

| Risk | Control |
|---|---|
| Transport | HTTPS only (Vercel automatic TLS), HSTS with `includeSubDomains; preload` after domain is stable |
| XSS / injection | No user-input rendering, no `innerHTML` with dynamic data, strict CSP (below) |
| Clickjacking | `frame-ancestors 'none'` (and `X-Frame-Options: DENY`) |
| MIME sniffing | `X-Content-Type-Options: nosniff` |
| Referrer leakage | `Referrer-Policy: strict-origin-when-cross-origin` |
| Browser features | `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()` |
| Tabnabbing | All external links use `rel="noopener noreferrer"` |
| Secrets | No secrets in the repo; `.env*` in `.gitignore`; MCP tokens for Stitch/Antigravity stay in local config only |
| Supply chain | Committed lockfile, `pnpm audit` in CI, Dependabot enabled, minimal dependencies, pin major versions, no unknown postinstall scripts |
| Account security | 2FA on GitHub, Vercel, domain registrar, and Telegram; use a shared business email, not a personal one |
| Repo protection | Branch protection on `main`; Vercel Preview deployments for every PR; production deploys only from `main` |
| Third-party embeds | Only Google Maps iframe (optional). No ad or tracking scripts. Fonts self-hosted |
| Scraping/spam | Phone numbers are public business info; accept the risk. No email address published (avoid email harvesting) |
| Domain | Registrar lock, DNSSEC if supported, auto-renew on |
| Data privacy | No cookies, no forms, no personal data stored; Vercel Web Analytics is cookie-free. A short privacy note in the footer is optional |

### 6.2 `vercel.json` (starting point)

```json
{
  "cleanUrls": true,
  "trailingSlash": false,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), payment=(), interest-cohort=()" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Content-Security-Policy", "value": "default-src 'self'; img-src 'self' data: https://*.googleapis.com https://*.gstatic.com https://*.google.com; script-src 'self' https://va.vercel-scripts.com; style-src 'self' 'unsafe-inline'; font-src 'self'; connect-src 'self' https://vitals.vercel-insights.com; frame-src https://www.google.com https://maps.google.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests" }
      ]
    },
    {
      "source": "/_astro/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    }
  ]
}
```

Test the CSP in a Preview deployment; if Astro inlines any scripts, switch to external script files rather than adding `'unsafe-inline'` to `script-src`. Remove the Google and Vercel Analytics entries if you don't use the map embed or analytics.

---

## 7. Deployment (Vercel)

### 7.1 Pipeline
1. Create a GitHub repo `luxury-lighting` and push from Antigravity.
2. In Vercel: **Add New → Project → Import** the repo. Framework preset: **Astro**. Build command `pnpm build`, output directory `dist`.
3. Every push to a branch creates a **Preview URL**; merging to `main` deploys to **Production**.
4. Add the custom domain in *Settings → Domains*, update DNS at the registrar (A/CNAME as Vercel shows), and wait for the automatic certificate.
5. Enable **Web Analytics** (optional) and **Speed Insights** (optional).
6. Set the `site` option in `astro.config.mjs` to the production URL so the sitemap and canonical tags are correct.

### 7.2 Pre-launch checklist
- [ ] All 4 phone numbers dial correctly on a real phone (+251 format)
- [ ] Telegram channel, inbox, and TikTok links open the correct accounts
- [ ] Google Maps link lands on the Sosa Merkato pin, not just "Merkato"
- [ ] Opening hours confirmed with the owner (or the field removed)
- [ ] Lighthouse mobile ≥ 90 on `/`, `/products`, `/contact`
- [ ] Security headers verified at securityheaders.com (aim for A)
- [ ] 404 page works; sitemap and robots are reachable
- [ ] Alt text on every image; keyboard navigation works
- [ ] Tested on a low-end Android phone and on throttled "Slow 4G"
- [ ] Google Business Profile created and linked to the website

### 7.3 Maintenance
- Edit `src/data/*.json` or drop new images in `src/assets/products/<category>/`, then commit; Vercel redeploys in about a minute.
- Monthly: merge Dependabot PRs, review Vercel deployment logs.

---

## 8. Delivery Plan (phases)

| Phase | Output |
|---|---|
| 0. Inputs | Image folder + asset manifest, confirmed contacts, Google Maps link, hours |
| 1. Design | Stitch screens for Home, Products, Category, About, Gallery, Contact (mobile + desktop) |
| 2. Foundation | Astro project, tokens, layout, header/footer, data files, security headers |
| 3. Pages | Home → Products/Category → Contact → About → Gallery → 404 |
| 4. Polish | SEO, JSON-LD, a11y pass, performance pass, image tuning |
| 5. Launch | Vercel production, domain, checklist, Google Business Profile |
| 6. Phase 2 (optional) | Amharic version, WhatsApp button (if they have one), product search improvements, Facebook/Instagram links |

---

## 9. Open Items to Confirm with the Owner
1. Exact Google Maps share link (the screenshot pin is at Merkato Sosa Building, next to the Harere Hotel / Derba Lime and Chemicals area).
2. Opening hours and days.
3. Which name appears on the site: "Luxury Lighting" (logo) or "Luxury Electrical" (mockup headline). Recommendation: logo says Luxury Lighting; headline and page titles use "Luxury Electrical", with "Luxury Lighting" kept in the logo.
4. Facebook/Instagram URLs (the mockup footer shows icons for them).
5. Whether delivery is limited to Addis Ababa or goes further.
6. Whether Amharic is required at launch.
7. Domain name (e.g. `luxuryelectrical.com` / `.et`).
8. Brand green exact hex (sample from the logo file).
