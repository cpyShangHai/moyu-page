const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('moyuElectron', {
  isElectron: true,
  onEscape: (callback) => {
    ipcRenderer.on('app:escape', () => callback());
  },
  onToggleToolbar: (callback) => {
    ipcRenderer.on('app:toggle-toolbar', () => callback());
  },
  onToggleFullscreen: (callback) => {
    ipcRenderer.on('app:toggle-fullscreen', () => callback());
  },
});
