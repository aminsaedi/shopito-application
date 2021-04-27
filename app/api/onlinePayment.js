import client from "./client";

const endPoint = "/onlinePayment";

const startOnlinePayment = (amount, mobile, shoppingId) =>
  client.post(endPoint + "/start", { amount, mobile, description: shoppingId });

const userPayments = (mobile) => client.post(endPoint + "/forUser", { mobile });

export default {
  startOnlinePayment,
  userPayments,
};
