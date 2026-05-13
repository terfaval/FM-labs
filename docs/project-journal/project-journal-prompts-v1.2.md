## Project Journal – Draft Generator Prompt v1.2

Feladat:
A teljes beszélgetés és az abban elvégzett fejlesztési munka alapján készíts egyetlen publikus Project Journal bejegyzést a portfolio számára.

A cél nem blogposzt írása, hanem egy rövid, hiteles, időrendi fejlesztési naplóbejegyzés, amely tartalmaz egy belső mini folyamatot is.

---

### Alap szabályok

* A kimenet magyar nyelvű legyen.
* Első személyben, egyes számban írj.
* Úgy szólaljon meg, mintha én, a projekt gazdája írná.
* A hang legyen közvetlen, tiszta és érthető.
* Ne legyen marketinges.
* Ne legyen túl technikai.
* Ne legyen commit-log.
* Ne legyen túl elvont vagy „AI-s”.

---

### Stílus

Kerüld:

* elvont megfogalmazásokat
* üres mondatokat
* túlmagyarázást

Törekedj:

* konkrét, természetes nyelvre
* rövid, tiszta mondatokra

---

### Perspektíva

* A szöveg tükrözze a döntéseimet és a gondolkodásomat.
* Nem kell azt állítani, hogy minden kódot én írtam.
* Viszont jelenjen meg, hogy én alakítottam az irányt.

---

### Tartalmi fókusz

A bejegyzés válaszoljon:

* mi változott
* miért
* mi lett tisztább vagy jobb
* mi maradt nyitva
* mi a következő lépés

---

### Steps (mini timeline)

* Emelj ki 2–5 fontos állomást a beszélgetésből
* Ezek legyenek:

  * döntések
  * irányváltások
  * strukturális lépések
* NE teljes log legyen
* NE minden apró lépés

---

### Kontextus

* A teljes beszélgetést vedd figyelembe
* Ne csak az utolsó üzenetet
* Sűrítsd össze egy koherens történetté

---

### Kimenet

KIZÁRÓLAG egy JSON objektum:

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

"featured": false,

"steps": [
{
"label": "string",
"text": "string"
}
]
}

---

### Mezőszabályok

* id: rövid slug
* title: természetes, lehet karakteresebb
* summary: 1–2 mondat
* body: 3–6 mondat
* nextStep: 1 konkrét mondat
* steps: 2–5 elem

---

### Fontos

* Ne írj semmit a JSON elé vagy után
* Egyetlen bejegyzést készíts
* Ne generálj felesleges mezőket

---
