# Fine Lanka Route Atlas — Todo Package

## Purpose

This directory contains the route-atlas research, generated map assets, computer-vision registrations, route databases, scripts, and preview source files created for the Fine Lanka Tours map work. The package is intended to preserve the work before further visual and interaction corrections are made.

> **Current status:** The research and asset-generation work is preserved, but the interactive overlay still requires another accuracy pass before it should be treated as production-ready.

## What has been completed

The repository itineraries were read from `lib/tours-data.ts` and normalized into thirteen route sequences. The sequences include primary tourism destinations and proposed pass-through hubs such as Kurunegala, Ibbagamuwa, Melsiripura, and Galewela on the Airport–Dambulla corridor. The initial route geometry pipeline geocoded named places and requested road traces from a public OSRM service. The Airport–Dambulla test route was separately recorded with a detailed road-step response in `data/airport-dambulla-osrm.json` and `data/airport-dambulla-route.txt`.

A prior ChatGPT corridor review covers all thirteen tours in `data/chatgpt-route-audit.md`. It identifies plausible corridors, local access spurs, scenic rail alternatives, and redundancies such as Nallathanniya versus Adam’s Peak and Arugam Bay versus Pottuvil. A later bulk ChatGPT expansion runner and a batched fallback runner are included under `scripts/`; their log is retained, but the fresh bulk request timed out and must not be interpreted as a complete authoritative output. The prior completed audit remains the usable ChatGPT review until the route expansion is rerun successfully in smaller batches.

Several illustrated Sri Lankan atlas backgrounds were generated. The latest all-hubs image is `assets/fine-lanka-route-atlas-all-hubs.png`; earlier variants are retained for comparison. The map-generation specification in `data/map-generation-spec.md` lists the distinct itinerary waypoint set and the intended visual hierarchy: larger creative primary destinations, smaller support hubs, solid main corridors, dashed scenic/local connectors, and a compact legend.

Computer-vision inspection scripts were created to detect waypoint symbols and route strokes. The strict crop-based vision pass produced `data/atlas-marker-vision-complete.json`, which contains 50 registered marker centers from the fixed all-hubs atlas image: 31 primary markers and 19 support markers. The raw OpenCV detections are retained in `data/atlas-marker-detections.json` and the `cv/` directory for comparison; these contain false positives and should not be used directly as the final marker registry.

The map preview component and page were updated under `preview/`. The intended behavior is to keep the generated atlas fixed, render routes in image coordinates, show quiet unselected corridors, brighten the selected itinerary, and make every registered waypoint clickable. The latest implementation adds an independent clicked-marker highlight state so a marker visibly changes even when it is not part of the currently selected itinerary.

## Package contents

| Directory | Contents |
|---|---|
| `scripts/` | Route generation, ChatGPT audit, map specification, CV detection, vision registration, registry merging, parsing, and verification scripts. |
| `data/` | Itinerary waypoint drafts, validated route data, feature registries, OSRM Airport–Dambulla output, ChatGPT audits, map-generation specification, and vision-registered marker data. |
| `assets/` | All generated Sri Lankan route-atlas image variants used during the work. |
| `cv/` | Raw CV inspection outputs and image crops used for vision registration. |
| `preview/` | Snapshot of the interactive map component, CSS module, and `/map-preview` page. |

## Important limitations

The generated atlas artwork is an illustrated visual base, not a survey-grade cartographic source. AI-generated labels and artwork can contain omissions, duplicates, or positional inaccuracies; the all-hubs draft previously showed a duplicated Matara label. The final production workflow should use the fixed artwork only as a visual background and should validate every label and marker against the route database before release.

The route geometry is based on road-routing data and corridor research, but some itinerary legs are local mountain spurs, park access roads, or scenic rail journeys. Those should be represented as separate route types rather than being forced into a single road trace. Travel times and road availability should be locally confirmed before publication.

The CV detector can find decorative circles as well as waypoint symbols. The crop-based vision registry is therefore a strong starting point, not a substitute for manual review. A final review must confirm each detected marker against the printed label and remove any marker that belongs to the legend or decorative artwork.

## Recommended next steps

1. Review `data/atlas-marker-vision-complete.json` against `assets/fine-lanka-route-atlas-all-hubs.png`. Rename every generic marker, confirm whether it is primary or support, and remove any remaining false positive.
2. Re-run route expansion per itinerary or per leg with short requests. Store each leg as `{tourSlug, start, end, orderedHubs, roadNamesAndRefs, routeType, confidence, notes}` and merge the results into one deterministic database.
3. Reconcile the route database with the visible atlas route network. A route should be represented as an edge from one registered waypoint UID to another, with the road geometry stored separately from the visual marker coordinates.
4. Update the preview to consume the reviewed registry only. Keep all unselected route edges grey and low-opacity, and render the selected trip’s exact edge set in red with a contrast halo. Do not project routes from latitude/longitude onto the artwork unless the artwork has first been calibrated.
5. Test every marker click and every itinerary selection in a real browser session. Confirm that the clicked marker changes color and scale, its label and popup appear, and the selected itinerary changes both its route styling and its active destination set.
6. After approval, replace any generated label that is not geographically or typographically correct, then commit the reviewed registry and map asset into the main application rather than relying on this snapshot directory.

## Reproducibility

The scripts assume the project root is `/home/ubuntu/fine-lanka-web`. Typical commands are:

```bash
python3 todo/scripts/build_routes.py
python3 todo/scripts/parse-airport-dambulla.py
node todo/scripts/build-map-feature-registry.js
python3 todo/scripts/vision-audit-atlas-crops-gpt.py
node todo/scripts/merge-vision-markers-into-atlas.js
node todo/scripts/verify-map-feature-registry.js
```

Network services used by the scripts can rate-limit, change route preferences, or be temporarily unavailable, so generated outputs should be versioned alongside their input assumptions.

## References

[1]: https://github.com/Prabhath-M/fine-lanka-web "Fine Lanka Tours repository"
[2]: https://www.openstreetmap.org/ "OpenStreetMap"
[3]: https://project-osrm.org/ "Open Source Routing Machine"
[4]: https://rda.gov.lk/index.php?Itemid=123&id=24&lang=en&option=com_content&view=article "Sri Lanka Road Development Authority road list"

The route data and map assets in this package were prepared from the repository itinerary definitions, public road-network routing, and the ChatGPT corridor audit. References [1]–[4] should be rechecked when the route database is promoted to production.
