/**
 * 本地静态文件服务 — 仅供 Electron 桌面版加载界面使用
 */

const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3456;
const serverApp = express();
let httpServer = null;

serverApp.use(express.static(path.join(__dirname)));

function getServerPort() {
  if (!httpServer) return null;
  const addr = httpServer.address();
  return typeof addr === 'object' ? addr.port : null;
}

function startServer(port = PORT) {
  const existingPort = getServerPort();
  if (existingPort) {
    return Promise.resolve(existingPort);
  }

  return new Promise((resolve, reject) => {
    httpServer = serverApp.listen(port, '127.0.0.1', () => {
      resolve(getServerPort() || port);
    });
    httpServer.on('error', (err) => {
      httpServer = null;
      reject(err);
    });
  });
}

function stopServer() {
  return new Promise((resolve) => {
    if (!httpServer) {
      resolve();
      return;
    }
    httpServer.close(() => {
      httpServer = null;
      resolve();
    });
  });
}

module.exports = { startServer, stopServer, getServerPort };

if (require.main === module) {
  startServer(Number(PORT))
    .then((port) => {
      console.log(`静态服务已启动: http://127.0.0.1:${port}`);
      console.log('请使用 npm start 或 npm run electron 启动桌面版');
    })
    .catch((err) => {
      console.error('启动失败:', err.message);
      process.exit(1);
    });
}
