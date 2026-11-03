import { Link } from 'react-router'

type BrandMarkProps = { className?: string; linkTo?: string }

type BrandMarkVariantProps = BrandMarkProps & { light?: boolean }

export function BrandMark({ className = '', linkTo = '/', light = false }: BrandMarkVariantProps) {
  return (
    <Link to={linkTo} className={`brand brand-image-link ${className}`} aria-label="Orivelle Convites Digitais, início">
      <img className="brand-image" src={light ? '/assets/orivelle-logo-light.png' : '/assets/orivelle-logo.png'} alt="Orivelle Convites Digitais" />
    </Link>
  )
}
