import { ErrorBoundary } from './components/ErrorBoundary';
import PDFScrubber from './components/PDFScrubber';

function App() {
    return (
        <ErrorBoundary>
            <PDFScrubber />
        </ErrorBoundary>
    );
}