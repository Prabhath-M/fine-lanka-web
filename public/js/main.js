/**
 * main.js
 * ------------------------------------------------------------------
 * Behaviour only: event listeners, small interactions. Content lives
 * in data.js, markup generation lives in render.js. This file should
 * stay readable without needing to know how the HTML got built.
 * ------------------------------------------------------------------
 */

function bootSite() {
  renderAll();
  initMobileNav();
  initHeaderScroll();
  initScrollReveal();
  initNewsletterForm();
  initEnquiryModal();
  initItineraryModal();
  initDestinationFlip();
  initExploreSection();
  initDestinationsPage();
  initTourPricingPage();
  initBookingForm();
  initJournalPage();
}
// On a normal static page this script is parsed during the initial HTML
// load, before DOMContentLoaded fires. On the Next.js /journal page it's
// injected client-side after hydration, when DOMContentLoaded has already
// fired — so the listener alone would never run. Handle both cases.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootSite);
} else {
  bootSite();
}

/** Toggles the mobile navigation drawer. */
function initMobileNav() {
  const toggle = document.getElementById("nav-toggle");
  const drawer = document.getElementById("mobile-nav");
  const overlay = document.getElementById("mobile-nav-overlay");
  if (!toggle || !drawer) return;

  const close = () => {
    drawer.classList.remove("is-open");
    overlay.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };
  const open = () => {
    drawer.classList.add("is-open");
    overlay.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
  };

  toggle.addEventListener("click", () => {
    const isOpen = drawer.classList.contains("is-open");
    isOpen ? close() : open();
  });
  overlay.addEventListener("click", close);
  drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

/** Adds a compact/scrolled style to the header once the page scrolls. */
function initHeaderScroll() {
  const header = document.getElementById("site-header");
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/** Fades/slides elements with the .reveal class in as they enter view. */
function initScrollReveal() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const targets = document.querySelectorAll(".reveal");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

/** Basic client-side validation + placeholder submit for the newsletter form. */
function initNewsletterForm() {
  const form = document.getElementById("newsletter-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const input = form.querySelector("input[type=email]");
    const message = document.getElementById("newsletter-message");
    const isValid = input && input.value && input.checkValidity();

    if (!isValid) {
      message.textContent = "Please enter a valid email address.";
      message.classList.add("is-error");
      return;
    }

    // NOTE: no backend wired up yet — this is a placeholder for a future
    // session to connect to a real signup endpoint / email service.
    message.textContent = `Thanks — we'll be in touch at ${input.value}.`;
    message.classList.remove("is-error");
    form.reset();
  });
}

/** Parses an object-position computed value like "90% 50%" (or, less
 *  commonly here, keywords like "right center") into {x, y} fractions
 *  from 0–1. Falls back to centered (0.5, 0.5) for anything it can't
 *  confidently parse, which matches the CSS default anyway. */
function parseObjectPosition(value) {
  const keywordX = { left: 0, center: 0.5, right: 1 };
  const keywordY = { top: 0, center: 0.5, bottom: 1 };
  const toFraction = (token, keywordMap) => {
    if (token in keywordMap) return keywordMap[token];
    if (token.endsWith("%")) return parseFloat(token) / 100;
    return 0.5;
  };
  const parts = (value || "").trim().split(/\s+/);
  if (parts.length < 2) return { x: 0.5, y: 0.5 };
  return { x: toFraction(parts[0], keywordX), y: toFraction(parts[1], keywordY) };
}

/** Converts a destination's mapX/mapY (percentages measured off the
 *  original images/sri-lanka-map-full.jpg) into actual on-screen px
 *  within `pinsEl`, given how object-fit: cover has scaled and cropped
 *  `imgEl` to fill its box at the current viewport size. .explore-bg's
 *  box is the image's native ratio on desktop (so, no crop — see
 *  style.css), but a taller, cropped box on mobile (so the map can
 *  fill more of a phone screen instead of sitting in a thin landscape
 *  strip) — reading imgEl's actual object-position (rather than
 *  assuming it's always centered) is what lets pins land correctly in
 *  both cases, including the mobile override that anchors the crop
 *  toward the island rather than the centre of the poster. Re-run on
 *  load and on resize. */
function positionMapPins(imgEl, pinsEl) {
  if (!imgEl || !pinsEl || !imgEl.naturalWidth || !imgEl.naturalHeight) return;
  const cw = pinsEl.clientWidth;
  const ch = pinsEl.clientHeight;
  if (!cw || !ch) return;
  const iw = imgEl.naturalWidth;
  const ih = imgEl.naturalHeight;
  const scale = Math.max(cw / iw, ch / ih); // same formula the browser uses for object-fit: cover
  const renderedW = iw * scale;
  const renderedH = ih * scale;
  const pos = parseObjectPosition(getComputedStyle(imgEl).objectPosition);
  const offsetX = (cw - renderedW) * pos.x; // object-position fraction (0 left/top … 1 right/bottom)
  const offsetY = (ch - renderedH) * pos.y;

  pinsEl.querySelectorAll(".map-pin").forEach((pin) => {
    const fx = parseFloat(pin.dataset.fx) / 100;
    const fy = parseFloat(pin.dataset.fy) / 100;
    pin.style.left = `${offsetX + fx * renderedW}px`;
    pin.style.top = `${offsetY + fy * renderedH}px`;
  });
}

/** Homepage "Explore the map" section: a single-location video window
 *  floating over the illustrated Sri Lanka map image
 *  (images/sri-lanka-map-full.jpg), which is the section's own full-bleed
 *  background. One destination shows at a time, rotating to the next every 8 seconds
 *  (skipping a rotation if the detail drawer is currently open, so it
 *  won't slide away mid-read). The map pin matching the current window
 *  destination gets a `.is-active` glow/pulse; clicking a pin or a
 *  pagination dot jumps the window straight to that destination via the
 *  same goTo() fade transition. The toggle button reads "+" normally and
 *  "−" once the detail drawer is open (pressing it again drops the drawer
 *  and returns to the video). The video plays automatically (muted,
 *  looping); choosing a destination via a dot or map pin restarts the
 *  8-second auto-rotation countdown. */
function initExploreSection() {
  const windowEl = document.getElementById("explore-window");
  const mapEl = document.getElementById("explore-map");
  const bgImage = document.getElementById("explore-bg-image");
  if (!windowEl || !mapEl) return;

  // Every destination actually pinned on images/sri-lanka-map-full.jpg
  // (see the mapX/mapY comment above DESTINATIONS in data.js) — not the
  // same set as `featured`, since the illustration doesn't include Ella.
  const onMap = DESTINATIONS.filter((d) => d.mapX != null && d.mapY != null);
  if (!onMap.length) return;

  renderExploreMap(onMap, "explore-map");

  const reposition = () => positionMapPins(bgImage, mapEl);
  if (bgImage) {
    if (bgImage.complete && bgImage.naturalWidth) {
      reposition();
    } else {
      bgImage.addEventListener("load", reposition, { once: true });
    }
    let resizeFrame;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(reposition);
    });
  }

  let index = 0;
  const setActivePin = (d) => {
    mapEl.querySelectorAll(".map-pin").forEach((pin) => {
      pin.classList.toggle("is-active", pin.dataset.slug === slugifyLike(d.name));
    });
  };
  // Mirrors render.js's internal slugify() so pin/window data-slug values
  // match without exposing that helper globally.
  function slugifyLike(str) {
    return str.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  const draw = () => {
    const d = onMap[index];
    renderExploreWindow(d, "explore-window", index, onMap.length);
    setActivePin(d);
  };
  draw();

  // 8-second auto-rotation timer. Kept in a variable so any manual
  // navigation (arrow, dot or map pin) can reset the countdown to zero
  // via startTimer(), giving the user a fresh 8s on the destination they
  // just chose rather than whatever was left of the previous cycle.
  const ROTATE_MS = 8000;
  let rotateTimer = null;
  const startTimer = () => {
    if (onMap.length <= 1) return;
    clearInterval(rotateTimer);
    rotateTimer = setInterval(() => {
      if (windowEl.querySelector(".dest-panel.is-open")) return; // reading — don't rotate away
      goTo((index + 1) % onMap.length);
    }, ROTATE_MS);
  };

  const goTo = (targetIndex, resetTimer = false) => {
    if (targetIndex === index) return;
    index = targetIndex;
    if (resetTimer) startTimer(); // restart the 8s countdown on user-driven jumps
    windowEl.classList.add("is-fading");
    setTimeout(() => {
      draw();
      windowEl.classList.remove("is-fading");
    }, 400);
  };

  startTimer();

  windowEl.addEventListener("click", (e) => {
    const toggle = e.target.closest(".dest-panel-toggle");
    if (toggle) {
      const panel = toggle.closest(".dest-panel");
      const open = panel.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.textContent = open ? "−" : "+";
      return;
    }

    const dot = e.target.closest(".dest-panel-dot");
    if (dot) { goTo(Number(dot.dataset.index), true); return; }
  });

  mapEl.addEventListener("click", (e) => {
    const pin = e.target.closest(".map-pin");
    if (!pin) return;
    const targetIndex = onMap.findIndex((d) => slugifyLike(d.name) === pin.dataset.slug);
    if (targetIndex === -1) return;
    goTo(targetIndex, true);
  });
}

