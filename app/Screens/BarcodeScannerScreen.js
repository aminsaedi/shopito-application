import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

import AppText from "../components/modules/AppText";
import Screen from "../components/modules/Screen";
import routes from '../navigation/routes'

function BarcodeScannerScreen({ navigation, onScan }) {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    // onScan(data);
    navigation.navigate(routes.ADDTOSHOPPING)
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return <Text>درخواست دسترسی به دوربین</Text>;
  }
  if (hasPermission === false) {
    return <Text>اجازه دسترسی به دوربین داده نشد</Text>;
  }

  return (
    <Screen style={styles.container}>
      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
        {scanned && (
          <Button
            title={"Tap to Scan Again"}
            onPress={() => setScanned(false)}
          />
        )}
      </View>
    </Screen>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerContainer: {
   width : 500,
   height : "100%",
   backgroundColor : "red"
  },
});

export default BarcodeScannerScreen;
