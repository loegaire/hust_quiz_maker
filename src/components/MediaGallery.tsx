import { useEffect, useState } from 'react';
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

function SvgMedia({ svg, alt }: { svg: string; alt?: string }) {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    const blobUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    setUrl(blobUrl);

    return () => {
      URL.revokeObjectURL(blobUrl);
    };
  }, [svg]);

  if (!url) {
    return null;
  }

  return <img src={url} alt={alt ?? ''} className="max-h-[28rem] w-full object-contain" loading="lazy" />;
}

export function MediaGallery({ items }: MediaGalleryProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {items.map((item) =>
        'src' in item ? (
          <figure key={item.id} className="overflow-hidden border-4 border-black bg-white shadow-[5px_5px_0_var(--shadow)]">
            <img src={resolveMediaSrc(item.src)} alt={item.alt ?? ''} className="max-h-[28rem] w-full object-contain" loading="lazy" />
            {item.alt ? <figcaption className="px-3 py-2 text-xs text-[var(--muted)]">{item.alt}</figcaption> : null}
          </figure>
        ) : 'svg' in item ? (
          <figure key={item.id} className="overflow-hidden border-4 border-black bg-white shadow-[5px_5px_0_var(--shadow)]">
            <SvgMedia svg={item.svg} alt={item.alt} />
            {item.alt ? <figcaption className="px-3 py-2 text-xs text-[var(--muted)]">{item.alt}</figcaption> : null}
          </figure>
        ) : (
          <figure key={item.id} className="max-w-full overflow-x-auto border-4 border-black bg-[#111] p-4 text-[#d8eadf] shadow-[5px_5px_0_var(--shadow)]">
            <pre className="font-mono text-xs leading-5 sm:text-sm">{item.ascii}</pre>
            {item.alt ? <figcaption className="mt-2 text-xs text-[#a9cfb5]">{item.alt}</figcaption> : null}
          </figure>
        )
      )}
    </div>
  );
}
