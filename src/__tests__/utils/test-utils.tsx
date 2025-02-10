import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Mock the electron global
const mockElectron = {
  selectFolder: jest.fn(),
  processPDFs: jest.fn(),
  confirmRename: jest.fn(),
};

//Mock the render function to include the mocked electron global
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => {
  return render(ui, { wrapper: ({ children }) => <>{children}</>, ...options });
};

export * from '@testing-library/react';
export { customRender as render, mockElectron };