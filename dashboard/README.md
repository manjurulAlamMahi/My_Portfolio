# MaxDev Admin Dashboard

Frontend-only admin dashboard for the MaxDev portfolio site. Lives entirely
in this `/dashboard` folder and does not modify the live site.

## Run it

No build step. Open `dashboard/login.html` directly in a browser, or serve
the repo root with any static server.

## Demo login

- Email: `admin@maxdev.com`
- Password: `MaxDev@2026`

Forgot Password shows a simulated OTP in a "DEV MODE" toast (no real email
is sent — there's no backend yet).

## Data

All content is stored in `localStorage` via `assets/js/store.js`, seeded on
first load from `assets/js/seed-data.js`. Swap `store.js`'s implementation
for real API calls to connect a backend later — no other file needs to
change.

## Modules

- Dashboard — overview stats and quick links
- Profile & Hero — site identity, social links, homepage hero copy
- About — bio, stats, services, toolbox, testimonials
- Resume — technical/soft skills, experience timeline, education
- Projects — searchable list + full add/edit case-study editor, plus category management
- Contact — address, email, WhatsApp and phone number
- Settings — account (email/password), mail configuration, AI Assistant configuration

## Structure

See `docs/superpowers/specs/2026-08-20-admin-dashboard-design.md` in the
repo root for the full design spec.
