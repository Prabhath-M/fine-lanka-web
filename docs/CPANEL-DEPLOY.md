# Deploying to cPanel (production — finelankatours.com)

Production hosting: Namecheap Stellar plan, cPanel, server
`server40.web-hosting.com`. Vercel remains the preview/testing
deployment (`fine-lanka-web-rgle.vercel.app`) — this doc is for the real
production site only.

## One-time setup in cPanel

1. **Confirm DNS**: cPanel → Domains → check `finelankatours.com` resolves
   to this server. Usually automatic since the domain and hosting were
   bought together through Namecheap.
2. **Create the Node.js app**: cPanel → Software → Setup Node.js App →
   Create Application.
   - Node version: latest available (**don't leave this on whatever
     cPanel defaults to** — it may default to something ancient like
     Node 10, which is EOL and incompatible with this project; pick
     the newest option, e.g. 22.x)
   - Application mode: **Production**
   - Application root: a folder of your choice (not `public_html`
     directly — cPanel handles routing the domain to the app)
   - Application startup file: `server.js`
   - Application URL: `finelankatours.com`
3. **Environment variables** — add all of these in the same screen:
   | Variable | Value |
   |---|---|
   | `RESEND_API_KEY` | (the Resend API key — keep this one marked sensitive/private) |
   | `LEADS_TO_EMAIL` | `mprabhathm@gmail.com` |
   | `LEADS_FROM_EMAIL` | `onboarding@resend.dev` until the domain is verified in Resend (see below), then switch to an address on `finelankatours.com` |
   | `NEXT_PUBLIC_SITE_URL` | `https://finelankatours.com` |
4. **Connect Git Version Control to the `deploy/production` branch**
   (not `main`) — cPanel → Software → Git™ Version Control → Create →
   Clone URL `https://github.com/Prabhath-M/fine-lanka-web.git`,
   pick the `deploy/production` branch specifically. This is the
   branch GitHub Actions keeps updated with ready-to-copy build
   output (see below) — deploying from it never triggers a build on
   the server itself.

## Every time you deploy an update

Deployment is git-based and automatic — you don't manually build or
upload anything anymore. Here's the flow:

1. Push (or merge a PR) to `main`.
2. GitHub Actions (`.github/workflows/deploy.yml`) builds the site —
   `pnpm install`, `pnpm run build:cpanel` — on GitHub's own runners,
   **not** on the cPanel server. This matters: this hosting account
   hits a hard memory ceiling (a CloudLinux LVE limit, invisible to
   `ulimit`, not tunable with Node flags) partway through
   `pnpm install`/`next build`. Building here sidesteps that entirely.
3. The Action force-pushes the finished build output — `server.js`,
   `node_modules/`, `package.json`, `.next/`, `public/` — plus a small
   auto-generated `.cpanel.yml`, to the `deploy/production` branch.
   That branch has no relation to `main`'s history; it's regenerated
   fresh every run and only ever contains the latest built output.
4. In cPanel → Git™ Version Control, the repository tracking
   `deploy/production` (separate from the one tracking `main`, if you
   keep one for reference) → Manage → Pull or Deploy → **Update from
   Remote**, then **Deploy HEAD Commit**.
   This step doesn't build anything — it only copies the
   already-built files into the live app folder and touches
   `tmp/restart.txt` to reload the app via Passenger. Nothing here can
   hit a memory limit, since no `install`/`build` runs on the server.
5. Check `https://finelankatours.com` to confirm.

Step 4 is currently a manual click in cPanel's UI — cPanel's Git
Version Control doesn't support triggering a deploy from a webhook out
of the box on this plan, so pushing to `main` builds automatically but
still needs that one manual "Deploy HEAD Commit" click to go live.

`node_modules` is built by GitHub's `ubuntu-latest` runners
(linux-x64/glibc), which matches this cPanel host's architecture — so
native deps like `sharp` work correctly without the cross-architecture
mismatch that building on a different machine (e.g. a local Windows/Mac
dev machine) would risk.

## SSL

cPanel → Security → SSL/TLS Status — confirm AutoSSL has issued a
certificate for `finelankatours.com`. Needed since the security headers
added in Phase 8 (`Strict-Transport-Security`, etc.) assume HTTPS.

## Verifying the domain in Resend (unlocks real email delivery)

Right now (`LEADS_FROM_EMAIL=onboarding@resend.dev`), the booking/
enquiry/newsletter forms' team notification works for any submission,
but the customer-facing auto-reply only actually delivers if the
customer's email happens to match the Resend account owner's own
address — see Phase 9 in `docs/PRE-LAUNCH-AUDIT.md` for the full
explanation. Once the site is live on `finelankatours.com`:

1. Resend dashboard → Domains → Add Domain → `finelankatours.com`.
2. Add the DNS records Resend gives you (TXT/DKIM) — same DNS zone as
   the domain itself, regardless of where the *site* is hosted.
3. Once verified, update `LEADS_FROM_EMAIL` in cPanel's environment
   variables to an address on the verified domain (e.g.
   `bookings@finelankatours.com`), and restart the app.
