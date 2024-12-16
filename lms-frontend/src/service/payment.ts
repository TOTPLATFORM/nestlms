import request from "@/lib/request";

export const createStripePaymentIntent = async (amount: number) => {
  const { data } = await request.post("/enroll/create-stripe-intent", {
    amount: amount,
  });
  return data;
};

export const verifyPaymentIntentApiForStripe = async (
  payment_intent_id: any,
  promo_code: any
) => {
  const { data } = await request.post(
    "/enroll/confirm-and-verify-stripe-payment",
    {
      payment_intent_id: payment_intent_id,
      promo_code: promo_code ? promo_code : "",
    }
  );
  return data;
};

export const braintreeDropInPaymentHandlerApi = async (value: any) => {
  const { data } = await request.post(
    "/enroll/confirm-and-verify-braintree-payment",
    {
      amount: value.amount,
      payment_method_nonce: value.payment_method_nonce,
      promo_code: value.promo_code ? value.promo_code : "",
    }
  );
  return data;
};

export const paystackCreatePaymentApi = async (
  promo_code: string,
  amount: string
) => {
  const { data } = await request.post("/enroll/paystack-create-payment", {
    promo_code: promo_code,
    amount,
  });
  return data;
};
