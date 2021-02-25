import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useDarkMode } from "react-native-dark-mode";
import Main from "./scenes/Main";
import Settings from "./scenes/Setttings";
import { Provider as PaperProvider } from "react-native-paper";
import { theme, darkTheme } from "./styles/themes";

const Stack = createStackNavigator();

export default function App() {
  const isDarkMode = useDarkMode();

  return (
    <PaperProvider theme={isDarkMode ? darkTheme : theme}>
      <NavigationContainer theme={isDarkMode ? darkTheme : theme}>
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
