import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
} from "react-native-paper";
import merge from "deepmerge";
import * as colors from "./colors";

const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

export const lightTheme = {
  ...CombinedDefaultTheme,
  colors: {
    ...PaperDefaultTheme.colors,
    primary: colors.PRIMARY,
    red: colors.RED,
    grey: colors.GREY,
    switchBackground: colors.LIGHT,
  },
};

export const darkTheme = {
  ...CombinedDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    primary: colors.PRIMARY_DESATURATED,
    red: colors.LIGHT_RED,
    grey: colors.LIGHTER_GREY,
    switchBackground: colors.PRIMARY_OVERSATURATED,
  },
};
