import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import routes from "./routes";
import CartScreen from "../Screens/CartScreen";
import AccountScreen from "../Screens/AccountScreen";
import NewShoppingButton from "./NewListingButton";
import ShoppingScreen from "../Screens/ShoppingScreen";
import ShoppingNavigator from "./ShoppingNavigator";
import AccountNavigator from "./AccountNavigator";

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator initialRouteName={routes.SHOPPING}>
    <Tab.Screen
      name={routes.CART}
      component={CartScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="cart" color={color} size={size} />
        ),
        tabBarLabel: "سبد خرید",
      }}
    />
    <Tab.Screen
      name={routes.SHOPPING}
      component={ShoppingNavigator}
      options={({ navigation }) => ({
        tabBarButton: () => (
          <NewShoppingButton
            onPress={() => navigation.navigate(routes.SHOPPING)}
          />
        ),
      })}
    />
    <Tab.Screen
      name={routes.ACCOUNTSCREEN}
      component={AccountNavigator}
      options={{
        tabBarIcon: ({ color, size }) => (
          <MaterialCommunityIcons name="account" color={color} size={size} />
        ),
        tabBarLabel: "حساب کاربری",
      }}
    />
  </Tab.Navigator>
);

export default AppNavigator;
