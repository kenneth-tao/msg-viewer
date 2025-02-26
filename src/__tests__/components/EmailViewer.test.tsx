import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmailViewer from '../../components/EmailViewer';
import { MsgFile, Attachment } from '../../types';

// Mock the child components
jest.mock('../../components/EmailHeader', () => {
  return function MockEmailHeader({ email }: { email: MsgFile }) {
    return <div data-testid="email-header">{email.subject}</div>;
  };
});

jest.mock('../../components/EmailBody', () => {
  return function MockEmailBody({ email }: { email: MsgFile }) {
    return <div data-testid="email-body">{email.body}</div>;
  };
});

jest.mock('../../components/AttachmentList', () => {
  return function MockAttachmentList({ 
    attachments, 
    onAttachmentClick 
  }: { 
    attachments: Attachment[], 
    onAttachmentClick: (attachment: Attachment) => void 
  }) {
    return (
      <div data-testid="attachment-list">
        {attachments.map((attachment, index) => (
          <button 
            key={index}
            onClick={() => onAttachmentClick(attachment)}
            data-testid={`attachment-${index}`}
          >
            {attachment.fileName}
          </button>
        ))}
      </div>
    );
  };
});

describe('EmailViewer Component', () => {
  const mockEmail: MsgFile = {
    subject: 'Test Email',
    from: 'sender@example.com',
    to: ['recipient@example.com'],
    body: 'Test email body',
    attachments: [
      { fileName: 'document.pdf', content: 'base64content1', size: 10000 },
      { fileName: 'image.jpg', content: 'base64content2', size: 20000 }
    ]
  };
  
  const mockOnSaveAttachment = jest.fn().mockImplementation(() => Promise.resolve());
  const mockOnSaveAttachmentError = jest.fn().mockImplementation(() => Promise.reject(new Error('Failed to save')));
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders email header, body, and attachments', () => {
    render(<EmailViewer email={mockEmail} onSaveAttachment={mockOnSaveAttachment} />);
    
    expect(screen.getByTestId('email-header')).toBeInTheDocument();
    expect(screen.getByTestId('email-body')).toBeInTheDocument();
    expect(screen.getByTestId('attachment-list')).toBeInTheDocument();
  });
  
  test('passes correct props to child components', () => {
    render(<EmailViewer email={mockEmail} onSaveAttachment={mockOnSaveAttachment} />);
    
    expect(screen.getByTestId('email-header')).toHaveTextContent('Test Email');
    expect(screen.getByTestId('email-body')).toHaveTextContent('Test email body');
    expect(screen.getByTestId('attachment-0')).toHaveTextContent('document.pdf');
    expect(screen.getByTestId('attachment-1')).toHaveTextContent('image.jpg');
  });
  
  test('handles attachment click correctly', async () => {
    render(<EmailViewer email={mockEmail} onSaveAttachment={mockOnSaveAttachment} />);
    
    fireEvent.click(screen.getByTestId('attachment-0'));
    
    expect(mockOnSaveAttachment).toHaveBeenCalledTimes(1);
    expect(mockOnSaveAttachment).toHaveBeenCalledWith(mockEmail.attachments![0]);
  });
  
  test('shows loading state when saving attachment', async () => {
    // Create a mock that doesn't resolve immediately
    const delayedMockSave = jest.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve(undefined), 100);
      });
    });
    
    render(<EmailViewer email={mockEmail} onSaveAttachment={delayedMockSave} />);
    
    fireEvent.click(screen.getByTestId('attachment-0'));
    
    expect(screen.queryByText('Saving attachment...')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(screen.queryByText('Saving attachment...')).not.toBeInTheDocument();
    });
  });
  
  test('shows error message when saving fails', async () => {
    render(<EmailViewer email={mockEmail} onSaveAttachment={mockOnSaveAttachmentError} />);
    
    fireEvent.click(screen.getByTestId('attachment-0'));
    
    await waitFor(() => {
      expect(screen.getByText(/Error saving attachment/)).toBeInTheDocument();
      expect(screen.getByText(/Failed to save/)).toBeInTheDocument();
    });
  });
  
  test('does not render attachment list when email has no attachments', () => {
    const emailWithoutAttachments = { ...mockEmail, attachments: undefined };
    render(<EmailViewer email={emailWithoutAttachments} onSaveAttachment={mockOnSaveAttachment} />);
    
    expect(screen.queryByTestId('attachment-list')).not.toBeInTheDocument();
  });
});
