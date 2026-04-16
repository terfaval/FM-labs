"use client";

import type { CSSProperties, ReactNode } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export type DerengoClipVariant = "a" | "b" | "c" | "d";

export function DerengoSectionBackground({
  image,
  clipVariant,
  overlayStrength = 0.55,
  overlayColor = "rgba(6, 10, 7, 1)",
  imagePosition = "center",
  imageZoom = 1.06,
  bgShiftY = 0,
  overlap = false,
  className,
  children,
}: {
  image?: string | null;
  clipVariant: DerengoClipVariant;
  overlayStrength?: number;
  overlayColor?: string;
  imagePosition?: string;
  imageZoom?: number;
  bgShiftY?: number;
  overlap?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      className={cx(
        "derengo-panel",
        `derengo-panel--clip-${clipVariant}`,
        overlap && "derengo-panel--overlap",
        className
      )}
      style={
        {
          "--derengo-panel-image": image ? `url("${image}")` : "none",
          "--derengo-panel-overlay-strength": overlayStrength,
          "--derengo-panel-overlay-color": overlayColor,
          "--derengo-panel-image-position": imagePosition,
          "--derengo-panel-image-zoom": imageZoom,
          "--derengo-panel-bg-shift-y": `${bgShiftY}px`,
        } as CSSProperties
      }
    >
      <div className="derengo-panel__bg" aria-hidden="true">
        {image ? (
          <img
            className="derengo-panel__bg-image"
            src={image}
            alt=""
            aria-hidden="true"
          />
        ) : null}
      </div>
      <div className="derengo-panel__overlay" aria-hidden="true" />
      <div className="derengo-panel__content">{children}</div>
    </section>
  );
}
