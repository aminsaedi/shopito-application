import React, { useState } from "react";
import { View, StyleSheet, Modal } from "react-native";
import * as Yup from "yup";

import AppBarcodeScanner from "../components/modules/AppBarcodeScanner";
import ActivityIndicator from "../components/modules/ActivityIndicator";
import AppButton from "../components/modules/AppButton";
import AppText from "../components/modules/AppText";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import Screen from "../components/modules/Screen";
import SubmitButton from "../components/forms/SubmitButton";
import colors from "../config/colors";
import routes from "../navigation/routes";

import shoppingApi from "../api/shopping";
import branchApi from "../api/branch";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";

const BranchCodeValidationSchema = Yup.object().shape({
  barcodeAddress: Yup.string().required("کد فروشگاه را وارد کنید"),
});

function SelectBranchScreen({ navigation }) {
  const { user } = useAuth();
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleStartShopping = async ({ barcodeAddress }) => {
    setShowScanner(false);
    setLoading(true);
    const branch = await branchApi.findByBarcode(barcodeAddress);
    if (branch.status !== 200) {
      setLoading(false);
      return alert("فروشگاه یافت نشد");
    }
    const shopping = await shoppingApi.startShopping(user._id, branch.data._id);
    if (shopping.status === 201) {
      setLoading(false);
      return navigation.navigate(routes.ADDTOSHOPPING);
    } else if (shopping.status !== 201) {
      setLoading(false);
      alert("خطا در شروع خرید");
    }
    setLoading(false);
  };
  return (
    <>
      <ActivityIndicator visible={loading} size="large" />
      <Screen style={styles.container}>
        <AppButton
          title="اسکن کد فروشگاه"
          onPress={() => setShowScanner(true)}
        />
        <AppForm
          initialValues={{ barcodeAddress: "" }}
          onSubmit={handleStartShopping}
          validationSchema={BranchCodeValidationSchema}
        >
          <AppFormField
            name="barcode"
            placeholder="ورود دستی کد فروشگاه"
            name="barcodeAddress"
          />
          <SubmitButton title="شروع خرید" />
        </AppForm>
      </Screen>
      <Modal visible={showScanner}>
        <Screen style={styles.barcodeScannerContainer}>
          <AppBarcodeScanner onBranchScan={handleStartShopping} />
          <AppButton
            width="90%"
            style={{ alignSelf: "center" }}
            title="لغو"
            color={colors.secondary}
            onPress={() => setShowScanner(false)}
          />
        </Screen>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding:10
  },
});

export default SelectBranchScreen;
