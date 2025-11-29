export interface BibleVerse {
  reference: string;
  text: string;
}

export interface Hymn {
  title: string;
  number?: string;
  reason: string;
}

export interface StudyContent {
  title: string;
  theme: string;
  introduction: string;
  key_verses: BibleVerse[];
  sermon_body: string; // Markdown supported
  illustration_prompts: string[]; // Prompts for AI image generation
  practical_application: string;
  conclusion: string;
  hymns: Hymn[];
}

export interface GeneratedImage {
  url: string;
  prompt: string;
}