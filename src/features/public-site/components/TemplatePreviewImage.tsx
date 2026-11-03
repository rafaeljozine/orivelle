import { useState } from 'react'

type TemplatePreviewImageProps = {
  src: string
  alt: string
  loading?: 'eager' | 'lazy'
}

export function TemplatePreviewImage({ src, alt, loading = 'lazy' }: TemplatePreviewImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null)

  if (!src || failedSource === src) {
    return <span className="template-image-placeholder">Imagem em preparação</span>
  }

  return <img src={src} alt={alt} loading={loading} onError={() => setFailedSource(src)} />
}
