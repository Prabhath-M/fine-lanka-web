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
   - Node version: latest available
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

## Every time you deploy an update

1. Locally: `pnpm build:cpanel`
   This runs `next build` (produces `.next/standalone` because
   `next.config.mjs` has `output: 'standalone'`) and then
   `scripts/prepare-cpanel-deploy.mjs`, which assembles everything into
   a `deploy/` folder — handling a well-known Next.js gotcha where
   `public/` and `.next/static` aren't included in the standalone
   output automatically (a silent way to ship a site with no images,
   fonts, or styling if skipped).
2. Upload the **contents** of `deploy/` (not the folder itself) into the
   cPanel Node.js app's root folder — via File Manager or your
   FTP/SFTP client.
3. In cPanel → Setup Node.js App → your app → **Run NPM Install**.
   This matters specifically for `sharp` (used for image optimization)
   — it's a native binary, and the one bundled from your local build
   may not match the server's exact architecture. Re-running install
   on the server itself gets the correct one.
4. Click **Restart** to pick up the new build.

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
