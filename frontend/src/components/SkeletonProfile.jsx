function SkeletonProfile() {
    const skeleton = (className) =>
      <div className={`bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse ${className}`} />;
  
    return (
      <div className="flex flex-col gap-2 p-4 rounded-lg items-start">
        {skeleton("h-32 w-32 rounded-full mb-8")}
        {skeleton("h-10 w-60 my-4")}
  
        <div className="space-y-2">
          {skeleton("h-6 w-16")}
          {skeleton("h-8 w-80")}
          {skeleton("h-6 w-16")}
          {skeleton("h-8 w-80")}
          {skeleton("h-6 w-16")}
          {skeleton("h-8 w-80")}
          {skeleton("h-4 w-40")}
          {skeleton("h-10 w-20")}
        </div>
  
        {skeleton("h-10 w-64 my-8")}
  
        <div className="space-y-2">
          {skeleton("h-6 w-32")}
          {skeleton("h-8 w-80")}
          {skeleton("h-6 w-32")}
          {skeleton("h-8 w-80")}
          {skeleton("h-4 w-40")}
          {skeleton("h-10 w-20")}
        </div>
      </div>
    );
  }
  
  export default SkeletonProfile;
  