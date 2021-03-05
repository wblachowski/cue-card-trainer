import React from "react";
import { View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useDarkMode } from "react-native-dark-mode";
import { Provider as PaperProvider } from "react-native-paper";
import Main from "./scenes/Main";
import Settings from "./scenes/Setttings";
import { lightTheme, darkTheme } from "./styles/themes";

const Stack = createStackNavigator();

export default function App() {
  const theme = useDarkMode() ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
          <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={Main}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Settings" component={Settings} />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </PaperProvider>
  );
}
