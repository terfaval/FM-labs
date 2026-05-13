# Project Journal – System Spec v1.2

## 1. Áttekintés

A Project Journal egy timeline alapú fejlesztési napló rendszer, amely a portfolio projektjeinek aktuális állapotát és fejlődését mutatja be.

A rendszer célja nem klasszikus blog létrehozása, hanem egy **élő fejlesztési réteg**, amely láthatóvá teszi:

* min dolgozom
* milyen döntések születnek
* hogyan állnak össze a rendszerek

---

## 2. Alapelv

A rendszer nem teljes log, hanem:

> **kurált, értelmezett fejlesztési napló**

Ez azt jelenti:

* nem minden beszélgetésből készül bejegyzés
* csak azokból, ahol:

  * történt döntés
  * kialakult egy irány
  * összeállt egy értelmezhető egység

---

## 3. Szerkezeti modell

A rendszer két szintből áll:

### 3.1 Fő timeline

* időrendi lista
* projektek keverve jelennek meg
* minden entry egy önálló állomás

### 3.2 Entry (bejegyzés)

* egy koherens fejlesztési történet
* tartalmazhat több eseményt
* de egy fő fókusza van

### 3.3 Belső mini timeline (`steps`)

* az entry-n belüli folyamat
* 2–5 rövid állomás
* nem teljes log, hanem kivonat

---

## 4. Adatmodell (v1.2)

```json
{
  "id": "string",
  "date": "YYYY-MM-DD",
  "project": "string",
  "title": "string",
  "summary": "string",
  "status": "active | refining | exploring | paused",

  "type": "feature | decision | refinement | research",
  "body": "string",
  "nextStep": "string",

  "featured": true,

  "steps": [
    {
      "label": "string",
      "text": "string"
    }
  ]
}
```

---

## 5. Mezők részletesen

### id

* slug-szerű azonosító
* rövid, beszédes

---

### date

* ISO formátum
* rendezés alapja

---

### project

* technikai azonosító
* pl: `portfolio`, `lumira`, `oneironauta`

---

### title

* 1 soros cím
* lehet karakteresebb
* nem clickbait

---

### summary

* 1–2 mondat
* timeline-ban jelenik meg
* közérthető, nem túl technikai

---

### status

* `active` → aktív fejlesztés
* `refining` → finomhangolás
* `exploring` → kísérletezés
* `paused` → szünetel

---

### type (domináns típus)

* `feature` → új dolog épül
* `decision` → irány / döntés
* `refinement` → finomítás
* `research` → feltérképezés

👉 mindig **1 darab**

---

### body

* 3–6 mondat
* E/1
* természetes hang
* itt jelenik meg a gondolkodás

---

### nextStep

* 1 mondat
* konkrét következő lépés

---

### featured (opcionális)

* boolean
* kiemelt bejegyzésekhez
* ritkán használjuk (~10–20%)

---

### steps (mini timeline)

* 2–5 elem
* az entry belső folyamata

#### step struktúra:

```json
{
  "label": "rövid cím",
  "text": "1–2 mondatos leírás"
}
```

---

## 6. Steps használati szabály

A `steps`:

* nem teljes beszélgetés
* nem user–AI log
* hanem **jelentős fordulópontok kivonata**

Tipikus step-ek:

* irány letisztulása
* adatmodell kialakulása
* prompt megszületése
* struktúra összeállása

---

## 7. Perspektíva és hang

### Perspektíva

* E/1
* a projekt gazdájának hangja

### Szerep

* gondolkodó / tervező / döntéshozó
* nem szükséges azt állítani, hogy minden kód saját

---

### Hang

* magyar
* közvetlen
* érthető
* nem elvont
* nem marketinges
* nem commit log

---

### Kerülendő

* túl absztrakt megfogalmazás
* “AI-s” szöveg
* üres mondatok

---

### Preferált

* konkrét igék:

  * megterveztem
  * összeraktam
  * kialakítottam
  * letisztult
  * most állt össze

---

## 8. Tartalmi fókusz

Minden entry válaszoljon:

* mi változott
* miért
* mi lett jobb
* mi maradt nyitva
* mi a következő lépés

---

## 9. Prompt működés (v1.2)

A generátor:

* a teljes beszélgetést figyelembe veszi
* nem minden részletet használ
* 2–5 kulcs állomást emel ki
* egyetlen koherens bejegyzést ír

---

## 10. Entry kiválasztási szabály

Nem minden session → entry

Entry készül, ha:

* történt döntés
* kialakult struktúra
* összeállt egy rendszer
* van “story”

---

## 11. Példa (teljes)

```json
{
  "id": "journal-system-direction",
  "date": "2026-04-19",
  "project": "portfolio",
  "title": "A napló nem blog, hanem fejlesztési réteg",
  "summary": "Elkezdtem összerakni egy egyszerű fejlesztési napló rendszert a portfoliohoz. Az irány mostanra letisztult: nem klasszikus blog lesz, hanem egy timeline, ami megmutatja, min dolgozom és hogyan haladnak a projektek.",
  "status": "active",

  "type": "decision",
  "body": "Elkezdtem felépíteni a Project Journal rendszert a portfoliohoz. Az elején még inkább blogként gondoltam rá, de mostanra letisztult, hogy ez inkább egy fejlesztési réteg lesz a projektek fölött. Kialakult az alap struktúra is: timeline nézet, egyszerű JSON adatmodell és egy egységes prompt, ami képes draftolni a bejegyzéseket.",
  "nextStep": "következő lépés a timeline UI struktúra megtervezése",

  "featured": true,

  "steps": [
    {
      "label": "Az irány letisztult",
      "text": "A rendszer nem klasszikus blogként állt össze, hanem projektalapú fejlesztési naplóként."
    },
    {
      "label": "Az adatmodell kialakult",
      "text": "Összeállt egy egyszerű JSON struktúra, amire a timeline nézet épülhet."
    },
    {
      "label": "A hang is rögzítve lett",
      "text": "Kialakult egy egységes promptirány, hogy a bejegyzések közvetlenek és érthetők maradjanak."
    }
  ]
}
```

---

## 12. Következő lépések

A rendszer következő fejlesztési lépései:

1. Timeline UI spec
2. Entry komponens
3. Szűrés (project)
4. Főoldali mini blokk (később)

---

## 13. Megjegyzés

Ez a dokumentum a rendszer aktuális “single source of truth” állapota (v1.2).

Minden további fejlesztés erre épül.

---
