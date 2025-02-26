import { Attachment, MsgFile } from '../types';

/**
 * Format a date string to a more readable format
 * @param dateString - The date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown date';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      timeZoneName: 'short'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format email addresses for display
 * @param emails - Array of email addresses
 * @returns Formatted string of email addresses
 */
export const formatEmails = (emails?: string[]): string => {
  if (!emails || emails.length === 0) return '';
  return emails.join('; ');
};

/**
 * Format file size to human-readable format
 * @param bytes - Size in bytes
 * @returns Formatted size string
 */
export const formatFileSize = (bytes?: number): string => {
  if (bytes === undefined || bytes === null) return 'Unknown size';
  
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(2)} ${units[unitIndex]}`;
};

/**
 * Get file icon based on file extension
 * @param fileName - Name of the file
 * @returns CSS class for the icon
 */
export const getFileIcon = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Map common extensions to icon classes
  // In a real app, you would have actual icons
  switch (extension) {
    case 'pdf':
      return 'file-pdf';
    case 'doc':
    case 'docx':
      return 'file-word';
    case 'xls':
    case 'xlsx':
      return 'file-excel';
    case 'ppt':
    case 'pptx':
      return 'file-powerpoint';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
      return 'file-image';
    case 'zip':
    case 'rar':
    case '7z':
      return 'file-archive';
    default:
      return 'file';
  }
};

/**
 * Safely render HTML content
 * @param htmlContent - HTML content to sanitize
 * @returns Sanitized HTML content
 */
export const sanitizeHtml = (htmlContent?: string): string => {
  if (!htmlContent) return '';
  
  // This is a basic implementation
  // In a production app, use a library like DOMPurify
  return htmlContent
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/on\w+=\w+/g, '');
};

/**
 * Check if the email has attachments
 * @param msgFile - The MSG file object
 * @returns True if the email has attachments
 */
export const hasAttachments = (msgFile: MsgFile | null): boolean => {
  return !!msgFile?.attachments && msgFile.attachments.length > 0;
};

/**
 * Get total size of all attachments
 * @param attachments - Array of attachments
 * @returns Total size in bytes
 */
export const getTotalAttachmentsSize = (attachments?: Attachment[]): number => {
  if (!attachments || attachments.length === 0) return 0;
  
  return attachments.reduce((total, attachment) => {
    return total + (attachment.size || 0);
  }, 0);
};

/**
 * Extract email address from a string
 * @param emailString - String containing email address
 * @returns Extracted email address or original string
 */
export const extractEmail = (emailString: string): string => {
  const match = emailString.match(/<([^>]+)>/);
  return match ? match[1] : emailString;
};

/**
 * Extract display name from a string
 * @param emailString - String containing display name and email
 * @returns Extracted display name or original string
 */
export const extractDisplayName = (emailString: string): string => {
  const match = emailString.match(/^([^<]+)</);
  return match ? match[1].trim() : emailString;
};
