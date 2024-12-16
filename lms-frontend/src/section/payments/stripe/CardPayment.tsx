import { Button } from "@/components/ui/button";
import { errorToast, successToast } from "@/lib/helper";
import { verifyPaymentIntentApiForStripe } from "@/service/payment";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { toast } from "react-toastify";

const CardPayment = ({ setAddPaymentModal, promoCode }: any) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [isStripeLoading, setIsStripeLoading] = useState<any>(false);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setIsStripeLoading(true);

    if (!stripe || !elements) {
      setIsStripeLoading(false);

      return;
    }

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
      redirect: "if_required",
    });

    if (result.error) {
      setIsStripeLoading(false);
      setAddPaymentModal(false);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        let verifyResponse = await verifyPaymentIntentApiForStripe(
          result.paymentIntent.id,
          promoCode
        );

        if (!verifyResponse?.success) {
          errorToast(verifyResponse.message);
          setAddPaymentModal(false);
          setIsStripeLoading(false);

          return;
        }
        router.push("/user/my-courses");
        successToast(verifyResponse.message);
        setAddPaymentModal(false);
        setIsStripeLoading(false);
      }
      setIsStripeLoading(false);
      setAddPaymentModal(false);
    }
  };

  return (
    <div className="p-10">
      <form onSubmit={handleSubmit}>
        <PaymentElement id="payment-elem" />
        <Button
          type="submit"
          className="mt-4 w-full"
          disabled={!stripe || isStripeLoading}
        >
          {isStripeLoading ? `Processing..` : `Submit`}
        </Button>
      </form>
    </div>
  );
};

export default CardPayment;
