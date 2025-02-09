const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        icon: path.join(__dirname, '../public/app-icon.png'),
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, '../electron/preload.js')
        }
    });

    // Load the app
    if (isDev) {
        mainWindow.loadURL('http://localhost:5173'); // Default Vite dev server port
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });

    if (!result.canceled) {
        const files = await fs.readdir(result.filePaths[0]);
        const pdfCount = files.filter(file =>
            file.toLowerCase().endsWith('.pdf')
        ).length;

        return {
            path: result.filePaths[0],
            pdfCount
        };
    }
    return null;
});

ipcMain.handle('process-pdfs', async (event, folderPath) => {
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
                    error: error.message,
                    success: false
                });
            }
        }
        return results;
    } catch (error) {
        throw new Error(`Failed to process directory: ${error.message}`);
    }
});