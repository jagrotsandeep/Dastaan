function StoryCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white dark:bg-[#251e1d] border border-[#4e312a]/13 animate-pulse">
      <div className="h-44 sm:h-56 w-full bg-[#f3e7dd] dark:bg-[#2b2320]" />
      <div className="p-4 sm:p-6 space-y-3">
        <div className="h-4 w-20 rounded-full bg-[#f3e7dd] dark:bg-[#2b2320]" />
        <div className="h-6 w-3/4 rounded bg-[#f3e7dd] dark:bg-[#2b2320]" />
        <div className="h-4 w-full rounded bg-[#f3e7dd] dark:bg-[#2b2320]" />
        <div className="h-4 w-2/3 rounded bg-[#f3e7dd] dark:bg-[#2b2320]" />
        <div className="h-10 w-10 rounded-full bg-[#f3e7dd] dark:bg-[#2b2320]" />
      </div>
    </div>
  )
}

export default StoryCardSkeleton