import type { QuizMedia } from '../types/quiz';

interface MediaGalleryProps {
  items: QuizMedia[];
}

function resolveMediaSrc(src: string) {
  if (/^(https?:)?\/\//.test(src) || src.startsWith('/') || src.startsWith('data:')) {
    return src;
  }

  return `${import.meta.env.BASE_URL}${src.replace(/^\.?\//, '')}`;
}

export function MediaGallery({ items }: MediaGalleryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {items.map((item) =>
        'src' in item ? (
          <figure key={item.id} className="overflow-hidden rounded-xl border border-black/10 bg-black/5">
            <img src={resolveMediaSrc(item.src)} alt={item.alt ?? ''} className="max-h-[28rem] w-full object-contain" loading="lazy" />
            {item.alt ? <figcaption className="px-3 py-2 text-xs text-[var(--muted)]">{item.alt}</figcaption> : null}
          </figure>
        ) : (
          <figure key={item.id} className="overflow-x-auto rounded-xl border border-black/10 bg-[#111] p-4 text-[#d8eadf] shadow-inner">
            <pre className="font-mono text-xs leading-5 sm:text-sm">{item.ascii}</pre>
            {item.alt ? <figcaption className="mt-2 text-xs text-[#a9cfb5]">{item.alt}</figcaption> : null}
          </figure>
        )
      )}
    </div>
  );
}
