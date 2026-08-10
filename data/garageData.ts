export type WheelStyle = "touring" | "sport" | "classic";
export type StickerStyle = "none" | "luthfiandra" | "initials" | "heart" | "angie";
export type LightColor = "white" | "warm" | "ice";

export type GarageBuild = {
  wheels: WheelStyle;
  roofRack: boolean;
  roofBox: boolean;
  sticker: StickerStyle;
  tint: number;
  lights: LightColor;
  plate: string;
  bodyAccent: boolean;
};

export const defaultGarageBuild: GarageBuild = {
  wheels: "classic",
  roofRack: false,
  roofBox: false,
  sticker: "none",
  tint: 78,
  lights: "ice",
  plate: "ANDRA",
  bodyAccent: false
};

export const stickerOptions: { value: StickerStyle; label: string }[] = [
  { value: "none", label: "Clean" },
  { value: "luthfiandra", label: "Luthfiandra" },
  { value: "initials", label: "L + A" },
  { value: "heart", label: "Small Heart" },
  { value: "angie", label: "Made by Angie" }
];
