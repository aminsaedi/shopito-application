import React from "react";
import { View, StyleSheet, FlatList } from "react-native";

import Screen from "../components/modules/Screen";
import ListItem from "../components/lists/ListItem";
import Icon from "../components/modules/Icon";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import colors from "../config/colors";
import useAuth from "../auth/useAuth";
import routes from "../navigation/routes";

const menuItems = [
  {
    title: "خرید های من",
    targetScreen: routes.MYSHOPPINGS,
    icon: {
      name: "receipt",
      backgroundColor: colors.primary,
    },
  },
  {
    title: "پرداخت های آنلاین من",
    targetScreen: routes.MYPAYMENTS,
    icon: {
      name: "export",
      backgroundColor: colors.secondary,
    },
  },
];

function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();

  return (
    <Screen>
      <ListItem
        style={styles.info}
        title={user.name}
        subTitle={user.mobile}
        image={require("../assets/mosh.jpg")}
      />
      <View style={styles.optionsPartOne}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          renderItem={({ item }) => (
            <ListItem
              onPress={() => navigation.navigate(item.targetScreen)}
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              showChevrons
            />
          )}
          ItemSeparatorComponent={ListItemSeparator}
        />
      </View>
      <View style={styles.optionsPartOne}>
        <ListItem
          style={styles.option}
          title="خروج از حساب"
          IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
          onPress={() => logOut()}
        />
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  info: {
    marginTop: 50,
  },
  optionsPartOne: {
    marginTop: 50,
  },
  option: {
    marginTop: 1,
  },
});

export default AccountScreen;
