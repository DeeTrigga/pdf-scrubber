import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toast } from '../../components/ui/Toast';

describe('Toast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders with correct message and type', () => {
    const onClose = jest.fn();
    render(
      <Toast
        message="Test message"
        type="success"
        onClose={onClose}
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-green-50');
  });

  it('calls onClose when close button is clicked', async () => {
    const onClose = jest.fn();
    render(
      <Toast
        message="Test message"
        type="error"
        onClose={onClose}
      />
    );

    await userEvent.click(screen.getByLabelText('Close notification'));
    expect(onClose).toHaveBeenCalled();
  });

  it('auto-closes after 5 seconds', async () => {
    const onClose = jest.fn();
    render(
      <Toast
        message="Test message"
        type="warning"
        onClose={onClose}
      />
    );

    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(onClose).toHaveBeenCalled();
    });
  });

  it('renders different icons based on type', () => {
    const onClose = jest.fn();
    const { rerender } = render(
      <Toast
        message="Test"
        type="success"
        onClose={onClose}
      />
    );

    expect(screen.getByRole('alert')).toHaveClass('bg-green-50');

    rerender(
      <Toast
        message="Test"
        type="error"
        onClose={onClose}
      />
    );

    expect(screen.getByRole('alert')).toHaveClass('bg-red-50');

    rerender(
      <Toast
        message="Test"
        type="warning"
        onClose={onClose}
      />
    );

    expect(screen.getByRole('alert')).toHaveClass('bg-yellow-50');
  });
});