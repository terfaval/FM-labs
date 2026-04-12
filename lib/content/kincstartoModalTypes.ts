export type KincstartoModalContent = {
  brand: { tagline: string };
  intro: { body: string };
  principles: {
    title: string;
    intro?: string;
    items: { icon: string; title: string; text: string }[];
  };
  books: { title: string; body: string };
  meditation: { title: string; body: string };
  yoga: { title: string; body: string };
  mood: { text: string };
  nextDirections: {
    title: string;
    intro?: string;
    cards: { title: string; text: string }[];
  };
  closing: { body: string };
};
