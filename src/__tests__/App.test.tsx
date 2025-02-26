import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { MsgFile, Attachment } from '../types';

// Mock the window.api
const mockOpenFile = jest.fn();
const mockParseMsgFile = jest.fn();
const mockSaveAttachment = jest.fn();

// Mock the child components
jest.mock('../components/EmailViewer', () => {
  return function MockEmailViewer({ 
    email, 
    onSaveAttachment 
  }: { 
    email: MsgFile, 
    onSaveAttachment: (attachment: Attachment) => Promise<void> 
  }) {
    return (
      <div data-testid="email-viewer">
        <div data-testid="email-subject">{email.subject}</div>
        <button 
          data-testid="save-attachment-button"
          onClick={() => onSaveAttachment(email.attachments![0])}
        >
          Save Attachment
        </button>
      </div>
    );
  };
});

jest.mock('../components/EmptyState', () => {
  return function MockEmptyState({ onOpenFile }: { onOpenFile: () => void }) {
    return (
      <div data-testid="empty-state">
        <button data-testid="open-file-button" onClick={onOpenFile}>
          Open File
        </button>
      </div>
    );
  };
});

jest.mock('../components/ErrorState', () => {
  return function MockErrorState({ 
    message, 
    onRetry 
  }: { 
    message: string, 
    onRetry?: () => void 
  }) {
    return (
      <div data-testid="error-state">
        <div data-testid="error-message">{message}</div>
        {onRetry && (
          <button data-testid="retry-button" onClick={onRetry}>
            Retry
          </button>
        )}
      </div>
    );
  };
});

jest.mock('../components/LoadingState', () => {
  return function MockLoadingState() {
    return <div data-testid="loading-state">Loading...</div>;
  };
});

describe('App Component', () => {
  const mockMsgFile: MsgFile = {
    subject: 'Test Email',
    from: 'sender@example.com',
    to: ['recipient@example.com'],
    body: 'Test email body',
    attachments: [
      { fileName: 'document.pdf', content: 'base64content', size: 10000 }
    ]
  };
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Setup window.api mock
    Object.defineProperty(window, 'api', {
      value: {
        openFile: mockOpenFile,
        parseMsgFile: mockParseMsgFile,
        saveAttachment: mockSaveAttachment,
        getAppVersion: jest.fn().mockReturnValue('1.0.0'),
        getPlatform: jest.fn().mockReturnValue('darwin')
      },
      writable: true
    });
  });
  
  test('renders empty state initially', () => {
    render(<App />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.queryByTestId('email-viewer')).not.toBeInTheDocument();
    expect(screen.queryByTestId('error-state')).not.toBeInTheDocument();
    expect(screen.queryByTestId('loading-state')).not.toBeInTheDocument();
  });
  
  test('shows loading state when opening a file', async () => {
    mockOpenFile.mockResolvedValueOnce('/path/to/file.msg');
    // Don't resolve parseMsgFile yet to keep the loading state
    mockParseMsgFile.mockImplementationOnce(() => new Promise(() => {}));
    
    render(<App />);
    
    fireEvent.click(screen.getByTestId('open-file-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    });
  });
  
  test('shows email viewer when file is successfully loaded', async () => {
    mockOpenFile.mockResolvedValueOnce('/path/to/file.msg');
    mockParseMsgFile.mockResolvedValueOnce(mockMsgFile);
    
    render(<App />);
    
    fireEvent.click(screen.getByTestId('open-file-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('email-viewer')).toBeInTheDocument();
      expect(screen.getByTestId('email-subject')).toHaveTextContent('Test Email');
    });
    
    expect(mockOpenFile).toHaveBeenCalledTimes(1);
    expect(mockParseMsgFile).toHaveBeenCalledTimes(1);
    expect(mockParseMsgFile).toHaveBeenCalledWith('/path/to/file.msg');
  });
  
  test('shows error state when file loading fails', async () => {
    mockOpenFile.mockResolvedValueOnce('/path/to/file.msg');
    mockParseMsgFile.mockRejectedValueOnce(new Error('Failed to parse MSG file'));
    
    render(<App />);
    
    fireEvent.click(screen.getByTestId('open-file-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
      expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to parse MSG file');
    });
  });
  
  test('does nothing when file dialog is canceled', async () => {
    mockOpenFile.mockResolvedValueOnce(null);
    
    render(<App />);
    
    fireEvent.click(screen.getByTestId('open-file-button'));
    
    // Wait a bit to ensure any state changes would have happened
    await new Promise(resolve => setTimeout(resolve, 100));
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(mockParseMsgFile).not.toHaveBeenCalled();
  });
  
  test('handles attachment saving', async () => {
    mockOpenFile.mockResolvedValueOnce('/path/to/file.msg');
    mockParseMsgFile.mockResolvedValueOnce(mockMsgFile);
    mockSaveAttachment.mockResolvedValueOnce({ success: true, filePath: '/saved/path/document.pdf' });
    
    render(<App />);
    
    fireEvent.click(screen.getByTestId('open-file-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('email-viewer')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTestId('save-attachment-button'));
    
    await waitFor(() => {
      expect(mockSaveAttachment).toHaveBeenCalledTimes(1);
      expect(mockSaveAttachment).toHaveBeenCalledWith({
        fileName: 'document.pdf',
        content: 'base64content'
      });
    });
  });
  
  test('retries file loading when retry button is clicked', async () => {
    // First attempt fails
    mockOpenFile.mockResolvedValueOnce('/path/to/file.msg');
    mockParseMsgFile.mockRejectedValueOnce(new Error('Failed to parse MSG file'));
    
    render(<App />);
    
    fireEvent.click(screen.getByTestId('open-file-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });
    
    // Reset mocks for second attempt
    mockOpenFile.mockResolvedValueOnce('/path/to/file.msg');
    mockParseMsgFile.mockResolvedValueOnce(mockMsgFile);
    
    fireEvent.click(screen.getByTestId('retry-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('email-viewer')).toBeInTheDocument();
    });
    
    expect(mockOpenFile).toHaveBeenCalledTimes(2);
    expect(mockParseMsgFile).toHaveBeenCalledTimes(2);
  });
  
  test('renders app header with title and open button', async () => {
    mockOpenFile.mockResolvedValueOnce('/path/to/file.msg');
    mockParseMsgFile.mockResolvedValueOnce(mockMsgFile);
    
    render(<App />);
    
    expect(screen.getByText('MSG Viewer')).toBeInTheDocument();
    
    // Open a file first to get to the viewer state
    fireEvent.click(screen.getByTestId('open-file-button'));
    
    await waitFor(() => {
      expect(screen.getByTestId('email-viewer')).toBeInTheDocument();
    });
    
    // There should still be an "Open File" button in the header
    const openFileButtons = screen.getAllByText(/Open File/i);
    expect(openFileButtons.length).toBeGreaterThan(0);
    
    // Click the header's open file button
    fireEvent.click(openFileButtons[0]);
    
    // It should trigger the openFile function again
    expect(mockOpenFile).toHaveBeenCalledTimes(2);
  });
});
