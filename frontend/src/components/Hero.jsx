function Hero() {
  return (
    <section className="relative mx-auto w-full max-w-7xl px-4 pb-10 pt-6 sm:px-6 sm:pb-16 sm:pt-8 lg:pt-12">
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-14 bg-linear-to-br from-[#b83227] to-[#e68a37]">

        <div className="absolute -left-16 -top-16 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-white/30 blur-sm"></div>
        <div className="absolute -bottom-20 right-1/3 h-48 w-48 sm:h-72 sm:w-72 rounded-full bg-[#ffcc78]/30 blur-sm"></div>

        <div className="relative z-10 grid items-center gap-8 lg:grid-cols-[1.1fr_.9fr] lg:gap-10">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex rounded-full border border-white/40 bg-white/20 px-3 py-1.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-white">
              India's home for original voices
            </div>

            <h1
              className="max-w-3xl font-bold leading-[1.1] text-white text-3xl sm:text-4xl lg:text-6xl"
              style={{ fontFamily: "'Eczar', serif" }}
            >
              Share Your Story With The World
            </h1>

            <p className="mt-4 max-w-xl leading-relaxed text-[#fff7ed] text-base sm:text-lg">
              हिंदी और अपनी मातृभाषा में लिखें, पढ़ें और उन कहानियों से जुड़ें जो दिल में ठहर जाती हैं।
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm sm:text-base font-bold text-[#9f2d20] shadow-lg active:scale-95 transition-transform">
                Start Reading
              </button>
              <button className="inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/10 px-5 py-3 text-sm sm:text-base font-bold text-white backdrop-blur active:scale-95 transition-transform">
                Write Story
              </button>
            </div>

            <div className="mt-7 flex flex-wrap gap-5 sm:gap-6">
              <div>
                <strong className="block text-xl sm:text-2xl text-white">12K+</strong>
                <span className="text-xs sm:text-sm text-[#fff7ed]">Original stories</span>
              </div>
              <div>
                <strong className="block text-xl sm:text-2xl text-white">4.8M</strong>
                <span className="text-xs sm:text-sm text-[#fff7ed]">Monthly readers</span>
              </div>
              <div>
                <strong className="block text-xl sm:text-2xl text-white">18</strong>
                <span className="text-xs sm:text-sm text-[#fff7ed]">Indian languages</span>
              </div>
            </div>
          </div>

          {/* Image side - hidden on small mobile, shown from sm upward to save space */}
          <div className="relative hidden sm:block">
            <div className="absolute -inset-4 rotate-3 rounded-3xl border border-white/30 bg-white/15"></div>
            <img
              loading="lazy"
              className="relative h-64 sm:h-80 lg:h-96 w-full rounded-2xl object-cover shadow-2xl"
              src="https://images.pexels.com/photos/28319369/pexels-photo-28319369.jpeg"
              alt="Abstract colorful light waves"
            />
            <div className="absolute -bottom-4 left-4 right-4 rounded-xl bg-white/90 backdrop-blur p-4">
              <div className="mb-1 text-[10px] font-bold uppercase tracking-wider text-[#c94531]">
                Editor's pick
              </div>
              <p className="font-semibold text-[#211b1a] text-base sm:text-lg" style={{ fontFamily: "'Eczar', serif" }}>
                बारिश के बाद तुम — अदिति शर्मा
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero