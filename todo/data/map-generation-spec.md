# Sri Lanka Route Atlas — Map Generation Specification

Use the fixed Sri Lanka silhouette and a portrait 4:5 illustrated tourism atlas style. This is a design specification, not a request to invent new geography. Place every named hub and tourism destination below at its correct Sri Lankan location, label each clearly, and draw only the listed corridor relationships.

## Distinct waypoint set

- Airport — primary tourism destination
- Pinnawala — primary tourism destination
- Kurunegala — pass-through hub / sub-point
- Dambulla — primary tourism destination
- Sigiriya — primary tourism destination
- Kandy — primary tourism destination
- Yapahuwa — primary tourism destination
- Anuradhapura — primary tourism destination
- Mihintale — primary tourism destination
- Aukana — primary tourism destination
- Ritigala — primary tourism destination
- Polonnaruwa — primary tourism destination
- Matale — primary tourism destination
- Ramboda — primary tourism destination
- Nuwara Eliya — primary tourism destination
- Haputale — primary tourism destination
- Ella — primary tourism destination
- Badulla — primary tourism destination
- Mahiyanganaya — primary tourism destination
- Dambana — primary tourism destination
- Tissamaharama — primary tourism destination
- Kataragama — primary tourism destination
- Yala — primary tourism destination
- Hatton — pass-through hub / sub-point
- Wellawaya — pass-through hub / sub-point
- Diyaluma — primary tourism destination
- Ratnapura — pass-through hub / sub-point
- Knuckles — primary tourism destination
- Meemure — primary tourism destination
- Gampola — pass-through hub / sub-point
- Nallathanni — pass-through hub / sub-point
- Adam's Peak — primary tourism destination
- Horton Plains — primary tourism destination
- Lipton's Seat — primary tourism destination
- Dunhinda — primary tourism destination
- Colombo — pass-through hub / sub-point
- Kitulgala — primary tourism destination
- Negombo — primary tourism destination
- Puttalam — pass-through hub / sub-point
- Kalpitiya — primary tourism destination
- Mannar — primary tourism destination
- Jaffna — primary tourism destination
- Vavuniya — pass-through hub / sub-point
- Trincomalee — primary tourism destination
- Habarana — pass-through hub / sub-point
- Avissawella — pass-through hub / sub-point
- Matara — pass-through hub / sub-point
- Mirissa — primary tourism destination
- Galle — primary tourism destination
- Bentota — primary tourism destination
- Pasikudah — primary tourism destination
- Batticaloa — primary tourism destination
- Arugam Bay — primary tourism destination
- Pottuvil — pass-through hub / sub-point
- Tangalle — primary tourism destination
- Udawalawe — primary tourism destination
- Chilaw — pass-through hub / sub-point
- Unawatuna — primary tourism destination

## Required visual rules

- Use a dark ocean, warm parchment land, editorial hand-drawn travel illustrations, compass, and compact legend.
- Primary tourism destinations must use larger red-ring markers and small destination doodles appropriate to their category.
- Hubs and sub-points must use smaller pale markers and readable labels.
- Main-road corridors use solid orange lines; scenic connectors/local spurs use orange dashed lines.
- Include every distinct waypoint above; do not omit airport, Kurunegala, Ibbagamuwa/Melsiripura/Galewela corridor towns where they are part of the verified Dambulla route.
- Keep labels outside dense artwork and reserve a clear inset for the legend.
- Do not place route markers by visual guess: use the supplied route database and the actual geography of Sri Lanka.

## Validation basis

Use docs/chatgpt-route-audit.md as the corridor-level accuracy review. Mountain spurs, park access roads, and scenic rail legs must be labeled as local/scenic alternatives rather than ordinary main-road routes.

## Output

Return one clean labeled map image suitable as the fixed base layer for a later interactive overlay.
