import { ReactNode } from "react";
import { cn } from "cn";

export type BadgeTone = "success" | "info" | "danger" | "neutral";
export type VideoStatus = "ready" | "processing" | "failed" | "draft";

const TONES: Record<BadgeTone, string> = {
  success: "bg-green-200 text-green-800",
  info: "bg-cyan-100 text-cyan-800",
  danger: "bg-red-100 text-red-800",
  neutral: "bg-gray-100 text-gray-700",
};

// Single source of truth for video statuses (reuse on the videos page)
const VIDEO_STATUS: Record<VideoStatus, { label: string; tone: BadgeTone }> = {
  ready: { label: "Ready", tone: "success" },
  processing: { label: "Processing", tone: "info" },
  failed: { label: "Failed", tone: "danger" },
  draft: { label: "Draft", tone: "neutral" },
};

interface StatusBadgeProps {
  /** Video status: sets both color and default label */
  status?: VideoStatus;
  /** Manual color when it isn't a video status */
  tone?: BadgeTone;
  /** Overrides the default label, e.g. "50%" or "3 shares" */
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
