import React from 'react';
import { mockElectron, render, screen, fireEvent, waitFor, act } from './utils/test-utils';
import userEvent from '@testing-library/user-event';
import PDFScrubber from '../components/PDFScrubber';

describe('PDFScrubber', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders initial state correctly', () => {
    render(<PDFScrubber />);
    
    expect(screen.getByText('PDF Scrubber')).toBeInTheDocument();
    expect(screen.getByText('Select Folder')).toBeEnabled();
    expect(screen.getByText('Start Processing')).toBeDisabled();
  });

  it('handles folder selection', async () => {
    mockElectron.selectFolder.mockResolvedValueOnce({
      path: '/test/path',
      pdfCount: 3
    });

    render(<PDFScrubber />);
    
    const selectButton = screen.getByText('Select Folder');
    await userEvent.click(selectButton);

    await waitFor(() => {
      expect(screen.getByText('/test/path (3 PDFs found)')).toBeInTheDocument();
      expect(screen.getByText('Start Processing')).toBeEnabled();
    });
  });

  it('handles processing PDFs', async () => {
    const mockResults = [
      {
        original: 'test1.pdf',
        extracted: {
          company: 'TestCo',
          type: 'Invoice',
          date: '2024-02-09',
          assumed: false
        },
        newName: 'testco-invoice-2024.02.09.pdf',
        success: true
      }
    ];

    mockElectron.selectFolder.mockResolvedValueOnce({
      path: '/test/path',
      pdfCount: 1
    });
    mockElectron.processPDFs.mockResolvedValueOnce(mockResults);

    render(<PDFScrubber />);
    
    // Select folder
    await userEvent.click(screen.getByText('Select Folder'));
    await waitFor(() => {
      expect(screen.getByText('Start Processing')).toBeEnabled();
    });

    // Start processing
    await userEvent.click(screen.getByText('Start Processing'));

    // Check processing state
    expect(screen.getByText(/Processing/)).toBeInTheDocument();

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('Original: test1.pdf')).toBeInTheDocument();
      expect(screen.getByText(/TestCo.*Invoice.*2024-02-09/)).toBeInTheDocument();
    });
  });

  it('handles file renaming', async () => {
    const mockResults = [
      {
        original: 'test1.pdf',
        extracted: {
          company: 'TestCo',
          type: 'Invoice',
          date: '2024-02-09',
          assumed: false
        },
        newName: 'testco-invoice-2024.02.09.pdf',
        success: true
      }
    ];

    mockElectron.selectFolder.mockResolvedValueOnce({
      path: '/test/path',
      pdfCount: 1
    });
    mockElectron.processPDFs.mockResolvedValueOnce(mockResults);
    mockElectron.confirmRename.mockResolvedValueOnce({ success: true });

    render(<PDFScrubber />);
    
    // Select folder and process
    await userEvent.click(screen.getByText('Select Folder'));
    await waitFor(() => {
      expect(screen.getByText('Start Processing')).toBeEnabled();
    });
    await userEvent.click(screen.getByText('Start Processing'));

    // Wait for results and click approve
    await waitFor(() => {
      expect(screen.getByLabelText('Approve rename')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByLabelText('Approve rename'));

    // Verify rename was called
    expect(mockElectron.confirmRename).toHaveBeenCalledWith({
      folderPath: '/test/path',
      oldName: 'test1.pdf',
      newName: 'testco-invoice-2024.02.09.pdf'
    });

    // Verify item is removed after successful rename
    await waitFor(() => {
      expect(screen.queryByText('Original: test1.pdf')).not.toBeInTheDocument();
    });
  });

  it('shows error toast on failed rename', async () => {
    const mockResults = [
      {
        original: 'test1.pdf',
        extracted: {
          company: 'TestCo',
          type: 'Invoice',
          date: '2024-02-09',
          assumed: false
        },
        newName: 'testco-invoice-2024.02.09.pdf',
        success: true
      }
    ];

    mockElectron.selectFolder.mockResolvedValueOnce({
      path: '/test/path',
      pdfCount: 1
    });
    mockElectron.processPDFs.mockResolvedValueOnce(mockResults);
    mockElectron.confirmRename.mockRejectedValueOnce(new Error('Rename failed'));

    render(<PDFScrubber />);
    
    // Select folder and process
    await userEvent.click(screen.getByText('Select Folder'));
    await waitFor(() => {
      expect(screen.getByText('Start Processing')).toBeEnabled();
    });
    await userEvent.click(screen.getByText('Start Processing'));

    // Wait for results and click approve
    await waitFor(() => {
      expect(screen.getByLabelText('Approve rename')).toBeInTheDocument();
    });
    await userEvent.click(screen.getByLabelText('Approve rename'));

    // Verify error toast
    await waitFor(() => {
      expect(screen.getByText(/Failed to rename file/)).toBeInTheDocument();
    });
  });
});