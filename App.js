import React from "react";
import {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useDarkMode } from "react-native-dark-mode";
import Main from "./scenes/Main";
import Settings from "./scenes/Setttings";
import {
  DarkTheme as PaperDarkTheme,
  DefaultTheme as PaperDefaultTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import merge from "deepmerge";

const Stack = createStackNavigator();
const CombinedDefaultTheme = merge(PaperDefaultTheme, NavigationDefaultTheme);
const CombinedDarkTheme = merge(PaperDarkTheme, NavigationDarkTheme);

export default function App() {
  const isDarkMode = useDarkMode();

  return (
    <PaperProvider
      theme={isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme}
    >
      <NavigationContainer
        theme={isDarkMode ? CombinedDarkTheme : CombinedDefaultTheme}
      >
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Main}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Settings" component={Settings} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
