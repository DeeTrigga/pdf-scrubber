import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock the electron global
const mockElectron = {
  selectFolder: jest.fn(),
  processPDFs: jest.fn(),
  confirmRename: jest.fn(),
};

// Create custom render method
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  window.electron = mockElectron;
  return render(ui, { ...options });
};

export * from '@testing-library/react';
export { customRender as render };
export { mockElectron };