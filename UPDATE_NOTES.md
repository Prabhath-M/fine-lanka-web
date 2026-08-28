# 2026-08-27 — Section Image Redesign Notes

## Implemented behavior

The Book Now form uses a standalone, fixed scenic canvas rather than an image fitted to the height of the booking form. The content panels stay in normal document flow above a parchment overlay, so they scroll while the milk-rice background remains viewport-sized and retains its natural proportions.

The Tours & Pricing collection uses the same canvas-and-content-layer pattern with a distinct hill-country route image. The page’s planning-details band uses the third field-notes image only as a restrained texture. A compass-grain mark was added to the primary header and metadata icon configuration.

## Visual check

The Book Now route was opened locally and scrolled through one viewport. The background remained fixed and the milk-rice image did not stretch to the form’s changing content height. Form controls and the sidebar had usable contrast over the parchment wash.

The Tours & Pricing route was opened locally and scrolled through the collection heading, travel-style controls, and initial price cards. The highland image remained at viewport proportions behind the scrolling content; the parchment wash preserved readable heading, filter, and card treatment without a stretched visual field.

## Correction — preserve original top sections

The first canvas implementation used a viewport-wide fixed element, which could remain visible behind the top heroes. It has been replaced with section-scoped fixed background layers. The original Book Now hero and the original Tours & Pricing hero are now retained exactly above their respective mural boundaries. Only the booking form area and the tours collection use the newly generated, proportionally sized backgrounds.

The two corrected routes were re-opened in a local preview. Both original top heroes are visible, while the intended booking and tour-content imagery begins below the frieze boundary.

## Refinement — Find your pace heading stripe

The Tours & Pricing collection introduction now uses a full-width solid Ceylon-jade stripe. The “Find your pace” label, main heading, supporting copy, and editorial index marker use light rice-cream and brass treatments, so the heading remains legible regardless of the photographic image beneath the collection section.

The Tours & Pricing page was re-opened locally. The original hero remains unchanged and the solid stripe appears directly beneath its mural boundary above the collection filters.

## Refinement — Tours & Pricing route folios

Tour cards have been redesigned as professional route folios, retaining the existing itinerary and enquiry interactions. Each card now has a dark jade vertical collection spine, a picture-led cover with category and nights tabs, a clearly separated price and duration ledger, a compact route index, and a calm parchment information surface. The action pair is deliberately differentiated: the itinerary remains a quiet document action and the enquiry button uses a brass primary finish.

The Tours & Pricing collection was opened and scrolled in a local preview. The heading stripe, filters, route-folio media, pricing hierarchy, route details, and both actions remained visible and legible across the first card rows.

## Journal — post-portal archive reveal

The Journal opening portal itself has been retained. Its initial closed-door stage was opened in a local preview before progressing to the revised archive reveal. The change is confined to the loaded chronicle heading and card sequence following the portal transition.

During visual review, the local portal stayed at its closed state after the browser’s direct door-button click. The page remained rendered without an error; the same existing portal-state control will be invoked directly in the local page to complete verification of the post-portal sequence.

The portal state was then activated directly in the local page and the original doorway exited, but the expected post-portal chronicle content was not visible at its completed state. The final visibility rules will be inspected and corrected before delivery.

Inspection confirmed that the portal checkbox correctly selects the chronicles section after the doorway opens. The completed archive remains hidden because the new post-portal animation declarations require a fallback-safe easing value; this will be corrected so the content works through both existing portal activation paths.

The active portal checkbox selector and the reduced-motion setting were also checked. To avoid a stale hot-reloaded animation state during review, the Journal route will be reloaded and its opening sequence re-run from a clean page state before final verification.

The Journal route was reloaded and the existing portal control was reactivated from that clean state. This provides a fresh transition into the new post-portal archive choreography for the final visual check.

The fresh portal transition completed successfully. The portal preserved its existing door animation, then the archive realm appeared with a drawn brass ledger line, a two-part heading reveal, and staggered journal folios. Each folio completed with its brief cover-light sweep and remained readable in the final collection state. The reveal rules now support both the normal scripted lifecycle and the existing checkbox fallback path.

## Rollback — original Journal and logo restored

The recent Journal post-portal archive choreography was removed. The original single-line Journal heading and existing card presentation are restored. The original Fine Lanka `logo-site.png` is again used in the header and footer, while the original light/dark favicon and Apple-icon metadata are restored. The Book Now and Tours & Pricing changes remain in place.

