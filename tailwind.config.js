module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: { 
      colors: {
        bgNav: "#2D3238", //  navbar background color
        bgLight: "#2C3137", //  main top left background color
        bgDark: "#17191D",
        onGoNext: "#FF5733", //  main bottom right background color
        primary: "#FF6A16", // main primary color
        onPrimary: "#FFFFFF", // text/icons on primary
        secondary: "#FFCC00", // secondary accent color
        outline: "#FF6916", // outline buttons / borders
        onOutline: "#FFFFFF", // text/icons on outline
        mainText: "#FFFFFF", // main text color
        onMainText: "#9CA3AF", // secondary text / subtitles
        onFooter: "#888888", // footer text
        error: "#D91B1B", // error messages
        onError: "#FFFFFF", // text on error
        chatStart: "#E53644", // right side (darker red)
        chatEnd: "#FF6916", // left side (orange)
        inputsIn: "#979797"
      },
      backgroundImage: {
        "dark-gradient":
        "linear-gradient(143.14deg, #2C3137 8.7%, #17191D 89.31%)",
        "chat-gradient": "linear-gradient(to left, #E53644, #FF6916)",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        vazirmatn: ["Vazirmatn", "sans-serif"],
        roboto: ["Roboto", "sans-serif"],
        inter: ["Inter", "sans-serif"], // Figma font
      },
    },
  },
  plugins: [],
};
