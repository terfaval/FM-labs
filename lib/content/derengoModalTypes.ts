export type DerengoHeroContent = {
  title: string;
  subtitle: string;
  text: string;
  media: string[];
};

export type DerengoCarouselItem = {
  icon: string;
  title: string;
  text: string;
};

export type DerengoFlowItem = {
  title: string;
  text: string;
  media: string;
};

export type DerengoSensoryItem = {
  icon: string;
  text: string;
};

export type DerengoCommunityItem = {
  title: string;
  text: string;
  media: string;
};

export type DerengoFutureItem = {
  title: string;
  text: string;
};

export type DerengoInspirationItem = {
  id: string;
  title: string;
  location: string;
  image: string;
  shortLabel: string;
  description: string;
  linkUrl: string;
};

export type DerengoModalContent = {
  hero: DerengoHeroContent;
  scene1: { content: string };
  scene2: {
    leftContent: string;
    rightCarousel: DerengoCarouselItem[];
  };
  scene3: { content: string };
  scene4: { items: DerengoFlowItem[] };
  scene5: {
    introText: string;
    items: DerengoSensoryItem[];
  };
  scene6: {
    introText: string;
    items: DerengoCommunityItem[];
  };
  scene7: { content: string };
  scene8: { items: DerengoFutureItem[] };
  scene9: { items: DerengoInspirationItem[] };
  scene10: { content: string };
};
