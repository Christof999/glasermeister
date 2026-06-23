/**
 * Leitet aus einem JPEG/PNG-Pfad den Pfad der WebP-Variante ab.
 * Die WebP-Dateien liegen unter demselben Namen neben dem Original
 * (siehe public/images). Browser ohne WebP-Support erhalten über das
 * <picture>-Element weiterhin die JPEG-Fassung.
 */
export const toWebp = (src: string): string =>
  src.replace(/\.(jpe?g|png)$/i, '.webp');
