import { processResponse } from "@/lib/helper";
import {
  addOrRemoveFromWishList,
  getCourseFilterDataApi,
  getCourseListsForAllApi,
  getSearchCourseListsForNavbarApi,
} from "@/section/public/course.category";
import { IRootState } from "@/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { useSelector } from "react-redux";

export const useGetCourseFilterData = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["CourseFilterData"],
    queryFn: () => getCourseFilterDataApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useGetCourseListsForAll = () => {
  const [page, setPage] = useState<any>(1);
  const [limit, setLimit] = useState(9);
  const [queryParams, setQueryParams] = useState<any>("");

  const { data, isLoading } = useQuery({
    queryKey: ["courseListsForPublic", limit, page, queryParams],
    queryFn: () => getCourseListsForAllApi(page, limit, queryParams),
  });

  return {
    data,
    isLoading,
    setPage,
    setLimit,
    limit,
    setQueryParams,
  };
};

export const useGetSearchCourseListsForNavbar = () => {
  const [search, setSearch] = useState<any>("");

  const [isSearchEnable, setIsSearchEnable] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["searchCourseListsForNavbar", search],
    queryFn: () => getSearchCourseListsForNavbarApi(search),
    enabled: search ? true : false,
  });

  return {
    data,
    isLoading,
    search,
    setSearch,
    setIsSearchEnable,
    isSearchEnable,
  };
};

export const useAddCourseToWishlistOrRemove = () => {
  const queryClient = useQueryClient();
  const { isLoggedIn } = useSelector((state: IRootState) => state.userSlice);
  const router = useRouter();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return addOrRemoveFromWishList(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["courseListsForPublic"]);
      },
    }
  );
  const handleWislistAddOrRemove = async (data: any) => {
    try {
      if (!isLoggedIn) {
        router.push("/login");
        return;
      }
      const response = await mutateAsync(data);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };
  return {
    handleWislistAddOrRemove,
    isLoading,
  };
};
