const { app, BrowserWindow, shell } = require('electron');
const path = require('path');
const { startServer, stopServer } = require('../server');
const { setupVideoWebviewContents } = require('./nav-handler');

let mainWindow = null;
let serverPort = null;

app.on('web-contents-created', (_event, contents) => {
  contents.on('before-input-event', (event, input) => {
    if (input.type !== 'keyDown' || !mainWindow || mainWindow.isDestroyed()) return;

    if (input.key === 'Escape') {
      mainWindow.webContents.send('app:escape');
      event.preventDefault();
      return;
    }

    if (input.key.toLowerCase() === 'l' && (input.meta || input.control)) {
      mainWindow.webContents.send('app:toggle-toolbar');
      event.preventDefault();
      return;
    }

    if (
      input.key.toLowerCase() === 'f'
      && (input.meta || input.control)
      && input.shift
      && !input.alt
    ) {
      mainWindow.webContents.send('app:toggle-fullscreen');
      event.preventDefault();
    }
  });

  if (contents.getType() === 'webview') {
    setupVideoWebviewContents(contents);
  }
});

async function createWindow() {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.show();
    mainWindow.focus();
    return;
  }

  try {
    serverPort = await startServer(Number(process.env.PORT) || 3456);
  } catch (err) {
    console.error('启动静态服务失败:', err.message);
    app.quit();
    return;
  }

  mainWindow = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 900,
    minHeight: 600,
    title: '笔记',
    backgroundColor: '#f5f7fa',
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webviewTag: true,
    },
  });

  mainWindow.setMenuBarVisibility(false);
  mainWindow.once('ready-to-show', () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.show();
    }
  });
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  await mainWindow.loadURL(`http://127.0.0.1:${serverPort}`);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  createWindow();
});

app.on('will-quit', () => {
  stopServer();
});
