import { Dimensions } from "react-native";

export default {
  colors: {
    black: "#000000",
    white: "#FFFFFF",
    purple: "#181a2f",
    purpleLight: "#222a42",
    pink: "#e14eca",
    cyan: "#2bffc6",
    yellow: "#ffd600",
    orange: "#fb6340",
  },
  screen: Dimensions.get("screen"),
  standardPadding: {
    horizontal: 10,
  },
  components: {
    standardLogo: {
      height: 50,
    },
    logoHeader: {
      verticalPadding: 10,
      borderBottomWidth: 5,
    },
  },
};
