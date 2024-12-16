import { processResponse } from "@/lib/helper";
import { getMyImages, getMyVideos, uploadFile } from "@/service/file";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useFile = (setopen: any) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const [imageGallery, setImageGallery] = useState<File[]>([]);
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return uploadFile(data);
    },
    {
      onSuccess: () => {
        setSelectedImage(null);
        queryClient.invalidateQueries(["myimages"]);
      },
      onError: (err) => {},
    }
  );
  const {
    data,
    isLoading: imagesLoading,
    refetch,
  } = useQuery({
    queryKey: ["myimages"],
    queryFn: () => getMyImages(),
  });

  useEffect(() => {
    setImageGallery(data?.data);
  }, [data?.data]);
  const handleUpload = async () => {
    try {
      const response = await mutateAsync(selectedImage);

      await refetch();
      await processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };
  const handleImageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const newImage = event.target.files[0];
      setSelectedImage(newImage);
    }
  };

  const handleImagePickerClick = () => {
    setopen(true);
  };

  return {
    isLoading,
    handleUpload,
    selectedImage,
    setSelectedImage,
    imageGallery,
    setImageGallery,
    handleImageInputChange,
    handleImagePickerClick,
  };
};

export const useVideoFile = (setopen: any) => {
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const [videoGallery, setVideoGallery] = useState<File[]>([]);
  const { mutateAsync, isLoading } = useMutation(
    (data: any) => {
      return uploadFile(data);
    },
    {
      onSuccess: () => {
        setSelectedVideo(null);
        queryClient.invalidateQueries(["myvideos"]);
      },
      onError: (err) => {},
    }
  );
  const {
    data,
    isLoading: videosLoading,
    refetch,
  } = useQuery({
    queryKey: ["myvideos"],
    queryFn: () => getMyVideos(),
  });

  useEffect(() => {
    setVideoGallery(data?.data);
  }, [data?.data]);
  const handleUpload = async () => {
    try {
      const response = await mutateAsync(selectedVideo);

      await refetch();
      await processResponse(response);
    } catch (error) {
      processResponse(error);
    }
  };
  const handleVideoInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files) {
      const newImage = event.target.files[0];
      setSelectedVideo(newImage);
    }
  };

  const handleVideoPickerClick = () => {
    setopen(true);
  };

  return {
    isLoading,
    handleUpload,
    selectedVideo,
    setSelectedVideo,
    videoGallery,
    setVideoGallery,
    handleVideoInputChange,
    handleVideoPickerClick,
  };
};
