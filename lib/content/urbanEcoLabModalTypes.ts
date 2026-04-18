export type UrbanEcoLabPrincipleItem = {
  title: string;
  text: string;
  media: string;
};

export type UrbanEcoLabLearningLogicItem = {
  title: string;
  text: string;
  media: string;
};

export type UrbanEcoLabCompetencyItem = {
  title: string;
  text: string;
  media: string;
};

export type UrbanEcoLabAgeGroupItem = {
  title: string;
  text: string;
  details: string;
};

export type UrbanEcoLabModuleItem = {
  title: string;
  text: string;
  media: string;
};

export type UrbanEcoLabSchoolIntegrationItem = {
  title: string;
  text: string;
  list: string[];
};

export type UrbanEcoLabRoadmapItem = {
  title: string;
  subtitle: string;
  text: string;
};

export type UrbanEcoLabModalContent = {
  title: string;
  tagline: string;
  hero: string;
  heroStatus: string;
  intro: string;
  principles: {
    introText: string;
    items: UrbanEcoLabPrincipleItem[];
  };
  learningLogic: {
    title: string;
    introText: string;
    items: UrbanEcoLabLearningLogicItem[];
    outroText: string;
  };
  competencies: {
    title: string;
    items: UrbanEcoLabCompetencyItem[];
  };
  ageGroups: {
    title: string;
    items: UrbanEcoLabAgeGroupItem[];
  };
  modules: {
    title: string;
    items: UrbanEcoLabModuleItem[];
  };
  schoolIntegration: {
    title: string;
    introText: string;
    items: UrbanEcoLabSchoolIntegrationItem[];
    note: string;
  };
  mood: string;
  roadmap: {
    title: string;
    introText: string;
    items: UrbanEcoLabRoadmapItem[];
    goal: string;
  };
  closing: string;
};
