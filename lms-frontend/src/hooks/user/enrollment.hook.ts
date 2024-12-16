import { processResponse } from "@/lib/helper";
import {
  addToCart,
  myCartDetails,
  validateCoupon,
  removeFromCart,
} from "@/service/user/enrollment";
import { IRootState } from "@/store";
import { setCart } from "@/store/slice/cart.slice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next-nprogress-bar";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";

export const useAddCourseToCart = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useSelector((state: IRootState) => state.userSlice);
  const router = useRouter();
  const { refetch } = useMyCartDetails();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return addToCart(data);
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );
  const handleAddToCart = async (course_id: number) => {
    try {
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }
      const response = await mutateAsync({ course_id });
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };
  return {
    handleAddToCart,
    isLoading,
  };
};
export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const { refetch } = useMyCartDetails();

  const { mutateAsync, isLoading } = useMutation(
    (courseId: number) => {
      return removeFromCart(courseId);
    },
    {
      onSuccess: () => {
        refetch();
      },
    }
  );

  const handleRemoveFromCart = async (courseId: number) => {
    try {
      const response = await mutateAsync(courseId);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleRemoveFromCart,
    isLoading,
  };
};
export const useMyCartDetails = () => {
  const dispatch = useDispatch();
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["my-cart-details"],
    queryFn: () => myCartDetails(),
    enabled: Cookies.get("token") ? true : false,
  });
  useEffect(() => {
    data?.data ? dispatch(setCart(data?.data)) : dispatch(setCart(null));
  }, [data]);

  return {
    totalPrice: data?.data?.totalPrice,
    productsList: data?.data?.productsList,
    isLoading,
    refetch,
  };
};

export const useValidateCoupon = (
  setDiscountPrice: any,
  setTotalPrice: any
) => {
  const form = useForm<any>();

  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return validateCoupon(data);
  });
  const handleValidateCoupon = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      setDiscountPrice(response.data.discountAmount);
      setTotalPrice(response.data.discountedPrice);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };
  return {
    handleValidateCoupon,
    isLoading,
    form,
  };
};
