type FileValidationOption = {
  maxSize: number;
  allowedTypes: string[];
};

export function validateFile(
  file: File | null | undefined,
  options: FileValidationOption,
): string | null {
  if (!file) {
    return "Please select a video";
  }
  if (!options.allowedTypes.includes(file.type)) {
    return "Only MP4 File are allowed";
  }
  if (file.size > options.maxSize) {
    return "Video size must not exceed 1 GB";
  }

  return null;
}
