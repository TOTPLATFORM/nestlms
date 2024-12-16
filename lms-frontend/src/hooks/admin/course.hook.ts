import { processResponse } from "@/lib/helper";
import {
  addEditCourseForAdminApi,
  addLessonForAdminApi,
  addSectionForAdminApi,
  changePendingCourseStatusForAdminApi,
  courseDeleteForAdminApi,
  getAllActiveCategoriesForAdminApi,
  getAllInstructorForAdminApi,
  getAllInstructorWalletListsForAdminApi,
  getCourseDetailsForAdminApi,
  getCourseEnrollmentListsForReportsApi,
  getCourseListsForAdminApi,
  getLessonsBySectionForAdminIdApi,
  getSectionForAdminByIdApi,
  getTransactionListsForReportsApi,
  lessonDeleteForAdminApi,
  sectionDeleteForAdminApi,
  updateLessonForAdminApi,
  updateSectionForAdminApi,
} from "@/service/admin/course";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

export const useGetCourseListsForAdmin = (type: any) => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["courseListsForAdmin", search, limit, page],
    queryFn: () => getCourseListsForAdminApi(page, limit, search, type),
  });

  return {
    data,
    isLoading,
    setPage,
    setSearch,
    setLimit,
    limit,
  };
};

export const useGetCourseDetailsForAdmin = (id: any) => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["CourseDetailsForAdmin", id],
    queryFn: () => getCourseDetails(id),
    enabled: id ? true : false,
  });

  const getCourseDetails = async (id: any) => {
    if (!id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getCourseDetailsForAdminApi(id);
    if (!data.success) {
      toast.error(data.message);
      router.push(`/admin/course`);
      return;
    }
    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useGetActiveCategoryListsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["categoryListsForAdmin"],
    queryFn: () => getAllActiveCategoriesForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useGetInstructorListsForAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["instructorListsForAdmin"],
    queryFn: () => getAllInstructorForAdminApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useDeleteCourseItemForAdmin = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return courseDeleteForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["courseListsForAdmin"]);
      },
    }
  );

  const handleDelete = async (item: any) => {
    try {
      const response = await mutateAsync(item);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleDelete,
    isLoading,
  };
};

export const useAddEditCourseFormHandlerForAdmin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isUpdate, setIsUpdate] = useState(false);

  const [thumbnailImageId, setThumbnailImageId] = useState();
  const [coverImageId, setCoverImageId] = useState();
  const [uploadImageUrlForThumbnailImage, setUploadImageUrlForThumbnailImage] =
    useState();
  const [uploadImageUrlForCoverImage, setUploadImageUrlForCoverImage] =
    useState();

  const [videoId, setVideoId] = useState();
  const [uploadVideoUrl, setUploadVideoUrl] = useState();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return addEditCourseForAdminApi(data);
    },
    {
      onSuccess: () => {
        if (isUpdate) {
          queryClient.invalidateQueries(["courseListsForAdmin"]);
        }
      },
    }
  );

  const handleCourseSettings = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      if (!response.success) {
        processResponse(response);
      }
      if (isUpdate) {
        processResponse(response);
      }
      return response;
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    data,
    handleCourseSettings,
    uploadImageUrlForThumbnailImage,
    setUploadImageUrlForThumbnailImage,
    setUploadImageUrlForCoverImage,
    uploadImageUrlForCoverImage,
    thumbnailImageId,
    setThumbnailImageId,
    setCoverImageId,
    coverImageId,
    videoId,
    setVideoId,
    uploadVideoUrl,
    setUploadVideoUrl,
    isLoading,
    isSuccess,
    setIsUpdate,
  };
};

export const useGetSectionForAdminById = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: [`sectionListsForAdmin`],
    queryFn: () => getSectionForAdminByIdApi(id),
    enabled: id ? true : false,
  });

  return {
    data,
    isLoading,
  };
};

export const useAddSectionForAdminFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      courseId: "",
      title: "",
    },
  });
  const { mutateAsync, isLoading, isSuccess } = useMutation(
    (data: any) => {
      return addSectionForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`sectionListsForAdmin`]);
      },
    }
  );

  const handleAddSection = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleAddSection,
    isLoading,
    isSuccess,
  };
};

export const useEditSectionForAdminFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      id: "",
      courseId: "",
      title: "",
    },
  });
  const { mutateAsync, isLoading, isSuccess } = useMutation(
    (data: any) => {
      return updateSectionForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`sectionListsForAdmin`]);
      },
    }
  );

  const handleUpdateSection = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleUpdateSection,
    isLoading,
    isSuccess,
  };
};

export const useDeleteSectionForAdminItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return sectionDeleteForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["sectionListsForAdmin"]);
      },
    }
  );

  const handleDelete = async (item: any) => {
    try {
      const response = await mutateAsync(item);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleDelete,
    isLoading,
  };
};

export const useAddLessonForAdminFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [videoId, setVideoId] = useState();
  const [uploadVideoUrl, setUploadVideoUrl] = useState<any>();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return addLessonForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["lessonListsForAdmin"]);
      },
    }
  );

  const handleLesonSettings = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      return response;
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    data,
    handleLesonSettings,
    videoId,
    setVideoId,
    uploadVideoUrl,
    setUploadVideoUrl,
    isLoading,
    isSuccess,
  };
};

export const useGetLessonForAdminBySectionId = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: [`lessonListsForAdmin`, id],
    queryFn: () => getLessonsBySectionForAdminIdApi(id),
    enabled: id ? true : false,
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateLessonForAdminFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [videoId, setVideoId] = useState();
  const [uploadVideoUrl, setUploadVideoUrl] = useState<any>();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return updateLessonForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["lessonListsForAdmin"]);
      },
    }
  );

  const handleLesonSettings = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
      return response;
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    data,
    handleLesonSettings,
    videoId,
    setVideoId,
    uploadVideoUrl,
    setUploadVideoUrl,
    isLoading,
    isSuccess,
  };
};

export const useDeleteLessonForAdminItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return lessonDeleteForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["lessonListsForAdmin"]);
      },
    }
  );

  const handleDeleteLesson = async (item: any) => {
    try {
      const response = await mutateAsync(item);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleDeleteLesson,
    isLoading,
  };
};

export const useChangePendingCourseStatusForAdminItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading, isSuccess } = useMutation(
    (data: any) => {
      return changePendingCourseStatusForAdminApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["courseListsForAdmin"]);
      },
    }
  );

  const handleUpdate = async (item: any) => {
    try {
      const response = await mutateAsync(item);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleUpdate,
    isLoading,
    isSuccess,
  };
};

export const useGetCourseEnrollmentListsForReports = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["courseEnrollmentListsForReports", search, limit, page],
    queryFn: () => getCourseEnrollmentListsForReportsApi(page, limit, search),
  });

  return {
    data,
    isLoading,
    setPage,
    setSearch,
    setLimit,
    limit,
  };
};

export const useGetTransactinListsForReports = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["transactinListsForReports", search, limit, page],
    queryFn: () => getTransactionListsForReportsApi(page, limit, search),
  });

  return {
    data,
    isLoading,
    setPage,
    setSearch,
    setLimit,
    limit,
  };
};

export const useGetAllInstructorWalletListsForAdmin = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["allInstructorWalletListsForAdmin", search, limit, page],
    queryFn: () => getAllInstructorWalletListsForAdminApi(page, limit, search),
  });

  return {
    data,
    isLoading,
    setPage,
    setSearch,
    setLimit,
    limit,
  };
};
