import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import Num2persian from "num2persian";

import colors from "../../config/colors";
import AppText from "./AppText";
import AppButton from "./AppButton";

function Card({
  title,
  price = "0",
  totalPrice,
  number = 1,
  style,
  isCheque,
  date,
  onPress,
  onLongPress,
  onIncrement,
  onDecrement,
}) {
  const window = useWindowDimensions();
  const formatedDate = new Date(date);
  const priceFormater = (inputPrice) => {
    return inputPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  return (
    <TouchableOpacity onPress={onPress} onLongPress={onLongPress}>
      <View
        style={[
          styles.cardConatiner,
          style,
          {
            backgroundColor: isCheque ? colors.medium : colors.light,
            // height: window.height / 4,
          },
        ]}
      >
        <AppText style={styles.title}>{title}</AppText>
        <AppText style={styles.price}>{priceFormater(price)} تومان</AppText>
        <AppText style={styles.number}>تعداد :‌ {number}</AppText>
        <View style={{ flexDirection: "row", paddingHorizontal: 10 }}>
          <AppButton
            title={number === 1 ? "حذف" : "-"}
            width="48%"
            color={colors.secondary}
            onPress={onDecrement}
            style={{ marginRight: "2%" }}
          />
          <AppButton
            title="+"
            width="48%"
            style={{ marginLeft: "2%" }}
            onPress={onIncrement}
          />
        </View>
        <AppText style={styles.totalPrice}>
          جمع کل : {priceFormater(totalPrice)}
        </AppText>
        <AppText style={styles.totalPriceText}>
          {Num2persian(totalPrice)} تومان
        </AppText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardConatiner: {
    // flex: 1,
    width: "95%",
    marginLeft: "2.5%",
    backgroundColor: colors.light,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
  },
  price: {
    fontFamily: "bKoodak",
    marginTop: 10,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "400",
  },
  totalPrice: {
    color: colors.secondary,
    textAlign: "right",
    paddingRight: 20,
    marginTop: 7,
  },
  totalPriceText: {
    textAlign: "right",
    marginTop: 7,
    paddingRight: 20,
    paddingBottom: 20,
    color: colors.dark,
  },
  number: {
    textAlign: "right",
    paddingRight: 20,
    marginTop: 5,
    fontSize: 15,
  },
  title: {
    fontSize: 25,
    textAlign: "center",
    paddingTop: 10,
  },
});

export default Card;
