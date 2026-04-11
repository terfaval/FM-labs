export type FlowBlock = {
  overline: string;
  title: string;
  body: string;
  caption: string;
};

export type IconItem = {
  icon: string;
  title: string;
  text: string;
};

export type NextCard = {
  icon: string;
  title: string;
  text: string;
};

export type LumiraModalContent = {
  hero: { eyebrow: string; body: string; cta: string };
  kiindulo: { title: string; body: string };
  flow: {
    rogzites: FlowBlock;
    keret: FlowBlock;
    feldolgozas: FlowBlock;
    visszateres: FlowBlock;
    elokeszites: FlowBlock;
  };
  mood: { first: string; second: string };
  principles: { title: string; intro: string; items: IconItem[] };
  nextDirections: { title: string; intro: string; cards: NextCard[] };
  closing: { body: string };
};
