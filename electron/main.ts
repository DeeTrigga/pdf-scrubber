import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // In development mode, load from localhost
  if (process.env.NODE_ENV === 'development') {
    console.log('Loading development URL');
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load the built index.html file
    const indexPath = path.join(__dirname, '..', 'dist', 'index.html');
    console.log('Loading production path:', indexPath);

    // Check if the file exists
    if (fs.existsSync(indexPath)) {
      console.log('Index file exists, loading...');
      mainWindow.loadFile(indexPath);
    } else {
      console.error('Index file not found at:', indexPath);
      // List directory contents to help debug
      const dir = path.join(__dirname, '..');
      console.log('Directory contents of:', dir);
      fs.readdirSync(dir).forEach(file => {
        console.log(file);
      });
    }
  }

  // Open DevTools in both dev and prod for debugging
  mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  console.log('App is ready');
  console.log('Current working directory:', process.cwd());
  console.log('__dirname:', __dirname);
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Basic IPC handlers for testing
ipcMain.handle('test-ipc', async () => {
  console.log('IPC test received');
  return 'IPC is working';
});