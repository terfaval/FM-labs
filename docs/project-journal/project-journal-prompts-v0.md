# Project Journal – Prompt Pack v0

## 1. Cél

Ez a prompt pack azt a célt szolgálja, hogy a portfolio Project Journal / Build Log bejegyzései egységes hangon, egységes perspektívából és egységes adatséma szerint készüljenek el, függetlenül attól, hogy a draftot ChatGPT vagy Codex készíti.

A bejegyzések célja nem marketinges blogposzt írása, hanem rövid, hiteles, publikus fejlesztési naplóbejegyzések előállítása.

---

## 2. Perspektíva és hang – rögzített alapelvek

A generált bejegyzések minden esetben az alábbi szabályokat kövessék:

### Perspektíva
- A bejegyzés **első személyben, egyes számban** íródjon.
- A szöveg úgy szólaljon meg, mintha a portfolio tulajdonosa írná.
- A fejlesztési döntések, irányok és felismerések az ő nézőpontjából jelenjenek meg.

### A felhasználó szerepének kezelése
- A szöveg nyugodtan emelje ki, hogy a fejlesztés tudatos döntések, irányválasztások és iterációk mentén haladt.
- A bejegyzésben a felhasználó szerepe lehet kissé „kikerekített”, de nem lehet hamis vagy félrevezető.
- Nem szabad azt állítani, hogy minden technikai megoldást saját kézzel kódolt, ha ez nem igaz.
- Viszont szabad azt hangsúlyozni, hogy ő tervezte, irányította, felülvizsgálta, döntötte el vagy alakította a rendszert.

### Hangnem
- Magyar nyelvű.
- Nyugodt, tiszta, pontos, emberi.
- Nem marketinges.
- Nem túl technikai.
- Nem túlmagyarázó.
- Nem commit-log jellegű.
- Ne legyen hype-os vagy önfényező.

### Tartalmi fókusz
A bejegyzés elsősorban ezekre koncentráljon:
- mi változott
- miért volt erre szükség
- mi lett tisztább, jobb vagy stabilabb
- mi maradt nyitva
- mi a következő logikus lépés

---

## 2. Kiegészítés – stílus finomhangolás (v1)

A generált bejegyzésekre az alábbi további szabályok is érvényesek:

### Kerülendő

* túl elvont megfogalmazások („rendszerszintű transzparencia”, „dinamikus struktúra” stb.)
* túl általános, üres mondatok
* túlságosan “AI-s” vagy marketinges hang
* olyan megfogalmazások, amelyek nem mondják meg konkrétan, mi történt

### Elvárt

* konkrét, érthető megfogalmazás
* hétköznapi, természetes magyar nyelv
* rövid, tiszta mondatok
* ahol lehet, konkrét igék használata:

  * „megterveztem”
  * „kialakítottam”
  * „átalakítottam”
  * „letisztult”
  * „összeállt”

### Hangolás

* a szöveg legyen közvetlen, de nem laza
* ne legyen túl „okoskodó”
* inkább tűnjön egy ember által írt rövid fejlesztési jegyzetnek, mint egy cikknek

### Perspektíva finomítása

* megjelenhet, hogy a fejlesztés eszközökkel (pl. AI) történt
* de a hangsúly maradjon a döntéseken, irányokon és felismeréseken

---

## 3. Kimeneti séma (v0)

A generált kimenet minden esetben ezt a JSON struktúrát kövesse:

```json
{
  "id": "string",
  "date": "YYYY-MM-DD",
  "project": "string",
  "title": "string",
  "summary": "string",
  "status": "active | refining | exploring | paused"
}
```

### Mezőszabályok

#### id
- slug-szerű, rövid azonosító
- kisbetű, kötőjeles forma
- lehetőleg a témára utaljon

#### date
- ISO dátumformátum
- a bejegyzés dátuma

#### project
- technikai projektazonosító
- példák: `portfolio`, `lumira`, `oneironauta`

#### title
- rövid, tiszta, informatív cím
- ne legyen clickbait
- inkább konkrét fejlesztési állítást fogalmazzon meg

#### summary
- 1–2 mondatos, publikus kivonat
- időrendi feedbe illeszkedjen
- ne legyen száraz, de ne is legyen túl irodalmi

#### status
Az alábbi értékek egyike:
- `active`
- `refining`
- `exploring`
- `paused`

---

## 4. ChatGPT alap prompt

Az alábbi prompt használható akkor, ha egy teljes beszélgetés vagy fejlesztési session alapján kell egyetlen Project Journal bejegyzést draftolni.

