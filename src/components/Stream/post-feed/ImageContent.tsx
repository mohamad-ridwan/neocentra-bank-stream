import React, { memo, useState, useCallback } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Skeleton } from "shared_remote/Skeleton";

const DynamicImageGallery = dynamic(
  () => import("shared_remote/imageGallery"),
  {
    ssr: false,
  },
);

export interface ImageContentProps {
  images: string[];
  streamId: number;
}

const ImageContentComponent: React.FC<ImageContentProps> = ({
  images,
  streamId,
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleImageClick = useCallback(() => {
    setShowGallery(true);
  }, []);

  const handleCloseGallery = useCallback(() => {
    setShowGallery(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  if (!images || images.length === 0) {
    return null;
  }

  const primaryImage = images[0];
  const hasMoreImages = images.length > 1;

  return (
    <div className="mt-3 relative w-full overflow-hidden rounded-xl bg-slate-800/50 border border-slate-700/60 shadow-md">
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full min-h-[280px] rounded-xl bg-slate-800 animate-pulse z-10" />
      )}
      <button
        type="button"
        onClick={handleImageClick}
        className="w-full relative block overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-xl"
        aria-label={`View images for stream ${streamId}`}
      >
        <div className="relative w-full aspect-video">
          <Image
            src={primaryImage}
            alt={`Post content image for stream ${streamId}`}
            width={600}
            height={337}
            loading="lazy"
            onLoad={handleImageLoad}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.02] ${
              isLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        {hasMoreImages && (
          <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-700 text-xs font-semibold text-white shadow-lg pointer-events-none">
            +{images.length - 1} photos
          </div>
        )}
      </button>

      {showGallery && (
        <DynamicImageGallery images={images} onClose={handleCloseGallery} />
      )}
    </div>
  );
};

export const ImageContent = memo(ImageContentComponent);
export default ImageContent;
