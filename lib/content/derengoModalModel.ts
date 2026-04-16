import type {
  DerengoFutureItem,
  DerengoInspirationItem,
  DerengoModalContent,
} from "./derengoModalTypes";
import type { Project } from "./types";

const FLOW_IMAGE_MAP: Record<string, string> = {
  "2_1_erkezes": "/derengo/icons/2-1-ekrezes.PNG",
  "2_2_installaciok": "/derengo/icons/2-2-installaciok.PNG",
  "2_3_performansz": "/derengo/icons/2-3-performansz.PNG",
  "2_4_szabad": "/derengo/icons/2-4-szabad.PNG",
};

const SENSORY_TITLE_MAP: Record<string, string> = {
  "3_1_zene": "Hang",
  "3_2_feny": "Fény",
  "3_3_alkotasok": "Anyag",
  "3_4_mozgas": "Jelenlét",
  "3_5_erzekek": "Atmoszféra",
};

export type DerengoFlowSection = {
  title: string;
  text: string;
  imageSrc: string;
  imageAlt: string;
  imageSide: "left" | "right";
};

export type DerengoNarrativeCard = {
  title: string;
  text: string;
};

export type DerengoSensoryCard = {
  icon: string;
  title: string;
  text: string;
};

export type DerengoModalModel = {
  project: Project;
  hero: {
    title: string;
    subtitle: string;
    text: string;
    backgroundSrc: string;
  };
  scene1: { content: string };
  scene2: DerengoModalContent["scene2"];
  scene3: { content: string };
  flowSections: DerengoFlowSection[];
  scene5: {
    introText: string;
    items: DerengoSensoryCard[];
  };
  scene6: DerengoModalContent["scene6"];
  scene7: { content: string };
  scene8: { items: DerengoFutureItem[] };
  scene9: { items: DerengoInspirationItem[] };
  scene10: { content: string };
};

function singleLine(text: string) {
  return text.replace(/\s+/g, " ").trim();
}

export function buildDerengoModalModel(
  content: DerengoModalContent
): DerengoModalModel {
  const cardText = singleLine(content.hero.text);
  const flowSections: DerengoFlowSection[] = content.scene4.items.map(
    (item, index) => ({
      title: item.title,
      text: item.text,
      imageSrc: FLOW_IMAGE_MAP[item.media] ?? "/derengo/backgrounds/card_background.PNG",
      imageAlt: item.title,
      imageSide: index % 2 === 0 ? "right" : "left",
    })
  );

  return {
    project: {
      slug: "derengo",
      title: content.hero.title,
      hero: cardText,
      card: cardText,
      what: "",
      use: "",
      features: [],
      unique: "",
      status: "",
      direction: content.scene8.items.map((item) => item.title),
    },
    hero: {
      title: content.hero.title,
      subtitle: content.hero.subtitle,
      text: cardText,
      backgroundSrc: "/derengo/backgrounds/card_background.PNG",
    },
    scene1: content.scene1,
    scene2: content.scene2,
    scene3: content.scene3,
    flowSections,
    scene5: {
      introText: content.scene5.introText,
      items: content.scene5.items.map((item) => ({
        icon: item.icon,
        title: SENSORY_TITLE_MAP[item.icon] ?? "",
        text: item.text,
      })),
    },
    scene6: content.scene6,
    scene7: content.scene7,
    scene8: content.scene8,
    scene9: content.scene9,
    scene10: content.scene10,
  };
}
