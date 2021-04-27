import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import routes from "./routes";

import ShoppingScreen from "../Screens/ShoppingScreen";
import SelectBranchScreen from "../Screens/SelectBranchScreen";
import BarcodeScannerScreen from "../Screens/BarcodeScannerScreen";

const Stack = createStackNavigator();

const ShoppingNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen
      name={routes.ADDTOSHOPPING}
      component={ShoppingScreen}
      options={{ headerShown: false, headerTitle: "خرید" }}
    />
    <Stack.Screen
      name={routes.BRANCHSELECT}
      component={SelectBranchScreen}
      options={{ headerTitle: "انتخاب فروشگاه" }}
    />
  </Stack.Navigator>
);

export default ShoppingNavigator;
