// Define the window API interface
export interface ElectronAPI {
  openFile: () => Promise<string | null>;
  parseMsgFile: (filePath: string) => Promise<MsgFile>;
  saveAttachment: (attachmentData: AttachmentSaveData) => Promise<AttachmentSaveResult>;
  getAppVersion: () => string;
  getPlatform: () => string;
}

// Extend the Window interface
declare global {
  interface Window {
    api: ElectronAPI;
  }
}

// MSG File structure
export interface MsgFile {
  subject: string;
  from: string;
  to: string[];
  cc?: string[];
  bcc?: string[];
  displayTo?: string;
  displayCc?: string;
  displayBcc?: string;
  body: string;
  bodyHTML?: string;
  headers?: Record<string, string>;
  attachments?: Attachment[];
  date?: string;
  importance?: 'low' | 'normal' | 'high';
  [key: string]: any; // For any other properties
}

// Attachment structure
export interface Attachment {
  fileName: string;
  contentId?: string;
  contentType?: string;
  content: string; // Base64 encoded content
  size?: number;
}

// Attachment save data
export interface AttachmentSaveData {
  fileName: string;
  content: string; // Base64 encoded content
}

// Attachment save result
export interface AttachmentSaveResult {
  success: boolean;
  filePath?: string;
  message?: string;
}

// Application state
export interface AppState {
  currentFile: MsgFile | null;
  filePath: string | null;
  loading: boolean;
  error: string | null;
  selectedAttachment: Attachment | null;
}
