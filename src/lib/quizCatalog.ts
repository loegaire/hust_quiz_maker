const quizModules = import.meta.glob('/public/quizzes/*.json', {
  eager: true,
  query: '?url',
  import: 'default'
}) as Record<string, string>;

export interface QuizAsset {
  filename: string;
  url: string;
}

export const quizAssets: QuizAsset[] = Object.entries(quizModules)
  .map(([path, url]) => ({
    filename: path.split('/').pop() ?? path,
    url
  }))
  .filter((asset) => asset.filename !== 'index.json')
  .sort((left, right) => left.filename.localeCompare(right.filename));
