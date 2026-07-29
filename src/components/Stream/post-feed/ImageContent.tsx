import React, {
  memo,
  useState,
  useCallback,
  useMemo,
  startTransition,
} from "react";
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
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}

const ImageContentComponent: React.FC<ImageContentProps> = ({
  images,
  streamId,
  size = "md",
  className = "",
}) => {
  const [showGallery, setShowGallery] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const sizeClasses = {
    xs: "bottom-2 right-2 px-2 py-0.5 text-[10px]",
    sm: "bottom-2 right-2 px-2.5 py-1 text-xs",
    md: "bottom-3 right-3 px-3 py-1.5 text-xs",
    lg: "bottom-4 right-4 px-3.5 py-2 text-sm",
  }[size];

  const handleImageClick = useCallback(() => {
    startTransition(() => setShowGallery(true));
  }, []);

  const handleCloseGallery = useCallback(() => {
    setShowGallery(false);
  }, []);

  const handleImageLoad = useCallback(() => {
    setIsLoaded(true);
  }, []);

  const primaryImage = useMemo(() => {
    return images?.[0];
  }, [images]);
  const hasMoreImages = useMemo(() => {
    return images?.length > 1;
  }, [images?.length]);

  if (!images || images.length === 0) {
    return null;
  }

  const containerClasses = className
    ? `relative w-full overflow-hidden ${className}`
    : "mt-3 relative w-full overflow-hidden rounded-xl bg-slate-800/50 border border-slate-700/60 shadow-md";

  return (
    <div className={containerClasses}>
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full min-h-[280px] bg-slate-800 animate-pulse z-10" />
      )}
      <button
        type="button"
        onClick={handleImageClick}
        className="w-full relative block overflow-hidden group focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <div className={`absolute ${sizeClasses} bg-slate-900/80 backdrop-blur-md rounded-lg border border-slate-700 font-semibold text-white shadow-lg pointer-events-none`}>
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
