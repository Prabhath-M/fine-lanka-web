/**
 * render.js
 * ------------------------------------------------------------------
 * Pure(ish) render functions: each takes data (from data.js) and an
 * element id, and fills that element with markup. No event binding
 * happens here — see main.js for behaviour.
 *
 * Keeping this separate means the homepage sections can be reused on
 * future pages just by calling the same render function with a
 * different data array.
 * ------------------------------------------------------------------
 */

function renderNav() {
  const desktopNav = document.getElementById("primary-nav");
  const mobileNav = document.getElementById("mobile-nav-links");
  if (!desktopNav || !mobileNav) return;

  const currentPage = document.body.dataset.page || "index";
  const activeClass = (item) => (item.page === currentPage ? " is-active" : "");

  // The ancient Sri Lankan (sigiri bithu sithuwam + liyawela) dropdown is
  // now the site-wide navigation dropdown, so its lotus-medallion row icons
  // are rendered on every page rather than gated to the homepage.
  const desktopHtml = NAV_LINKS.map((item) => {
    if (item.children) {
      const submenu = item.children
        .map((c) => {
          const icon = c.icon ? `<span class="dropdown-icon">${iconMarkup(c.icon)}</span>` : "";
          return `<li><a href="${c.href}">${icon}<span class="dropdown-label">${c.label}</span></a></li>`;
        })
        .join("");
      return `
        <li class="nav-item has-dropdown" data-menu="${item.page || ""}">
          <a href="${item.href}" class="${activeClass(item).trim()}">${item.label}</a>
          <ul class="dropdown">
            <li class="dropdown-heading" aria-hidden="true"><span>${item.label}</span></li>
            ${submenu}
          </ul>
        </li>`;
    }
    return `<li class="nav-item${activeClass(item)}"><a href="${item.href}">${item.label}</a></li>`;
  }).join("");

  const mobileHtml = NAV_LINKS.map((item) => {
    if (item.children) {
      const submenu = item.children
        .map((c) => `<li><a href="${c.href}">${c.label}</a></li>`)
        .join("");
      return `
        <li class="mobile-nav-group">
          <span class="mobile-nav-heading">${item.label}</span>
          <ul>${submenu}</ul>
        </li>`;
    }
    return `<li><a href="${item.href}"${item.page === currentPage ? ' class="is-active"' : ""}>${item.label}</a></li>`;
  }).join("");

  desktopNav.innerHTML = desktopHtml;
  mobileNav.innerHTML = mobileHtml;
}

/** Renders a list of destination objects into any container id. Shared by
 *  the homepage's featured grid and destinations.html's full/filtered grid.
 *  `animate: true` (homepage, one-time render) applies the scroll-reveal
 *  class; the filterable destinations.html grid renders instantly instead,
 *  since it re-renders on every filter click. */
function renderDestinationCards(list, containerId, { animate = false } = {}) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `<p class="dest-empty">No destinations match that filter yet — try another region.</p>`;
    return;
  }

  grid.innerHTML = list.map(
    (d, i) => `
    <article class="dest-card${animate ? " reveal" : ""}" style="--delay:${i * 60}ms" tabindex="0" role="button" aria-pressed="false" aria-label="${d.name} — show details">
      <div class="dest-card-flip">
        <div class="dest-card-face dest-card-front">
          <div class="dest-card-visual">
            ${iconMarkup(d.icon, "dest-icon")}
          </div>
          <p class="coord-label">${d.coords}</p>
          <h3>${d.name}</h3>
          <p class="dest-region">${d.region}</p>
          <p class="dest-flip-hint">Tap to explore ↴</p>
        </div>
        <div class="dest-card-face dest-card-back">
          <p class="dest-blurb">${d.blurb}</p>
          <ul class="dest-highlights">
            ${(d.highlights || []).map((h) => `<li>${h}</li>`).join("")}
          </ul>
          <button type="button" class="dest-back-cta" data-open-enquiry>Ask us about ${d.name}</button>
        </div>
      </div>
    </article>`
  ).join("");
}

/** Small local slug helper — used to build predictable video/poster
 *  paths and matching data-slug attributes (e.g. "Ella & the Hill
 *  Country" -> "ella-and-the-hill-country"). */
