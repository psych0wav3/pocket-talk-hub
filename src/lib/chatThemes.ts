export const chatThemes = {
  default: {
    primaryColor: "262 85% 58%",
    backgroundColor: "248 250 252", 
    userMessageColor: "262 85% 58%",
    botMessageColor: "0 0% 100%"
  },
  
  blue: {
    primaryColor: "217 91% 60%",
    backgroundColor: "240 249 255",
    userMessageColor: "217 91% 60%",
    botMessageColor: "0 0% 100%"
  },

  green: {
    primaryColor: "142 77% 58%",
    backgroundColor: "240 253 244",
    userMessageColor: "142 77% 58%",
    botMessageColor: "0 0% 100%"
  },

  orange: {
    primaryColor: "31 100% 60%",
    backgroundColor: "255 247 237",
    userMessageColor: "31 100% 60%",
    botMessageColor: "0 0% 100%"
  },

  red: {
    primaryColor: "0 84% 60%",
    backgroundColor: "254 242 242",
    userMessageColor: "0 84% 60%",
    botMessageColor: "0 0% 100%"
  },

  dark: {
    primaryColor: "262 85% 58%",
    backgroundColor: "222 84% 5%",
    userMessageColor: "262 85% 58%",
    botMessageColor: "222 84% 10%"
  }
};

export type ChatTheme = keyof typeof chatThemes;