/** Destination cards flip open on click/tap (any device) to reveal their
 *  back panel; desktop pointers also get a CSS :hover flip (see style.css).
 *  Delegated on document so it keeps working after destinations.html
 *  re-renders the grid on every filter click. */
function initDestinationFlip() {
  const toggle = (card) => {
    const flipped = card.classList.toggle("is-flipped");
    card.setAttribute("aria-pressed", String(flipped));
  };

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-enquiry]")) return; // let the back-panel CTA do its own thing
    const card = e.target.closest(".dest-card");
    if (card) toggle(card);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(".dest-card");
    if (!card) return;
    e.preventDefault();
    toggle(card);
  });
}

/** Region filter bar + grid on destinations.html. No-ops on other pages. */
function initDestinationsPage() {
  const bar = document.getElementById("region-filters");
  const grid = document.getElementById("all-destinations-grid");
  if (!bar || !grid) return;

  const regions = [...new Set(DESTINATIONS.map((d) => d.region))];
  const params = new URLSearchParams(window.location.search);
  let activeRegion = params.get("region") || "All";
  if (!regions.includes(activeRegion)) activeRegion = "All";

  const draw = () => {
    const list = activeRegion === "All" ? DESTINATIONS : DESTINATIONS.filter((d) => d.region === activeRegion);
    renderDestinationCards(list, "all-destinations-grid");
    bar.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.region === activeRegion);
    });
  };

  bar.innerHTML = ["All", ...regions]
    .map((r) => `<button type="button" data-region="${r}">${r}</button>`)
    .join("");

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-region]");
    if (!btn) return;
    activeRegion = btn.dataset.region;
    const url = new URL(window.location.href);
    activeRegion === "All" ? url.searchParams.delete("region") : url.searchParams.set("region", activeRegion);
    window.history.replaceState({}, "", url);
    draw();
  });

  draw();
}

