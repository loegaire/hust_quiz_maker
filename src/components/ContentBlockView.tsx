import { MediaGallery } from './MediaGallery';
import { RichText } from './RichText';
import type { ContentBlock } from '../types/quiz';

interface ContentBlockViewProps {
  content: ContentBlock;
  textClassName?: string;
}

export function ContentBlockView({ content, textClassName }: ContentBlockViewProps) {
  return (
    <div className="space-y-4">
      <RichText content={content.text} className={textClassName} />
      <MediaGallery items={content.images} />
    </div>
  );
}
