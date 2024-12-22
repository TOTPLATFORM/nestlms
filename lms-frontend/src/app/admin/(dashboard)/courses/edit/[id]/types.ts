import { Dispatch, SetStateAction } from 'react';

export interface CourseDetails {
  data: {
    id: string | number;
    name?: string;
    duration?: number;
    short_description?: string;
    description?: string;
    price?: number;
    meta_title?: string;
    meta_keyword?: string;
    meta_description?: string;
    requirments?: string;
    video_upload_source?: string;
    private_status?: boolean;
    course_level?: string;
    is_free?: boolean;
    discount_status?: boolean;
    discount_type?: string;
    discount_value?: number;
    category?: { id: number; name: string };
    sub_category?: { id: number; name: string };
    sub_category_id?: number;
    User?: { id: number; first_name: string; last_name: string };
    demo_video?: string;
    cover_image_link?: string;
    thumbnail_link?: string;
    what_you_will_learn?: string;
  };
}

export interface EditCourseClientProps {
  params: {
    id: string;
  };
}

export interface FormHandlerReturn {
  data: CourseDetails;
  form: any;
  handleCourseSettings: (data: any) => Promise<unknown>;
  uploadImageUrlForThumbnailImage: string | null | undefined;
  setUploadImageUrlForThumbnailImage: Dispatch<SetStateAction<string | null | undefined>>;
  uploadImageUrlForCoverImage: string | null | undefined;
  setUploadImageUrlForCoverImage: Dispatch<SetStateAction<string | null | undefined>>;
  thumbnailImageId: string | null | undefined;
  setThumbnailImageId: Dispatch<SetStateAction<string | null | undefined>>;
  coverImageId: string | null | undefined;
  setCoverImageId: Dispatch<SetStateAction<string | null | undefined>>;
  videoId: string | null | undefined;
  setVideoId: Dispatch<SetStateAction<string | null | undefined>>;
  uploadVideoUrl: string | null | undefined;
  setUploadVideoUrl: Dispatch<SetStateAction<string | null | undefined>>;
  isLoading: boolean;
  isSuccess: boolean;
}
