
export type ColorTheme = {
  name: string;
  primaryColor: string;
  accentColor: string;
};

export const colorThemes: ColorTheme[] = [
  {
    name: "Default Purple",
    primaryColor: "hsl(260, 96%, 66%)",
    accentColor: "hsl(260, 80%, 96%)",
  },
  {
    name: "Lavender & Amber",
    primaryColor: "#B8A9E3",
    accentColor: "#FFB347",
  },
  {
    name: "Sage & Terracotta",
    primaryColor: "#9CAF88",
    accentColor: "#E07A5F",
  },
  {
    name: "Dusty Blue & Peach",
    primaryColor: "#8DA9C4",
    accentColor: "#FFC5A1",
  },
  {
    name: "Deep Teal & Coral",
    primaryColor: "#00696F",
    accentColor: "#FA8072",
  },
  {
    name: "Aubergine & Gold",
    primaryColor: "#5F4B66",
    accentColor: "#D4B483",
  },
  {
    name: "Olive & Rust",
    primaryColor: "#7D8C65",
    accentColor: "#B7410E",
  },
];
