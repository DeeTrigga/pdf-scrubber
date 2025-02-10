import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockElectron } from '../utils/test-utils';

// Mock data for integration tests
const mockPDFResults = [
    {
        original: 'invoice_123.pdf',
        extracted: {
            company: 'Acme Corp',
            type: 'Invoice',
            date: '2024-02-09',
            assumed: false
        },
        newName: 'acmecorp-invoice-02.09.2024.pdf',
        success: true
    },
    {
        original: 'statement_456.pdf',
        extracted: {
            company: 'Tech Inc',
            type: 'Statement',
            date: '2024-02-08',
            assumed: true
        },
        newName: 'techinc-statement-02.08.2024.pdf',
        success: true
    }
];

describe('PDF Processing Integration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Reset mock implementations
        mockElectron.selectFolder.mockReset();
        mockElectron.processPDFs.mockReset();
        mockElectron.confirmRename.mockReset();
    });

    it('completes a full PDF processing workflow', async () => {
        // Mock the folder selection
        mockElectron.selectFolder.mockResolvedValueOnce({
            path: '/test/documents',
            pdfCount: 2
        });

        // Mock the PDF processing
        mockElectron.processPDFs.mockResolvedValueOnce(mockPDFResults);

        // Mock successful rename operations
        mockElectron.confirmRename.mockResolvedValue({ success: true });

        // Step 1: Select Folder
        await act(async () => {
            await userEvent.click(screen.getByText('Select Folder'));
        });

        // Verify folder selection result
        await waitFor(() => {
            expect(screen.getByText('/test/documents (2 PDFs found)'));
        });

        // Step 2: Start Processing
        await act(async () => {
            await userEvent.click(screen.getByText('Start Processing'));
        });

        // Verify processing started
        expect(screen.getByText(/Processing/)).toBeInTheDocument();

        // Wait for results to appear
        await waitFor(() => {
            expect(screen.getByText('Results (2 of 2):')).toBeInTheDocument();
            expect(screen.getByText('Original: invoice_123.pdf')).toBeInTheDocument();
            expect(screen.getByText('Original: statement_456.pdf')).toBeInTheDocument();
        });

        // Step 3: Approve first file rename
        const approveButtons = screen.getAllByLabelText('Approve rename');
        await act(async () => {
            await userEvent.click(approveButtons[0]);
        });

        // Verify first file was processed
        await waitFor(() => {
            expect(screen.queryByText('Original: invoice_123.pdf')).not.toBeInTheDocument();
            expect(mockElectron.confirmRename).toHaveBeenCalledWith({
                folderPath: '/test/documents',
                oldName: 'invoice_123.pdf',
                newName: 'acmecorp-invoice-02.09.2024.pdf'
            });
        });

        // Step 4: Reject second file
        const rejectButton = screen.getByLabelText('Reject rename');
        await act(async () => {
            await userEvent.click(rejectButton);
        });

        // Verify all files have been handled
        await waitFor(() => {
            expect(screen.queryByText('Original: statement_456.pdf')).not.toBeInTheDocument();
            // Verify reject didn't call rename
            expect(mockElectron.confirmRename).toHaveBeenCalledTimes(1);
        });
    });

    it('handles errors during the processing workflow', async () => {
        // Mock successful folder selection
        mockElectron.selectFolder.mockResolvedValueOnce({
            path: '/test/documents',
            pdfCount: 2
        });

        // Mock PDF processing error
        mockElectron.processPDFs.mockRejectedValueOnce(new Error('Processing failed'));

        
        // Select folder
        await act(async () => {
            await userEvent.click(screen.getByText('Select Folder'));
        });

        // Start processing
        await act(async () => {
            await userEvent.click(screen.getByText('Start Processing'));
        });

        // Verify error handling
        await waitFor(() => {
            expect(screen.getByText(/Failed to process PDFs/)).toBeInTheDocument();
        });
    });

    it('handles mixed success/failure scenarios', async () => {
        // Mock folder selection
        mockElectron.selectFolder.mockResolvedValueOnce({
            path: '/test/documents',
            pdfCount: 2
        });

        // Mock PDF processing with one success, one failure
        mockElectron.processPDFs.mockResolvedValueOnce([
            {
                ...mockPDFResults[0],
                success: true
            },
            {
                original: 'corrupted.pdf',
                error: 'Could not read PDF',
                success: false
            }
        ]);


        // Complete workflow
        await act(async () => {
            await userEvent.click(screen.getByText('Select Folder'));
            await waitFor(() => {
                expect(screen.getByText('Start Processing')).toBeEnabled();
            });
            await userEvent.click(screen.getByText('Start Processing'));
        });

        // Verify mixed results
        await waitFor(() => {
            expect(screen.getByText('Original: invoice_123.pdf')).toBeInTheDocument();
            expect(screen.getByText('Original: corrupted.pdf')).toBeInTheDocument();
            expect(screen.getByText(/Could not read PDF/)).toBeInTheDocument();
        });
    });

    it('preserves state between operations', async () => {
        // Mock multiple folder selections
        mockElectron.selectFolder
            .mockResolvedValueOnce({
                path: '/test/documents1',
                pdfCount: 1
            })
            .mockResolvedValueOnce({
                path: '/test/documents2',
                pdfCount: 2
            });

        mockElectron.processPDFs
            .mockResolvedValueOnce([mockPDFResults[0]])
            .mockResolvedValueOnce(mockPDFResults);


        // First folder selection and processing
        await act(async () => {
            await userEvent.click(screen.getByText('Select Folder'));
        });

        await waitFor(() => {
            expect(screen.getByText('/test/documents1 (1 PDFs found)')).toBeInTheDocument();
        });

        await act(async () => {
            await userEvent.click(screen.getByText('Start Processing'));
        });

        // Verify first processing results
        await waitFor(() => {
            expect(screen.getByText('Original: invoice_123.pdf')).toBeInTheDocument();
        });

        // Select new folder
        await act(async () => {
            await userEvent.click(screen.getByText('Select Folder'));
        });

        // Verify state reset and new folder selection
        await waitFor(() => {
            expect(screen.getByText('/test/documents2 (2 PDFs found)')).toBeInTheDocument();
            expect(screen.queryByText('Original: invoice_123.pdf')).not.toBeInTheDocument();
        });
    });
});

function act(arg0: () => Promise<void>) {
    throw new Error('Function not implemented.');
}
