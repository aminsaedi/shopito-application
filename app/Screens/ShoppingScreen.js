import React, { useState, useEffect } from "react";
import { View, StyleSheet, Modal, Alert } from "react-native";
import * as Yup from "yup";
import { useIsFocused } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import * as WebBrowser from "expo-web-browser";
import Num2persian from "num2persian";

import customerApi from "../api/customer";
import productApi from "../api/product";
import shoppingApi from "../api/shopping";
import onlinePaymentApi from "../api/onlinePayment";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";

import routes from "../navigation/routes";

import ActivityIndicator from "../components/modules/ActivityIndicator";
import AppButton from "../components/modules/AppButton";
import AppText from "../components/modules/AppText";
import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import Screen from "../components/modules/Screen";
import SubmitButton from "../components/forms/SubmitButton";
import AppBarcodeScanner from "../components/modules/AppBarcodeScanner";
import colors from "../config/colors";
import { event } from "react-native-reanimated";

const BarcodeShema = Yup.object().shape({
  barcode: Yup.string().required("بارکد محصول را وارد کنید"),
});

function ShoppingScreen({ navigation }) {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankView, setBankView] = useState(false);
  const [bankUrl, setBankUrl] = useState("");

  const getCartApi = useApi(customerApi.currentShopping);
  const getProductApi = useApi(productApi.findById);
  const addToCartApi = useApi(shoppingApi.addToCart);

  const handleAddToCart = async ({ barcode }) => {
    setShowScanner(false);
    setLoading(true);
    const product = await productApi.findById(
      getCartApi.data[0].branch._id,
      barcode
    );
    if (product.status !== 200) {
      setLoading(false);
      return alert("کالا یافت نشد");
    }
    const addToCart = await shoppingApi.addToCart(
      getCartApi.data[0]._id,
      product.data._id
    );
    getCartApi.request(user._id, 0);
    setLoading(false);
    if (addToCart.status === 200) alert(`${addToCart.data.name} اضافه شد`);
  };

  const handleFinishShopping = () => {
    Alert.alert("اتمام خرید", "نوع پرداخت را انتخاب کیند", [
      {
        text: "پرداخت انلاین",
        onPress: handleOnlinePayment,
      },
      {
        text: "پرداخت نقدی",
        onPress: () => alert("جهت پرداخت نقدی به صندوق مراجعه کنید"),
      },
      {
        text: "ادامه خرید",
      },
    ]);
  };
  const getTotalPrice = (products) => {
    if (!products) return 0;
    let total = 0;
    products.forEach((item) => (total += item.price));
    return total;
  };
  const priceFormater = (inputPrice) => {
    return inputPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  const handleOnlinePayment = async () => {
    setLoading(true);
    const onlineResult = await onlinePaymentApi.startOnlinePayment(
      getTotalPrice(getCartApi.data[0].products) * 10,
      getCartApi.data[0].customer.mobile,
      getCartApi.data[0]._id
    );
    if (onlineResult.status === 200)
      await WebBrowser.openBrowserAsync(onlineResult.data);
    else if (onlineResult.status !== 200)
      alert("خطا در پرداخت آنلاین" + onlineResult.data);
    getCartApi.request(user._id, 0);
    setLoading(false);
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    getCartApi.request(user._id, 0);
  }, [isFocused]);

  return (
    <>
      <ActivityIndicator
        visible={getCartApi.loading || getProductApi.loading || loading}
        size="large"
      />
      <Screen style={styles.container}>
        {getCartApi.status === 404 && (
          <View style={{ padding: 10 }}>
            <AppText style={{ textAlign: "center" }}>
              شما خرید در حال انجامی ندارید لطفا شروع را لمس کنید
            </AppText>
            <AppButton
              title="شروع"
              onPress={() => navigation.navigate(routes.BRANCHSELECT)}
            />
          </View>
        )}
        {getCartApi.status === 200 && (
          <>
            <View style={{ marginTop: "30%" }}>
              <AppButton
                title="اسکن بارکد محصول"
                onPress={() => setShowScanner(true)}
              />
              <AppForm
                initialValues={{ barcode: "" }}
                onSubmit={handleAddToCart}
                validationSchema={BarcodeShema}
              >
                <AppFormField name="barcode" placeholder="ورود دستی بارکد" />
                <SubmitButton title="افزودن به سبد" />
              </AppForm>
              <AppButton
                title="پایان خرید"
                color={colors.secondary}
                onPress={handleFinishShopping}
              />
              <AppText style={{ textAlign: "right", marginTop: 10 }}>
                جمع کل :{" "}
                {priceFormater(getTotalPrice(getCartApi.data[0].products))}
              </AppText>
              <AppText style={{ textAlign: "right", marginTop: 10 }}>
                {Num2persian(getTotalPrice(getCartApi.data[0].products))} تومان
              </AppText>
              <AppText style={{ color: colors.medium, textAlign: "center" }}>
                جزییات بیشتر در سبد خرید
              </AppText>
            </View>
          </>
        )}
        {getCartApi.status !== 200 && getCartApi.status !== 404 && (
          <Screen>
            <AppText style={{ textAlign: "center" }}>
              خطا در ارتباط با سرور {getCartApi.status}
            </AppText>
            <AppButton
              title="تلاش مجدد"
              onPress={() => getCartApi.request(user._id, 0)}
            />
          </Screen>
        )}
      </Screen>
      <Modal visible={showScanner}>
        <Screen style={styles.barcodeScannerContainer}>
          <AppBarcodeScanner onProductScan={handleAddToCart} />
          <AppButton
            width="90%"
            style={{ alignSelf: "center" }}
            title="لغو"
            color={colors.secondary}
            onPress={() => setShowScanner(false)}
          />
        </Screen>
      </Modal>
      <Modal visible={bankView}>
        <Screen>
          <AppButton title="لغو" onPress={() => setBankView(false)} />
          <WebView
            source={{ uri: bankUrl }}
            onNavigationStateChange={({ url }) => alert(url)}
          />
        </Screen>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default ShoppingScreen;
