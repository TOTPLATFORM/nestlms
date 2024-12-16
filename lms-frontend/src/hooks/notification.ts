import { getNotificationApi } from "@/service/notification";
import { IRootState } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useSelector } from "react-redux";

export const useGetNotification = (limitSize = 5, seen = 0) => {
  const [page, setPage] = useState<any>(1);
  const [limit, setLimit] = useState(limitSize);

  const { user, isLoggedIn } = useSelector(
    (state: IRootState) => state.userSlice
  );
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getNotification"],
    queryFn: () => getNotificationApi(page, limit, seen),
    enabled: isLoggedIn,
  });

  return {
    isLoading,
    data: data?.data,
    refetch,
    setPage,
    setLimit,
    limit,
  };
};
