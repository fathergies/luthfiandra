export type Memory = {
  id: string;
  title: string;
  date: string;
  caption: string;
  imageTone: "pink" | "blue" | "cream";
};

export const memories: Memory[] = [
  {
    id: "first-spark",
    title: "First Spark",
    date: "Soon",
    caption: "A placeholder for where the story begins.",
    imageTone: "pink"
  },
  {
    id: "soft-day",
    title: "Soft Day",
    date: "Soon",
    caption: "A quiet little page reserved for a favorite ordinary moment.",
    imageTone: "blue"
  },
  {
    id: "favorite-laugh",
    title: "Favorite Laugh",
    date: "Soon",
    caption: "A place for the kind of smile that stays in the room.",
    imageTone: "cream"
  }
];
