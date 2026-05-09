import Image from 'next/image'

interface LogoProps {
  size?: number
  className?: string
  priority?: boolean
}

export default function Logo({ size = 40, className = '', priority = false }: LogoProps) {
  return (
    <div
      className={`relative rounded-full overflow-hidden bg-white shadow-sm ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/logo.svg"
        alt="Egyptian SAMURAI"
        fill
        sizes={`${size}px`}
        className="object-cover"
        priority={priority}
      />
    </div>
  )
}
