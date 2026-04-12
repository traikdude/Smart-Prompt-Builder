export type TemplateCategory = 
  | 'communication' 
  | 'technical' 
  | 'creative' 
  | 'analysis' 
  | 'development'
  | 'custom';

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  placeholderTrigger?: string; // The string in the content to replace
  isCustom?: boolean;
  category?: TemplateCategory; // Color-coded category badge
}

export interface FormatTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
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

// ═══════════════════════════════════════════
// 🚀 Universal Output Engine Types
// ═══════════════════════════════════════════

export interface ContextSource {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface OutputSubOption {
  id: string;
  name: string;
  instructionModifier: string;
}

export interface OutputFormatOption {
  id: string;
  name: string;
  description: string;
  instruction: string;
  icon: string;
  subOptions?: OutputSubOption[];
}

export interface OutputFormatCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  options: OutputFormatOption[];
}

// ═══════════════════════════════════════════
// 📎 Multi-Modal Attachment Types (Phase 7)
// ═══════════════════════════════════════════

export interface AttachmentInput {
  id: string;
  type: 'file' | 'url';
  name: string; // Filename or URL string
  size?: number; // File size in bytes (for files)
  mimeType?: string; // e.g., image/png, application/pdf
  file?: File; // The raw File object reference
  base64?: string; // The base64 data string (extracted via FileReader)
  urlContent?: string; // The raw text scraped from the URL
  status: 'loading' | 'ready' | 'error';
  errorMessage?: string;
}