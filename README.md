# Lenskart — Omni Area Zone Dashboard

A working prototype of the **Omni Area** module for the Lenskart Store POS app. Built for store managers to action high-intent online signals from their store's geographic catchment zone — without leaving the store.

---

## What this is

Lenskart store managers today are measured purely on in-store metrics. Within every store's radius, a significant volume of online activity goes uninfluenced — cart abandoners, lapsed buyers, Gold members with expiring memberships, return initiations.

This prototype gives managers a unified zone dashboard with four signal buckets, customer-level context, and a WhatsApp outreach + associate task assignment workflow built in.

## Live demo

> Open `index.html` in any browser — no build step, no dependencies to install.

Or deploy instantly to GitHub Pages (see below).

---

## Features

**Zone summary bar**
- Zone GMV (online + in-store combined) · Zone MTD vs target · Actionable signal count · Outreach conversion rate

**4 signal buckets**

| Bucket | Signals |
|---|---|
| Drop-offs | Payment drop-off · Cart abandonment · Repeat PDP views · Wishlist saves |
| Returns & exchanges | Fit issue · Power mismatch · Quality defect · Changed mind |
| Membership | Gold expiry · Low utilisation · New member no-purchase · Non-Gold upgrade |
| Retention & cross-sell | Lapsed frames · Lapsed lenses · Sunglasses cross-sell · Second pair · Post-return win-back |

**Customer panel (slide-over)**
- Customer card: name, masked phone, LTV, affluence tier, Gold status, signal detail, frame browsed
- Signal-specific WA templates with personalisation (name, frame, brand auto-filled)
- Full outreach flow: select template → preview personalised message → confirm send
- Associate assignment flow: select associate → confirm → task created

---

## Project structure

```
lenskart-omni-area/
├── index.html          # App shell and layout
├── src/
│   ├── styles.css      # All styles (CSS custom properties, no framework)
│   ├── data.js         # All data: zone cards, buckets, signals, customers, WA templates
│   └── app.js          # Render logic and interaction handlers
└── README.md
```

No build tool. No framework. Plain HTML + CSS + JS. Tabler Icons loaded from CDN.

---

## Running locally

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/lenskart-omni-area.git
cd lenskart-omni-area

# Open in browser (any of these)
open index.html
npx serve .
python3 -m http.server 8080
```

---

## Deploying to GitHub Pages

1. Push to a GitHub repo
2. Go to **Settings → Pages**
3. Set source to `main` branch, `/ (root)`
4. Your prototype is live at `https://YOUR_USERNAME.github.io/lenskart-omni-area`

---

## Extending the prototype

**Add a new signal to a bucket** — edit `src/data.js`:
```js
// In the relevant bucket's signals array:
{ id: 'new_signal', name: 'Signal name', meta: 'Description', count: 4, pri: 'high' }

// Add customers:
CUSTOMERS.new_signal = [ { initials: 'AB', name: 'Amit Bose', ... } ]

// Add WA templates:
TEMPLATES.new_signal = [ { name: 'Template name', preview: '...', full: '...' } ]
```

**Add a new bucket** — add an entry to the `BUCKETS` array in `src/data.js`. The render logic in `src/app.js` is data-driven and will pick it up automatically.

**Change store details** — update the sidebar HTML in `index.html` and the template signatures in `src/data.js`.

---

## Context

Built as part of the Lenskart Store POS — Omni Area Module PRD (May 2026).

The Omni Area module targets ~₹220 Cr in incremental annual GMV at full network rollout (2,700 stores) through three interventions:
- Cart & payment drop-off outreach (10% recovery rate)
- Lapsed customer re-engagement (6% recovery)  
- Eye test no-show recovery (30% conversion)

Attribution loop: WA outreach → store visit via QMS phone OTP match → purchase tagged as Omni-attributed GMV.
