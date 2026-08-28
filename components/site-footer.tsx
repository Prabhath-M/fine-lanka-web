import { Icon } from '@/components/icons'
import { FOOTER_COLUMNS, SITE, SOCIAL_LINKS } from '@/lib/site-data'

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-top">
        <div className="footer-brand">
          <a href="/" className="brand">
            <span className="brand-logo">
              <span className="brand-logo-flare" aria-hidden="true" />
              <img src="/images/logo-site.png" alt="" className="brand-logo-img" />
            </span>
          </a>
          <p>
            Tailor-made journeys across Sri Lanka, considered one traveller at a time since{' '}
            <span data-founded>{SITE.foundedYear}</span>.
          </p>
          <div className="footer-socials" id="footer-socials">
            {SOCIAL_LINKS.map((social) => (
              <a key={social.key} href={social.href} aria-label={social.label}>
                <Icon name={social.key} />
              </a>
            ))}
          </div>
        </div>
        <div className="footer-columns" id="footer-columns" style={{ display: 'contents' }}>
          {FOOTER_COLUMNS.map((col) => (
            <div className="footer-col" key={col.heading}>
              <h4>{col.heading}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
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
