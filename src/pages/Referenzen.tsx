import { useState, useMemo } from 'react';
import { services } from '../data/services';
import { Seo } from '../lib/seo';
import { PageMotion, Reveal } from '../components/PageMotion';
import { Lightbox } from '../components/Lightbox';
import './Referenzen.css';

type GalleryItem = { src: string; alt: string; category: string; categoryLabel: string };

export function Referenzen() {
  const [filter, setFilter] = useState<string>('alle');
  const [lbIndex, setLbIndex] = useState<number | null>(null);

  const allItems: GalleryItem[] = useMemo(() => {
    const seen = new Set<string>();
    const items: GalleryItem[] = [];
    services.forEach((s) => {
      s.gallery.forEach((src, i) => {
        if (seen.has(src)) return;
        seen.add(src);
        items.push({
          src,
          alt: `${s.title} – Arbeit ${i + 1}`,
          category: s.slug,
          categoryLabel: s.title,
        });
      });
    });
    // Add the kitchen splashback as a bonus reference
    items.push({
      src: '/images/IMG_0294.jpeg',
      alt: 'Küchenrückwand aus lackiertem Glas',
      category: 'sonstiges',
      categoryLabel: 'Sonstige Arbeiten',
    });
    items.push({
      src: '/images/IMG_0297.jpeg',
      alt: 'Glasvitrine in der Werkstatt',
      category: 'sonstiges',
      categoryLabel: 'Sonstige Arbeiten',
    });
    items.push({
      src: '/images/IMG_0298.jpeg',
      alt: 'Maßgefertigte Glasvitrine',
      category: 'sonstiges',
      categoryLabel: 'Sonstige Arbeiten',
    });
    return items;
  }, []);

  const filtered = filter === 'alle' ? allItems : allItems.filter((it) => it.category === filter);

  const filters = [
    { id: 'alle', label: 'Alle Arbeiten' },
    ...services.map((s) => ({ id: s.slug, label: s.title })),
    { id: 'sonstiges', label: 'Sonstige Arbeiten' },
  ];

  return (
    <PageMotion>
      <Seo
        title="Referenzen – Glaserarbeiten aus Merkendorf"
        description="Eine Auswahl umgesetzter Projekte: Duschkabinen, Glastüren, Vordächer, Treppengeländer und Restaurierungen. Klicken Sie auf ein Bild für Details."
        path="/referenzen"
      />

      <section className="section section--tight page-head">
        <div className="container">
          <Reveal>
            <span className="eyebrow">Referenzen</span>
            <h1>Eine Auswahl umgesetzter Arbeiten.</h1>
            <p className="lead">
              Jedes Stück ist ein Unikat – maßgefertigt, sauber montiert und für den Alltag gemacht.
            </p>
          </Reveal>

          <div className="filter-bar" role="tablist" aria-label="Kategorien">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                role="tab"
                aria-selected={filter === f.id}
                className={`filter-bar__btn ${filter === f.id ? 'filter-bar__btn--active' : ''}`}
                onClick={() => setFilter(f.id)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--tight" aria-label="Galerie">
        <div className="container">
          <div className="gallery">
            {filtered.map((it, i) => (
              <Reveal key={it.src} delay={(i % 6) * 0.04}>
                <button
                  type="button"
                  className="gallery__item"
                  onClick={() => setLbIndex(i)}
                  aria-label={`${it.alt} – vergrößern`}
                >
                  <img src={it.src} alt={it.alt} loading="lazy" decoding="async" />
                  <span className="gallery__tag">{it.categoryLabel}</span>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={filtered.map((i) => i.src)}
        alts={filtered.map((i) => i.alt)}
        index={lbIndex}
        onClose={() => setLbIndex(null)}
        onPrev={() => setLbIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length))}
        onNext={() => setLbIndex((i) => (i === null ? null : (i + 1) % filtered.length))}
      />
    </PageMotion>
  );
}
