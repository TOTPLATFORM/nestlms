import { processResponse } from "@/lib/helper";
import {
  addAnswerApi,
  addCourseApi,
  addEditCourseApi,
  addLessonApi,
  addQuestionApi,
  addQuizApi,
  addSectionApi,
  addUserReviewApi,
  answerDeleteApi,
  checkCourseEnrollment,
  courseDeleteApi,
  getAllActiveCategoriesForUserApi,
  getAnswersByQuestionIdApi,
  getCourseDetailsApi,
  getCourseDetailsPublic,
  getCourseListsForInstructorApi,
  getEnrolledCourseDetailsApi,
  getEnrolledCourses,
  getInstructroStudentsApi,
  getLessonsBySectionIdApi,
  getMyWishlistCourseListsApi,
  getQuestionsByQuizIdApi,
  getQuizByCourseIdApi,
  getSectionByIdApi,
  getUserQuizDetailsByQuizIdApi,
  getUserReviewDetailsByCourseIdApi,
  lessonDeleteApi,
  questionDeleteApi,
  quizDeleteApi,
  sectionDeleteApi,
  updateAnswerApi,
  updateCourseApi,
  updateLessonApi,
  updateQuestionApi,
  updateQuizApi,
  updateSectionApi,
} from "@/service/user/course";
import { IRootState } from "@/store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next-nprogress-bar";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
export const useGetEnrolledCourses = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["courseListsForInstructor", search, limit, page],
    queryFn: () => getEnrolledCourses(page, limit, search),
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
export const useGetInstructroStudentsApi = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["getInstructroStudentsApi", search, limit, page],
    queryFn: () => getInstructroStudentsApi(page, limit, search),
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
export const useGetCourseListsForInstructor = () => {
  const [page, setPage] = useState<any>(1);
  const [search, setSearch] = useState<any>("");
  const [limit, setLimit] = useState(10);

  const { data, isLoading } = useQuery({
    queryKey: ["courseListsForInstructor", search, limit, page],
    queryFn: () => getCourseListsForInstructorApi(page, limit, search),
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

export const useGetActiveCategoryListsForUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["categoryListsForUser"],
    queryFn: () => getAllActiveCategoriesForUserApi(),
  });

  return {
    data,
    isLoading,
  };
};

export const useAddCourseFormHandler = () => {
  const router = useRouter();

  const [thumbnailImageId, setThumbnailImageId] = useState();
  const [coverImageId, setCoverImageId] = useState();
  const [uploadImageUrlForThumbnailImage, setUploadImageUrlForThumbnailImage] =
    useState();
  const [uploadImageUrlForCoverImage, setUploadImageUrlForCoverImage] =
    useState();

  const [videoId, setVideoId] = useState();
  const [uploadVideoUrl, setUploadVideoUrl] = useState();

  const form = useForm();
  const { mutateAsync, isLoading } = useMutation((data: any) => {
    return addCourseApi(data);
  });

  const handleCourseSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        privateStatus: data.privateStatus?.value,
        courseLevel: data.courseLevel?.value,
        isFree: data.isFree?.value,
        discountStatus: data.discountStatus?.value,
        discount_type: data.discount_type?.value,
        discount_value: data.discount_value
          ? parseFloat(data.discount_value)
          : 0,
        categoryId: data.categoryId?.value,
        subCategoryId: data.subCategoryId?.value,
        duration: parseFloat(data.duration),
        price: parseFloat(data.price),
        demoVideo: `${data.demoVideo}`,
        video_upload_source: data.video_upload_source?.value,
      };
      const response = await mutateAsync(value);
      processResponse(response);

      if (response.success) {
        router.push(`/instructor/courses`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
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
  };
};

export const useDeleteCourseItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return courseDeleteApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["courseListsForInstructor"]);
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

export const useGetCourseDetails = (id: any) => {
  const router = useRouter();
  const { data, isLoading } = useQuery({
    queryKey: ["CourseDetails", id],
    queryFn: () => getCatDetails(id),
    enabled: id ? true : false,
  });

  const getCatDetails = async (id: any) => {
    if (!id) {
      toast.error("Id Not Found");
      return;
    }
    const data = await getCourseDetailsApi(id);
    if (!data.success) {
      toast.error(data.message);
      router.push(`/instructor/course`);
      return;
    }
    return data;
  };

  return {
    data,
    isLoading,
  };
};

