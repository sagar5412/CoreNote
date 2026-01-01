export function LoadingSkeleton() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
      <div>
        <div role="status" className="max-w-sm animate-pulse">
          <div className="flex items-center w-full pt-10">
            <div className="h-4.5 bg-gray-200 dark:bg-gray-700 rounded-full w-full mb-2"></div>
            <div className="h-4.5 ms-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full mb-2"></div>
            <div className="h-4.5 ms-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full mb-2"></div>
          </div>
          <div className="flex items-center w-full">
            <div className="h-4.5 bg-gray-200 dark:bg-gray-700 rounded-full w-full mb-6"></div>
            <div className="h-4.5 ms-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full mb-6"></div>
            <div className="h-4.5 ms-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full mb-6"></div>
          </div>
          <div className="h-4.5 bg-gray-200 dark:bg-gray-700 rounded-lg w-72 mx-auto mb-2"></div>
          <div className="h-4.5 bg-gray-200 dark:bg-gray-700 rounded-lg w-72 mx-auto mb-6"></div>

          <div className="flex items-center w-full">
            <div className="h-4.5 bg-gray-200 dark:bg-gray-700 rounded-full w-full mb-6"></div>
            <div className="h-4.5 ms-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full mb-6"></div>
            <div className="h-4.5 ms-2 bg-gray-200 dark:bg-gray-700 rounded-full w-full mb-6"></div>
          </div>
          <div className="h-4.5 bg-gray-200 dark:bg-gray-700 rounded-lg w-72 mx-auto mb-2"></div>
          <div className="h-4.5 bg-gray-200 dark:bg-gray-700 rounded-lg w-72 mx-auto mb-2"></div>
          <div className="h-4.5 bg-gray-200 dark:bg-gray-700 rounded-lg w-72 mx-auto mb-2"></div>
        </div>
      </div>
    </div>
  );
}

//<div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-32 mx-auto"></div>
