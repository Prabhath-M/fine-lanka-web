import { Icon } from '@/components/icons'
import { NavLink } from '@/components/nav-link'
import { FOOTER_COLUMNS, SITE } from '@/lib/site-data'
import { SOCIAL_LINKS } from '@/lib/social-links'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <NavLink href="/" className="brand">
            <span className="brand-logo">
              <span className="brand-logo-flare" aria-hidden="true" />
              <img
                src="/images/logo-site.webp"
                alt=""
                className="brand-logo-img"
                width={1024}
                height={1024}
                loading="lazy"
              />
            </span>
          </NavLink>
          <p>
            Tailor-made journeys across Sri Lanka, considered one traveller at a time since{' '}
            <span data-founded>{SITE.foundedYear}</span>.
          </p>
          <div className="footer-socials" id="footer-socials">
            {SOCIAL_LINKS.map((social) =>
              social.href ? (
                <a
                  key={social.key}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon name={social.key} />
                </a>
              ) : (
                // No confirmed profile yet — render a non-interactive,
                // visibly muted icon instead of a dead `#` link. Add a
                // real URL in lib/social-links.ts and this becomes a
                // live link automatically.
                <span
                  key={social.key}
                  className="footer-social-pending"
                  aria-hidden="true"
                  title={`${social.label} — coming soon`}
                >
                  <Icon name={social.key} />
                </span>
              ),
            )}
          </div>
        </div>
        <div className="footer-columns" id="footer-columns" style={{ display: 'contents' }}>
          {FOOTER_COLUMNS.map((col) => (
            <div className="footer-col" key={col.heading}>
              <h4>{col.heading}</h4>
              <ul>
                {col.links.map((link) =>
                  link.href.startsWith('#') ? (
                    <li key={link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <NavLink href={link.href}>{link.label}</NavLink>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          © <span id="current-year">{new Date().getFullYear()}</span> {SITE.brand} (Pvt) Ltd. All rights reserved.
        </span>
        <span>
          Call <span data-phone>{SITE.phone}</span> to start planning
        </span>
      </div>
    </footer>
  )
}
