import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Attachment from '../../components/Attachment';
import { Attachment as AttachmentType } from '../../types';

describe('Attachment Component', () => {
  const mockAttachment: AttachmentType = {
    fileName: 'test-document.pdf',
    content: 'base64content',
    size: 12345
  };
  
  const mockOnClick = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders attachment name correctly', () => {
    render(<Attachment attachment={mockAttachment} onClick={mockOnClick} />);
    expect(screen.getByText('test-document.pdf')).toBeInTheDocument();
  });
  
  test('renders attachment size correctly', () => {
    render(<Attachment attachment={mockAttachment} onClick={mockOnClick} />);
    expect(screen.getByText('12.06 KB')).toBeInTheDocument();
  });
  
  test('calls onClick when clicked', () => {
    render(<Attachment attachment={mockAttachment} onClick={mockOnClick} />);
    fireEvent.click(screen.getByText('test-document.pdf'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockAttachment);
  });
  
  test('calls onClick when Enter key is pressed', () => {
    render(<Attachment attachment={mockAttachment} onClick={mockOnClick} />);
    const attachmentElement = screen.getByRole('button');
    fireEvent.keyDown(attachmentElement, { key: 'Enter' });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockAttachment);
  });
  
  test('calls onClick when Space key is pressed', () => {
    render(<Attachment attachment={mockAttachment} onClick={mockOnClick} />);
    const attachmentElement = screen.getByRole('button');
    fireEvent.keyDown(attachmentElement, { key: ' ' });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(mockAttachment);
  });
  
  test('does not call onClick for other keys', () => {
    render(<Attachment attachment={mockAttachment} onClick={mockOnClick} />);
    const attachmentElement = screen.getByRole('button');
    fireEvent.keyDown(attachmentElement, { key: 'A' });
    expect(mockOnClick).not.toHaveBeenCalled();
  });
  
  test('has correct accessibility attributes', () => {
    render(<Attachment attachment={mockAttachment} onClick={mockOnClick} />);
    const attachmentElement = screen.getByRole('button');
    expect(attachmentElement).toHaveAttribute('tabIndex', '0');
    expect(attachmentElement).toHaveAttribute('aria-label', 'Attachment: test-document.pdf, Size: 12.06 KB');
  });
});
