import {
  formatDate,
  formatEmails,
  formatFileSize,
  getFileIcon,
  sanitizeHtml,
  hasAttachments,
  getTotalAttachmentsSize,
  extractEmail,
  extractDisplayName
} from '../../utils/helpers';
import { MsgFile, Attachment } from '../../types';

describe('formatDate', () => {
  test('formats date string correctly', () => {
    const date = '2023-01-01T12:00:00Z';
    const result = formatDate(date);
    expect(result).toContain('2023');
    expect(result).toContain('January');
    expect(result).toContain('1');
  });

  test('returns "Unknown date" for undefined input', () => {
    expect(formatDate(undefined)).toBe('Unknown date');
  });

  test('returns original string for invalid date', () => {
    const invalidDate = 'not-a-date';
    expect(formatDate(invalidDate)).toBe(invalidDate);
  });
});

describe('formatEmails', () => {
  test('joins email array with semicolons', () => {
    const emails = ['test1@example.com', 'test2@example.com', 'test3@example.com'];
    expect(formatEmails(emails)).toBe('test1@example.com; test2@example.com; test3@example.com');
  });

  test('returns empty string for empty array', () => {
    expect(formatEmails([])).toBe('');
  });

  test('returns empty string for undefined input', () => {
    expect(formatEmails(undefined)).toBe('');
  });
});

describe('formatFileSize', () => {
  test('formats bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500.00 B');
  });

  test('formats kilobytes correctly', () => {
    expect(formatFileSize(1500)).toBe('1.46 KB');
  });

  test('formats megabytes correctly', () => {
    expect(formatFileSize(1500000)).toBe('1.43 MB');
  });

  test('formats gigabytes correctly', () => {
    expect(formatFileSize(1500000000)).toBe('1.40 GB');
  });

  test('returns "Unknown size" for undefined input', () => {
    expect(formatFileSize(undefined)).toBe('Unknown size');
  });
});

describe('getFileIcon', () => {
  test('returns correct icon for PDF', () => {
    expect(getFileIcon('document.pdf')).toBe('file-pdf');
  });

  test('returns correct icon for Word documents', () => {
    expect(getFileIcon('document.doc')).toBe('file-word');
    expect(getFileIcon('document.docx')).toBe('file-word');
  });

  test('returns correct icon for Excel documents', () => {
    expect(getFileIcon('spreadsheet.xls')).toBe('file-excel');
    expect(getFileIcon('spreadsheet.xlsx')).toBe('file-excel');
  });

  test('returns correct icon for PowerPoint documents', () => {
    expect(getFileIcon('presentation.ppt')).toBe('file-powerpoint');
    expect(getFileIcon('presentation.pptx')).toBe('file-powerpoint');
  });

  test('returns correct icon for images', () => {
    expect(getFileIcon('image.jpg')).toBe('file-image');
    expect(getFileIcon('image.jpeg')).toBe('file-image');
    expect(getFileIcon('image.png')).toBe('file-image');
    expect(getFileIcon('image.gif')).toBe('file-image');
  });

  test('returns correct icon for archives', () => {
    expect(getFileIcon('archive.zip')).toBe('file-archive');
    expect(getFileIcon('archive.rar')).toBe('file-archive');
    expect(getFileIcon('archive.7z')).toBe('file-archive');
  });

  test('returns default icon for unknown extensions', () => {
    expect(getFileIcon('unknown.xyz')).toBe('file');
  });
});

describe('sanitizeHtml', () => {
  test('removes script tags', () => {
    const html = '<p>Hello</p><script>alert("XSS")</script>';
    expect(sanitizeHtml(html)).toBe('<p>Hello</p>');
  });

  test('removes event handlers', () => {
    const html = '<a href="#" onclick="alert(\'XSS\')">Click me</a>';
    // The sanitizeHtml function removes the onclick attribute but leaves a space
    expect(sanitizeHtml(html)).toBe('<a href="#" >Click me</a>');
  });

  test('returns empty string for undefined input', () => {
    expect(sanitizeHtml(undefined)).toBe('');
  });
});

describe('hasAttachments', () => {
  test('returns true when email has attachments', () => {
    const email: MsgFile = {
      subject: 'Test',
      from: 'test@example.com',
      to: ['recipient@example.com'],
      body: 'Test body',
      attachments: [
        { fileName: 'test.pdf', content: 'base64content' }
      ]
    };
    expect(hasAttachments(email)).toBe(true);
  });

  test('returns false when email has no attachments', () => {
    const email: MsgFile = {
      subject: 'Test',
      from: 'test@example.com',
      to: ['recipient@example.com'],
      body: 'Test body',
      attachments: []
    };
    expect(hasAttachments(email)).toBe(false);
  });

  test('returns false when attachments property is undefined', () => {
    const email: MsgFile = {
      subject: 'Test',
      from: 'test@example.com',
      to: ['recipient@example.com'],
      body: 'Test body'
    };
    expect(hasAttachments(email)).toBe(false);
  });

  test('returns false for null email', () => {
    expect(hasAttachments(null)).toBe(false);
  });
});

describe('getTotalAttachmentsSize', () => {
  test('calculates total size correctly', () => {
    const attachments: Attachment[] = [
      { fileName: 'test1.pdf', content: 'base64content', size: 1000 },
      { fileName: 'test2.pdf', content: 'base64content', size: 2000 },
      { fileName: 'test3.pdf', content: 'base64content', size: 3000 }
    ];
    expect(getTotalAttachmentsSize(attachments)).toBe(6000);
  });

  test('returns 0 for empty array', () => {
    expect(getTotalAttachmentsSize([])).toBe(0);
  });

  test('returns 0 for undefined input', () => {
    expect(getTotalAttachmentsSize(undefined)).toBe(0);
  });

  test('handles attachments without size property', () => {
    const attachments: Attachment[] = [
      { fileName: 'test1.pdf', content: 'base64content' },
      { fileName: 'test2.pdf', content: 'base64content', size: 2000 }
    ];
    expect(getTotalAttachmentsSize(attachments)).toBe(2000);
  });
});

describe('extractEmail', () => {
  test('extracts email from format "Name <email@example.com>"', () => {
    expect(extractEmail('John Doe <john.doe@example.com>')).toBe('john.doe@example.com');
  });

  test('returns original string if no email format is detected', () => {
    expect(extractEmail('john.doe@example.com')).toBe('john.doe@example.com');
  });
});

describe('extractDisplayName', () => {
  test('extracts name from format "Name <email@example.com>"', () => {
    expect(extractDisplayName('John Doe <john.doe@example.com>')).toBe('John Doe');
  });

  test('returns original string if no name format is detected', () => {
    expect(extractDisplayName('john.doe@example.com')).toBe('john.doe@example.com');
  });
});
