import { processResponse } from "@/lib/helper";
import { braintreeDropInPaymentHandlerApi } from "@/service/payment";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";

export const useBraintreeDropInPaymentHandler = () => {
  const router = useRouter();

  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return braintreeDropInPaymentHandlerApi(data);
  });

  const handleBraintreeDropInPayment = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      return response;
    } catch (error) {
      processResponse(error);
    }
  };

  return {
    handleBraintreeDropInPayment,
    isLoading,
  };
};
