import { LumiraModalContent } from "./lumiraModalTypes";

export type ImageSide = "left" | "right";

export type FlowSectionModel = {
  overline: string;
  title: string;
  body: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
  imageSide: ImageSide;
};

export type LumiraModalModel = {
  brand: { logo: string; name: string; tagline: string };
  kiindulo: { title: string; body: string };
  mood: { first: string; second: string };
  flowSections: FlowSectionModel[];
  principles: LumiraModalContent["principles"];
  nextDirections: LumiraModalContent["nextDirections"];
  closing: { body: string };
};

export function buildLumiraModalModel(content: LumiraModalContent): LumiraModalModel {
  const flowSections: FlowSectionModel[] = [
    {
      ...content.flow.rogzites,
      imageSrc: "/lumira/screens/raw input.PNG",
      imageAlt: "Rögzítés képernyõ",
      imageSide: "right",
    },
    {
      ...content.flow.keret,
      imageSrc: "/lumira/screens/direction.PNG",
      imageAlt: "Keret és irány képernyõ",
      imageSide: "left",
    },
    {
      ...content.flow.feldolgozas,
      imageSrc: "/lumira/screens/question.PNG",
      imageAlt: "Feldolgozás képernyõ",
      imageSide: "right",
    },
    {
      ...content.flow.visszateres,
      imageSrc: "/lumira/screens/dream list.PNG",
      imageAlt: "Visszatérés képernyõ",
      imageSide: "left",
    },
    {
      ...content.flow.elokeszites,
      imageSrc: "/lumira/screens/exercises.PNG",
      imageAlt: "Elõkészítés képernyõ",
      imageSide: "right",
    },
  ];

  return {
    brand: {
      logo: "/lumira/logo.svg",
      name: "lumira",
      tagline: content.hero.eyebrow,
    },
    kiindulo: content.kiindulo,
    mood: content.mood,
    flowSections,
    principles: content.principles,
    nextDirections: content.nextDirections,
    closing: content.closing,
  };
}
