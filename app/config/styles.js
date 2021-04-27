import { Platform } from "react-native";
import colors from "./colors";

export default {
  colors,
  text: {
    fontFamily: "bKoodak",
    width: "100%",
    color: colors.black,
    ...Platform.select({
      ios: {
        fontFamily: "bKoodak",
        fontSize: 20,
      },
      android: {
        fontFamily: "bKoodak",
        fontSize: 14,
      },
    }),
  },
};
