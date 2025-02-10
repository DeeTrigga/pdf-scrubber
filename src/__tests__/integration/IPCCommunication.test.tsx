import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockElectron } from '../utils/test-utils';
import '@testing-library/jest-dom'

describe('IPC Communication Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('handles IPC timeouts and retries', async () => {
    // Mock first attempt timeout, second succeeds
    mockElectron.selectFolder
      .mockRejectedValueOnce(new Error('Timeout'))
      .mockResolvedValueOnce({
        path: '/test/documents',
        pdfCount: 1
      });


    await act(async () => {
      await userEvent.click(screen.getByText('Select Folder'));
    });

    // Verify error toast appears
    await waitFor(() => {
      expect(screen.getByText(/Failed to select folder/)).toBeInTheDocument();
    });

    // Try again
    await act(async () => {
      await userEvent.click(screen.getByText('Select Folder'));
    });

    // Verify second attempt succeeds
    await waitFor(() => {
      expect(screen.getByText('/test/documents (1 PDFs found)')).toBeInTheDocument();
    });
  });

  it('handles concurrent IPC calls correctly', async () => {
    // Mock slow responses
    mockElectron.selectFolder.mockImplementation(() => 
      new Promise(resolve => setTimeout(() => 
        resolve({ path: '/test/documents', pdfCount: 1 }), 100))
    );

    // Trigger multiple clicks rapidly
    await act(async () => {
      await userEvent.click(screen.getByText('Select Folder'));
      await userEvent.click(screen.getByText('Select Folder'));
      await userEvent.click(screen.getByText('Select Folder'));
    });

    // Verify only one request succeeded
    await waitFor(() => {
      expect(mockElectron.selectFolder).toHaveBeenCalledTimes(1);
    });
  });

  it('handles large PDF processing batches', async () => {
    // Create large batch of mock results
    const largeBatch = Array.from({ length: 50 }, (_, i) => ({
      original: `file${i}.pdf`,
      extracted: {
        company: 'Test Corp',
        type: 'Document',
        date: '2024-02-09',
        assumed: false
      },
      newName: `testcorp-document-${i}-02.09.2024.pdf`,
      success: true
    }));

    mockElectron.selectFolder.mockResolvedValueOnce({
      path: '/test/documents',
      pdfCount: 50
    });

    mockElectron.processPDFs.mockResolvedValueOnce(largeBatch);

    // Start processing
    await act(async () => {
      await userEvent.click(screen.getByText('Select Folder'));
      await waitFor(() => {
        expect(screen.getByText('Start Processing')).toBeEnabled();
      });
      await userEvent.click(screen.getByText('Start Processing'));
    });

    // Verify all results are rendered
    await waitFor(() => {
      expect(screen.getByText('Results (50 of 50):')).toBeInTheDocument();
    });

    // Verify scrolling behavior
    const resultsContainer = screen.getByText('Results (50 of 50):');
    expect(resultsContainer).toHaveClass('overflow-y-auto');
  });

  it('handles network disconnection scenarios', async () => {
    mockElectron.selectFolder.mockResolvedValueOnce({
      path: '/test/documents',
      pdfCount: 2
    });

    // Mock network failure during processing
    mockElectron.processPDFs.mockImplementation(async () => {
      await new Promise(resolve => setTimeout(resolve, 100));
      throw new Error('Network disconnected');
    });

    // Start processing
    await act(async () => {
      await userEvent.click(screen.getByText('Select Folder'));
      await waitFor(() => {
        expect(screen.getByText('Start Processing')).toBeEnabled();
      });
      await userEvent.click(screen.getByText('Start Processing'));
    });

    // Verify error handling
    await waitFor(() => {
      expect(screen.getByText(/Failed to process PDFs/)).toBeInTheDocument();
    });

    // Verify UI is reset for retry
    expect(screen.getByText('Start Processing')).toBeEnabled();
  });
});