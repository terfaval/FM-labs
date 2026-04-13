# Kincstartó Modal Background + Icons + Card Ratios Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set Kincstartó modal background image, add section icons, and match Kincstartó card proportions to Lumira.

**Architecture:** Update `ProjectGallery` modal background for Kincstartó, add icon rendering in Kincstartó modal component, and apply a Kincstartó card class for split grid proportions.

**Tech Stack:** Next.js, React, CSS

---

### Task 1: Kincstartó modal background image

**Files:**
- Modify: `components/ProjectGallery.tsx`

- [ ] **Step 1: Apply modal background for Kincstartó**

```tsx
const kincstartoStyle = isKincstarto
  ? ({
      ...style,
      "--card-bg": 'url("/kincstarto/modal_background.png")',
    } as CSSProperties)
  : style;

const modalClassName = `project-modal${
  isLumira ? " project-modal--lumira" : ""
}${isKincstarto ? " project-modal--kincstarto" : ""}`;

const modalStyle = isLumira ? lumiraStyle : isKincstarto ? kincstartoStyle : style;
```

- [ ] **Step 2: Commit**

```bash
git add components/ProjectGallery.tsx
git commit -m "feat: set kincstarto modal background"
```

---

### Task 2: Section icons in split blocks

**Files:**
- Modify: `components/kincstarto/KincstartoModalNarrative.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add icon mapping and render above titles**

```tsx
const sectionIcons: Record<string, string> = {
  "Könyvtár": "/kincstarto/icons/library.svg",
  "Meditáció": "/kincstarto/icons/meditations.svg",
  "Jóga": "/kincstarto/icons/yoga.svg",
};

const iconSrc = sectionIcons[section.title];
{iconSrc ? (
  <img
    className="kincstarto-modal__section-icon"
    src={iconSrc}
    alt=""
    aria-hidden="true"
  />
) : null}
```

- [ ] **Step 2: Add icon styling**

```css
.kincstarto-modal__section-icon {
  width: 28px;
  height: 28px;
  margin-bottom: 10px;
}
```

- [ ] **Step 3: Commit**

```bash
git add components/kincstarto/KincstartoModalNarrative.tsx app/globals.css
git commit -m "feat: add kincstarto section icons"
```

---

### Task 3: Match Kincstartó card proportions to Lumira

**Files:**
- Modify: `components/ProjectCard.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Add class for Kincstartó card**

```tsx
className={`project-card ... ${project.slug === "kincstarto" ? " project-card--kincstarto" : ""}`}
```

- [ ] **Step 2: Ensure split proportions match Lumira**

```css
.project-card--kincstarto .project-card__split {
  grid-template-columns: minmax(220px, 320px) minmax(0, 1fr);
}
```

- [ ] **Step 3: Commit**

```bash
git add components/ProjectCard.tsx app/globals.css
git commit -m "feat: align kincstarto card proportions"
```

---

### Task 4: Check status

- [ ] **Step 1: Check git status**

Run: `git status -sb`
Expected: clean (except user-edited content file if present)

---

Plan complete.
