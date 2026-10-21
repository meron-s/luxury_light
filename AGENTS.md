# Rules for this project
- Read SPEC.md first. It is the source of truth for requirements, architecture, security and deployment.
- Stack: Astro (static output), TypeScript strict, Tailwind CSS v4, pnpm. No backend, no database, no runtime secrets.
- All content lives in src/data/*.json. Components must not hardcode phone numbers, addresses or product text.
- Never invent facts: coordinates, opening hours, prices, social URLs. Use clearly marked TODO placeholders and list them in docs/TODO.md.
- Ethiopian phone numbers: store as 09XXXXXXXX, link as tel:+2519XXXXXXXX.
- Accessibility (WCAG AA), performance (Lighthouse mobile >= 90) and the security headers in SPEC.md section 6 are mandatory.
- Do not add third-party scripts, trackers, or fonts from CDNs.
- Keep dependencies minimal. Commit lockfile. Never commit .env or tokens.
