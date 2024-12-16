"use client";
import { Fragment, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import {
  Dialog,
  Popover,
  RadioGroup,
  Tab,
  Transition,
} from "@headlessui/react";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import {
  useMyCartDetails,
  useValidateCoupon,
} from "@/hooks/user/enrollment.hook";
import { InputType } from "@/components/form/InputType";
import LoaderButton from "@/components/button/LoaderButton";
import { errorToast } from "@/lib/helper";
import {
  createStripePaymentIntent,
  paystackCreatePaymentApi,
} from "@/service/payment";
import CardPayment from "@/section/payments/stripe/CardPayment";
import { useRouter } from "next-nprogress-bar";
import { Skeleton } from "@/components/ui/skeleton";
import SectionLoader from "@/components/SectionLoader";
import { PAYMENT_METHODS } from "@/constant/core";
import DropIn from "braintree-web-drop-in-react";
import { useBraintreeDropInPaymentHandler } from "@/section/payments/braintree/Braintree.hook";

const paymentOptions = [
  { name: "Stripe", value: PAYMENT_METHODS.STRIPE },
  { name: "Paypal", value: PAYMENT_METHODS.PAYPAL },
  { name: "Paystack", value: PAYMENT_METHODS.PAYSTACK },
  { name: "Google Pay", value: 5 },
];
function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export default function CheckOut() {
  const router = useRouter();
  const [instance, setInstance] = useState<any>(null);

  const { data } = useSelector((state: IRootState) => state.common);
  const {
    isLoading: CartLoading,
    productsList,
    totalPrice,
  } = useMyCartDetails();

  const { isLoading: isBraintreePaymentLoading, handleBraintreeDropInPayment } =
    useBraintreeDropInPaymentHandler();

  const [myTotalPrice, setTotalPrice] = useState<any>(totalPrice);
  const [myDiscountPrice, setDiscountPrice] = useState<any>(0);
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [showStripeModal, setShowStripeModal] = useState<any>(false);
  const [showPaypalModal, setShowPaypalModal] = useState<any>(false);
  const [showGooglePayModal, setShowGooglePayModal] = useState<any>(false);

  const stripePromise = loadStripe(data?.stripe?.pm_stripe_client_id_live);

  const [selectedPayment, setSelectedPayment] = useState(0);
  const { form, handleValidateCoupon, isLoading } = useValidateCoupon(
    setDiscountPrice,
    setTotalPrice
  );
  const promoCode = form.watch("promo_code");
  useEffect(() => {
    setTotalPrice(totalPrice);
  }, [totalPrice]);
  const sripePaymentHandler = async () => {
    try {
      const paymentIntentResponse = await createStripePaymentIntent(
        parseFloat(totalPrice)
      );
      if (!paymentIntentResponse.success) {
        errorToast(paymentIntentResponse.message);
        return;
      }
      setPaymentIntent(paymentIntentResponse.data.intent);
      setShowStripeModal(true);
    } catch (error: any) {
      if (!error.response.data.success) {
        errorToast(error.response.data.message);
      }
    }
  };

  const handleConfirmOrder = () => {
    if (selectedPayment == 0) {
      errorToast("Select Payment Method");
      return;
    }
    if (selectedPayment == 1) {
      sripePaymentHandler();
    }
    if (selectedPayment == PAYMENT_METHODS.PAYPAL) {
      setShowPaypalModal(true);
    }
    if (selectedPayment == 5) {
      setShowGooglePayModal(true);
    }
    if (selectedPayment == PAYMENT_METHODS.PAYSTACK) {
      paystackPaymentHandler();
    }
  };

  const handlePromoAmount = (value: any) => {
    if (!value.promo_code) {
      errorToast("Please enter Promo Code");
      return;
    }
    handleValidateCoupon({
      promo_code: value.promo_code,
      total_amount: totalPrice,
    });
  };

  const buyPack = async () => {
    try {
      const { nonce } = await instance.requestPaymentMethod();
      if (!nonce) {
        return;
      }
      const data = await handleBraintreeDropInPayment({
        amount: 1,
        payment_method_nonce: nonce,
        promo_code: promoCode,
      });

      setShowPaypalModal(false);
    } catch (err: any) {}
  };

  const paystackPaymentHandler = async () => {
    try {
      const paymentIntentResponse = await paystackCreatePaymentApi(
        promoCode,
        totalPrice
      );

      if (!paymentIntentResponse.success) {
        errorToast(paymentIntentResponse.message);
        return;
      }

      const authorizationUrl =
        paymentIntentResponse?.data?.data?.authorization_url;

      if (authorizationUrl) {
        window.location.href = authorizationUrl;
      } else {
        console.error("Authorization URL not found in the response");
      }
    } catch (error: any) {
      if (!error.response?.data?.success) {
        errorToast(error.response?.data?.message || "An error occurred");
      }
    }
  };

  return (
    <>
      <div className="container">
        <main className="py-16">
          <h1 className="mb-6 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Checkout
          </h1>
          <div className="mx-auto max-w-2xl lg:max-w-none">
            <h1 className="sr-only">Checkout</h1>

            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
              <div>
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    Your Cart Items
                  </h2>
                </div>
                <div className="mt-6">
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(handlePromoAmount)}
                      className="space-y-4"
                    >
                      <div className="mt-1 flex items-end justify-between gap-4 rounded-md">
                        <div className="w-full">
                          <InputType
                            form={form}
                            formName={"promo_code"}
                            formLabel={"Promo Code"}
                            formPlaceholder={"Enter Promo Code"}
                            formDescription={null}
                            isErrorMessageShow={false}
                          />
                        </div>
                        <div className="mb-2">
                          <LoaderButton
                            buttonText={`Apply`}
                            isLoading={isLoading}
                            loaderText={"Applying..."}
                          />
                        </div>
                      </div>
                    </form>
                  </Form>
                </div>

                <div className="mt-4 ">
                  <fieldset className="mt-4">
                    <div className="space-y-4 text-sm sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                      Select Payemt Type
                    </div>
                    <div className="mt-4 space-y-4">
                      {paymentOptions.map((option, optionIdx) => (
                        <div key={optionIdx} className="flex items-center">
                          <input
                            id={`payment-${option.value}`}
                            name={`duration`}
                            type="radio"
                            className="accent-primary h-4 w-4 rounded border-gray-300 "
                            onChange={() => setSelectedPayment(option.value)}
                            checked={selectedPayment == option.value}
                          />
                          <label
                            htmlFor={`payment-${option.value}`}
                            className="ml-3 flex min-w-0 items-center gap-x-1 text-gray-500"
                          >
                            <p className="pl-2 text-sm">{option.name}</p>
                          </label>
                        </div>
                      ))}
                    </div>
                  </fieldset>
                </div>
              </div>

              <div className="mt-10 lg:mt-0">
                <h2 className="text-lg font-medium text-gray-900">
                  Order summary
                </h2>
                <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-md">
                  <h3 className="sr-only">Items in your cart</h3>

                  <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Subtotal</dt>
                      {CartLoading ? (
                        <Skeleton className="h-4 w-1/2" />
                      ) : (
                        <dd className="text-sm font-medium text-gray-900">
                          ${totalPrice ? totalPrice : 0}{" "}
                        </dd>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <dt className="text-sm">Discount</dt>
                      {CartLoading ? (
                        <Skeleton className="h-4 w-1/2" />
                      ) : (
                        <dd className="text-sm font-medium text-gray-900">
                          ${myDiscountPrice ? myDiscountPrice : 0}
                        </dd>
                      )}
                    </div>
                    <div className="flex items-center justify-between border-t border-gray-200 pt-6">
                      <dt className="text-base font-medium">Total</dt>
                      {CartLoading ? (
                        <Skeleton className="h-4 w-1/2" />
                      ) : (
                        <dd className="text-base font-medium text-gray-900">
                          ${myTotalPrice ? myTotalPrice : 0}
                        </dd>
                      )}
                    </div>
                  </dl>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <Button
                      type="button"
                      className="w-full"
                      disabled={!productsList}
                      onClick={handleConfirmOrder}
                    >
                      Confirm order
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <Transition appear show={showStripeModal} as={Fragment}>
        <Dialog
          as="div"
          open={showStripeModal}
          onClose={() => setShowStripeModal(false)}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[black]/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="panel dark:text-white-dark w-full max-w-2xl overflow-hidden rounded-lg border-0 p-0 text-black">
                  <button
                    type="button"
                    onClick={() => setShowStripeModal(false)}
                    className="absolute right-4 top-4 text-gray-400 outline-none hover:text-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  {paymentIntent?.client_secret && (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret: paymentIntent.client_secret,
                      }}
                    >
                      <CardPayment
                        setAddPaymentModal={setShowStripeModal}
                        promoCode={promoCode}
                      />
                    </Elements>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={showPaypalModal} as={Fragment}>
        <Dialog
          as="div"
          open={showPaypalModal}
          onClose={() => setShowPaypalModal(false)}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[black]/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="panel dark:text-white-dark w-full max-w-2xl overflow-hidden rounded-lg border-0 p-0 text-black">
                  <button
                    type="button"
                    onClick={() => setShowPaypalModal(false)}
                    className="absolute right-4 top-4 text-gray-400 outline-none hover:text-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  <div className="p-8">
                    <DropIn
                      options={{
                        authorization: "sandbox_7b5x4wq9_75ybmq4kqtb886fr",
                        card: false,

                        paypal: {
                          flow: "checkout",
                          amount: totalPrice,
                          currency: "USD",
                        },
                      }}
                      onInstance={setInstance}
                    />
                    <div>
                      <Button
                        disabled={
                          !instance || (instance && isBraintreePaymentLoading)
                        }
                        className="w-full"
                        onClick={buyPack}
                      >
                        {instance && isBraintreePaymentLoading
                          ? `Processing..`
                          : `Buy`}
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Transition appear show={showGooglePayModal} as={Fragment}>
        <Dialog
          as="div"
          open={showGooglePayModal}
          onClose={() => setShowGooglePayModal(false)}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-[black]/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center px-4 py-8">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="panel dark:text-white-dark w-full max-w-2xl overflow-hidden rounded-lg border-0 p-0 text-black">
                  <button
                    type="button"
                    onClick={() => setShowGooglePayModal(false)}
                    className="absolute right-4 top-4 text-gray-400 outline-none hover:text-gray-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                  <div className="p-8">
                    <DropIn
                      options={{
                        authorization: "sandbox_7b5x4wq9_75ybmq4kqtb886fr",
                        card: false,
                        googlePay: {
                          merchantId: "BCR2DN4T23L2B2DQ",
                          googlePayVersion: 1,
                          transactionInfo: {
                            currencyCode: "USD",
                            totalPriceStatus: "FINAL",
                            totalPrice: totalPrice,
                          },
                        },
                      }}
                      onInstance={setInstance}
                    />
                    <div>
                      <Button
                        disabled={
                          !instance || (instance && isBraintreePaymentLoading)
                        }
                        className="w-full"
                        onClick={buyPack}
                      >
                        {instance && isBraintreePaymentLoading
                          ? `Processing..`
                          : `Buy`}
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}
