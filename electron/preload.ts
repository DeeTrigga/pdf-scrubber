import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
    selectFolder: async () => {
        return await ipcRenderer.invoke('select-folder');
    },
    processPDFs: async (folderPath: string) => {
        return await ipcRenderer.invoke('process-pdfs', folderPath);
    },
    testIPC: async () => {
        return await ipcRenderer.invoke('test-ipc');
    }
});