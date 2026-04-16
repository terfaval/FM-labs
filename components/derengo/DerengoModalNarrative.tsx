"use client";

import type { CSSProperties, TouchEvent } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff, X } from "lucide-react";
import { ProjectFeedbackForm } from "@/components/ProjectFeedbackForm";
import { DerengoSectionBackground } from "@/components/derengo/DerengoSectionBackground";
import type { DerengoModalModel } from "@/lib/content/derengoModalModel";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || isVisible) {
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [isVisible]);

  return { ref, isVisible };
}

function splitParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}

function RevealTextBlock({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  const { ref, isVisible } = useReveal<HTMLElement>();
  const paragraphs = splitParagraphs(content);

  return (
    <section
      ref={ref}
      className={cx(
        "derengo-modal__centered",
        "derengo-modal__reveal",
        className,
        isVisible && "is-visible"
      )}
    >
      {paragraphs.map((paragraph, index) => (
        <p
          key={`${paragraph}-${index}`}
          className="derengo-modal__reveal-line"
          style={{ "--reveal-delay": `${index * 140}ms` } as CSSProperties}
        >
          {paragraph}
        </p>
      ))}
    </section>
  );
}

const DERENGO_ICON_ASSETS: Record<string, string> = {
  "1_1_erzekek": "/derengo/icons/1-1-erzekek.PNG",
  "1_2_csend": "/derengo/icons/1-2-csend.PNG",
  "1_3_muveszet": "/derengo/icons/1-3-muveszet.PNG",
  "1_4_kapcsolat": "/derengo/icons/1-4-kapcsolat.PNG",
  "3_1_zene": "/derengo/icons/3-1-zene.PNG",
  "3_2_feny": "/derengo/icons/3-2-feny.PNG",
  "3_3_alkotasok": "/derengo/icons/3-3-alkotasok.PNG",
  "3_4_mozgas": "/derengo/icons/3-4-mozgas.PNG",
  "3_5_erzekek": "/derengo/icons/3-5-erzekek.PNG",
  "4_1_szervezo": "/derengo/icons/4-1-szervezo.PNG",
  "4_2_alkoto": "/derengo/icons/4-2-alkoto.PNG",
  "4_3_latogato": "/derengo/icons/4-3-latogato.PNG",
};

const DERENGO_FUTURE_ICON_ASSETS: Record<string, string> = {
  "Felfedező hétvégék": "/derengo/icons/5-1-felfedezes.PNG",
  "Közösségi erdőtér": "/derengo/icons/5-2-muhely.PNG",
  "Tanuló közösség": "/derengo/icons/5-3-kozosseg.PNG",
};

const INSPIRATION_GALLERIES: Record<string, string[]> = {
  "arte-sella": [
    "/derengo/inspirations/artesella.jpg",
    "/derengo/inspirations/artesella_1.jpeg",
    "/derengo/inspirations/artesella_2.jpg",
    "/derengo/inspirations/artesella_3.PNG",
    "/derengo/inspirations/artesella_4.PNG",
    "/derengo/inspirations/artesella_5.PNG",
    "/derengo/inspirations/artesella_6.PNG",
  ],
  "echigo-tsumari": [
    "/derengo/inspirations/echigo.jpg",
    "/derengo/inspirations/echigo_1.JPG",
    "/derengo/inspirations/echigo_2.JPG",
    "/derengo/inspirations/echigo_3.JPG",
  ],
  "forest-of-dean": [
    "/derengo/inspirations/forest of dean.jpg",
    "/derengo/inspirations/forest of dean_1.jpeg",
    "/derengo/inspirations/forest of dean_2.jpeg",
    "/derengo/inspirations/forest of dean _3.jpg",
  ],
  "the-borderland": [
    "/derengo/inspirations/borderland.PNG",
    "/derengo/inspirations/borderland_2.PNG",
    "/derengo/inspirations/borderland_3.PNG",
    "/derengo/inspirations/borderland_4.PNG",
  ],
  fruga: [
    "/derengo/inspirations/fruga.jpg",
    "/derengo/inspirations/fruga_1.jpg",
    "/derengo/inspirations/fruga_2.jpeg",
  ],
  irwell: [
    "/derengo/inspirations/irwell.jpg",
    "/derengo/inspirations/irwell_2.jpg",
    "/derengo/inspirations/irwell_3.JPG",
    "/derengo/inspirations/irwell_4.JPG",
  ],
  skovsnogen: [
    "/derengo/inspirations/skovsnogen.jpg",
    "/derengo/inspirations/skovsnogen_2.PNG",
    "/derengo/inspirations/skovsnogen_3.JPG",
  ],
  "oku-noto": [
    "/derengo/inspirations/oku-notu.PNG",
    "/derengo/inspirations/oku-notu_1.JPG",
    "/derengo/inspirations/oku-notu_2.JPG",
    "/derengo/inspirations/oku-notu_3.JPG",
  ],
};

function inspirationSources(id: string, fallbackImage: string) {
  const sources = INSPIRATION_GALLERIES[id.trim()] ?? [];
  if (sources.length > 0) {
    return sources.map((src) => encodeURI(src));
  }

  return [encodeURI(`/derengo/inspirations/${fallbackImage}`)];
}

export function DerengoModalNarrative({
  model,
  onRequestClose,
}: {
  model: DerengoModalModel;
  onRequestClose?: () => void;
}) {
  const contactIntro =
    "A Derengő egy ideje formálódó ötlet, ami egy visszatérő élményből indult, és most kezd körvonalazódni. Egyelőre nem egy kész struktúra, inkább egy irány, amihez különböző módokon lehet kapcsolódni.\n\nHa érdekes számodra, és szívesen gondolkodnál róla vagy részt vennél benne valahogy, írj nyugodtan.";
  const formEndpoint = process.env.NEXT_PUBLIC_CONTACT_FORM_ENDPOINT ?? "";
  const [activeSlide, setActiveSlide] = useState(0);
  const [isCarouselVisible, setIsCarouselVisible] = useState(true);
  const [activeInspiration, setActiveInspiration] = useState<string | null>(null);
  const [activePopupImageIndex, setActivePopupImageIndex] = useState(0);
  const [popupBaseSrc, setPopupBaseSrc] = useState<string>("");
  const [popupOverlaySrc, setPopupOverlaySrc] = useState<string>("");
  const [isPopupOverlayVisible, setIsPopupOverlayVisible] = useState(false);
  const [brokenImages, setBrokenImages] = useState<Record<string, true>>({});
  const touchStartX = useRef<number | null>(null);
  const transitionTimeoutRef = useRef<number | null>(null);
  const popupTransitionTimeoutRef = useRef<number | null>(null);

  const carouselLength = model.scene2.rightCarousel.length;
  const activeCarouselItem =
    model.scene2.rightCarousel[activeSlide] ?? model.scene2.rightCarousel[0];
  const inspirationItems = useMemo(
    () => model.scene9.items.filter((item) => item.id !== "darmstadt"),
    [model.scene9.items]
  );
  const activeInspirationItem = useMemo(
    () => inspirationItems.find((item) => item.id === activeInspiration) ?? null,
    [activeInspiration, inspirationItems]
  );
  const activeInspirationSources = activeInspirationItem
    ? inspirationSources(activeInspirationItem.id, activeInspirationItem.image)
    : [];

  useEffect(() => {
    if (!activeInspirationItem) {
      setPopupBaseSrc("");
      setPopupOverlaySrc("");
      setIsPopupOverlayVisible(false);
      return;
    }

    const first = activeInspirationSources[0] ?? "";
    setPopupBaseSrc(first);
    setPopupOverlaySrc("");
    setIsPopupOverlayVisible(false);
    setActivePopupImageIndex(0);
  }, [activeInspirationItem?.id]);

  const queuePopupImage = (nextIndex: number) => {
    if (activeInspirationSources.length < 2 || nextIndex === activePopupImageIndex) {
      return;
    }

    if (popupTransitionTimeoutRef.current) {
      window.clearTimeout(popupTransitionTimeoutRef.current);
    }

    const nextSrc = activeInspirationSources[nextIndex] ?? "";
    if (!nextSrc) {
      return;
    }

    setPopupOverlaySrc(nextSrc);
    // Mount overlay hidden first, then fade it in on the next frame.
    setIsPopupOverlayVisible(false);
    window.requestAnimationFrame(() => setIsPopupOverlayVisible(true));
    setActivePopupImageIndex(nextIndex);

    popupTransitionTimeoutRef.current = window.setTimeout(() => {
      setPopupBaseSrc(nextSrc);
      setPopupOverlaySrc("");
      setIsPopupOverlayVisible(false);
      popupTransitionTimeoutRef.current = null;
    }, 650);
  };

  const goToPreviousPopupImage = () => {
    queuePopupImage(
      (activePopupImageIndex - 1 + activeInspirationSources.length) %
        activeInspirationSources.length
    );
  };

  const goToNextPopupImage = () => {
    queuePopupImage((activePopupImageIndex + 1) % activeInspirationSources.length);
  };

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        window.clearTimeout(transitionTimeoutRef.current);
      }
      if (popupTransitionTimeoutRef.current) {
        window.clearTimeout(popupTransitionTimeoutRef.current);
      }
    };
  }, []);

  const queueSlide = (nextIndex: number) => {
    if (carouselLength < 2 || nextIndex === activeSlide) {
      return;
    }

    if (transitionTimeoutRef.current) {
      window.clearTimeout(transitionTimeoutRef.current);
    }

    setIsCarouselVisible(false);
    transitionTimeoutRef.current = window.setTimeout(() => {
      setActiveSlide(nextIndex);
      setIsCarouselVisible(true);
      transitionTimeoutRef.current = null;
    }, 260);
  };

  const goToPreviousSlide = () => {
    queueSlide((activeSlide - 1 + carouselLength) % carouselLength);
  };

  const goToNextSlide = () => {
    queueSlide((activeSlide + 1) % carouselLength);
  };

  useEffect(() => {
    if (carouselLength < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      queueSlide((activeSlide + 1) % carouselLength);
    }, 9000);

    return () => window.clearInterval(timer);
  }, [activeSlide, carouselLength]);

  useEffect(() => {
    if (!activeInspirationItem || activeInspirationSources.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      if (popupTransitionTimeoutRef.current) {
        return;
      }

      queuePopupImage((activePopupImageIndex + 1) % activeInspirationSources.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [activeInspirationItem, activeInspirationSources.length, activePopupImageIndex]);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key !== "Escape") {
        return;
      }

      if (activeInspirationItem) {
        if (popupTransitionTimeoutRef.current) {
          window.clearTimeout(popupTransitionTimeoutRef.current);
          popupTransitionTimeoutRef.current = null;
        }
        setActiveInspiration(null);
        setActivePopupImageIndex(0);
        setPopupBaseSrc("");
        setPopupOverlaySrc("");
        setIsPopupOverlayVisible(false);
        return;
      }

      onRequestClose?.();
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeInspirationItem, onRequestClose]);

  const handleTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    touchStartX.current = event.changedTouches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    const startX = touchStartX.current;
    const endX = event.changedTouches[0]?.clientX ?? null;
    touchStartX.current = null;

    if (startX === null || endX === null) {
      return;
    }

    const delta = endX - startX;
    if (Math.abs(delta) < 36) {
      return;
    }

    if (delta < 0) {
      goToNextSlide();
      return;
    }

    goToPreviousSlide();
  };

  const markImageBroken = (src: string) => {
    setBrokenImages((current) => {
      if (current[src]) {
        return current;
      }
      return { ...current, [src]: true };
    });
  };

  return (
    <div className="derengo-modal">
      <DerengoSectionBackground
        image="/derengo/backgrounds/1.PNG"
        clipVariant="a"
        overlayStrength={0.26}
        imagePosition="center 32%"
        imageZoom={1.04}
        className="derengo-panel--hero"
        bgShiftY={0}
      >
        <section className="lumira-modal__brand derengo-modal__brand">
          <img src="/derengo/logo.svg" alt="Derengő logo" />
          <h1 className="lumira-modal__brand-name">{model.project.title}</h1>
          <div className="lumira-modal__brand-tagline">{model.hero.subtitle}</div>
        </section>

      </DerengoSectionBackground>

      <DerengoSectionBackground
        image="/derengo/backgrounds/2.PNG"
        clipVariant="b"
        overlayStrength={0.28}
        overlap
      >
        <RevealTextBlock content={model.scene1.content} />
      </DerengoSectionBackground>

      <DerengoSectionBackground
        image="/derengo/backgrounds/3.PNG"
        clipVariant="c"
        overlayStrength={0.3}
        overlap
      >
        <section className="derengo-modal__scene derengo-modal__scene--split">
          <div className="derengo-modal__scene-copy">
            {splitParagraphs(model.scene2.leftContent).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <div
            className="derengo-modal__carousel"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              className="derengo-modal__carousel-button"
              onClick={goToPreviousSlide}
              aria-label="Előző"
            >
              <ChevronLeft />
            </button>

            {activeCarouselItem ? (
              <article
                className={cx(
                  "derengo-modal__carousel-card",
                  isCarouselVisible ? "is-visible" : "is-hidden"
                )}
                aria-live="polite"
              >
                <div className="derengo-modal__carousel-icon">
                  <img
                    src={DERENGO_ICON_ASSETS[activeCarouselItem.icon]}
                    alt=""
                    aria-hidden="true"
                  />
                </div>
                <h3>{activeCarouselItem.title}</h3>
                <p>{activeCarouselItem.text}</p>
              </article>
            ) : null}

            <button
              type="button"
              className="derengo-modal__carousel-button"
              onClick={goToNextSlide}
              aria-label="Következő"
            >
              <ChevronRight />
            </button>
          </div>
        </section>

      </DerengoSectionBackground>

      <DerengoSectionBackground
        image="/derengo/backgrounds/4.PNG"
        clipVariant="d"
        overlayStrength={0.28}
        overlap
      >
        <RevealTextBlock content={model.scene3.content} />
      </DerengoSectionBackground>

      <DerengoSectionBackground
        image={null}
        clipVariant="a"
        overlayStrength={0}
        overlap
      >
        <section className="derengo-modal__flow">
          {model.flowSections.map((section) => (
            <article
              key={section.title}
              className={cx(
                "derengo-modal__flow-item",
                section.imageSide === "right" && "derengo-modal__flow-item--image-right"
              )}
            >
              <div className="derengo-modal__flow-visual">
                <img src={section.imageSrc} alt={section.imageAlt} />
              </div>
              <div className="derengo-modal__flow-copy">
                <h3>{section.title}</h3>
                <p>{section.text}</p>
              </div>
            </article>
          ))}
        </section>
      </DerengoSectionBackground>

      <DerengoSectionBackground
        image="/derengo/backgrounds/10.PNG"
        clipVariant="b"
        overlayStrength={0.28}
        overlap
        imagePosition="center 62%"
        bgShiftY={160}
      >
        <section className="derengo-modal__scene derengo-modal__scene--centered">
          <div className="derengo-modal__centered derengo-modal__mood">
            {splitParagraphs(model.scene5.introText).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="derengo-modal__sensory-grid">
            {model.scene5.items.map((item, index) => (
              <article key={item.icon} className="derengo-modal__sensory-card">
                <img
                  src={DERENGO_ICON_ASSETS[item.icon]}
                  alt=""
                  aria-hidden="true"
                  className="derengo-modal__plain-icon"
                />
                <p
                  className={cx(
                    "derengo-modal__sensory-text",
                    index >= 3 && "derengo-modal__sensory-text--second-row"
                  )}
                >
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </section>
      </DerengoSectionBackground>

      <DerengoSectionBackground
        image="/derengo/backgrounds/5.PNG"
        clipVariant="c"
        overlayStrength={0.3}
        overlap
        imagePosition="center 62%"
        bgShiftY={160}
      >
        <section className="derengo-modal__scene derengo-modal__scene--centered">
          <div className="derengo-modal__centered">
            <p>{model.scene6.introText}</p>
          </div>
          <div className="derengo-modal__community-grid">
            {model.scene6.items.map((item) => (
              <article key={item.title} className="derengo-modal__community-card">
                <div className="derengo-modal__community-icon">
                  <img
                    src={DERENGO_ICON_ASSETS[item.media]}
                    alt=""
                    aria-hidden="true"
                    className="derengo-modal__plain-icon"
                  />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </section>
      </DerengoSectionBackground>

      <DerengoSectionBackground
        image="/derengo/backgrounds/9.PNG"
        clipVariant="d"
        overlayStrength={0.28}
        overlap
        imagePosition="center 62%"
        bgShiftY={160}
      >
        <section className="derengo-modal__centered derengo-modal__mood">
          {splitParagraphs(model.scene7.content).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      </DerengoSectionBackground>

      <DerengoSectionBackground
        image="/derengo/backgrounds/7.PNG"
        clipVariant="a"
        overlayStrength={0.28}
        overlap
        imagePosition="center 62%"
        bgShiftY={160}
      >
        <section className="lumira-modal__next derengo-modal__future">
          <h3>Jövő</h3>
          <div className="lumira-modal__next-cards">
            {model.scene8.items.map((item) => (
              <div
                key={item.title}
                className="lumira-modal__next-card derengo-modal__future-card"
              >
                {DERENGO_FUTURE_ICON_ASSETS[item.title] ? (
                  <img
                    src={DERENGO_FUTURE_ICON_ASSETS[item.title]}
                    alt=""
                    aria-hidden="true"
                    className="derengo-modal__plain-icon derengo-modal__future-icon"
                  />
                ) : null}
                <div className="lumira-modal__icon-title">{item.title}</div>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </section>
      </DerengoSectionBackground>

      <DerengoSectionBackground
        image="/derengo/backgrounds/11.PNG"
        clipVariant="b"
        overlayStrength={0.28}
        overlap
        imagePosition="center 62%"
        bgShiftY={140}
        className="derengo-panel--inspirations"
      >
        <section className="derengo-modal__scene derengo-modal__scene--centered">
          <div className="derengo-modal__centered">
            <h3>Inspirációk</h3>
          </div>
          <div className="derengo-modal__inspiration-grid">
            {inspirationItems.map((item) => {
              const sources = inspirationSources(item.id, item.image);
              const coverImage = sources[0] ?? "";
              const isBroken = brokenImages[coverImage];

              return (
                <button
                  key={item.id}
                  type="button"
                  className="derengo-modal__inspiration-card"
                  onClick={() => {
                    setActiveInspiration(item.id);
                    setActivePopupImageIndex(0);
                    setPopupBaseSrc(sources[0] ?? "");
                    setPopupOverlaySrc("");
                    setIsPopupOverlayVisible(false);
                  }}
                >
                  <div className="derengo-modal__inspiration-image">
                    {coverImage && !isBroken ? (
                      <img
                        src={coverImage}
                        alt=""
                        onError={() => markImageBroken(coverImage)}
                      />
                    ) : (
                      <div className="derengo-modal__image-fallback" aria-hidden="true">
                        <ImageOff />
                      </div>
                    )}
                  </div>
                  <div className="derengo-modal__inspiration-copy">
                    <h3>{item.title}</h3>
                    {item.shortLabel ? <p>{item.shortLabel}</p> : null}
                  </div>
                </button>
              );
            })}
          </div>
        </section>

      </DerengoSectionBackground>

      <DerengoSectionBackground
        image="/derengo/backgrounds/9.PNG"
        clipVariant="c"
        overlayStrength={0.28}
        overlap
        imagePosition="center 62%"
        bgShiftY={160}
      >
        <section className="derengo-modal__centered derengo-modal__closing derengo-modal__mood">
          {splitParagraphs(model.scene10.content)
            .slice(0, 1)
            .map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
        </section>
      </DerengoSectionBackground>

      <section className="derengo-modal__contact">
        <div className="derengo-modal__centered">
          {contactIntro
            ? splitParagraphs(contactIntro).map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))
            : null}
        </div>
        <ProjectFeedbackForm
          projectTitle={model.project.title}
          formEndpoint={formEndpoint}
          variant="inverse"
          alwaysOpen
          introText=""
        />
      </section>

      {activeInspirationItem ? (
        <div
          className="derengo-modal__popup-backdrop"
          onClick={() => {
            if (popupTransitionTimeoutRef.current) {
              window.clearTimeout(popupTransitionTimeoutRef.current);
              popupTransitionTimeoutRef.current = null;
            }
            setActiveInspiration(null);
            setActivePopupImageIndex(0);
            setPopupBaseSrc("");
            setPopupOverlaySrc("");
            setIsPopupOverlayVisible(false);
          }}
          role="presentation"
        >
          <div
            className="derengo-modal__popup"
            role="dialog"
            aria-modal="true"
            aria-label={activeInspirationItem.title}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="derengo-modal__popup-close"
              aria-label="Bezárás"
              onClick={() => {
                setActiveInspiration(null);
                setActivePopupImageIndex(0);
                if (popupTransitionTimeoutRef.current) {
                  window.clearTimeout(popupTransitionTimeoutRef.current);
                  popupTransitionTimeoutRef.current = null;
                }
                setPopupBaseSrc("");
                setPopupOverlaySrc("");
                setIsPopupOverlayVisible(false);
              }}
            >
              <X />
            </button>

            <div className="derengo-modal__popup-image">
              {popupBaseSrc && !brokenImages[popupBaseSrc] ? (
                <>
                  <img
                    className="derengo-modal__popup-image-asset derengo-modal__popup-image-asset--base"
                    src={popupBaseSrc}
                    alt={activeInspirationItem.title}
                    onError={() => markImageBroken(popupBaseSrc)}
                  />
                  {popupOverlaySrc && !brokenImages[popupOverlaySrc] ? (
                    <img
                      className={cx(
                        "derengo-modal__popup-image-asset",
                        "derengo-modal__popup-image-asset--overlay",
                        isPopupOverlayVisible ? "is-visible" : "is-hidden"
                      )}
                      src={popupOverlaySrc}
                      alt=""
                      aria-hidden="true"
                      onError={() => markImageBroken(popupOverlaySrc)}
                    />
                  ) : null}
                </>
              ) : (
                <div className="derengo-modal__image-fallback derengo-modal__image-fallback--large">
                  <ImageOff />
                </div>
              )}

              {false ? (
                <div className="derengo-modal__popup-thumbnails">
                  {activeInspirationSources.map((src, index) => (
                    <button
                      key={src}
                      type="button"
                      className={cx(
                        "derengo-modal__thumbnail",
                        activePopupImageIndex === index && "is-active"
                      )}
                      aria-label={`Kép ${index + 1}`}
                      onClick={() => setActivePopupImageIndex(index)}
                    >
                      {brokenImages[src] ? (
                        <div className="derengo-modal__thumbnail-fallback" aria-hidden="true">
                          <ImageOff />
                        </div>
                      ) : (
                        <img
                          src={src}
                          alt=""
                          onError={() => markImageBroken(src)}
                        />
                      )}
                    </button>
                  ))}
                </div>
              ) : null}

              {activeInspirationSources.length > 1 ? (
                <>
                  <button
                    type="button"
                    className="derengo-modal__popup-nav derengo-modal__popup-nav--prev"
                    aria-label="Előző kép"
                    onClick={goToPreviousPopupImage}
                  >
                    <ChevronLeft />
                  </button>
                  <button
                    type="button"
                    className="derengo-modal__popup-nav derengo-modal__popup-nav--next"
                    aria-label="Következő kép"
                    onClick={goToNextPopupImage}
                  >
                    <ChevronRight />
                  </button>
                </>
              ) : null}
            </div>

            <div className="derengo-modal__popup-copy">
              <div className="derengo-modal__popup-location">
                {activeInspirationItem.location}
              </div>
              <h3>{activeInspirationItem.title}</h3>
              <p>{activeInspirationItem.description}</p>
              <a
                className="project-modal__cta derengo-modal__popup-link"
                href={activeInspirationItem.linkUrl}
                target="_blank"
                rel="noreferrer"
              >
                Projekt megtekintése
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
