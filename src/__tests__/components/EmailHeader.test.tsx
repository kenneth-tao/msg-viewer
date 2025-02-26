import React from 'react';
import { render, screen } from '@testing-library/react';
import EmailHeader from '../../components/EmailHeader';
import { MsgFile } from '../../types';

describe('EmailHeader Component', () => {
  const mockEmail: MsgFile = {
    subject: 'Test Subject',
    from: 'sender@example.com',
    to: ['recipient1@example.com', 'recipient2@example.com'],
    displayTo: 'recipient1@example.com; recipient2@example.com',
    displayCc: 'cc@example.com',
    body: 'Test body content',
    date: '2023-01-15T10:30:00Z'
  };
  
  test('renders subject correctly', () => {
    render(<EmailHeader email={mockEmail} />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Subject');
  });
  
  test('renders sender correctly', () => {
    render(<EmailHeader email={mockEmail} />);
    const fromLabel = screen.getByText('From:');
    expect(fromLabel.nextSibling).toHaveTextContent('sender@example.com');
  });
  
  test('renders recipients correctly', () => {
    render(<EmailHeader email={mockEmail} />);
    const toLabel = screen.getByText('To:');
    expect(toLabel.nextSibling).toHaveTextContent('recipient1@example.com; recipient2@example.com');
  });
  
  test('renders CC recipients correctly', () => {
    render(<EmailHeader email={mockEmail} />);
    const ccLabel = screen.getByText('CC:');
    expect(ccLabel.nextSibling).toHaveTextContent('cc@example.com');
  });
  
  test('renders date correctly', () => {
    render(<EmailHeader email={mockEmail} />);
    const dateLabel = screen.getByText('Date:');
    expect(dateLabel.nextSibling).toHaveTextContent(/January 15, 2023/);
  });
  
  test('does not render CC section when displayCc is not provided', () => {
    const emailWithoutCc = { ...mockEmail, displayCc: undefined };
    render(<EmailHeader email={emailWithoutCc} />);
    expect(screen.queryByText('CC:')).not.toBeInTheDocument();
  });
  
  test('does not render date section when date is not provided', () => {
    const emailWithoutDate = { ...mockEmail, date: undefined };
    render(<EmailHeader email={emailWithoutDate} />);
    expect(screen.queryByText('Date:')).not.toBeInTheDocument();
  });
  
  test('renders high importance with appropriate styling', () => {
    const highImportanceEmail = { ...mockEmail, importance: 'high' as 'high' };
    render(<EmailHeader email={highImportanceEmail} />);
    
    const importanceLabel = screen.getByText('Importance:');
    const importanceValue = importanceLabel.nextSibling as HTMLElement;
    
    expect(importanceValue).toHaveTextContent('High');
    expect(importanceValue.style.fontWeight).toBe('bold');
  });
  
  test('does not render importance section for normal importance', () => {
    const normalImportanceEmail = { ...mockEmail, importance: 'normal' as 'normal' };
    render(<EmailHeader email={normalImportanceEmail} />);
    expect(screen.queryByText('Importance:')).not.toBeInTheDocument();
  });
  
  test('renders low importance without special styling', () => {
    const lowImportanceEmail = { ...mockEmail, importance: 'low' as 'low' };
    render(<EmailHeader email={lowImportanceEmail} />);
    
    const importanceLabel = screen.getByText('Importance:');
    const importanceValue = importanceLabel.nextSibling as HTMLElement;
    
    expect(importanceValue).toHaveTextContent('Low');
    expect(importanceValue.style.fontWeight).not.toBe('bold');
  });
});
