export type Meta = {
  title: string;
  role: string;
  language: string;
  tagline: string;
  intro: string;
  about: string;
  approach: string;
  approachItems: string[];
  collaboration: string;
};

export type Project = {
  slug: string;
  title: string;
  hero: string;
  card: string;
  what: string;
  use: string;
  features: string[];
  unique: string;
  status: string;
  direction: string[];
};

export type ContentPack = {
  meta: Meta;
  featuredProjects: Project[];
  otherProjects: Project[];
};
export type KincstartoModalModel = import("./kincstartoModalModel").KincstartoModalModel;
