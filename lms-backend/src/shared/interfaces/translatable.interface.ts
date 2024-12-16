export interface Translatable {
  id: number;
  translations?: {
    [key: string]: string;
  };
}

export interface TranslationPayload {
  language_id: number;
  table_name: string;
  table_id: number;
  field_name: string;
  translation: string;
}

export interface TranslatableField {
  field: string;
  type: 'string' | 'text' | 'html';
  required?: boolean;
}

export interface TranslatableConfig {
  tableName: string;
  fields: TranslatableField[];
}

// Example configuration for Course entity
export const COURSE_TRANSLATABLE_CONFIG: TranslatableConfig = {
  tableName: 'courses',
  fields: [
    { field: 'name', type: 'string', required: true },
    { field: 'short_description', type: 'text' },
    { field: 'description', type: 'html' },
    { field: 'what_you_will_learn', type: 'text' },
    { field: 'requirements', type: 'text' },
    { field: 'meta_title', type: 'string' },
    { field: 'meta_description', type: 'text' },
  ],
};

// Example configuration for Category entity
export const CATEGORY_TRANSLATABLE_CONFIG: TranslatableConfig = {
  tableName: 'categories',
  fields: [
    { field: 'name', type: 'string', required: true },
    { field: 'description', type: 'text' },
  ],
};

// Example configuration for Blog entity
export const BLOG_TRANSLATABLE_CONFIG: TranslatableConfig = {
  tableName: 'blogs',
  fields: [
    { field: 'title', type: 'string', required: true },
    { field: 'description', type: 'html' },
    { field: 'meta_title', type: 'string' },
    { field: 'meta_description', type: 'text' },
  ],
};

// Example configuration for FAQ entity
export const FAQ_TRANSLATABLE_CONFIG: TranslatableConfig = {
  tableName: 'faqs',
  fields: [
    { field: 'question', type: 'text', required: true },
    { field: 'answer', type: 'text', required: true },
  ],
};

// Example configuration for LiveClass entity
export const LIVECLASS_TRANSLATABLE_CONFIG: TranslatableConfig = {
  tableName: 'live_classes',
  fields: [
    { field: 'title', type: 'string', required: true },
    { field: 'description', type: 'text' },
  ],
};

// Example configuration for Quiz entity
export const QUIZ_TRANSLATABLE_CONFIG: TranslatableConfig = {
  tableName: 'quizzes',
  fields: [
    { field: 'title', type: 'string', required: true },
    { field: 'description', type: 'text' },
  ],
};

// Example configuration for QuizQuestion entity
export const QUIZ_QUESTION_TRANSLATABLE_CONFIG: TranslatableConfig = {
  tableName: 'quiz_questions',
  fields: [
    { field: 'title', type: 'text', required: true },
  ],
};

// Example configuration for QuizQuestionAnswer entity
export const QUIZ_ANSWER_TRANSLATABLE_CONFIG: TranslatableConfig = {
  tableName: 'quiz_question_answers',
  fields: [
    { field: 'title', type: 'text', required: true },
  ],
};