export const useUpdateCourseFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [thumbnailImageId, setThumbnailImageId] = useState();
  const [coverImageId, setCoverImageId] = useState();
  const [uploadImageUrlForThumbnailImage, setUploadImageUrlForThumbnailImage] =
    useState();
  const [uploadImageUrlForCoverImage, setUploadImageUrlForCoverImage] =
    useState();

  const [videoId, setVideoId] = useState();
  const [uploadVideoUrl, setUploadVideoUrl] = useState<any>();

  const form = useForm();
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return updateCourseApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["courseListsForInstructor"]);
      },
    }
  );

  const handleCourseSettings = async (data: any) => {
    try {
      let value = {
        ...data,
        privateStatus: data.privateStatus?.value,
        courseLevel: data.courseLevel?.value,
        isFree: data.isFree?.value,
        discountStatus: data.discountStatus?.value,
        discount_type: data.discount_type?.value,
        discount_value: data.discount_value
          ? parseFloat(data.discount_value)
          : 0,
        categoryId: data.categoryId?.value,
        subCategoryId: data.subCategoryId?.value,
        duration: parseFloat(data.duration),
        price: parseFloat(data.price),
        video_upload_source: data.video_upload_source?.value,
      };
      const response = await mutateAsync(value);
      processResponse(response);

      if (response.success) {
        router.push(`/instructor/courses`);
      }
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
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
  };
};

export const useAddEditCourseFormHandler = () => {
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
      return addEditCourseApi(data);
    },
    {
      onSuccess: () => {
        if (isUpdate) {
          queryClient.invalidateQueries(["courseListsForInstructor"]);
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

export const useGetSectionById = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: [`sectionLists`],
    queryFn: () => getSectionByIdApi(id),
    enabled: id ? true : false,
  });

  return {
    data,
    isLoading,
  };
};

export const useAddSectionFormHandler = () => {
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
      return addSectionApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`sectionLists`]);
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

export const useGetSectionDetailsById = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: [`sectionDetails`],
    queryFn: () => getSectionByIdApi(id),
  });

  return {
    data,
    isLoading,
  };
};

export const useEditSectionFormHandler = () => {
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
      return updateSectionApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`sectionLists`]);
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

export const useDeleteSectionItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return sectionDeleteApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["sectionLists"]);
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

export const useAddLessonFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [videoId, setVideoId] = useState();
  const [uploadVideoUrl, setUploadVideoUrl] = useState<any>();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return addLessonApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["lessonLists"]);
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

export const useGetLessonBySectionId = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: [`lessonLists`, id],
    queryFn: () => getLessonsBySectionIdApi(id),
    enabled: id ? true : false,
  });

  return {
    data,
    isLoading,
  };
};

export const useUpdateLessonFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [videoId, setVideoId] = useState();
  const [uploadVideoUrl, setUploadVideoUrl] = useState<any>();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return updateLessonApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["lessonLists"]);
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

export const useDeleteLessonItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return lessonDeleteApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["lessonLists"]);
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
export const useGetPublicCourseDetails = (slug: any) => {
  const router = useRouter();
  const { isLoggedIn } = useSelector((state: IRootState) => state.userSlice);

  const { data: courseDetails, isLoading: isCourseDetailsLoading } = useQuery({
    queryKey: ["CourseDetailsPublic", slug],
    queryFn: () => getCatDetails(slug),
    enabled: slug ? true : false,
  });

  const { data: enrollmentData, isLoading: isEnrollmentLoading } = useQuery({
    queryKey: ["EnrollmentDetails", courseDetails?.data?.id],
    queryFn: () => checkCourseEnrollment(courseDetails?.data?.id),
    enabled: courseDetails?.data?.id && isLoggedIn ? true : false,
  });

  const getCatDetails = async (id: any) => {
    if (!id) {
      toast.error("Id Not Found");
      return;
    }
    const details = await getCourseDetailsPublic(slug);
    if (!details.success) {
      toast.error(details.message);
      router.push(`/instructor/course`);
      return;
    }
    return details;
  };

  return {
    data: courseDetails?.data,
    course_enrolled: enrollmentData?.success,
    isLoading: isCourseDetailsLoading,
  };
};