function slugify(str) {
  return str
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Builds the single-location video window for the homepage's
 *  Explore-the-map section (see initExploreSection in main.js) — a wide
 *  landscape media frame in a cream matted card with a small brass
 *  corner flourish at each of its 4 corners, an auto-playing muted
 *  video, a "+" detail toggle that slides a drawer (blurb + highlights +
 *  CTA) up over the media, and a caption strip below (title + one-line
 *  blurb on the left, pagination dots on the right) whose whole surface
 *  is a Sigiriya fresco + liyawela heritage artwork background.
 *  `index`/`total` position the pagination dots. */
function exploreWindowMarkup(d, index, total) {
  const slug = slugify(d.name);
  const dots = Array.from({ length: total }, (_, i) => `
    <button type="button" class="dest-panel-dot${i === index ? " is-active" : ""}" data-index="${i}" aria-label="Show destination ${i + 1} of ${total}" aria-current="${i === index}"></button>
  `).join("");

  return `
    <div class="dest-panel" data-slug="${slug}">
      <span class="dest-panel-corner dest-panel-corner-tl" aria-hidden="true">${iconMarkup("flourish")}</span>
      <span class="dest-panel-corner dest-panel-corner-tr" aria-hidden="true">${iconMarkup("flourish")}</span>
      <span class="dest-panel-corner dest-panel-corner-br" aria-hidden="true">${iconMarkup("flourish")}</span>
      <span class="dest-panel-corner dest-panel-corner-bl" aria-hidden="true">${iconMarkup("flourish")}</span>
      <div class="dest-panel-media">
        <div class="dest-panel-media-inner">
          <video class="dest-panel-video" autoplay muted loop playsinline poster="https://picsum.photos/seed/finelanka-dest-${slug}/900/560">
            <source src="videos/destinations/${slug}.mp4" type="video/mp4" />
          </video>
          <div class="dest-panel-scrim"></div>
          <div class="dest-panel-detail">
            <p class="dest-blurb">${d.blurb}</p>
            <ul class="dest-highlights">
              ${(d.highlights || []).map((h) => `<li>${h}</li>`).join("")}
            </ul>
            <button type="button" class="dest-back-cta" data-open-enquiry>Ask us about ${d.name}</button>
          </div>
        </div>
        <button type="button" class="dest-panel-toggle" aria-label="Show details for ${d.name}" aria-expanded="false">+</button>
      </div>
      <div class="dest-panel-caption">
        <div class="dest-panel-caption-text">
          <h3>${d.name}</h3>
          <p class="dest-panel-caption-sub">${d.blurb}</p>
        </div>
        <div class="dest-panel-caption-side">
          <div class="dest-panel-dots">${dots}</div>
        </div>
      </div>
    </div>`;
}

/** Renders one destination into the homepage's video window. Called on
 *  load and on every rotation/navigation from initExploreSection() in
 *  main.js. `index`/`total` position that destination's pagination dot. */
function renderExploreWindow(d, containerId, index, total) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = exploreWindowMarkup(d, index, total);
}

/** Renders one invisible-until-active glow hotspot per destination
 *  that's actually pinned on the illustrated map. The map itself
 *  (images/sri-lanka-map-full.jpg) is painted as the explore-map
 *  section's own full-bleed background in index.html — this function
 *  only lays hotspot buttons on top of it. Each button carries its
 *  destination's `mapX`/`mapY` (percentages measured directly off that
 *  full background image, in data.js) as data-fx/data-fy attributes;
 *  positionMapPins() in main.js converts those into actual on-screen px
 *  once the backdrop image's rendered geometry is known, since
 *  object-fit: cover scales/crops that image differently whenever the
 *  section's box isn't the same shape as the image itself (as on
 *  mobile — see the ~980px media query in style.css). Called once on
 *  load — after that, initExploreSection() only toggles each hotspot's
 *  `.is-active` class as the porthole window rotates, and
 *  positionMapPins() re-runs on resize, rather than re-rendering. */
function renderExploreMap(onMap, containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;

  wrap.innerHTML = onMap.map((d) => {
    const slug = slugify(d.name);
    return `
      <button type="button" class="map-pin" data-slug="${slug}" data-fx="${d.mapX}" data-fy="${d.mapY}" aria-label="Show ${d.name}">
        <span class="map-pin-glow"></span>
        <span class="map-pin-ping"></span>
      </button>`;
  }).join("");
}

/** Renders a list of tour packages into any container id. Used by
 *  tours-pricing.html, re-run on every category filter click. Each card's
 *  "View Full Itinerary" button opens the shared #itinerary-modal via
 *  main.js, looked up by `data-tour` (the package slug). */
