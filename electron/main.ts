import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs/promises';
import { extractMetadata, generateFilename } from './utils/pdfProcessing';
import * as pdfParse from 'pdf-parse';

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, '../public/app-icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // In development mode, load from localhost
  if (isDev) {
    console.log('Loading development URL');
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html file
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    console.log('Loading production path:', indexPath);

    // Check if the file exists
    fs.access(indexPath)
      .then(() => {
        console.log('Index file exists, loading...');
        mainWindow.loadFile(indexPath);
      })
      .catch(async (error) => {
        console.error('Index file not found at:', indexPath);
        // List directory contents to help debug
        const dir = path.join(__dirname, '..');
        console.log('Directory contents of:', dir);
        try {
          const files = await fs.readdir(dir);
          files.forEach(file => console.log(file));
        } catch (err) {
          console.error('Error reading directory:', err);
        }
      });
  }

  // Open DevTools in development and when debugging is needed
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// App event handlers
app.whenReady().then(() => {
  console.log('App is ready');
  console.log('Current working directory:', process.cwd());
  console.log('__dirname:', __dirname);
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC Handlers
ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (!result.canceled) {
    try {
      const files = await fs.readdir(result.filePaths[0]);
      const pdfCount = files.filter(file =>
        file.toLowerCase().endsWith('.pdf')
      ).length;

      return {
        path: result.filePaths[0],
        pdfCount
      };
    } catch (error) {
      console.error('Error reading directory:', error);
      throw error;
    }
  }
  return null;
});

ipcMain.handle('process-pdfs', async (event, folderPath: string) => {
  try {
    const files = await fs.readdir(folderPath);
    const pdfFiles = files.filter(file =>
      file.toLowerCase().endsWith('.pdf')
    );

    const results = [];

    for (const pdfFile of pdfFiles) {
      const filePath = path.join(folderPath, pdfFile);
      try {
        const pdfBuffer = await fs.readFile(filePath);
        const data = await pdfParse(pdfBuffer);

        const metadata = extractMetadata(data.text, filePath);
        const newFilename = generateFilename(metadata);

        results.push({
          original: pdfFile,
          extracted: metadata,
          newName: newFilename,
          success: true
        });
      } catch (error) {
        results.push({
          original: pdfFile,
          error: error instanceof Error ? error.message : 'Unknown error',
          success: false
        });
      }
    }
    return results;
  } catch (error) {
    console.error('Failed to process directory:', error);
    throw error;
  }
});

// Test IPC handler for debugging
ipcMain.handle('test-ipc', async () => {
  console.log('IPC test received');
  return 'IPC is working';
});