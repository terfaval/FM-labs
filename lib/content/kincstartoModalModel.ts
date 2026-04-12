import { KincstartoModalContent } from "./kincstartoModalTypes";

export type KincstartoImageSide = "left" | "right";

export type KincstartoFlowSection = {
  title: string;
  body: string;
  imageSrcs: string[];
  imageAlt: string;
  imageSide: KincstartoImageSide;
};

export type KincstartoModalModel = {
  brand: { logo: string; name: string; tagline: string };
  intro: { body: string };
  principles: KincstartoModalContent["principles"];
  flowSections: KincstartoFlowSection[];
  mood: { text: string };
  nextDirections: KincstartoModalContent["nextDirections"];
  closing: { body: string };
};

export function buildKincstartoModalModel(content: KincstartoModalContent): KincstartoModalModel {
  const flowSections: KincstartoFlowSection[] = [
    {
      ...content.books,
      imageSrcs: [
        "/kincstarto/screens/konyvtar_1.PNG",
        "/kincstarto/screens/konyvtar_2.PNG",
      ],
      imageAlt: "Könyvtár képernyő",
      imageSide: "right",
    },
    {
      ...content.meditation,
      imageSrcs: [
        "/kincstarto/screens/meditacio_1.PNG",
        "/kincstarto/screens/meditacio_2.PNG",
      ],
      imageAlt: "Meditáció képernyő",
      imageSide: "left",
    },
    {
      ...content.yoga,
      imageSrcs: [
        "/kincstarto/screens/joga_1.PNG",
        "/kincstarto/screens/joga_2.PNG",
      ],
      imageAlt: "Jóga képernyő",
      imageSide: "right",
    },
  ];

  return {
    brand: {
      logo: "/kincstarto/logo.svg",
      name: "kincstartó",
      tagline: content.brand.tagline,
    },
    intro: content.intro,
    principles: content.principles,
    flowSections,
    mood: content.mood,
    nextDirections: content.nextDirections,
    closing: content.closing,
  };
}
