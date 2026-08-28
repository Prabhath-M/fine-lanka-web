# Redesigned Home-Section Assets

The two generated illustrations were visually checked before integration. The Sigiriya fresco panel uses a weathered plaster surface, lotus forms, a distant rock citadel and warm mural pigment, with the visual weight placed on the right. The cultural-route panel includes a moonstone foreground, a heritage stupa, a winding path, distant elephants, and hand-painted floral/liyawel motifs.

These locally copied files support only the redesigned **Why Fine Lanka** section and the section immediately beneath it:

- `public/images/fine-lanka-sigiriya-fresco-passage.jpg`
- `public/images/fine-lanka-cultural-route-panel.jpg`
- `public/images/fine-lanka-liyawel-border.png`
- `public/images/fine-lanka-moonstone-liyawel-symbol.png`

No Manus-hosted image path is required by the packaged source.

## Live Visual Check

The opening view of the redesigned **Why Fine Lanka** section was checked in the running site. The Sigiriya fresco illustration appears in the intended framed, right-hand mural position; the editorial heading and descriptive copy remain clearly legible on the warm temple-plaster background. The existing navigation and all home-page sections above it remained unchanged.

The following travel-design section was also checked live. Its locally bundled cultural-route illustration, copy panel, and “See how a journey takes shape” link sit together as a legible route folio. A direct-anchor rendering check identified that the commitment-card area needed a visibility safeguard, which has been applied in the scoped stylesheet and is being rechecked.

The first safeguard did not take effect after a live reload because the inherited reveal rule continued to win in the running stylesheet. The final stylesheet now receives a direct, property-level visibility override for the four cards before packaging.

The development server was restarted after the final scoped stylesheet edit to clear the cross-origin hot-reload limitation used during live checking.

The live computed-style check confirmed that the original global `.reveal` class was still holding the four commitment cards at zero opacity on direct anchor visits. The class has therefore been removed only from these four redesigned cards; the shared reveal treatment remains unchanged elsewhere on the home page.

After the source change, the local development server continued to serve a stale compiled component even though the saved source had the class removed. The local Next cache is being cleared before the final verification; this is a local preview-cache issue, not a packaged-source dependency.

Even after clearing the local build output, the browser continued to report the previously loaded component payload. The final live verification will use a cache-busting request URL; the packaged source itself has been checked directly and contains no `.feature reveal` markup.

## Final Live Verification

Using the cache-busting preview URL, the updated component payload rendered correctly: all four commitment cards are visible under the framed Sigiriya mural, and the next section continues into the cultural-route folio with the locally bundled illustration. The two sections read as a single Sri Lankan heritage passage while the surrounding home-page sections retain their existing content and styling.

## Background-and-Photography Revision

The updated home-page preview confirms that the Sigiriya fresco now works as the **background layer** for the Why Fine Lanka section, while three framed tourism photographs show Arugam Bay, Kandy Esala Perahera, and Kandyan dance. The cultural-route artwork now functions as the background atmosphere for the following journey-design section.

The About Us preview confirms the same system is applied there: generated heritage artwork is behind the copy, the Esala Perahera procession is the primary live tourism image, and the Arugam Bay and Kandyan dancer images form the origin-section photo rail. Text remained legible against the layered backgrounds in the browser preview.
