import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EmptyState from '../../components/EmptyState';

describe('EmptyState Component', () => {
  const mockOnOpenFile = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders empty state message', () => {
    render(<EmptyState onOpenFile={mockOnOpenFile} />);
    
    expect(screen.getByText('No MSG file opened')).toBeInTheDocument();
    expect(screen.getByText('Open an Outlook MSG file to view its contents')).toBeInTheDocument();
  });
  
  test('renders open file button', () => {
    render(<EmptyState onOpenFile={mockOnOpenFile} />);
    
    const button = screen.getByRole('button', { name: /open msg file/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Open MSG File');
  });
  
  test('calls onOpenFile when button is clicked', () => {
    render(<EmptyState onOpenFile={mockOnOpenFile} />);
    
    const button = screen.getByRole('button', { name: /open msg file/i });
    fireEvent.click(button);
    
    expect(mockOnOpenFile).toHaveBeenCalledTimes(1);
  });
  
  test('has correct accessibility attributes', () => {
    render(<EmptyState onOpenFile={mockOnOpenFile} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Open MSG file');
    
    const icon = screen.getByText('📂');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  });
  
  test('has correct styling classes', () => {
    const { container } = render(<EmptyState onOpenFile={mockOnOpenFile} />);
    
    expect(container.firstChild).toHaveClass('empty-state');
    expect(screen.getByText('📧')).toHaveClass('empty-state-icon');
    expect(screen.getByText('No MSG file opened')).toHaveClass('empty-state-text');
    expect(screen.getByText('Open an Outlook MSG file to view its contents')).toHaveClass('empty-state-subtext');
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-primary');
  });
});
