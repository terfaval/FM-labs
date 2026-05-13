# Project Journal – UX Spec v0

## 1. Áttekintés

A Project Journal két fő felületből áll:

1. **Publikus timeline (read-only)**
2. **Rejtett admin felület (draft → publish workflow)**

A két felület szigorúan el van választva egymástól:

* publikus oldalon nincs szerkesztés
* admin nem érhető el navigációból

---

## 2. Publikus felület (Timeline)

### 2.1 Route

* `/journal` vagy `/build-log`

---

### 2.2 Oldal struktúra

Felül:

* cím: *Project Journal*
* rövid leírás (1–2 mondat)

Alatta:

* projekt szűrő (dropdown vagy pill)
* timeline lista

---

### 2.3 Timeline lista

Minden entry egy blokk:

#### Alap (collapsed állapot)

* dátum
* projekt neve
* státusz badge
* cím
* summary

#### Expand (kattintásra)

* body (3–6 mondat)
* steps (mini timeline)
* nextStep

---

### 2.4 Steps megjelenítés

* vertikális lista
* max 2–5 elem
* minden elem:

  * rövid cím (label)
  * 1–2 mondatos leírás

Megjelenítés:

* finom vizuális elválasztás (pl. kis pontok / vonal)
* nem dominálhatja az entry-t

---

### 2.5 Featured entry

Ha `featured = true`:

* nagyobb kártya
* vagy kiemelt vizuális
* timeline tetején is megjelenhet

---

### 2.6 Szűrés

v0:

* projekt alapján
* egy aktív filter

---

### 2.7 Interakció

* entry kattintás → expand
* új kattintás → collapse
* nincs külön page v0-ban

---

## 3. Rejtett Admin

### 3.1 Elérés

* nincs linkelve
* direkt URL (pl. `/studio/journal`)
* egyszerű védelem (pl. env alapú vagy basic auth később)

---

## 3.2 Fő nézet

Lista + create

* entry lista (dátum szerint)
* státusz (draft / published)
* featured jelölés
* edit gomb

---

## 3.3 Primary action

### “JSON draft beillesztése”

UI:

* textarea
* “parse” gomb

---

### 3.4 Parse folyamat

1. JSON bemásolás

2. parse

3. mezők feltöltése:

   * title
   * summary
   * body
   * steps
   * stb.

4. validáció:

   * hiányzó mezők
   * hibás formátum

---

## 3.5 Entry editor

Form mezők:

* title
* project
* date
* status
* type
* summary
* body
* nextStep
* featured (toggle)

### Steps editor

* lista
* add / remove
* label + text mezők

---

## 3.6 Preview

* élő preview (jobb oldalon vagy alatta)
* ugyanúgy néz ki, mint publikus entry

---

## 3.7 Mentés

* Save as draft
* Publish

---

## 3.8 Draft státusz

Entry állapotok:

* draft → nem publikus
* published → megjelenik timeline-ban

---

## 4. Adatfolyam

1. beszélgetés / fejlesztés
2. prompt → JSON draft
3. admin → paste
4. review
5. publish
6. megjelenik publikus timeline-ban

---

## 5. Design elvek

### Publikus oldal

* tiszta
* olvasható
* nem túlzsúfolt
* content-first

### Admin

* funkcionális
* gyors
* nem design-heavy
* minimal friction

---

## 6. v0 scope (fontos)

BENNE VAN:

* timeline lista
* expand entry
* steps megjelenítés
* JSON paste admin
* draft/publish

NINCS BENNE:

* auth rendszer (full)
* külön entry oldal
* kommentek
* kereső
* multi-filter
* analytics

---

## 7. Következő lépések

1. Timeline komponens implementáció
2. Entry komponens
3. Admin parser logika
4. JSON → UI mapping
5. Minimál védelem admin route-ra

---

## 8. Megjegyzés

Ez a UX spec közvetlenül implementálható egy modern webappban (pl. Next.js + Vercel környezetben).

---
