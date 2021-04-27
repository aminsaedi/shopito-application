import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";

import AccountScreen from "../Screens/AccountScreen";
import MyPaymentsScreen from "../Screens/MyPaymentsScreen";
import MyShoppingScreen from "../Screens/MyShoppingScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={routes.MYMAINACCOUNT}
      component={AccountScreen}
      options={{ headerShown: false, headerTitle: "حساب کاربری" }}
    />
    <Stack.Screen
      name={routes.MYSHOPPINGS}
      component={MyShoppingScreen}
      options={{ headerTitle: "خرید های من" }}
    />
    <Stack.Screen
      name={routes.MYPAYMENTS}
      component={MyPaymentsScreen}
      options={{ headerTitle: "پرداخت های من" }}
    />
  </Stack.Navigator>
);

export default AccountNavigator;
