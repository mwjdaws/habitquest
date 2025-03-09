
export type ColorTheme = {
  name: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  foregroundColor: string;
  cardColor: string;
  cardForegroundColor: string;
};

export const colorThemes: ColorTheme[] = [
  {
    name: "Default Purple",
    primaryColor: "hsl(260, 96%, 66%)",
    accentColor: "hsl(260, 80%, 96%)",
    backgroundColor: "hsl(260, 100%, 99%)",
    foregroundColor: "hsl(260, 10%, 10%)",
    cardColor: "hsl(0, 0%, 100%)",
    cardForegroundColor: "hsl(260, 10%, 10%)",
  },
  {
    name: "Lavender & Amber",
    primaryColor: "#B8A9E3",
    accentColor: "#FFB347",
    backgroundColor: "hsl(258, 40%, 98%)",
    foregroundColor: "hsl(258, 15%, 15%)",
    cardColor: "hsl(0, 0%, 100%)",
    cardForegroundColor: "hsl(258, 15%, 15%)",
  },
  {
    name: "Sage & Terracotta",
    primaryColor: "#9CAF88",
    accentColor: "#E07A5F",
    backgroundColor: "hsl(95, 30%, 98%)",
    foregroundColor: "hsl(95, 15%, 15%)",
    cardColor: "hsl(0, 0%, 100%)",
    cardForegroundColor: "hsl(95, 15%, 15%)",
  },
  {
    name: "Dusty Blue & Peach",
    primaryColor: "#8DA9C4",
    accentColor: "#FFC5A1",
    backgroundColor: "hsl(210, 30%, 98%)",
    foregroundColor: "hsl(210, 15%, 15%)",
    cardColor: "hsl(0, 0%, 100%)",
    cardForegroundColor: "hsl(210, 15%, 15%)",
  },
  {
    name: "Deep Teal & Coral",
    primaryColor: "#00696F",
    accentColor: "#FA8072",
    backgroundColor: "hsl(183, 35%, 97%)",
    foregroundColor: "hsl(183, 20%, 15%)",
    cardColor: "hsl(0, 0%, 100%)",
    cardForegroundColor: "hsl(183, 20%, 15%)",
  },
  {
    name: "Aubergine & Gold",
    primaryColor: "#5F4B66",
    accentColor: "#D4B483",
    backgroundColor: "hsl(282, 15%, 98%)",
    foregroundColor: "hsl(282, 15%, 15%)",
    cardColor: "hsl(0, 0%, 100%)",
    cardForegroundColor: "hsl(282, 15%, 15%)",
  },
  {
    name: "Olive & Rust",
    primaryColor: "#7D8C65",
    accentColor: "#B7410E",
    backgroundColor: "hsl(80, 20%, 97%)",
    foregroundColor: "hsl(80, 15%, 15%)",
    cardColor: "hsl(0, 0%, 100%)",
    cardForegroundColor: "hsl(80, 15%, 15%)",
  },
];
