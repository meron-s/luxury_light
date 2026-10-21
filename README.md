# Luxury Lighting / Luxury Electrical — Static Website

Official static brochure website for **Luxury Lighting** (trading as **Luxury Electrical**) — premier supplier of architectural and commercial lighting products located at **Sosa Merkato (Merkato Sosa Building)** in Addis Ababa, Ethiopia.

Built with **Astro 5**, **TypeScript (Strict)**, and **Tailwind CSS v4**. Static output hosted on **Vercel**.

---

## 1. Quick Start (Run Locally)

### Prerequisites
- Node.js v18+ or v20+
- npm (or pnpm)

### Setup & Run
```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```
Open [http://localhost:4321](http://localhost:4321) in your browser.

### Quality Checks & Build
```bash
# Run TypeScript and Astro diagnostics
npm run check

# Build production static bundle (outputs to /dist)
npm run build

# Preview production build locally
npm run preview
```

---

## 2. How to Edit Website Content

Per project architecture, non-developers can manage all store information, contact numbers, and product inventory entirely through JSON files in `src/data/`:

| Content Item | File Location | What You Can Edit |
|---|---|---|
| **Store & Contact Info** | `src/data/site.json` | Store name, slogan, 4 phone numbers, Telegram links, TikTok link, address, Google Maps links, and opening hours. |
| **Categories** | `src/data/categories.json` | Category titles, Amharic translations, taglines, and descriptions. |
| **Product Inventory** | `src/data/products.json` | Add, update, or remove products (names, descriptions, wattage, IP ratings, color temperature, badges). |
| **Project Gallery** | `src/data/gallery.json` | Add or update showcase photos, titles, categories, and descriptions. |

### Adding New Products & Images
1. Place the new product image into `src/assets/products/<category-slug>/`.
2. Add a new item into `src/data/products.json` referencing that image path.
3. Commit and push your changes to GitHub — Vercel will rebuild and deploy automatically in ~60 seconds!

---

## 3. Deployment (Vercel)

1. Push this repository to GitHub (`main` branch).
2. Go to [Vercel](https://vercel.com) and click **Add New → Project → Import**.
3. Select **Astro** framework preset:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Deploy! Vercel provides automatic HTTPS, global Edge CDN distribution, and HTTP/3 support.
5. In Vercel Project Settings → **Domains**, add the custom domain (e.g., `luxuryelectrical.et`).

---

## 4. Key Performance & Security Features

- **Zero Client JS by Default**: Ultra-lightweight static pages with deferred vanilla TypeScript for interactive features (menu, bottom call sheet, search filter, photo lightbox).
- **Responsive Images via Sharp**: Automatic AVIF and WebP generation, responsive srcset, explicit widths/heights to eliminate cumulative layout shifts (CLS).
- **A+ Security Headers (`vercel.json`)**: Strict Content Security Policy (CSP), HSTS preload, X-Content-Type-Options `nosniff`, frame-ancestors `none`, tabnabbing protection on all external links (`rel="noopener noreferrer"`).
- **WCAG AA Accessible**: High-contrast ratios, visible focus outlines in brand green, semantic HTML landmarks, and skip-to-content link.
- **Local SEO & Structured Data**: Built-in JSON-LD `ElectricalStore` Schema, canonical tags, Open Graph cards, sitemap index, and search engine directives in `robots.txt`.