function renderTourPackages(list, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = `<p class="tour-empty">No packages match that filter yet — try another category.</p>`;
    return;
  }

  grid.innerHTML = list.map(
    (t) => `
    <article class="tour-card" data-category="${t.category}" style="--tour-media: url('../images/tour-${t.category}.png')">
      <div class="tour-card-media" role="img" aria-label="${t.name} — Sri Lanka">
        <span class="tour-nights-badge">${t.nights} nights</span>
        <div class="tour-media-title">
          ${iconMarkup(t.icon, "tour-icon")}
          <h3>${t.name}</h3>
        </div>
      </div>
      <div class="tour-card-body">
        <p class="tour-route">${t.route}</p>
        <p class="tour-meta">From <strong>$${t.priceFrom.toLocaleString("en-US")}</strong> per person</p>
        <p class="tour-blurb">${t.blurb}</p>
        <div class="tour-card-actions">
          <button type="button" class="btn btn-uikit-secondary" style="--btn-icon-left: url('../images/direction2.png')" data-open-itinerary data-tour="${t.slug}">View Full Itinerary</button>
          <button type="button" class="btn btn-uikit-primary" style="--btn-icon-left: url('../images/ask1.png')" data-open-enquiry>Enquire About This Tour</button>
        </div>
      </div>
    </article>`
  ).join("");
}

/** Builds the inner markup for #itinerary-modal for one tour package.
 *  Called from main.js at click time (day-by-day content is only ever
 *  needed for the one package a visitor opens). */
function itineraryModalMarkup(pkg) {
  const days = pkg.itinerary.map(
    (d) => `
    <li class="itinerary-day">
      <span class="itinerary-day-num">Day ${d.day}</span>
      <div>
        <h4>${d.title}</h4>
        <p>${d.text}</p>
      </div>
    </li>`
  ).join("");

  return `
    <p class="itinerary-route">${pkg.route}</p>
    <p class="itinerary-meta">${pkg.nights} nights · From $${pkg.priceFrom.toLocaleString("en-US")} per person</p>
    <ol class="itinerary-days">${days}</ol>
    <button type="button" class="btn btn-uikit-primary" style="--btn-icon-left: url('../images/ask1.png')" data-close-itinerary-and-enquire data-open-enquiry>Enquire About This Tour</button>
  `;
}

/** Renders the tour-type filter bar's category intro copy + "coming soon"
 *  state for categories without a drafted itinerary yet. Called from
 *  main.js's initTourPricingPage() alongside renderTourPackages(). */
function renderCategoryIntro(category, containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!category) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML = `<p class="category-intro">${category.intro}</p>`;
}

/** Renders the chronicle index shown once the ancient doorway is opened
 *  on journal.html — one illuminated palm-leaf (ola) card per journal post.
 *  Used by journal.html; written the same way as the other list renderers
 *  for consistency. */
function renderJournalIndex(containerId) {
  const wrap = document.getElementById(containerId);
  if (!wrap) return;

  wrap.innerHTML = JOURNAL_ENTRIES.map(
    (e, i) => `
    <article class="chronicle-card" data-entry="${e.slug}" tabindex="0" role="button" aria-label="Read: ${e.title}" style="--delay:${i * 90}ms">
      <div class="chronicle-card-media">
        <img src="${e.image}" alt="${e.title}, ${e.location}" loading="lazy" />
        <span class="chronicle-card-seal" aria-hidden="true">✦</span>
      </div>
      <div class="chronicle-card-body">
        <p class="chronicle-card-meta">${e.date} · ${e.location}</p>
        <h3>${e.title}</h3>
        <p class="chronicle-card-excerpt">${e.excerpt}</p>
        <div class="chronicle-card-tags">${e.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        <span class="chronicle-card-cta">Unseal the entry →</span>
      </div>
    </article>`
  ).join("");
}

/** Builds the reading-view markup for one journal entry, styled as an
 *  unfurled ancient manuscript. Called from main.js at click time and
 *  injected into the #journal-detail overlay. */
