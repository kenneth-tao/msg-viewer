import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailBody from '../../components/EmailBody';
import { MsgFile } from '../../types';
import { sanitizeHtml } from '../../utils/helpers';

// Mock the sanitizeHtml function
jest.mock('../../utils/helpers', () => ({
  ...jest.requireActual('../../utils/helpers'),
  sanitizeHtml: jest.fn((html) => html ? html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') : '')
}));

describe('EmailBody Component', () => {
  const mockPlainTextEmail: MsgFile = {
    subject: 'Plain Text Email',
    from: 'sender@example.com',
    to: ['recipient@example.com'],
    body: 'This is a plain text email body.\nWith multiple lines.\nAnd some formatting.'
  };
  
  const mockHtmlEmail: MsgFile = {
    subject: 'HTML Email',
    from: 'sender@example.com',
    to: ['recipient@example.com'],
    body: 'Fallback plain text',
    bodyHTML: '<div><h1>HTML Email</h1><p>This is an <strong>HTML</strong> email body.</p></div>'
  };
  
  const mockUnsafeHtmlEmail: MsgFile = {
    subject: 'Unsafe HTML Email',
    from: 'sender@example.com',
    to: ['recipient@example.com'],
    body: 'Fallback plain text',
    bodyHTML: '<div><h1>HTML Email</h1><p>This is an <strong>HTML</strong> email body.</p><script>alert("XSS")</script></div>'
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders plain text email with pre tag', () => {
    render(<EmailBody email={mockPlainTextEmail} />);
    const preElement = screen.getByText(/This is a plain text email body/);
    expect(preElement.tagName).toBe('PRE');
    expect(preElement).toHaveTextContent('With multiple lines.');
    expect(preElement).toHaveTextContent('And some formatting.');
  });
  
  test('renders HTML email with dangerouslySetInnerHTML', () => {
    render(<EmailBody email={mockHtmlEmail} />);
    // Check for the heading
    expect(screen.getByRole('heading')).toHaveTextContent('HTML Email');
    // Check for the paragraph element directly
    const paragraph = screen.getByText((content, element) => {
      return element?.tagName?.toLowerCase() === 'p' && 
             element?.textContent?.includes('This is an') && 
             element?.textContent?.includes('HTML') && 
             element?.textContent?.includes('email body') || false;
    });
    expect(paragraph).toBeInTheDocument();
  });
  
  test('sanitizes HTML content', () => {
    render(<EmailBody email={mockUnsafeHtmlEmail} />);
    expect(sanitizeHtml).toHaveBeenCalledWith(mockUnsafeHtmlEmail.bodyHTML);
  });
  
  test('uses plain text when HTML content is empty', () => {
    const emptyHtmlEmail = {
      ...mockHtmlEmail,
      bodyHTML: ''
    };
    render(<EmailBody email={emptyHtmlEmail} />);
    expect(screen.getByText('Fallback plain text')).toBeInTheDocument();
  });
  
  test('uses plain text when HTML content is undefined', () => {
    const undefinedHtmlEmail = {
      ...mockHtmlEmail,
      bodyHTML: undefined
    };
    render(<EmailBody email={undefinedHtmlEmail} />);
    expect(screen.getByText('Fallback plain text')).toBeInTheDocument();
  });
  
  test('renders content in appropriate container', () => {
    const { container } = render(<EmailBody email={mockHtmlEmail} />);
    // Find the email-body-content container directly
    const contentContainer = container.querySelector('.email-body-content');
    expect(contentContainer).toBeInTheDocument();
    // Verify it contains the HTML content
    expect(contentContainer?.textContent).toContain('This is an');
    expect(contentContainer?.textContent).toContain('HTML');
    expect(contentContainer?.textContent).toContain('email body');
  });
});
