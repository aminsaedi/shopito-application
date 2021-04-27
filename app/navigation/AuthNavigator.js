import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";
import WelcomeScreen from "../Screens/WelcomeScreen";
import LoginScreen from "../Screens/LoginScreen";
import RegisterScreen from "../Screens/RegisterScreen";

const Stack = createStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={routes.WELCOME}
      component={WelcomeScreen}
      options={{ headerShown: false, headerTitle: "خوش آمدید" }}
    />
    <Stack.Screen
      name={routes.LOGIN}
      component={LoginScreen}
      options={{ headerTitle: "ورود به شاپیتو" }}
    />
    <Stack.Screen
      name={routes.REGISTER}
      component={RegisterScreen}
      options={{ headerTitle: "ثبت نام در شاپیتو" }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
