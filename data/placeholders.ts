export type PlaceholderPage = {
  route: string;
  eyebrow: string;
  title: string;
  description: string;
  notes: string[];
};

export const placeholderPages: PlaceholderPage[] = [
  {
    route: "/love-studio",
    eyebrow: "Creative room",
    title: "Love Studio",
    description: "A future workspace for custom love notes, tiny poems, and playful edits.",
    notes: ["Letter maker", "Mood palette", "Secret prompts"]
  },
  {
    route: "/games",
    eyebrow: "Play room",
    title: "Games",
    description: "A collection area for mini games and interactive challenges.",
    notes: ["Memory match", "Love quiz", "Daily spin"]
  },
  {
    route: "/garage",
    eyebrow: "Idea parking",
    title: "Garage",
    description: "A flexible place to park drafts, silly concepts, and hidden experiments.",
    notes: ["Inside jokes", "Unfinished gifts", "Future modules"]
  },
  {
    route: "/photobooth",
    eyebrow: "Snapshot corner",
    title: "Photobooth",
    description: "A sweet frame for photos, stickers, and printable-style keepsakes.",
    notes: ["Photo frames", "Sticker overlays", "Polaroid exports"]
  }
];
