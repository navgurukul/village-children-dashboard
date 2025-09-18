export interface SurveyOption {
  id: string;
  text: string;
  value: string;
}

export interface QuestionVisibility {
  questionId: string;
  expectedAnswer: string | string[];
  isRequired: boolean;
}

export interface Question {
  id: string;
  sectionId: string;
  questionText: string;
  questionTextHindi: string;
  type: 'written' | 'calendar' | 'single_choose' | 'yes_no' | 'multi_choose';
  requirementType?: 'always' | 'never' | 'conditional';
  isRequired: boolean;
  order: number;
  options?: SurveyOption[];
  visibility?: QuestionVisibility;
  validations?: {
    minLength?: number;
    maxLength?: number;
    minAge?: number;
    maxAge?: number;
  };
}

export interface SurveySection {
  id: string;
  title: string;
  titleHindi: string;
  order: number;
  questions: Question[];
}

export interface Survey {
  id: string;
  title: string;
  titleHindi: string;
  description: string;
  version: string;
  isActive: boolean;
  sections: SurveySection[];
}

export interface SurveyResponse {
  [questionId: string]: string | string[];
}