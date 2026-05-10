import Image from 'next/image'

interface LogoProps {
  size?: number
  className?: string
  priority?: boolean
}

export default function Logo({ size = 40, className = '', priority = false }: LogoProps) {
  return (
    <div
      className={`relative overflow-hidden bg-black ${className}`}
      style={{ width: size * 2.5, height: size }}
    >
      <Image
        src="/logo.png"
        alt="Egyptian SAMURAI"
        fill
        sizes={`${size * 2.5}px`}
        className="object-contain"
        priority={priority}
      />
    </div>
  )
}