/** Category filter bar + grid on tours-pricing.html. No-ops on other pages. */
function initTourPricingPage() {
  const bar = document.getElementById("type-filters");
  const grid = document.getElementById("tour-packages-grid");
  if (!bar || !grid) return;

  const params = new URLSearchParams(window.location.search);
  let activeSlug = params.get("category") || "All";
  if (activeSlug !== "All" && !TOUR_CATEGORIES.some((c) => c.slug === activeSlug)) activeSlug = "All";

  const draw = () => {
    const category = TOUR_CATEGORIES.find((c) => c.slug === activeSlug);
    renderCategoryIntro(category, "category-intro");

    if (category && category.comingSoon) {
      grid.innerHTML = `<p class="tour-empty">${category.name} itineraries are still being drafted — <button type="button" class="link-btn" data-open-enquiry>tell us what you're after</button> and we'll build one around it.</p>`;
    } else {
      const list = activeSlug === "All" ? TOUR_PACKAGES : TOUR_PACKAGES.filter((t) => t.category === activeSlug);
      renderTourPackages(list, "tour-packages-grid");
    }

    bar.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.category === activeSlug);
    });
  };

  bar.innerHTML = [{ slug: "All", name: "All" }, ...TOUR_CATEGORIES]
    .map((c) => `<button type="button" data-category="${c.slug}">${c.name}</button>`)
    .join("");

  bar.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-category]");
    if (!btn) return;
    activeSlug = btn.dataset.category;
    const url = new URL(window.location.href);
    activeSlug === "All" ? url.searchParams.delete("category") : url.searchParams.set("category", activeSlug);
    window.history.replaceState({}, "", url);
    draw();
  });

  draw();
}

/** Opens #itinerary-modal with one tour package's full day-by-day route.
 *  No-ops on pages without the modal (only tours-pricing.html has it). */
