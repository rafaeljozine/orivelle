import { Link } from 'react-router'

type BrandMarkProps = { className?: string; linkTo?: string }

export function BrandMark({ className = '', linkTo = '/' }: BrandMarkProps) {
  return (
    <Link to={linkTo} className={`brand brand-image-link ${className}`} aria-label="Ourivelle Convites Digitais, início">
      <img className="brand-image" src="/assets/ourivelle-logo.png" alt="Ourivelle Convites Digitais" width={1535} height={1024} decoding="async" />
    </Link>
  )
}
