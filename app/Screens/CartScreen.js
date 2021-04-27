import React, { useState, useEffect } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useIsFocused } from "@react-navigation/native";

import ActivityIndicator from "../components/modules/ActivityIndicator";
import AppButton from "../components/modules/AppButton";
import AppText from "../components/modules/AppText";
import Card from "../components/modules/Card";
import Screen from "../components/modules/Screen";

import customerApi from "../api/customer";
import shoppingApi from "../api/shopping";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";
import routes from "../navigation/routes";

function CartScreen({ navigation }) {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  const getCartApi = useApi(customerApi.currentShopping);

  const isFocused = useIsFocused();
  useEffect(() => {
    getCartApi.request(user._id, 0);
  }, [isFocused]);

  const getSortedProducts = (allProduct) => {
    if (!allProduct) return;
    const result = [
      ...allProduct
        .reduce((mp, o) => {
          const key = JSON.stringify([o.name, o.price]);
          if (!mp.has(key)) mp.set(key, { ...o, count: 0 });
          mp.get(key).count++;
          return mp;
        }, new Map())
        .values(),
    ];
    return result;
  };

  const incrementInCart = async (productId) => {
    setLoading(true);
    const result = await shoppingApi.addToCart(
      getCartApi.data[0]._id,
      productId
    );
    getCartApi.request(user._id, 0);
    setLoading(false);
  };

  const decrementInCart = async (productId) => {
    setLoading(true);
    const result = await shoppingApi.removeFromCart(
      getCartApi.data[0]._id,
      productId
    );
    getCartApi.request(user._id, 0);
    setLoading(false);
  };

  return (
    <>
      <ActivityIndicator visible={getCartApi.loading || loading} size="large" />
      <Screen style={styles.container}>
        {getCartApi.status === 404 && (
          <Screen style={styles.errorContainer}>
            <AppText style={{ textAlign: "center" }}>
              شما خرید فعالی ندارید
            </AppText>
            <AppButton
              title="شروع خرید"
              onPress={() => navigation.navigate(routes.SHOPPING)}
            />
          </Screen>
        )}
        {getCartApi.status === 200 &&
          getCartApi.data &&
          getCartApi.data.length >= 1 && (
            <FlatList
              data={getSortedProducts(getCartApi.data[0].products)}
              keyExtractor={(item) => item._id.toString()}
              renderItem={({ item }) => (
                <Card
                  title={item.name}
                  price={item.price}
                  number={item.count}
                  totalPrice={item.count * item.price}
                  onDecrement={() => decrementInCart(item._id)}
                  onIncrement={() => incrementInCart(item._id)}
                />
              )}
              refreshing={refreshing}
              onRefresh={() => getCartApi.request(user._id, 0)}
            />
          )}
        {getCartApi.status === 200 &&
          getCartApi.data &&
          getCartApi.data[0].products.length === 0 && (
            <Screen>
              <AppText style={{ textAlign: "center", paddingVertical: 10 }}>
                آیتمی در سبد وجود ندارد
              </AppText>
            </Screen>
          )}
        {getCartApi.status !== 200 && getCartApi.status !== 404 && (
          <Screen style={styles.errorContainer}>
            <AppText style={{ textAlign: "center" }}>
              خطا در دریافت سبد خرید
            </AppText>
            <AppButton
              title="تلاش مجدد"
              onPress={() => getCartApi.request(user._id, 0)}
            />
          </Screen>
        )}
      </Screen>
    </>
  );
}
const styles = StyleSheet.create({
  container: {},
  errorContainer: {
    marginTop: "2%",
    padding: 10,
  },
});

export default CartScreen;
