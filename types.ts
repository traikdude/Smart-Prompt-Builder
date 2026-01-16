export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  placeholderTrigger?: string; // The string in the content to replace
  isCustom?: boolean;
}

export interface RecentPrompt {
  id: string;
  templateId: string;
  templateName: string; // Store name in case template is deleted
  userContent: string;
  generatedContent: string;
  timestamp: number;
}

export type ToastType = 'success' | 'info' | 'error';

export interface ToastState {
  show: boolean;
  message: string;
  type: ToastType;
}