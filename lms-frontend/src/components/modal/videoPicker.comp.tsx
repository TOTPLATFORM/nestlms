import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useFile, useVideoFile } from "@/hooks/file.hook";
import LoaderButton from "../button/LoaderButton";

const VideoPicker = ({
  name,
  open,
  setopen,
  uploadVideoUrl,
  setuploadVideoUrl,
  setId,
  width = "280px",
  height = "280px",
  minHeight = "280px",
  minWidth = "180px",
  isForProfile = false,
  inputText = "Select an Video",
}: any) => {
  const [selectedVideoIndex, setSelectedVideoIndex] = useState<any>(null);

  const {
    isLoading,
    handleUpload,
    selectedVideo,
    videoGallery,
    handleVideoInputChange,
    handleVideoPickerClick,
  } = useVideoFile(setopen);
  const { t } = useTranslation();

  return (
    <div className="mb-5">
      <div onClick={handleVideoPickerClick} style={{}}>
        <label htmlFor="site_logo" className="text-sm">
          {name}
        </label>
        <input
          id="site_logo"
          type="file"
          accept="video/*"
          onChange={handleVideoInputChange}
          className="hidden"
          disabled={true}
        />

        <div>
          <div className="mt-2 flex h-10 cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm">
            <p className="text-gray-600">{t(inputText)}</p>
          </div>
        </div>
      </div>
      {uploadVideoUrl && (
        <div className="mt-3 max-h-[150px] max-w-[250px]">
          <video
            controls
            src={uploadVideoUrl?.toString()}
            className="h-[150px] w-[250px] cursor-pointer rounded-lg object-contain object-center"
          ></video>
        </div>
      )}
      <Transition appear show={open} as={Fragment}>
        <Dialog as="div" open={open} onClose={() => setopen(false)}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0" />
          </Transition.Child>
          <div className="fixed inset-0 z-[999] overflow-y-auto bg-[black]/60">
            <div className="flex min-h-screen items-center justify-center px-4">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  as="div"
                  className="panel dark:text-white-dark my-8 w-full max-w-5xl overflow-hidden rounded-lg border-0 p-0 text-black"
                >
                  <div className="mt-5 flex items-center justify-between bg-[#fbfbfb] px-5 py-3 dark:bg-[#121c2c]">
                    <h5 className="text-2xl font-bold">{t(`Video Picker`)}</h5>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-col gap-y-2">
                      <label
                        htmlFor="site_fav_icon"
                        className="text-sm font-bold"
                      >
                        {t(`Add Videos`)}
                      </label>
                      <input
                        id="site_fav_icon"
                        type="file"
                        accept="video/*"
                        onChange={handleVideoInputChange}
                        className="rtl:file-ml-5 form-input file:bg-primary/90 file:hover:bg-primary mt-2 p-0 file:border-0 file:px-4 file:py-2 file:font-semibold file:text-white ltr:file:mr-5"
                      />
                    </div>
                    {selectedVideo && (
                      <div className="mt-8 flex flex-col items-start justify-center">
                        <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                          <video
                            src={
                              typeof selectedVideo === "object"
                                ? URL.createObjectURL(selectedVideo)
                                : //@ts-ignore
                                  selectedVideo.toString()
                            }
                            className="h-[150px] w-full cursor-pointer rounded-lg object-cover"
                            onClick={() => setopen(true)}
                            controls
                          ></video>
                        </div>
                        <button
                          type="button"
                          className="btn btn-primary mt-3"
                          onClick={() => handleUpload()}
                        >
                          <LoaderButton
                            buttonText="Add"
                            loaderText="Adding...."
                            isLoading={isLoading}
                          />
                        </button>
                      </div>
                    )}
                    {videoGallery?.length > 0 && (
                      <div className="mt-8">
                        <h5 className="mb-2 text-lg font-bold">
                          {t(`Video Gallery`)}
                        </h5>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 ">
                          {videoGallery.map((video: any, index) => (
                            <div
                              key={index}
                              className={`relative  cursor-pointer p-4 ${
                                selectedVideoIndex === index
                                  ? "border-primary border-2"
                                  : ""
                              }`}
                              onClick={() => {
                                if (selectedVideoIndex !== index) {
                                  setuploadVideoUrl(video?.file_path);
                                  setId(video.id);
                                  setSelectedVideoIndex(index);
                                }
                              }}
                            >
                              <div
                                className={`${
                                  selectedVideoIndex === index && "bg-primary"
                                } border-primary absolute inset-0 z-50 block h-4 w-4 rounded-[4px] border`}
                                onClick={() => {
                                  if (selectedVideoIndex !== index) {
                                    setuploadVideoUrl(video?.file_path);
                                    setId(video.id);
                                    setSelectedVideoIndex(index);
                                  }
                                }}
                              ></div>
                              <video
                                controls
                                src={video?.file_path}
                                className="h-[150px] w-full rounded-lg object-cover"
                                onClick={(e) => e.stopPropagation()}
                              ></video>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="mt-4 flex items-center justify-end space-x-4">
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setopen(false)}
                      >
                        {t(`Confirm Select`)}
                      </button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default VideoPicker;
