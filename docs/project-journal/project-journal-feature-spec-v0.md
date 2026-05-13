# Project Journal – Feature Spec v0

## 1. Áttekintés

A Project Journal egy időrendi (timeline) alapú napló, amely a portfolio projektjeinek aktuális állapotát és fejlődését mutatja be.

A cél nem egy klasszikus blog létrehozása, hanem egy transzparens, élő fejlesztési réteg biztosítása a projektek fölött.

---

## 2. Célok

* Láthatóvá tenni, hogy mely projektek aktívak
* Megmutatni a fejlesztési folyamatot, nem csak a kész állapotokat
* Egységes formában dokumentálni a változásokat
* Támogatni a későbbi bővítést (projekt-oldali integráció, automatizált bejegyzések)

---

## 3. Nem célok (v0)

* Nem klasszikus blog rendszer
* Nincs kommentelés
* Nincs admin felület
* Nincs automatikus publikálás
* Nincs komplex kategorizálás

---

## 4. Elnevezés

Belső név: `journal`

Publikus név (választható):

* Project Journal
* Build Log

---

## 5. Oldal struktúra

Route:
`/journal` vagy `/build-log`

Oldal tartalma:

* Oldalcím
* Rövid leírás (1–2 mondat)
* Szűrő (projekt alapján)
* Időrendi lista (timeline)

---

## 6. Bejegyzés (entry) – kötelező mezők

Minden bejegyzés tartalmazza:

* `id` – egyedi azonosító
* `date` – dátum (ISO formátum ajánlott)
* `project` – projekt azonosító
* `title` – cím
* `summary` – rövid kivonat (1–2 mondat)
* `status` – állapot

---

## 7. Státusz mező (v0)

Előre definiált értékek:

* `active` – aktívan fejlesztett
* `refining` – finomhangolás alatt
* `exploring` – kísérleti fázis
* `paused` – ideiglenesen szünetel

---

## 8. Timeline működés

* Bejegyzések dátum szerint rendezve (legfrissebb felül)
* Minden bejegyzés egy blokk:

  * dátum
  * projekt neve
  * státusz
  * cím
  * summary

---

## 9. Szűrés

v0-ban:

* Projekt alapú szűrés
* Több projekt esetén lista vagy dropdown

---

## 10. Tartalom forrás

v0-ban manuális:

* statikus fájl (pl. JSON vagy MD)
* vagy egyszerű CMS struktúra

---

## 11. Későbbi bővítési irányok (nem v0)

* Projektoldali integráció (recent updates)
* Főoldali “Latest updates” blokk
* Codex alapú draft generálás
* Részletes bejegyzés oldal
* Címkék és típusok
* Admin felület

---

## 12. Design elvek

* Egyszerű, olvasható timeline
* Nem túlzsúfolt
* Tartalom-first megközelítés
* Konzisztens struktúra minden bejegyzésnél

---
