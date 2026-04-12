# Kincstartó Modal Narrative Redesign (Kincstartó-only)

Date: 2026-04-12  
Scope: **Kincstartó project modal only** (no changes to other project modals)

## Goal
Build a Kincstartó modal using the **existing Lumira modal components** and layout rhythm, with Kincstartó-specific content, images, and CTA.

## Constraints
- Applies only to Kincstartó (`project.slug === "kincstarto"`).
- **Reuse existing Lumira modal components** (no new layout system).
- Keep layout calm, minimal, lots of whitespace.
- Screenshots are dominant in split sections.
- CTA opens `https://kincstarto.vercel.app` in a new tab.

## Assets
Screens in `public/kincstarto/screens/`:
- `konyvtar_1.PNG`
- `konyvtar_2.PNG`
- `meditacio_1.PNG`
- `meditacio_2.PNG`
- `joga_1.PNG`
- `joga_2.PNG`

Logo: existing project logo (from `projectVisuals`)
Card background image: **use the card_background asset** for Kincstartó project card.

## Layout Structure (Top → Bottom)
1. **BrandIntro (existing component)**
   - Logo + name + tagline
   - Tagline: “Egy személyes tér olvasáshoz, gyakorláshoz és elmélyüléshez.”
   - CTA: “Fedezd fel” → `https://kincstarto.vercel.app` (new tab)

2. **CenteredTextBlock — Kiinduló**
   - Text-block (single column, centered)
   - Content:
     Ez a projekt egy személyes gyűjteményből indult: könyvek, jegyzetek és visszatérő gyakorlatok egy helyre rendezéséből.
     Idővel egymásra rétegződtek benne különböző irányok — olvasás, meditáció és mozgás — nem különálló funkciókként, hanem egy közös tér részeként.

     Nem egy általános használatra tervezett alkalmazás, inkább egy belső tér, ami használat közben alakult ki, és azóta is folyamatosan formálódik.

3. **IconGrid — Működési elv**
   - 3 items, centered
   - Icons (Lucide): `bookmark`, `rotate-ccw`, `compass`
   - Items:
     1) Személyes válogatás — Nem teljes gyűjtés, hanem tudatosan kiválasztott tartalom.
     2) Visszatérő használat — Nem egyszeri felfedezésre, hanem újrahasználatra épül.
     3) Lassú felfedezés — A tartalom nem lineárisan, hanem saját tempóban tárul fel.

4. **SplitSection — Könyv blokk**
   - Side-by-side, **alternate layout**
   - Text:
     A könyvtár nem egy általános olvasólista, hanem egy személyes válogatás keleti filozófiáról, meditációról, pszichológiáról és ezek irodalmi megközelítéseiről.

     A tartalom címkék, hagyományok és szintek mentén van rendezve, így nem csak kereshető, hanem különböző nézőpontokból is bejárható.
     A rendszer egyszerű olvasási útvonalakat is képes összeállítani, amelyek egy adott téma mentén kapcsolják össze a könyveket.
   - Images: `konyvtar_1.PNG`, `konyvtar_2.PNG`

5. **SplitSection — Meditáció blokk**
   - Side-by-side, alternate
   - Text:
     A meditációs rész saját írt szövegekre épül, amelyek nem statikus formában jelennek meg, hanem időzített, ritmusra hangolt olvasási élményként.

     A szöveg fokozatosan jelenik meg, halk zenei aláfestéssel, így a figyelem nem csak a tartalomra, hanem az áramlására is irányul.
     Ideális esetben végigvezet, de ugyanúgy vissza lehet térni egy-egy részhez.
   - Images: `meditacio_1.PNG`, `meditacio_2.PNG`

6. **SplitSection — Jóga blokk**
   - Side-by-side, alternate
   - Text:
     A jóga rész a saját gyakorlásban visszatérő pózokból épül fel, kiegészítve azokkal az információkkal, amelyek segítenek pontosabban és tudatosabban végezni őket.

     A pózok mellett fokozatosan megjelennek a kedvenc gyakorló videók is, így a statikus tudás és a követhető gyakorlat egymás mellé kerül.
   - Images: `joga_1.PNG`, `joga_2.PNG`

7. **MoodBlock**
   - Centered highlight text, large font, extra whitespace
   - Text:
     Nem egy hely, amit végigjársz.
     Inkább egy, ahova időről időre visszatérsz.

8. **NextCards — Következő irányok**
   - Card list (not icon grid)
   - 2–4 cards, subtle background/border, distinct from icon grid
   - Cards:
     1) Tartalom bővítése — Új könyvek és meditációk folyamatos hozzáadása a meglévő struktúrához.
     2) Jóga tudástér mélyítése — A gyakorlati leírások további pontosítása és rendszerezése.
     3) Anatómiai réteg — Egy külön tudástér kialakítása, amely a test működését és a mozgás alapjait teszi érthetőbbé.
     4) Testtérkép (távlati) — Egy vizuális felület, ahol pszichoszomatikus összefüggések mentén lehet böngészni a test működését.

9. **CenteredTextBlock — Záró**
   - Short centered text
   - Content:
     A projekt jelenlegi formájában használható és lezárt egységet alkot, de nem végleges.
     Inkább egy olyan tér, ami a használattal együtt alakul, és mindig annyit mutat, amennyire éppen szükség van.
   - CTA: “Fedezd fel” → `https://kincstarto.vercel.app` (new tab)

## Alternation Rule
- Split sections alternate image side (image left / image right) per block.
- Mobile: image first, text second.

## Acceptance Criteria
- Kincstartó modal uses the same component structure as Lumira (no new layout system).
- Kincstartó card uses **card_background** as background image.
- CTA present in header and closing block with correct URL.
- IconGrid uses specified Lucide icons and copy.
- Split sections show the specified images, large and legible.
- Layout remains calm, minimal, with generous spacing.

