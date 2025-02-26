import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AttachmentList from '../../components/AttachmentList';
import { Attachment as AttachmentType } from '../../types';

describe('AttachmentList Component', () => {
  const mockAttachments: AttachmentType[] = [
    {
      fileName: 'document1.pdf',
      content: 'base64content1',
      size: 10000
    },
    {
      fileName: 'document2.docx',
      content: 'base64content2',
      size: 20000
    },
    {
      fileName: 'image.jpg',
      content: 'base64content3',
      size: 30000
    }
  ];
  
  const mockOnAttachmentClick = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders nothing when attachments array is empty', () => {
    const { container } = render(
      <AttachmentList attachments={[]} onAttachmentClick={mockOnAttachmentClick} />
    );
    expect(container.firstChild).toBeNull();
  });
  
  test('renders nothing when attachments is undefined', () => {
    // @ts-ignore - Testing undefined case
    const { container } = render(
      <AttachmentList attachments={undefined} onAttachmentClick={mockOnAttachmentClick} />
    );
    expect(container.firstChild).toBeNull();
  });
  
  test('renders correct number of attachments', () => {
    render(
      <AttachmentList attachments={mockAttachments} onAttachmentClick={mockOnAttachmentClick} />
    );
    
    expect(screen.getByText('document1.pdf')).toBeInTheDocument();
    expect(screen.getByText('document2.docx')).toBeInTheDocument();
    expect(screen.getByText('image.jpg')).toBeInTheDocument();
  });
  
  test('displays correct total count and size in heading', () => {
    render(
      <AttachmentList attachments={mockAttachments} onAttachmentClick={mockOnAttachmentClick} />
    );
    
    const heading = screen.getByRole('heading', { name: /attachments/i });
    expect(heading).toHaveTextContent('Attachments (3, 58.59 KB)');
  });
  
  test('calls onAttachmentClick when an attachment is clicked', () => {
    render(
      <AttachmentList attachments={mockAttachments} onAttachmentClick={mockOnAttachmentClick} />
    );
    
    fireEvent.click(screen.getByText('document1.pdf'));
    expect(mockOnAttachmentClick).toHaveBeenCalledTimes(1);
    expect(mockOnAttachmentClick).toHaveBeenCalledWith(mockAttachments[0]);
  });
  
  test('has correct accessibility attributes', () => {
    render(
      <AttachmentList attachments={mockAttachments} onAttachmentClick={mockOnAttachmentClick} />
    );
    
    const heading = screen.getByRole('heading');
    expect(heading).toHaveAttribute('id', 'attachments-heading');
    
    const list = screen.getByRole('list');
    expect(list).toHaveAttribute('aria-labelledby', 'attachments-heading');
  });
});