function initItineraryModal() {
  const modal = document.getElementById("itinerary-modal");
  if (!modal) return;
  const panel = modal.querySelector(".itinerary-modal-body");
  const titleEl = modal.querySelector("#itinerary-modal-title");

  const close = () => {
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  };
  const open = (pkg) => {
    titleEl.textContent = pkg.name;
    panel.innerHTML = itineraryModalMarkup(pkg);
    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");
  };

  document.addEventListener("click", (e) => {
    const opener = e.target.closest("[data-open-itinerary]");
    if (opener) {
      const pkg = TOUR_PACKAGES.find((t) => t.slug === opener.dataset.tour);
      if (pkg) open(pkg);
      return;
    }
    if (e.target.closest("[data-close-itinerary]") || e.target === modal) {
      close();
      return;
    }
    // "Enquire About This Tour" inside the itinerary modal: close it, then
    // let the click bubble so initEnquiryModal's delegated listener opens
    // the enquiry modal in its place.
    if (e.target.closest("[data-close-itinerary-and-enquire]")) close();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}

/** The ancient doorway on journal.html: a carved stone double door that
 *  swings open on click to reveal an ancient dimension, then unveils the
 *  chronicle entries beyond the threshold. Picking an entry unfurls it as
 *  a manuscript in an overlay reader. No-ops on other pages. */
function initJournalPage() {
  const stage = document.getElementById("portal-stage");
  const enterBtn = document.getElementById("portal-enter");
  const chronicle = document.getElementById("chronicle-section");
  const grid = document.getElementById("journal-index");
  const reader = document.getElementById("journal-detail");
  if (!stage || !grid || !reader) return;

  renderJournalIndex("journal-index");

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---- Open the doorway → reveal the chronicles beyond ----
  const openPortal = () => {
    if (stage.dataset.state === "open") return;
    stage.dataset.state = "open";
    if (enterBtn) enterBtn.disabled = true;
    const revealDelay = reduceMotion ? 0 : 1500;
    window.setTimeout(() => {
      chronicle.classList.add("is-revealed");
      chronicle.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    }, revealDelay);
  };
  enterBtn?.addEventListener("click", openPortal);
  stage.addEventListener("click", (e) => {
    if (e.target.closest(".portal-door")) openPortal();
  });

  // ---- Unseal / seal a single chronicle entry ----
  const openReader = (slug) => {
    const entry = JOURNAL_ENTRIES.find((e) => e.slug === slug);
    if (!entry) return;
    reader.innerHTML = journalDetailMarkup(entry);
    reader.classList.add("is-open");
    reader.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    reader.scrollTop = 0;
  };
  const closeReader = () => {
    reader.classList.remove("is-open");
    reader.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  };

  grid.addEventListener("click", (e) => {
    const card = e.target.closest("[data-entry]");
    if (card) openReader(card.dataset.entry);
  });
  grid.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest("[data-entry]");
    if (!card) return;
    e.preventDefault();
    openReader(card.dataset.entry);
  });
  reader.addEventListener("click", (e) => {
    if (e.target.closest("[data-journal-back]")) closeReader();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && reader.classList.contains("is-open")) closeReader();
  });
}
function initBookingForm() {
  const form = document.getElementById("booking-form");
  if (!form) return;

  const tourSelect = form.querySelector("#booking-tour");
  const destWrap = form.querySelector("#booking-destinations");
  const message = document.getElementById("booking-message");
  const params = new URLSearchParams(window.location.search);

  if (tourSelect) {
    const optgroups = TOUR_CATEGORIES.filter((c) => TOUR_PACKAGES.some((t) => t.category === c.slug))
      .map((c) => {
        const opts = TOUR_PACKAGES.filter((t) => t.category === c.slug)
          .map((t) => `<option value="${t.slug}">${t.name} (${t.nights} nights)</option>`)
          .join("");
        return `<optgroup label="${c.name}">${opts}</optgroup>`;
      })
      .join("");
    tourSelect.innerHTML = `<option value="">Not sure yet — help me choose</option>${optgroups}`;
    const preselect = params.get("tour");
    if (preselect && TOUR_PACKAGES.some((t) => t.slug === preselect)) tourSelect.value = preselect;
  }

  if (destWrap) {
    destWrap.innerHTML = DESTINATIONS.map(
      (d, i) => `
      <label class="checkbox-pill">
        <input type="checkbox" name="destinations" value="${d.name}" />
        ${d.name}
      </label>`
    ).join("");
    const preselectDest = params.get("destination");
    if (preselectDest) {
      const match = [...destWrap.querySelectorAll("input")].find((i) => i.value === preselectDest);
      if (match) match.checked = true;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    // NOTE: no backend wired up yet — placeholder for a future session to
    // connect to a real enquiry/CRM endpoint, same pattern as the
    // newsletter form above.
    const name = form.querySelector("#booking-name").value.trim();
    message.textContent = `Thanks, ${name.split(" ")[0]} — a Sri Lanka-based travel designer will be in touch within one business day.`;
    message.classList.remove("is-error");
    form.reset();
  });
}

/** Opens/closes the "Plan your trip" enquiry modal used by header CTAs,
 *  tour cards, and destination back-panels. Delegated on document because
 *  most openers (tour cards, flipped destination cards) are rendered
 *  after this runs — a plain querySelectorAll would miss them. */
function initEnquiryModal() {
  const modal = document.getElementById("enquiry-modal");
  if (!modal) return;

  const open = () => {
    modal.classList.add("is-open");
    document.body.classList.add("no-scroll");
  };
  const close = () => {
    modal.classList.remove("is-open");
    document.body.classList.remove("no-scroll");
  };

  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-open-enquiry]")) return open();
    if (e.target.closest("[data-close-enquiry]") || e.target === modal) return close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });
}