export const useGetQuizByCourseId = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: [`quizLists`],
    queryFn: () => getQuizByCourseIdApi(id),
    enabled: id ? true : false,
  });

  return {
    data,
    isLoading,
  };
};

export const useAddQuizFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      course_id: "",
      section_id: {},
      title: "",
      time: "",
      max_attempts: "",
      pass_mark: "",
      expiry_days: "",
      qus_limit: "",
      display_qus_randomly: {},
      display_limited_qus: {},
      certificate_included: {},
      status: {},
    },
  });
  const { mutateAsync, isLoading, isSuccess } = useMutation(
    (data: any) => {
      return addQuizApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`quizLists`]);
      },
    }
  );

  const handleAddQuiz = async (data: any) => {
    try {
      let value: any = {
        title: data.title,
        course_id: Number(data.course_id),
        time: Number(data.time),
        max_attempts: Number(data.max_attempts),
        pass_mark: Number(data.pass_mark),
        expiry_days: 0,
        section_id: Number(data?.section_id?.value),
        display_qus_randomly: data?.display_qus_randomly?.value,
        certificate_included: 0,
        display_limited_qus: 0,
        status: data?.status?.value,
      };
      if (data.qus_limit) {
        value = {
          ...value,
          qus_limit: 0,
        };
      }
      const response = await mutateAsync(value);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleAddQuiz,
    isLoading,
    isSuccess,
  };
};

export const useDeleteQuizItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return quizDeleteApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["quizLists"]);
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

export const useUpdateQuizFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      id: "",
      course_id: "",
      section_id: {},
      title: "",
      time: "",
      max_attempts: "",
      pass_mark: "",
      expiry_days: "",
      qus_limit: "",
      display_qus_randomly: {},
      display_limited_qus: {},
      certificate_included: {},
      status: {},
    },
  });
  const { mutateAsync, isLoading, isSuccess } = useMutation(
    (data: any) => {
      return updateQuizApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`quizLists`]);
      },
    }
  );

  const handleUpdateQuiz = async (data: any) => {
    try {
      let value: any = {
        title: data.title,
        course_id: Number(data.course_id),
        time: Number(data.time),
        max_attempts: Number(data.max_attempts),
        pass_mark: Number(data.pass_mark),
        expiry_days: 0,
        section_id: Number(data?.section_id?.value),
        display_qus_randomly: data?.display_qus_randomly?.value,
        certificate_included: 0,
        display_limited_qus: 0,
        status: data?.status?.value,
      };
      if (data.qus_limit) {
        value = {
          ...value,
          qus_limit: 0,
        };
      }
      const response = await mutateAsync({ data: value, id: data.id });
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleUpdateQuiz,
    isLoading,
    isSuccess,
  };
};

export const useGetQuestionByQuizId = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: [`quesionLists`, id],
    queryFn: () => getQuestionsByQuizIdApi(id),
    enabled: id ? true : false,
  });

  return {
    data,
    isLoading,
  };
};

export const useAddQuestionFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [videoId, setVideoId] = useState();
  const [uploadVideoUrl, setUploadVideoUrl] = useState<any>();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return addQuestionApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["quesionLists"]);
      },
    }
  );

  const handleQuestionSettings = async (data: any) => {
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
    handleQuestionSettings,
    videoId,
    setVideoId,
    uploadVideoUrl,
    setUploadVideoUrl,
    isLoading,
    isSuccess,
  };
};

export const useDeleteQuestionItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return questionDeleteApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["quesionLists"]);
      },
    }
  );

  const handleDeleteQuestion = async (item: any) => {
    try {
      const response = await mutateAsync(item);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleDeleteQuestion,
    isLoading,
  };
};

export const useUpdateQuestionFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [videoId, setVideoId] = useState();
  const [uploadVideoUrl, setUploadVideoUrl] = useState<any>();

  const form = useForm<any>();
  const { mutateAsync, isLoading, data, isSuccess } = useMutation(
    (data: any) => {
      return updateQuestionApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["quesionLists"]);
      },
    }
  );

  const handleQuestionSettings = async (data: any, quesId: any) => {
    try {
      const response = await mutateAsync({ data: data, id: quesId });
      processResponse(response);
      return response;
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    data,
    handleQuestionSettings,
    videoId,
    setVideoId,
    uploadVideoUrl,
    setUploadVideoUrl,
    isLoading,
    isSuccess,
  };
};

