import { toast } from "sonner";

export const handleCopyLink = (streamId: number, customLink?: string) => {
  if (typeof window !== "undefined" && navigator.clipboard) {
    const demoLink =
      customLink || `${window.location.origin}/stream/post/${streamId}`;
    navigator.clipboard
      .writeText(demoLink)
      .then(() => {
        toast.success("Link copied");
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
        toast.error("Link copy failed");
      });
  } else {
    toast.error("Link copy failed");
  }
};
