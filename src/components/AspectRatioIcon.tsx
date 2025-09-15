import { cn } from "@/lib/utils";

interface AspectRatioIconProps {
  ratio: string;
  className?: string;
}

const AspectRatioIcon = ({ ratio, className }: AspectRatioIconProps) => {
  // Calculate dimensions based on aspect ratio
  const getDimensions = (ratio: string) => {
    const [width, height] = ratio.split(":").map(Number);
    const baseSize = 16;
    const maxDimension = baseSize;
    
    // Normalize to fit within max dimension while maintaining aspect ratio
    if (width > height) {
      const scaledHeight = (height / width) * maxDimension;
      return { width: maxDimension, height: scaledHeight };
    } else {
      const scaledWidth = (width / height) * maxDimension;
      return { width: scaledWidth, height: maxDimension };
    }
  };

  const { width, height } = getDimensions(ratio);

  return (
    <div
      className={cn(
        "border border-current flex-shrink-0 rounded-sm",
        className
      )}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        minWidth: `${width}px`,
        minHeight: `${height}px`,
      }}
    />
  );
};

export default AspectRatioIcon;