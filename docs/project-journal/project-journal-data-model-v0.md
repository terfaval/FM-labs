# Project Journal – Data Model v0

## 1. Áttekintés

A Project Journal v0 egy egyszerű, JSON-alapú adatstruktúrát használ, amely időrendi (timeline) megjelenítéshez optimalizált.

A cél egy könnyen kezelhető, konzisztens és bővíthető modell.

---

## 2. Fájlszerkezet

Javasolt elhelyezés:

/content/journal/journal.json

---

## 3. Alap struktúra

A fájl egy tömböt tartalmaz, ahol minden elem egy bejegyzés:

```json
[
  { ...entry1 },
  { ...entry2 }
]
```

---

## 4. Entry (bejegyzés) struktúra

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

---

## 5. Mezők magyarázata

### id

* egyedi azonosító
* slug-szerű formátum ajánlott

példa:
"portfolio-journal-v0"

---

### date

* ISO formátum
* rendezés alapja

példa:
"2026-04-19"

---

### project

* projekt azonosító (nem display név!)
* később map-elhető label-re

példa:
"portfolio"
"oneironauta"
"lumira"

---

### title

* rövid, informatív cím
* 1 sor

---

### summary

* 1–2 mondatos kivonat
* ez jelenik meg a timeline-ban

---

### status

Elérhető értékek:

* active
* refining
* exploring
* paused

---

## 6. Példa adatok

```json
[
  {
    "id": "journal-feature-planning",
    "date": "2026-04-19",
    "project": "portfolio",
    "title": "Project Journal feature alapjainak megtervezése",
    "summary": "Elindult a portfolio fejlesztési napló rendszerének tervezése, timeline alapú megközelítéssel.",
    "status": "active"
  },
  {
    "id": "journal-data-model-v0",
    "date": "2026-04-19",
    "project": "portfolio",
    "title": "Journal adatmodell v0 definiálva",
    "summary": "Kialakult egy egyszerű JSON struktúra, amely támogatja az időrendi megjelenítést és a későbbi bővítést.",
    "status": "active"
  },
  {
    "id": "lumira-background-direction",
    "date": "2026-04-18",
    "project": "lumira",
    "title": "Vizuális háttér irány véglegesítése (v0)",
    "summary": "Döntés született az ősi, alacsony kontrasztú háttérvilágról, amely nem vonja el a figyelmet a UI-ról.",
    "status": "refining"
  }
]
```

---

## 7. Rendezés

Frontend oldalon:

* csökkenő dátum szerint
* legfrissebb bejegyzés felül

---

## 8. Bővíthetőség (előkészítve)

A modell később könnyen bővíthető például:

* body (hosszabb szöveg)
* tags
* type (feature, fix, decision stb.)
* featured
* relatedLinks

---

## 9. Megjegyzések

* v0-ban minden bejegyzés manuálisan kerül a fájlba
* fontos a konzisztens kitöltés
* a későbbi automatizálás (Codex) ezt a struktúrát fogja generálni

---
