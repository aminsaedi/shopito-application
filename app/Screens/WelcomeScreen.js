import React from "react";
import { View, StyleSheet, ImageBackground, Image } from "react-native";

import AppText from "../components/modules/AppText";
import AppButton from "../components/modules/AppButton";
import colors from "../config/colors";
import routes from "../navigation/routes";

function WelcomeScreen({ navigation }) {
  const backgroundImage = require("../assets/background.jpeg");
  const logo = require("../assets/logo.png");
  return (
    <ImageBackground
      blurRadius={1}
      source={backgroundImage}
      style={styles.background}
    >
      <View style={styles.logocontainer}>
        <Image source={logo} resizeMode="contain" style={styles.logo} />
        <AppText style={styles.text}>به شاپیتو خوش آمدید</AppText>
      </View>
      <View style={styles.buttonsContainer}>
        <AppButton
          title="ورود به حساب"
          onPress={() => navigation.navigate(routes.LOGIN)}
          textStyle={styles.buttonTextStyle}
        />
        <AppButton
          title="ساخت حساب جدید"
          color={colors.secondary}
          onPress={() => navigation.navigate(routes.REGISTER)}
          textStyle={styles.buttonTextStyle}
        />
      </View>
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  logocontainer: {
    position: "absolute",
    top: 70,
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
  },
  buttonsContainer: {
    width: "100%",
    padding: 20,
  },
  text: {
    fontSize: 35,
    paddingTop: 10,
    fontWeight: "900",
    color: colors.primary,
    fontFamily: "bKoodak",
  },
  buttonTextStyle: {
    fontFamily: "bKoodak",
  },
});

export default WelcomeScreen;
