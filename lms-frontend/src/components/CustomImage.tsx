import Image from "next/image";

export default function CustomImage({
  imageUrl,
  customHeight = 500,
  customWidth = 500,
  customClassName = "",
}: any) {
  return (
    <Image
      src={imageUrl}
      priority
      quality={100}
      alt="Alt Pic"
      className={` !h-full !w-full !object-cover !object-center ${customClassName}`}
      width={customWidth}
      height={customHeight}
    />
  );
}