export const useGetAnswerByQuestionId = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: [`answerLists`, id],
    queryFn: () => getAnswersByQuestionIdApi(id),
    enabled: id ? true : false,
  });

  return {
    data,
    isLoading,
  };
};

export const useAddAnswerFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      title: "",
      is_correct: {},
      quiz_id: "",
      quiz_question_id: "",
    },
  });
  const { mutateAsync, isLoading, isSuccess } = useMutation(
    (data: any) => {
      return addAnswerApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`answerLists`]);
      },
    }
  );

  const handleAddAnswer = async (data: any) => {
    try {
      let value: any = {
        title: data.title,
        quiz_id: Number(data.quiz_id),
        quiz_question_id: Number(data.quiz_question_id),
        is_correct: data?.is_correct?.value,
      };

      const response = await mutateAsync(value);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleAddAnswer,
    isLoading,
    isSuccess,
  };
};

export const useDeleteAnswerItem = () => {
  const queryClient = useQueryClient();

  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return answerDeleteApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(["answerLists"]);
      },
    }
  );

  const handleDeleteAnswer = async (item: any) => {
    try {
      const response = await mutateAsync(item);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    handleDeleteAnswer,
    isLoading,
  };
};

export const useUpdateAnswerFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      id: "",
      title: "",
      is_correct: {},
      quiz_id: "",
      quiz_question_id: "",
    },
  });
  const { mutateAsync, isLoading, isSuccess } = useMutation(
    (data: any) => {
      return updateAnswerApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`answerLists`]);
      },
    }
  );

  const handleUpdateAnswer = async (data: any) => {
    try {
      let value: any = {
        title: data.title,
        quiz_id: Number(data.quiz_id),
        quiz_question_id: Number(data.quiz_question_id),
        is_correct: data?.is_correct?.value,
      };

      const response = await mutateAsync({ data: value, id: data.id });
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleUpdateAnswer,
    isLoading,
    isSuccess,
  };
};

export const useGetEnrolledCourseDetails = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: [`enrolledCourseDetails`, id],
    queryFn: () => getEnrolledCourseDetailsApi(id),
    enabled: id ? true : false,
  });

  return {
    data,
    isLoading,
  };
};

export const useAddReviewForUserFormHandler = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      content: "",
      rating: "",
      course_id: "",
    },
  });
  const { mutateAsync, isLoading, isSuccess } = useMutation(
    (data: any) => {
      return addUserReviewApi(data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([`userReviewDetailsByCourseId`]);
      },
    }
  );

  const handleAddReviewForUser = async (data: any) => {
    try {
      const response = await mutateAsync(data);
      processResponse(response);
    } catch (error: any) {
      processResponse(error?.response?.data);
    }
  };

  return {
    form,
    handleAddReviewForUser,
    isLoading,
    isSuccess,
  };
};

export const useGetUserReviewDetailsByCourseId = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: [`userReviewDetailsByCourseId`, id],
    queryFn: () => getUserReviewDetailsByCourseIdApi(id),
    enabled: id ? true : false,
  });

  return {
    data,
    isLoading,
  };
};

export const useGetQuizDetailsByQuizId = (id: any) => {
  const { data, isLoading } = useQuery({
    queryKey: [`userQuizDetailsByQuizId`, id],
    queryFn: () => getUserQuizDetailsByQuizIdApi(id),
    enabled: id ? true : false,
  });

  return {
    data,
    isLoading,
  };
};

export const useGetMyWishlistCourseLists = () => {
  const [page, setPage] = useState<any>(1);
  const [limit, setLimit] = useState(9);

  const { data, isLoading } = useQuery({
    queryKey: ["myWishlistCourseLists", limit, page],
    queryFn: () => getMyWishlistCourseListsApi(page, limit),
  });

  return {
    data,
    isLoading,
    setPage,
    setLimit,
    limit,
  };
};
