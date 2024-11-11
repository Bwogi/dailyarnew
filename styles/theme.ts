// styles/theme.ts
export const theme = {
  colors: {
    primary: {
      gradient: "from-blue-600 to-indigo-600",
      text: "text-blue-600",
      hover: "hover:text-blue-700",
      bg: "bg-blue-600",
      light: "bg-blue-50",
    },
    secondary: {
      gradient: "from-indigo-600 to-purple-600",
      text: "text-indigo-600",
      hover: "hover:text-indigo-700",
      bg: "bg-indigo-600",
    },
    background: {
      main: "from-blue-50 to-indigo-50",
      card: "bg-white/70",
      glass: "backdrop-filter backdrop-blur-lg",
    },
  },
  animation: {
    hover:
      "transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg",
    fade: "transition-opacity duration-300",
    scale: "transition-transform duration-300 hover:scale-102",
  },
};
