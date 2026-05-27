export type Difficulty = 'easy' | 'medium' | 'hard';
export type QuestionType = 'single_choice' | 'multiple_choice' | 'fill_gap';

export interface QuizImageAsset {
  id: string;
  src: string;
  alt?: string;
}

export interface QuizAsciiAsset {
  id: string;
  ascii: string;
  alt?: string;
}

export type QuizMedia = QuizImageAsset | QuizAsciiAsset;

export interface ContentBlock {
  text: string;
  images: QuizMedia[];
}

export interface ExplanationBlock extends ContentBlock {}

export interface Choice {
  id: string;
  text: string;
}

export interface SingleOrMultiAnswer {
  correctChoiceIds: string[];
}

export interface FillGapAnswer {
  acceptedAnswers: string[];
  caseSensitive?: boolean;
  trimWhitespace?: boolean;
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  question: ContentBlock;
  explanation: ExplanationBlock;
  tags?: string[];
  difficulty?: Difficulty;
}

export interface SingleChoiceQuestion extends BaseQuestion {
  type: 'single_choice';
  choices: Choice[];
  answer: SingleOrMultiAnswer;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  choices: Choice[];
  answer: SingleOrMultiAnswer;
}

export interface FillGapQuestion extends BaseQuestion {
  type: 'fill_gap';
  answer: FillGapAnswer;
}

export type QuizQuestion = SingleChoiceQuestion | MultipleChoiceQuestion | FillGapQuestion;

export interface QuizPack {
  id: string;
  title: string;
  description?: string;
  language?: string;
  source?: {
    type: string;
    notes?: string;
  };
  settings?: {
    shuffleQuestions?: boolean;
    shuffleChoices?: boolean;
    showExplanationAfterAnswer?: boolean;
  };
  questions: QuizQuestion[];
}

export interface QuizPackFile {
  schemaVersion: 1;
  quiz: QuizPack;
}

export interface StoredQuizPack {
  id: string;
  title: string;
  description?: string;
  language?: string;
  sourceType: 'built_in' | 'imported';
  createdAt: number;
  updatedAt: number;
  questionCount: number;
}
