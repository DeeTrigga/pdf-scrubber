const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
    'electron',
    {
        selectFolder: async () => {
            return await ipcRenderer.invoke('select-folder');
        },
        processPDFs: async (folderPath) => {
            return await ipcRenderer.invoke('process-pdfs', folderPath);
        },
        confirmRename: async (data) => {
            return await ipcRenderer.invoke('confirm-rename', data);
        }
    }
);