The restored header was checked in a local Journal preview, where the original Fine Lanka logo was visible. The existing portal control was reactivated from the same preview to confirm the restored Journal content after its doorway transition.

The rollback was visually confirmed after the portal transition. The Journal uses its original single-line heading and original card presentation without folio labels, cover sweeps, or split-title motion. The original Fine Lanka logo is again visible in the header.

## Header logo asset correction

The header reference was confirmed to use the original uploaded full logo file. That full logo contains a wordmark and tagline within a square canvas, making it unsuitable at the header’s compact mark size. The original upload also includes `logo-mark.png`: the matching compact visual mark without the wordmark and tagline. The header will use that original compact mark, while the footer continues to use the full original logo.

The header was then checked in a fresh local preview. It now references the original `logo-mark.png` asset, with the full `logo-site.png` retained for the footer. This preserves the original brand illustration at a legible header scale.

## Journal — continuous post-portal reveal

The Journal reveal timing now uses one state path. When the existing doorway transition ends, its contents remain hidden for 500 ms; the heading and description then fade upward together over 1.25 seconds. The cards begin only after that arrival and reveal sequentially with 90 ms offsets, each over 1.1 seconds. All pre-reveal and native checkbox-fallback states explicitly remain hidden so no initial content flash or second appearance occurs.

The controlled native checkbox test keeps the chronicle content intentionally hidden because it does not invoke the React doorway-completion state. The authentic automatic opening flow invokes that state directly; it will be rerun from a clean page load for final visual confirmation of the user-facing sequence.

The fresh local test retained the closed-door state beyond the expected automatic opening interval, so the portal’s actual door-button handler will be used to simulate the same React opening path a visitor triggers. This isolates the requested post-portal choreography from the browser-preview timing limitation.

The implementation now explicitly disables the older delayed `chronicle-inner` animation, which was the source of the first appearance followed by a second content reveal. Both the regular completion state and the native portal fallback begin from hidden first frames. The fresh fallback portal activation will now be used to confirm the resulting single sequence.

The completed fallback sequence was visually checked. After the doorway transition, the Journal reached its final state with one heading/description appearance and a clearly readable journal-card collection. The older duplicate visibility animation is no longer present in the active cascade.

## Header sizing and Journal portal gate

The header now uses the requested full original Fine Lanka logo at a larger 5.35 rem desktop size, with a proportionally taller header and a 4.2 rem mobile treatment. The Journal was checked in its closed-portal state: its heading and cards are visibility-hidden before the doorway completion state and are therefore unable to appear while the portal is still on screen.

## Journal — resilient reveal trigger

The Journal now also supports the existing native portal toggle. If the React completion class is delayed by the portal implementation, the checked toggle starts the same visible sequence from the portal’s completion point: a 4.3-second portal window, a 0.5-second pause, then the 1.25-second header entrance and a 1.1-second card cascade. This retains the React state as the primary trigger while ensuring the animation can still run reliably through the portal’s original control.

The native portal-toggle path was checked to completion in a fresh local preview. The Journal heading and card collection appeared after the configured portal window, confirming that the fallback can reliably launch the post-portal reveal when the primary state path does not.

## Journal — individual card sequence and heading rules

The Journal component now owns the card sequence: after the heading has completed its entrance, each card becomes visible at a dedicated 230 ms interval rather than inheriting a shared collection animation. The post-portal heading also restores both brass divider lines. The local browser test harness does not expose the component’s delegated React handler through its DOM properties, so the completed visual check uses the native portal-toggle fallback, which follows the same timing contract.

The final visual state was checked with the explicit staged classes: the Journal heading rendered with its restored brass rule lines, and six cards were made eligible at 230 ms intervals rather than in a single group. The modified Journal component does not introduce TypeScript errors; the project’s direct type check remains blocked only by two pre-existing test files that reference an unavailable `vitest` dependency.

## Journal — restored durable divider treatment

The divider treatment now uses two explicit `chronicle-heading-rule` child elements rather than the legacy `::before` and `::after` rules that had been disabled by the rollback cascade. In the completed content state, both rules are present, visible, and measure 128 px in the desktop preview. The card cadence was lengthened from 230 ms to 330 ms, with a 1.1-second entrance, so each arrival has more breathing room.

The initial local preview retained a stale stylesheet because its live-update channel is blocked across the temporary preview origin. The runtime inspection confirmed that the prior rule was still active, so the Journal will be reloaded from a fresh route state to evaluate the updated divider placement and stronger brass treatment.

