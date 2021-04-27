import client from "./client";

const endpoint = "/customer";

const registerCustomer = (name, mobile) =>
  client.post(endpoint + "/register", { name, mobile });

const loginCustomer = (mobile) => client.post(endpoint + "/login", { mobile });

const OTPCheck = (mobile, OTP) =>
  client.post(endpoint + "/OTP", { mobile, OTP });

const currentShopping = (customerId, state) =>
  client.post("/shopping/user", { customerId, state });

export default {
  registerCustomer,
  loginCustomer,
  OTPCheck,
  currentShopping,
};
