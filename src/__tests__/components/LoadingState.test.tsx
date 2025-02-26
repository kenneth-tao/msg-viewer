import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingState from '../../components/LoadingState';

describe('LoadingState Component', () => {
  test('renders loading spinner', () => {
    const { container } = render(<LoadingState />);
    
    const spinner = container.querySelector('.loading-spinner');
    expect(spinner).toBeInTheDocument();
  });
  
  test('has correct accessibility attributes', () => {
    render(<LoadingState />);
    
    const loadingContainer = screen.getByRole('status');
    expect(loadingContainer).toBeInTheDocument();
    
    const spinner = screen.getByLabelText('Loading');
    expect(spinner).toBeInTheDocument();
    
    const srOnlyText = screen.getByText('Loading...');
    expect(srOnlyText).toHaveClass('sr-only');
  });
  
  test('has correct styling classes', () => {
    const { container } = render(<LoadingState />);
    
    expect(container.firstChild).toHaveClass('loading');
    expect(container.querySelector('.loading-spinner')).toBeInTheDocument();
  });
});