function journalDetailMarkup(entry) {
  return `
    <div class="reader-backdrop" data-journal-back></div>
    <article class="reader-scroll" role="dialog" aria-modal="true" aria-label="${entry.title}">
      <button type="button" class="reader-close" data-journal-back aria-label="Seal the entry">&times;</button>
      <div class="reader-hero"><img src="${entry.image}" alt="${entry.title}, ${entry.location}" /></div>
      <div class="reader-body">
        <p class="reader-meta">${entry.date} · ${entry.location} · ${entry.coords}</p>
        <h2>${entry.title}</h2>
        <div class="reader-tags">${entry.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        <div class="reader-rule" aria-hidden="true"><span>✦</span></div>
        ${entry.body.map((p) => `<p class="reader-para">${p}</p>`).join("")}
        <button type="button" class="btn btn-uikit-primary" style="--btn-icon-left: url('../images/plan.png')" data-open-enquiry>Plan a Trip Like This</button>
      </div>
    </article>
  `;
}

/** Renders the "good to know" travel-notes strip on tours-pricing.html. */
function renderTravelNotes() {
  const wrap = document.getElementById("travel-notes");
  if (!wrap) return;

  wrap.innerHTML = TRAVEL_NOTES.map(
    (n) => `
    <div class="travel-note">
      <h4>${n.title}</h4>
      <p>${n.text}</p>
    </div>`
  ).join("");
}


function renderFeatures() {
  const wrap = document.getElementById("features-grid");
  if (!wrap) return;

  wrap.innerHTML = FEATURES.map(
    (f, i) => `
    <div class="feature reveal" style="--delay:${i * 80}ms">
      <div class="feature-icon">${iconMarkup(f.icon || "compass")}</div>
      <h3>${f.title}</h3>
      <p>${f.text}</p>
    </div>`
  ).join("");
}

function renderProcess() {
  const wrap = document.getElementById("process-steps");
  if (!wrap) return;

  wrap.innerHTML = PROCESS_STEPS.map(
    (s, i) => `
    <div class="process-step reveal" style="--delay:${i * 100}ms">
      <span class="process-index">0${i + 1}</span>
      <h3>${s.title}</h3>
      <p>${s.text}</p>
    </div>`
  ).join("");
}

function renderTestimonials() {
  const track = document.getElementById("testimonials-track");
  if (!track) return;

  track.innerHTML = TESTIMONIALS.map(
    (t) => `
    <blockquote class="testimonial-card">
      <p class="testimonial-quote">&ldquo;${t.quote}&rdquo;</p>
      <footer>
        <span class="testimonial-name">${t.name}</span>
        <span class="testimonial-trip">${t.trip}</span>
      </footer>
    </blockquote>`
  ).join("");
}

/** Reuses PROCESS_STEPS (same data as the homepage's four-step section) to
 *  fill the "What happens next" list in booking.html's sidebar. */
function renderBookingProcess() {
  const list = document.getElementById("booking-process-steps");
  if (!list) return;
  list.innerHTML = PROCESS_STEPS.map((s) => `<li>${s.text}</li>`).join("");
}

function renderFooter() {
  const columns = document.getElementById("footer-columns");
  const socials = document.getElementById("footer-socials");

  if (columns) {
    columns.innerHTML = FOOTER_COLUMNS.map(
      (col) => `
      <div class="footer-col">
        <h4>${col.heading}</h4>
        <ul>${col.links.map((l) => `<li><a href="${l.href}">${l.label}</a></li>`).join("")}</ul>
      </div>`
    ).join("");
  }

  if (socials) {
    const platforms = [
      { key: "facebook", label: "Facebook" },
      { key: "instagram", label: "Instagram" },
      { key: "linkedin", label: "LinkedIn" },
    ];
    socials.innerHTML = platforms
      .map((p) => `<a href="#" aria-label="${p.label}">${iconMarkup(p.key)}</a>`)
      .join("");
  }
}

/** Fills every repeated site-wide field (brand name, phone, founded year,
 *  copyright year) wherever it appears — header, footer, hero, etc. */
function renderGlobalFields() {
  document.querySelectorAll("[data-brand]").forEach((el) => (el.textContent = SITE.brand));
  document.querySelectorAll("[data-phone]").forEach((el) => (el.textContent = SITE.phone));
  document.querySelectorAll("[data-founded]").forEach((el) => (el.textContent = SITE.foundedYear));

  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function renderAll() {
  renderNav();
  renderFeatures();
  renderProcess();
  renderTestimonials();
  renderFooter();
  renderGlobalFields();
  renderTravelNotes();
  renderBookingProcess();
}
