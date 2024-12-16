import { processResponse } from "@/lib/helper";
import { getAllLogLists, getAllLogs, logDeleteApi } from "@/service/admin/logs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const useGetLogLists = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["allLogLists"],
    queryFn: () => getAllLogLists(),
  });

  return {
    data,
    isLoading,
  };
};

export const useGetLogs = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [fileName, setFileName] = useState<any>(null);

  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useQuery({
    queryKey: ["allLogs", search, limit, page, fileName],
    queryFn: () => getAllLogs(page, limit, search, fileName),
    enabled: fileName ? true : false,
  });

  return {
    data,
    isLoading,
    setPage,
    setSearch,
    setLimit,
    setFileName,
    fileName,
    limit,
    page,
  };
};

export const useDeleteLogItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return logDeleteApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["allLogLists"]);
      },
    }
  );

  const handleDeleteLog = async (pack_id: any) => {
    try {
      const response = await mutateAsync(pack_id);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleDeleteLog,
    isLoading,
  };
};
