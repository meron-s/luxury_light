# Luxury Lighting — Owner Confirmation & Action Checklist (TODOs)

The following items are placeholders preserved in the site code and data files (`src/data/*.json`) that need final confirmation or links provided by the business owner before production launch. Per project rules, we never guess real-world facts.

---

## 1. Google Maps & Location
- [ ] **Exact Google Maps Share Link**: Replace `https://maps.google.com/?q=Merkato+Sosa+Building+Addis+Ababa` in `src/data/site.json` (`map.shareUrl`) with the exact Google Maps share pin for the showroom at Sosa Merkato Building.
- [ ] **Google Maps Embed Link**: Replace `map.embedUrl` in `src/data/site.json` with the exact Google Maps iframe embed URL.
- [ ] **Google Business Profile**: Verify and claim the Google Business Profile pin at Sosa Merkato so visitors searching "lighting store near me" or "electrical supplier Merkato" find the business with the website link.

---

## 2. Business Hours & Operations
- [ ] **Opening Hours**: Confirm exact operating days and hours (e.g. `Monday - Saturday: 8:30 AM - 6:30 PM, Closed Sunday`) in `src/data/site.json` (`hours`). Currently marked with a clear `TODO` note.
- [ ] **Delivery Scope**: Confirm whether fast delivery is exclusive to Addis Ababa or extends to regional Ethiopia.

---

## 3. Social Media & Accounts
- [ ] **Telegram Channel & Inbox**:
  - Confirmed: Channel `https://t.me/luxuryelectrical`
  - Confirmed: Inbox `https://t.me/Rezured` (@Rezured)
- [ ] **TikTok Profile**:
  - Confirmed: `https://www.tiktok.com/@luxuryelectrical`
- [ ] **Facebook / Instagram Accounts**: If the business creates or has Facebook or Instagram profiles, add them to `src/data/site.json`. (Per SPEC.md rule, these are omitted until real URLs exist).

---

## 4. Domain & Deployment
- [ ] **Production Domain**: Select and register the custom domain (e.g. `luxuryelectrical.et` or `luxurylightingaddis.com`). Update `site` in `astro.config.mjs` and configure DNS in Vercel.
- [ ] **HSTS Preload**: After the production domain is tested and running stably on HTTPS, enable HSTS preload.

---

## 5. Design & Mockup Conflicts / Alignments (Stitch vs SPEC.md)
| Item | Stitch Visual Mockup | SPEC.md Specification | Implementation Decision |
|---|---|---|---|
| **Brand Green** | Calibrated `#5BE584` | Calibrated `#5BE584` / sampled `#65D782` | Uses `#5BE584` with hover `#2FD468` matching both Stitch and SPEC.md |
| **Store Location** | Showroom copy had placeholder "Bole Medhanialem Showroom" | Ground truth: Sosa Merkato Building, Addis Ababa | Implemented **Sosa Merkato Building** throughout the entire site |
| **Phone Numbers** | 4 manager numbers (`0911948627`, `0935021157`, `0910404241`, `0910210089`) | Same 4 numbers in local Ethiopian format | Full consistency in call sheet modal, footer, contact bar, and contact page |
| **Pricing** | Some sample prices shown in design cards | Strictly excluded (prices change frequently in Addis Ababa) | Replaced with "Call to Order" and "Inquire on Telegram" direct concierges |
| **Product Specs** | Unknown wattages or IP ratings | Generic / TODO marked | Marked with `TODO: confirm with owner` rather than invented |
