import { z } from 'zod';

const imageSchema = z.union([
  z.string().min(1),
  z
    .object({
      id: z.string().min(1).optional(),
      src: z.string().min(1).optional(),
      ascii: z.string().min(1).optional(),
      svg: z.string().min(1).optional(),
      alt: z.string().optional()
    })
    .refine((value) => Number(Boolean(value.src)) + Number(Boolean(value.ascii)) + Number(Boolean(value.svg)) === 1, {
      message: 'Each media item must include exactly one of "src", "ascii", or "svg".'
    })
]);

const contentSchema = z.object({
  text: z.string().min(1),
  images: z.array(imageSchema).default([])
});

const baseSchema = z.object({
  id: z.string().min(1),
  question: contentSchema,
  explanation: contentSchema,
  tags: z.array(z.string()).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional()
});

const choiceSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1)
});

const singleChoiceSchema = baseSchema.extend({
  type: z.literal('single_choice'),
  choices: z.array(choiceSchema).min(2),
  answer: z.object({ correctChoiceIds: z.array(z.string()).length(1) })
});

const multipleChoiceSchema = baseSchema.extend({
  type: z.literal('multiple_choice'),
  choices: z.array(choiceSchema).min(2),
  answer: z.object({ correctChoiceIds: z.array(z.string()).min(1) })
});

const fillGapSchema = baseSchema.extend({
  type: z.literal('fill_gap'),
  answer: z.object({
    acceptedAnswers: z.array(z.string().min(1)).min(1),
    caseSensitive: z.boolean().optional(),
    trimWhitespace: z.boolean().optional()
  })
});

export const questionSchema = z.discriminatedUnion('type', [
  singleChoiceSchema,
  multipleChoiceSchema,
  fillGapSchema
]);

export const quizPackSchema = z.object({
  schemaVersion: z.literal(1),
  quiz: z.object({
    id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().optional(),
    language: z.string().optional(),
    source: z
      .object({
        type: z.string().min(1),
        notes: z.string().optional()
      })
      .optional(),
    settings: z
      .object({
        shuffleQuestions: z.boolean().optional(),
        shuffleChoices: z.boolean().optional(),
        showExplanationAfterAnswer: z.boolean().optional()
      })
      .optional(),
    questions: z.array(questionSchema).min(1)
  })
});

export type QuizPackSchema = z.infer<typeof quizPackSchema>;
