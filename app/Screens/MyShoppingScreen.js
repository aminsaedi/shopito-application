import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

import { View, StyleSheet, FlatList, Alert } from "react-native";

import ActivityIndicator from "../components/modules/ActivityIndicator";
import ListItem from "../components/lists/ListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import Screen from "../components/modules/Screen";

import customerApi from "../api/customer";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";

function MyShoppingScreen(props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const getAllShoppingApi = useApi(customerApi.currentShopping);
  const isFocused = useIsFocused();
  useEffect(() => {
    getAllShoppingApi.request(user._id, "all");
  }, [isFocused]);
  const getTotalPrice = (products) => {
    let total = 0;
    products.forEach((item) => (total += item.price));
    return total;
  };
  const priceFormater = (inputPrice) => {
    return inputPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleShowDetails = (item) => {
    Alert.alert("گزارش خرید",`تعداد کالا : ${item.products.length} \n وضعیت پرداخت : ${item.state}`)
  };

  return (
    <>
      <ActivityIndicator
        visible={getAllShoppingApi.loading || loading}
        size="large"
      />
      <Screen style={styles.container}>
        {!getAllShoppingApi.loading && (
          <FlatList
            data={getAllShoppingApi.data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ListItem
                onPress={() => handleShowDetails(item)}
                title={`خرید از فروشگاه ${item.branch.name}`}
                subTitle={`تاریخ : ${item.date} مبلغ : ${priceFormater(
                  getTotalPrice(item.products)
                )} تومان`}
                showChevrons
              />
            )}
            ItemSeparatorComponent={ListItemSeparator}
            refreshing={getAllShoppingApi.loading}
            onRefresh={() => getAllShoppingApi.request(user._id, "all")}
          />
        )}
      </Screen>
    </>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default MyShoppingScreen;
