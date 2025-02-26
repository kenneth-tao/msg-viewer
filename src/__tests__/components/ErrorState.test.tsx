import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorState from '../../components/ErrorState';

describe('ErrorState Component', () => {
  const mockOnRetry = jest.fn();
  const errorMessage = 'Failed to load MSG file';
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders error message', () => {
    render(<ErrorState message={errorMessage} />);
    
    expect(screen.getByText('Error')).toBeInTheDocument();
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  
  test('does not render retry button when onRetry is not provided', () => {
    render(<ErrorState message={errorMessage} />);
    
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });
  
  test('renders retry button when onRetry is provided', () => {
    render(<ErrorState message={errorMessage} onRetry={mockOnRetry} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Try Again');
  });
  
  test('calls onRetry when retry button is clicked', () => {
    render(<ErrorState message={errorMessage} onRetry={mockOnRetry} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });
  
  test('has correct accessibility attributes', () => {
    render(<ErrorState message={errorMessage} onRetry={mockOnRetry} />);
    
    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toBeInTheDocument();
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Try again');
  });
  
  test('has correct styling classes', () => {
    const { container } = render(<ErrorState message={errorMessage} onRetry={mockOnRetry} />);
    
    expect(container.firstChild).toHaveClass('error');
    expect(screen.getByText('⚠️')).toHaveClass('error-icon');
    expect(screen.getByText('Error')).toHaveClass('error-message');
    expect(screen.getByText(errorMessage)).toHaveClass('error-details');
    expect(screen.getByRole('button')).toHaveClass('btn', 'btn-primary');
  });
});
