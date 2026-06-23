import type { ImgHTMLAttributes } from 'react';
import { toWebp } from '../lib/img';

type PictureProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

/**
 * Bild mit moderner WebP-Auslieferung und JPEG-Fallback.
 * Das <picture>-Element selbst ist per `display: contents` (Klasse `pic`)
 * layout-neutral – das eigentliche <img> verhält sich also exakt so, als
 * stünde es direkt im Elternelement. Bestehende CSS-Regeln, die das Bild
 * über Nachfahren-Selektoren ansprechen, greifen dadurch unverändert.
 */
export function Picture({ src, alt, className, ...imgProps }: PictureProps) {
  return (
    <picture className="pic">
      <source type="image/webp" srcSet={toWebp(src)} />
      <img src={src} alt={alt} className={className} {...imgProps} />
    </picture>
  );
}