After a fresh route load, the dedicated heading-rule elements resolved to the restored brass gradients at their new visible content position. Their draw animation begins with zero width and opacity, as designed, then completes during the following 760 ms animation window.

The completed Journal content view confirms that the two brass divider lines are now visibly rendered above the eyebrow and below the fixed header threshold. The cards retain their individual component-controlled reveal, now spaced at 330 ms with a 1.1-second entrance for a calmer progression.

## Journal — pre-card collection divider

The requested missing lines above the cards are restored as a dedicated `chronicle-collection-divider` positioned between the Journal description and card grid. It consists of two brass rules with a centered star mark. It becomes visible just before the first card and does not touch the established 330 ms card stagger or 1.1-second card entrance.

The completed Journal preview confirms that the restored two-rule brass divider is visible directly above the card-collection position, between the Journal description and the first row of entries. The slower individual card cadence remains unchanged.

## Journal — collection-divider wording

The collection divider now restores wording between its brass lines: **“Field notes · Selected entries”**, with a small brass star mark. In a fresh local page load, the divider label is present and visible once the Journal content state begins. It uses the same staged divider appearance immediately before the individual card sequence.

## Journal — complete heading-block restoration

The final post-portal cascade now explicitly restores every requested heading element: the two brass heading rules, the “The Chronicles” eyebrow, “Logs From Beyond the Threshold” title, and the introductory description. Each receives a deliberate upward fade after the portal completes. This corrective layer leaves the visible collection divider, its wording, and the approved component-controlled card cadence unchanged.

In a fresh local Journal preview with the completed portal state active, all five requested heading elements were visible together above the restored “Field notes · Selected entries” collection divider. The post-portal card timing constants were not changed.

## Journal — live heading trigger hardening

The supplied comparison confirms that the desired completed Journal view contains the heading rules, eyebrow, title, description, and collection-divider wording together. The final heading child rules now settle directly to visible, readable values whenever the same `is-content-revealed` state that exposes the collection divider is present. This avoids reliance on older child animations that could leave the wording transparent in a normal browser load.

The completed state was visually checked after the heading-rule draw window. It shows “The Chronicles,” “Logs From Beyond the Threshold,” the full introductory paragraph, and the “Field notes · Selected entries” lower divider together. The existing card timings remain unchanged.

## Journal — parent visibility correction

The live screenshot exposed the remaining defect: the heading child elements were readable in isolation, but their `.chronicle-head` parent was still allowed to retain a zero-opacity completion animation. The final Journal layer now settles the heading parent and its dedicated brass rules to visible, opaque values in the same completed state that exposes the collection divider. This is a direct replacement for the suppressing parent animation, not another overlapping reveal layer.

The repaired completed state was visually verified with all expected wording visible above the divider: “The Chronicles,” “Logs From Beyond the Threshold,” and the full introductory description. Both dedicated heading-rule elements resolved with visible opacity and full scale, while the divider and card sequence remained unchanged.

## Journal — ordered heading and stable realm load

The Journal realm background now uses a stable `cover` treatment anchored to the viewport rather than stretching to the changing section height. The revised reveal begins with all heading and divider elements hidden, then releases the eyebrow, title, description, and Field Notes collection divider in the user-requested order. The card timers remain unchanged.

The timed local sequence was sampled after a fresh stylesheet load. At 300 ms, only the “The Chronicles” eyebrow was entering; at 700 ms, the title joined it; at 1050 ms, the description was entering; and at 1450 ms, the Field Notes divider appeared. The Journal background computed to a fixed `cover` treatment throughout this check.

## Journal — slow state-driven reveal and non-scaling portal exit

The Journal heading progression now has clear, non-overlapping stages: the eyebrow begins first, followed by the title, then the description, and finally the Field Notes collection divider. Each stage uses a slower 0.82–1.10 second arrival. The card cadence is unchanged once the final divider has completed, but the first card waits until the heading sequence has finished.

The portal wall, carved frame, and revealed realm now retain fixed transform scales during the portal exit and fade away without camera zoom. Timed inspection confirmed that the wall remained at a 1.65 scale and the frame at its original lifted 1.0 scale throughout the transition, while the heading stages advanced one by one.

