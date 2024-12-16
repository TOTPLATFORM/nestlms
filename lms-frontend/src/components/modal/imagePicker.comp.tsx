import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { useFile } from "@/hooks/file.hook";
import LoaderButton from "../button/LoaderButton";
import CustomImage from "../CustomImage";

const ImagePicker = ({
  name,
  open,
  setopen,
  uploadImageUrl,
  setuploadImageUrl,
  setId,
  width = "280px",
  height = "280px",
  minHeight = "280px",
  minWidth = "180px",
  isForProfile = false,
  inputText = "Select an Image",
}: any) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<any>(null);

  const {
    isLoading,
    handleUpload,
    selectedImage,
    imageGallery,
    handleImageInputChange,
    handleImagePickerClick,
  } = useFile(setopen);
  const { t } = useTranslation();
  return (
    <div className="mb-5">
      {uploadImageUrl && isForProfile && (
        <div className="mt-3">
          <div
            className="h-[200px] w-[200px] cursor-pointer overflow-hidden rounded-full"
            onClick={() => setopen(true)}
          >
            <CustomImage imageUrl={uploadImageUrl?.toString()} />
          </div>
        </div>
      )}
      <div onClick={handleImagePickerClick} style={{}}>
        <label htmlFor="site_logo" className="text-sm">
          {name}
        </label>
        <input
          id="site_logo"
          type="file"
          accept="image/*"
          onChange={handleImageInputChange}
          className="hidden"
          disabled={true}
        />

        <div>
          <div className="mt-2 flex h-10 cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm">
            <p className="text-gray-600">{t(inputText)}</p>
          </div>
        </div>
      </div>
      {uploadImageUrl && !isForProfile && (
        <div className="mt-3 max-h-[150px] max-w-[150px]">
          <div
            className="h-[150px] w-[150px] cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setopen(true)}
          >
            <CustomImage imageUrl={uploadImageUrl?.toString()} />
          </div>
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
                    <h5 className="text-2xl font-bold">{t(`Image Picker`)}</h5>
                  </div>
                  <div className="p-5">
                    <div className="flex flex-col gap-y-2">
                      <label
                        htmlFor="site_fav_icon"
                        className="text-sm font-bold"
                      >
                        {t(`Add Images`)}
                      </label>
                      <input
                        id="site_fav_icon"
                        type="file"
                        accept="image/*"
                        onChange={handleImageInputChange}
                        className="rtl:file-ml-5 form-input file:bg-primary/90 file:hover:bg-primary mt-2 p-0 file:border-0 file:px-4 file:py-2 file:font-semibold file:text-white ltr:file:mr-5"
                      />
                    </div>
                    {selectedImage && (
                      <div className="mt-8 flex flex-col items-start justify-center">
                        <div
                          className="h-80 w-full cursor-pointer overflow-hidden rounded-lg"
                          onClick={() => setopen(true)}
                        >
                          <CustomImage
                            imageUrl={
                              typeof selectedImage === "object"
                                ? URL.createObjectURL(selectedImage)
                                : //@ts-ignore
                                  selectedImage.toString()
                            }
                          />
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
                    {imageGallery?.length > 0 && (
                      <div className="mt-8">
                        <h5 className="mb-2 text-lg font-bold">
                          {t(`Image Gallery`)}
                        </h5>
                        <div className="grid grid-cols-3 gap-4">
                          {imageGallery.map((image: any, index) => (
                            <div
                              key={index}
                              className={`cursor-pointer ${
                                selectedImageIndex === index
                                  ? "border-4 border-blue-500"
                                  : ""
                              }`}
                              onClick={() => {
                                setuploadImageUrl(image?.file_path);
                                setId(image.id);
                                setSelectedImageIndex(index);
                              }}
                            >
                              <div className="h-20 w-full overflow-hidden rounded-lg">
                                <CustomImage imageUrl={image?.file_path} />
                              </div>
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

export default ImagePicker;
