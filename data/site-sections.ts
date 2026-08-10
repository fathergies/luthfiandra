export type SiteSection = {
  title: string;
  href: string;
  icon: string;
  description: string;
};

export const siteSections: SiteSection[] = [
  {
    title: "Memories",
    href: "/memories",
    icon: "✦",
    description: "A gentle timeline for photos, dates, and tiny stories."
  },
  {
    title: "Love Studio",
    href: "/love-studio",
    icon: "♡",
    description: "A creative space for notes, letters, colors, and future surprises."
  },
  {
    title: "Games",
    href: "/games",
    icon: "♢",
    description: "Playful little interactions made for two."
  },
  {
    title: "Garage",
    href: "/garage",
    icon: "◌",
    description: "A parking spot for ideas, inside jokes, and works in progress."
  },
  {
    title: "Photobooth",
    href: "/photobooth",
    icon: "◇",
    description: "A future corner for cute frames, snaps, and keepsakes."
  }
];