```text
A feladatom az, hogy a teljes beszélgetés és az abban elvégzett fejlesztési munka alapján készítsek egyetlen publikus Project Journal bejegyzést a portfolio számára.

Fontos szabályok:
- A kimenet magyar nyelvű legyen.
- A bejegyzés első személyben, egyes számban íródjon.
- Úgy szólaljon meg, mintha én, a projekt gazdája írná.
- A hang legyen nyugodt, tiszta, pontos, emberi.
- Ne legyen marketinges, ne legyen hype-os, ne legyen commit-log.
- Ne vesszen el technikai részletekben.
- A szöveg emelje ki az én szerepemet mint tervező, döntéshozó, irányt kijelölő vagy felülvizsgáló szereplő, de ne állítson olyat, ami hamis lenne.
- A fejlesztést lehet enyhén kikerekítve, koherens történetként összefoglalni, de csak a beszélgetésben ténylegesen jelenlévő információkra támaszkodva.

A fókusz ezekre kerüljön:
- mi változott
- miért volt erre szükség
- mi lett jobb, tisztább vagy stabilabb
- mi maradt nyitva
- mi a következő logikus lépés

A teljes beszélgetést és a teljes fejlesztési kontextust vedd figyelembe, ne csak az utolsó üzeneteket.
Sűrítsd össze a lényeget egyetlen publikus naplóbejegyzéssé.

A kimenet kizárólag egy JSON objektum legyen ebben a sémában:
{
  "id": "string",
  "date": "YYYY-MM-DD",
  "project": "string",
  "title": "string",
  "summary": "string",
  "status": "active | refining | exploring | paused"
}

További szabályok:
- Az `id` legyen rövid, slug-szerű.
- A `title` legyen természetes magyar cím.
- A `summary` 1–2 mondat legyen.
- A `summary` publikus portfolio timeline-ba illő szöveg legyen.
- Ne adj magyarázatot a JSON előtt vagy után.
- Ha a session alapján nem egyértelmű a státusz, a legjobb becslést add a fenti enumok egyikével.
```

---

## 5. Codex alap prompt

Az alábbi prompt használható akkor, ha Codex egy fejlesztési beszélgetés, ticket, patch vagy session alapján állít elő publikus journal draftot.

```text
Feladat: a teljes fejlesztési beszélgetés, a kapcsolódó döntések és az elkészült munka alapján készíts egyetlen publikus Project Journal bejegyzést a portfolio számára.

A cél nem technikai changelog írása, hanem rövid, hiteles, publikus fejlesztési összefoglaló készítése.

Szabályok:
- A kimenet magyar nyelvű legyen.
- Első személyben, egyes számban írj.
- A hang olyan legyen, mintha a projekt gazdája írná a saját portfolio naplóját.
- A szöveg legyen nyugodt, tiszta, tárgyszerű, de emberi.
- Ne legyen marketinges.
- Ne legyen túl technikai.
- Ne legyen commit-lista vagy implementációs zaj.
- A felhasználó szerepét mint tervező, irányadó és döntéshozó szereplőt nyugodtan hangsúlyozd, de ne állíts olyat, ami nem következik a beszélgetésből.
- A beszélgetésben szereplő fejlesztést enyhén kikerekítve, koherens formában foglald össze.

A fókusz ezekre essen:
- mi változott
- miért változott
- mi lett tisztább, jobb vagy stabilabb
- mi maradt nyitva
- mi a következő lépés

A teljes beszélgetést vedd figyelembe, ne csak az utolsó promptot vagy az utolsó kódmódosítást.
A cél egyetlen olyan bejegyzés, amely kívülről olvasva is érthető.

Kimeneti forma:
KIZÁRÓLAG egy JSON objektumot adj vissza ebben a sémában:
{
  "id": "string",
  "date": "YYYY-MM-DD",
  "project": "string",
  "title": "string",
  "summary": "string",
  "status": "active | refining | exploring | paused"
}

Mezőszabályok:
- `id`: rövid, slug-szerű azonosító
- `date`: ISO dátum
- `project`: technikai projektazonosító
- `title`: rövid magyar cím
- `summary`: 1–2 mondatos publikus összefoglaló
- `status`: a megadott enumok egyike

Ne írj semmit a JSON elé vagy mögé.
```

---

## 6. Ajánlott használat

### ChatGPT esetén
A prompt elé vagy mögé érdemes odatenni:
- a célprojekt azonosítóját
- a kívánt dátumot
- opcionálisan a preferált státuszt, ha már ismert

Példa:

```text
Projekt: portfolio
Dátum: 2026-04-19
Preferált státusz: active
```

### Codex esetén
A prompt használható:
- ticket végén összefoglaló blokkhoz
- sessionzáró draft generáláshoz
- release note helyett publikus build log draft készítéséhez

---

## 7. Későbbi bővítési lehetőség

Ha a journal rendszer később hosszabb bejegyzéseket is kezel, akkor a prompt kimenete bővíthető például ezekkel:
- `body`
- `nextStep`
- `type`
- `tags`

v0-ban azonban érdemes maradni a rövid timeline-kompatibilis struktúránál.

---

## 8. Megjegyzés

A jelenlegi promptok draft-generálásra készültek, nem automatikus publikálásra. A javasolt működés továbbra is:
- generálás
- gyors emberi átnézés
- publikálás

Ez biztosítja, hogy a hang egységes maradjon, de a portfolio napló ne váljon mechanikussá vagy pontatlanná.
