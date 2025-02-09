import '@testing-library/jest-dom';

// Mock the electron object
window.electron = {
  selectFolder: jest.fn(),
  processPDFs: jest.fn(),
  confirmRename: jest.fn(),
};