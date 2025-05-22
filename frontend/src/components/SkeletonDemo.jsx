export function SkeletonDemo() {
    return (
      <div className="flex flex-col gap-2 p-4 rounded-lg items-start ring-1 ring-gray-100/25">
        <div className="h-4 w-[200px] animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
        <div className="h-6 w-[250px] m-0 animate-pulse rounded-md bg-gray-200 dark:bg-gray-800" />
      </div>
    );
  }
  