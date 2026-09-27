# Project Jango — Product Brief

**Market:** USA — launching in Brooklyn, NYC.
**Core idea:** A barber signs up and instantly gets their own booking page ("a barbershop website")
where clients see open times and book. Barber-first; the customer-facing "find a barber" search comes later.

## How a barber appointment works

1. **Service menu** — each service has a duration and price.
2. **Availability** — weekly hours, breaks, days off. Slots are generated from the service length
   plus a buffer (~10 min for cleanup/changeover), not a fixed grid.
3. **Booking** — client picks service + time, enters name/phone, pays a deposit (or saves a card).
4. **Before** — SMS reminders (24h + 2h), cancellation window (typically 24h).
5. **After** — pay balance + tip, rebook prompt (regulars return every 2–4 weeks).

| Service | Typical duration |
|---|---|
| Standard cut / simple fade | 20–30 min |
| Fade / taper (most common) | 30–45 min |
| Skin fade | ~45 min |
| Beard trim / line-up | 15–20 min |
| Cut + beard | 45–60 min |
| Cut + hot-towel shave | 60–75 min |

## Pricing (what clients pay)

- US national average men's cut: ~$41–43.
- Brooklyn: fades typically $25–60; ~$40 is common; premium shops $55–75+.
- Beard trim add-on: ~$20–25. Kids' cuts are usually discounted.
- NYC tips are typically 15–20%+ and often in cash.

## No-shows (the #1 pain point)

- ~10–15% average; 15–30% with no reminders or deposits.
- Required deposits bring it down to ~3–5%. **Deposits + SMS reminders are core, not extras.**

## Competitors (US)

| App | Model | Notes |
|---|---|---|
| theCut | Barber-specific app + client discovery | Very popular with US barbers — closest competitor |
| Booksy | ~$30/mo + ~$20 per extra staff; optional 30% "Boost" on new marketplace clients | Big consumer marketplace |
| Squire | From ~$30/mo, built for shop owners | Multi-chair shops, not solo barbers |
| Fresha | ~$19.95/mo solo + 20% (min $6) on new marketplace clients + card fees | General beauty, not barber-focused |

Barbers dislike commissions on "their" clients and fees that stack up.

## NYC/NY specifics

- Barbers need an NYS barber operator license (NY Dept. of State). Chair/booth renters also need an
  **Area Renter** license; shops need a Barber Shop Owner license. Could show a "licensed" badge
  (license # entry) as a trust signal.
- Many Brooklyn barbers are independent chair renters booking via Instagram DMs/text and taking
  deposits through Cash App/Zelle. The product needs to beat that flow: a link-in-bio booking page.

## MVP scope (proposal)

**Barber side**
- Sign up; profile (name, photo, shop name/address, Instagram, license #)
- Service menu (name, duration, price, deposit amount)
- Weekly availability, breaks, time off, buffer setting
- Public booking page: `jango.app/<barber-handle>`
- Appointment list/calendar; accept, cancel, mark no-show
- Deposits via Stripe (Stripe Connect payouts to barber)

**Client side**
- Open barber's link → pick service → see open slots → enter name + phone → pay deposit → confirmed
- SMS confirmation + reminders; cancel/reschedule link

**Later**
- Brooklyn "find a barber near me with an open slot now" search
- Multi-barber shops, walk-in queue, reviews, portfolio photos, rebooking reminders

## Open decisions

- Business model: flat subscription (e.g. $10–20/mo) vs small per-booking fee vs free for barbers
  with a client booking fee. Recommendation: no commission on a barber's own clients.
- Platform: mobile-first web app first (works via Instagram bio link), native apps later.
