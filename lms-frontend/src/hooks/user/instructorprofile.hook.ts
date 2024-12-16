import { getInstructorProfile } from "@/service/user/instructor-profile";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

export const useInstructorProfile = (userName: string) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["getInstructorProfile"],
    queryFn: () => getInstructorProfile(userName),
    enabled: !!userName,
  });

  return {
    isLoading,
    data,
    refetch,
  };
};
