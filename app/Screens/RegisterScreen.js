import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
  Modal,
  Button,
  Animated,
  TouchableOpacity,
} from "react-native";
import * as Yup from "yup";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";

import AppForm from "../components/forms/AppForm";
import AppFormField from "../components/forms/AppFormField";
import ErrorMessage from "../components/forms/ErrorMessage";
import SubmitButton from "../components/forms/SubmitButton";
import Screen from "../components/modules/Screen";
import AppText from "../components/modules/AppText";
import AppButton from "../components/modules/AppButton";
import colors from "../config/colors";

import customerApi from "../api/customer";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";
import AppLoading from "expo-app-loading";
import ActivityIndicator from "../components/modules/ActivityIndicator";

const registerValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("نام خود را وارد کنید")
    .min(5, "حداقل طول نام ۵ کاراکتر است")
    .max(20, "حداکثر طول نام ۲۰ کاراکتر است"),
  mobile: Yup.string()
    .required("شماره موبایل را وارد کنید")
    .matches(
      /^[0][9][0-9][0-9]{8,8}$/g,
      "شماره موبایل را به صورت ۰۹۱۳۰۰۰۰۰۰۰ وارد کنید"
    ),
});
const OTPValidationSchema = Yup.object().shape({
  OTP: Yup.number().required("کد ارسال شده را وارد کنید"),
});

function RegisterScreen(props) {
  const { logIn } = useAuth();
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(0);
  const [resetClock, setResetClock] = useState(0);
  const [tempUser, setTempUser] = useState();
  const [loading, setLoading] = useState(false);

  const registerApi = useApi(customerApi.registerCustomer);
  const OTPApi = useApi(customerApi.OTPCheck);

  const handleResetClock = async () => {
    setLoading(true);
    const result = await customerApi.loginCustomer(tempUser.mobile);
    setLoading(false);
    setResetClock(resetClock + 1);
  };
  const handleRegister = async ({ name, mobile }) => {
    setLoading(true);
    const result = await customerApi.registerCustomer(name, mobile);
    setLoading(false);
    if (result.ok) {
      setStep(step + 1);
      setTempUser(result.data);
      setError(false);
    }
    if (result.status === 400) {
      setError(true);
      setMessage("شماره موبایل قبلا ثبت شده");
    }
  };
  const handleOTP = async ({ OTP }) => {
    const result = await customerApi.OTPCheck(tempUser.mobile, OTP);
    if (result.status === 200) {
      setError(false);
      logIn(result.data);
    }
    if (result.status === 400) {
      setError(true);
      setMessage("کد وارد شده اشتباه است");
    }
  };

  return (
    <>
      <ActivityIndicator visible={loading} size="large" />
      <Modal animationType="slide" visible={step == 1}>
        <Screen style={{ padding: 10 }}>
          <AppText style={styles.welcomeText}>
            کاربر {tempUser && tempUser.name} خوش آمدید
          </AppText>
          <View style={{ alignItems: "center" }}>
            <CountdownCircleTimer
              isPlaying
              duration={120}
              colors={[
                ["#004777", 0.4],
                ["#F7B801", 0.4],
                ["#A30000", 0.2],
              ]}
              strokeWidth={18}
              key={resetClock}
            >
              {({ remainingTime, animatedColor }) => (
                <>
                  {remainingTime !== 0 && (
                    <Animated.Text
                      style={{ color: animatedColor, fontFamily: "bKoodak" }}
                    >
                      تا ارسال مجدد کد : {remainingTime}
                    </Animated.Text>
                  )}
                  {remainingTime === 0 && (
                    <TouchableOpacity onPress={handleResetClock}>
                      <AppText>ارسال دوباره کد</AppText>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </CountdownCircleTimer>
          </View>
          <AppForm
            initialValues={{ OTP: "" }}
            onSubmit={handleOTP}
            validationSchema={OTPValidationSchema}
          >
            <ErrorMessage error={message} visible={error} />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              name="OTP"
              icon="numeric"
              placeholder="کد ارسال شده را وارد کنید"
              textContentType="oneTimeCode"
            />
            <SubmitButton title="ورود" />
          </AppForm>
          <AppButton
            title="ویرایش شماره"
            onPress={() => setStep(step - 1)}
            color={colors.secondary}
          />
        </Screen>
      </Modal>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <Screen style={styles.container}>
          <Image source={require("../assets/logo.png")} style={styles.logo} />
          <AppForm
            initialValues={{ mobile: "", name: "" }}
            onSubmit={handleRegister}
            validationSchema={registerValidationSchema}
          >
            <ErrorMessage error={message} visible={error} />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="default"
              name="name"
              icon="account"
              placeholder="نام و نام خانوادگی"
            />
            <AppFormField
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="number-pad"
              name="mobile"
              icon="phone"
              placeholder="شماره موبایل"
            />
            <SubmitButton title="ثبت نام" />
          </AppForm>
        </Screen>
      </TouchableWithoutFeedback>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginTop: 50,
    marginBottom: 20,
  },
  welcomeText: {
    textAlign: "center",
    paddingVertical: 10,
  },
});

export default RegisterScreen;
