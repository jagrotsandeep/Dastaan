function AdSlot({ label = 'Advertisement' }) {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 py-4">
      <div className="flex items-center justify-center rounded-2xl border border-dashed p-5 sm:p-7 text-xs sm:text-sm text-[#706766] border-[#4e312a]/25">
        {label} · Ad space
      </div>
    </div>
  )
}

export default AdSlot