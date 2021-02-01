import React from "react";
import "react-native-gesture-handler";
import {
  NavigationContainer,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useDarkMode } from "react-native-dark-mode";
import Main from "./scenes/Main";
import Settings from "./components/Setttings";

const Stack = createStackNavigator();

export default function App() {
  const settingsComponent = () => {
    return <Settings />;
  };
  const isDarkMode = useDarkMode();

  return (
    <NavigationContainer theme={isDarkMode ? DarkTheme : DefaultTheme}>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Main}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Settings" component={settingsComponent} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
