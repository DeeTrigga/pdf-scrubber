import '@testing-library/jest-dom';

// Mock the electron object
const window = {
  selectFolder: jest.fn(),
  processPDFs: jest.fn(),
  confirmRename: jest.fn(),
};