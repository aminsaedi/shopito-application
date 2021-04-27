import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";

import { View, StyleSheet, FlatList, Alert } from "react-native";

import ActivityIndicator from "../components/modules/ActivityIndicator";
import ListItem from "../components/lists/ListItem";
import ListItemSeparator from "../components/lists/ListItemSeparator";
import Screen from "../components/modules/Screen";

import onlinePaymnetApi from "../api/onlinePayment";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";

function MyPaymentsScreen(props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const getAllPaymentsApi = useApi(onlinePaymnetApi.userPayments);
  const isFocused = useIsFocused();
  useEffect(() => {
    getAllPaymentsApi.request(user.mobile);
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
    Alert.alert(
      "گزارش پرداخت آنلاین",
      `شماره پیگیری : ${item.transId} \n تعداد کالا : ${item.shopping.products.length} \n وضعیت پرداخت : ${item.message}`
    );
  };
  return (
    <>
      <ActivityIndicator
        visible={getAllPaymentsApi.loading || loading}
        size="large"
      />
      <Screen style={styles.container}>
        {!getAllPaymentsApi.loading && (
          <FlatList
            data={getAllPaymentsApi.data}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ListItem
                onPress={() => handleShowDetails(item)}
                title={`خرید از فروشگاه ${item.shopping.branch.name}`}
                subTitle={`از کارت : ${
                  item.cardNumber
                } به مبلغ : ${priceFormater(item.amount)} تومان `}
                showChevrons
              />
            )}
            ItemSeparatorComponent={ListItemSeparator}
            refreshing={getAllPaymentsApi.loading}
            onRefresh={() => getAllPaymentsApi.request(user.mobile)}
          />
        )}
      </Screen>
    </>
  );
}
const styles = StyleSheet.create({
  container: {},
});

export default MyPaymentsScreen;
