type ProgressBarProps = {
  progress: number;
};

const ProgressBar = ({ progress }: ProgressBarProps) => {
  return progress === 100 ? (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Uploaded</span>
        <span>{progress}%</span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-green-400 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  ) : (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-sm">
        <span className="font-medium">Uploading...</span>
        <span>{progress}%</span>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-400 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