The final staged check confirms the intentional order and slower cadence: only the eyebrow was visible at 1.2 seconds; the title joined at 2.6 seconds; the description appeared at 4.2 seconds; and the Field Notes divider appeared at 5.6 seconds. The first card begins only after the divider has settled, while its approved 330 ms between-card cadence and 1.1-second entry duration remain intact.

## Journal — preserve portal motion; stabilise only the handoff

The portal-wall, frame, and realm zoom overrides were removed in full, restoring the original doorway-opening animation. The corrective work is confined to the separate Chronicle background: the realm asset is now requested with priority while the portal is still present, and the existing parent section fade brings its already-decoded cover background into view without a second pseudo-layer animation. This removes the post-portal handoff shift without altering the opening animation.

Direct inspection confirmed that the post-portal realm preload had completed before the doorway transition, while the Chronicle background pseudo-layer was already at full opacity with no active animation. The separate original portal stage remains untouched by the background handoff correction.

## Build note

The supplied project compiles the modified booking, tours, header, layout, and CSS files during `next build`, but its production export still fails while prerendering the pre-existing `/_not-found` route with a React `useContext` null error. A standalone TypeScript pass also reports two existing test-only missing `vitest` type declarations. Neither diagnostic references the modified files.

## Recovery, Home alignment, and responsive Journal sizing

After an unexpected sandbox reset, the full Next.js workspace was reconstructed from the recovered original project archive, then overlaid with the latest preserved Journal state machine, wording edits, Home alignment correction, notes, and checklist. The Home “Sri Lanka, held in story and place” introduction retains the supplied one-column layout and compact `0.9rem` spacing.

For the Journal, the approved portal keyframes and staged-content timing remain unchanged. Portal layout now measures against `100dvh`; its mobile doorway visual is constrained to the live viewport. The loaded realm background is viewport-cover on larger screens and `contain` on mobile, preventing the portrait image from being capped by the card collection. A 375 × 812 completed mobile check confirmed the portal fit and showed the full post-portal realm artwork, heading, divider, and first entry without image cropping.

An additional 960 × 700 resized-desktop check confirmed the same completed Journal state recalculates cleanly: the realm remains `cover` fitted to the viewport, the heading and divider stay legible, and the image fills the available viewport without a desktop-size-dependent crop or animation change.

The mobile crop source was the Journal card media window: a fixed 190px height combined with `object-fit: cover` was cutting off the artwork subjects. The mobile-only correction keeps the browser width responsive, changes the card media to a stable 16:10 ratio, and uses `object-fit: contain` with a dark backing so the full image remains visible. The desktop crop treatment and all Journal portal/content animations are unchanged.

A final 375 × 812 mobile capture shows the complete Sigiriya card image with natural side letterboxing rather than a cropped subject. The Journal realm reports `contain` on mobile and `cover` on resized desktop, and the completed heading/divider/card state remains intact.

## Journal — narrowest viewport correction

A 240 × 600 reproduction exposed two separate narrow-width issues: the realm was using `contain` across the entire tall Chronicle section, leaving the artwork visually capped to a short strip, and the collection divider wording exceeded the available inline width. The portal itself remained inside the viewport.

The narrow-only correction now anchors the realm pseudo-background to the initial `100dvh` viewport and returns it to `cover`, while keeping mobile card images on the safer full-subject `contain` treatment. The divider gap, lettering, and rule widths now clamp down below 320 px. A fresh 240 × 600 capture shows the realm artwork filling the opening viewport, the heading remaining readable, and the divider staying within the narrow screen without changing portal keyframes or standard card timing.

## Journal — full-scroll backdrop and card-frame correction

A follow-up narrow-width review found that the previous safeguard had explicitly limited the realm pseudo-layer to `100dvh`, so the page could scroll beyond the artwork while reading the cards. The final override now keeps the pseudo-layer inset from the top through the bottom of the entire `.chronicle-section`, with ordinary scroll attachment; the portal animation and reveal state machine are unchanged.

The card media frame also had a visible fit artifact at very narrow widths because the 16:10 container was paired with `object-fit: contain` for a mixed set of square and landscape source images. The final mobile-only rule removes any media inset and uses a frame ratio suited to the landscape artwork, switching to a square frame below 320 px so the square card sources fill the frame without an inner gap. The change is intentionally scoped to the Journal card media layer.

The source package was checked for archive integrity. Automated project verification is limited in this reconstructed source because the package does not include Vitest despite two existing test files importing it; TypeScript reports only those missing-test-dependency errors, not errors in the changed Journal files.
