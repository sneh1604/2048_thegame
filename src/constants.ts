export const theme = {
  backgroundPrimary: "#FAF8EF",
  backgroundSecondary: "#BBAC9F",
  backgroundTertiary: "#CCC1B3",
  textPrimary: "#776E65",
  textSecondary: "#F9F6F2",
  fonts: {
    bold: "ClearSans-Bold",
    regular: "ClearSans-Regular",
  },
};

export const MARGIN = 4;
export const BOARD_SIZE = 4;
export const BOARD_PADDING = 8;
export const ANIMATION_DURATION = 150;

// Cell colors matching original 2048
export const CELL_COLORS: Record<number, string> = {
  2: "#eee4da",
  4: "#ede0c8",
  8: "#f2b179",
  16: "#f59563",
  32: "#f67c5f",
  64: "#f65e3b",
  128: "#edcf72",
  256: "#edcc61",
  512: "#edc850",
  1024: "#edc53f",
  2048: "#edc22e",
};

export const CELL_NUMBER_COLORS: Record<number, string> = {
  2: "#776e65",
  4: "#776e65",
  8: "#f9f6f2",
  16: "#f9f6f2",
  32: "#f9f6f2",
  64: "#f9f6f2",
  128: "#f9f6f2",
  256: "#f9f6f2",
  512: "#f9f6f2",
  1024: "#f9f6f2",
  2048: "#f9f6f2",
};