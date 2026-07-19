import { User } from 'lucide-react'

function Avatar({ src, alt, className }) {
  if (src) {
    return <img src={src} alt={alt} className={className} />
  }
  return (
    <div className={`${className} grid place-items-center bg-[#fff0e3] text-[#c94531]`}>
      <User className="h-1/2 w-1/2" />
    </div>
  )
}

export default Avatar