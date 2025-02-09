# PDF Scrubber Documentation

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Usage Guide](#usage-guide)
4. [Technical Documentation](#technical-documentation)
5. [Troubleshooting](#troubleshooting)
6. [Development Guide](#development-guide)

## Overview

PDF Scrubber is a desktop application that helps organize PDF documents by analyzing their content and automatically generating descriptive filenames. It extracts key information such as company names, document types, and dates from PDF content to create meaningful filenames.

### Key Features

- Automated PDF content analysis
- Smart metadata extraction
- Interactive review and approval process
- Batch processing capabilities
- Local processing (no cloud/API dependencies)

## Installation

### System Requirements

- Node.js 16.x or higher
- npm 8.x or higher
- Operating System: Windows 10+, macOS 10.15+, or Linux

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/pdf-scrubber
   cd pdf-scrubber
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create required directories:

   ```bash
   mkdir dist
   ```

4. Install the application:

   ```bash
   npm run install
   ```

## Structure

```markdownlint
pdf-scrubber/
├── src/
│   ├── components/
│   │   ├── PDFScrubber.jsx           # Main PDF Scrubber component
│   │   └── ui/                       # shadcn/ui components
│   │       ├── alert.jsx
│   │       └── progress.jsx
│   ├── styles/
│   │   └── globals.css               # Global styles and Tailwind imports
│   ├── main.js                       # Electron main process
│   ├── preload.js                    # Electron preload script
│   ├── App.jsx                       # Root React component
│   └── index.jsx                     # React entry point
├── public/
│   ├── index.html                    # HTML template
│   └── electron.js                   # Electron entry point
├── config/
│   └── tailwind.config.js            # Tailwind configuration
├── scripts/
│   ├── build.js                      # Build scripts
│   └── start.js                      # Development scripts
├── .gitignore
├── package.json
├── README.md
└── vite.config.js                    # Vite configuration for React
```

## Key File Purposes

### React Files

- `src/index.jsx`: Entry point for React application
- `src/App.jsx`: Root React component that wraps PDFScrubber
- `src/components/PDFScrubber.jsx`: Main application component
- `src/components/ui/*`: Reusable UI components from shadcn/ui

### Electron Files

- `public/electron.js`: Electron entry point
- `src/main.js`: Main process code
- `src/preload.js`: Preload script for IPC communication

### Configuration Files

- `vite.config.js`: Configures Vite for development and building
- `config/tailwind.config.js`: Tailwind CSS configuration
- `package.json`: Project dependencies and scripts

### Build and Development

- `scripts/build.js`: Production build script
- `scripts/start.js`: Development script

## Component Structure

```jsx
// src/index.jsx
↓
// src/App.jsx
↓
// src/components/PDFScrubber.jsx
```

## Development Workflow

1. Source files in `src/`
2. Development using Vite dev server
3. Electron runs alongside React in development
4. Production build creates optimized bundle

## Usage Guide

### Getting Started

1. Launch the application:

   ```bash
   npm start
   ```

2. Click "Select Folder" to choose a directory containing PDFs
3. Review the number of PDFs found in the selected directory
4. Click "Start Processing" to begin analysis

### Processing Files

The application will:

1. Scan each PDF for content
2. Extract key information:
   - Company names
   - Document types
   - Relevant dates
3. Generate suggested filenames
4. Present results for review

### Review Process

For each file, you can:

- Review the original filename
- See extracted metadata
- Preview the suggested new filename
- Approve (👍) or reject (👎) the suggestion

Yellow highlights indicate:

- Best-guess metadata
- Uncertain classifications
- Assumed dates

### File Naming Convention

The default naming pattern is:
`[company]-[type]-[date].pdf`

Examples:

- `xfinity-cable_invoice-04.20.2020.pdf`
- `statefarm-insurance_policy-03.15.2020.pdf`

## Technical Documentation

### Metadata Extraction

The application uses several strategies to extract metadata:

1. **Company Detection**:
   - Pattern matching against known companies
   - Industry-specific keyword detection
   - Capitalization analysis
   - Context-based company name extraction

2. **Document Type Classification**:
   - Common document type patterns
   - Content-based classification
   - Industry-specific document types
   - Fallback categorization

3. **Date Extraction**:
   - Multiple date format support
   - Priority-based date selection
   - Context-aware date extraction
   - Fallback to file creation date

### Pattern Matching System

Confidence scoring is based on:

- Exact matches (10 points)
- Indicator presence (5 points)
- Category matches (3 points)
- Case-sensitive matches (2 bonus points)

### File Processing Pipeline

1. **File Selection**:
   - Directory scanning
   - PDF filtering
   - File count verification

2. **Content Extraction**:
   - PDF parsing
   - Text content extraction
   - Error handling

3. **Metadata Analysis**:
   - Pattern matching
   - Confidence scoring
   - Best-match selection

4. **Filename Generation**:
   - Metadata combination
   - String sanitization
   - Collision handling

## Troubleshooting

### Common Issues

1. **PDF Reading Errors**
   - Cause: Corrupted PDF or unsupported format
   - Solution: Verify PDF file integrity

2. **No Metadata Extracted**
   - Cause: Unrecognized content format
   - Solution: Review PDF content structure

3. **Installation Issues**
   - Cause: Missing dependencies
   - Solution: Run `npm install` with --verbose flag

### Error Messages

- "Failed to process PDF": File is corrupted or encrypted
- "Unable to extract text": PDF contains no extractable text
- "File access denied": Check file permissions

## Development Guide

### Adding New Features

1. **New Company Patterns**:

```javascript
const newCompany = {
  names: ['CompanyName'],
  category: 'Industry',
  indicators: ['keyword1', 'keyword2']
};
PATTERNS.companies.push(newCompany);
```

2. **New Document Types**:

```javascript
const newDocType = {
  types: ['TypeName'],
  indicators: ['indicator1', 'indicator2']
};
PATTERNS.documentTypes.push(newDocType);
```

### Building for Production

1. Create production build:

```bash
npm run build
```

2. Package application:

```bash
npm run package
```

### Testing

Run the test suite:

```bash
npm test
```

### Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

Follow the coding standards:

- Use ES6+ features
- Add JSDoc comments
- Follow the existing pattern matching structure

## Support

For issues and feature requests, please:

1. Check the troubleshooting guide
2. Review existing GitHub issues
3. Submit a new issue if needed

---

## Version History

- 1.0.0: Initial release
  - Basic PDF processing
  - Metadata extraction
  - Interactive review

- 1.1.0: Enhanced features
  - Improved company detection
  - Better date extraction
  - UI improvements
