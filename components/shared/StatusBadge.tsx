import { ReactNode } from "react";
import { cn } from "cn";

export type BadgeTone = "success" | "info" | "danger" | "neutral" | "warning";

export type VideoStatus = "draft" | "converting" | "published" | "failed";

const TONES: Record<BadgeTone, string> = {
  success: "bg-green-200 text-green-800",
  info: "bg-cyan-100 text-cyan-800",
  danger: "bg-red-100 text-red-800",
  neutral: "bg-gray-100 text-gray-700",
  warning: "bg-yellow-100 text-yellow-800",
};

const VIDEO_STATUS: Record<VideoStatus, { label: string; tone: BadgeTone }> = {
  draft: {
    label: "Draft",
    tone: "neutral",
  },
  converting: {
    label: "Converting",
    tone: "info",
  },
  published: {
    label: "Published",
    tone: "success",
  },
  failed: {
    label: "Failed",
    tone: "danger",
  },
};

interface StatusBadgeProps {
  status?: VideoStatus;
  tone?: BadgeTone;
  children?: ReactNode;
  className?: string;
}

const StatusBadge = ({
  status,
  tone = "neutral",
  children,
  className,
}: StatusBadgeProps) => {
  const resolvedTone = status ? VIDEO_STATUS[status].tone : tone;

  const label = children ?? (status && VIDEO_STATUS[status].label);

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center whitespace-nowrap rounded-full px-2 py-1 text-xs font-medium",
        TONES[resolvedTone],
        className,
      )}
    >
      {label}
    </span>
  );
};

export default StatusBadge;
