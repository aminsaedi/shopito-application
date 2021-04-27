import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";

import routes from "../../navigation/routes";

function AppBarcodeScanner({ navigation, onProductScan, onBranchScan }) {
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
    if (onProductScan) onProductScan({ barcode: data });
    if (onBranchScan) onBranchScan({ barcodeAddress: data });
  };

  if (hasPermission === null) {
    return <Text>درخواست دسترسی به دوربین</Text>;
  }
  if (hasPermission === false) {
    return <Text>اجازه دسترسی به دوربین داده نشد</Text>;
  }

  return (
    <View style={styles.scannerContainer}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {scanned && (
        <Button title={"Tap to Scan Again"} onPress={() => setScanned(false)} />
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  scannerContainer: {
    flex: 1,
  },
});

export default AppBarcodeScanner;
