/** 视频 webview 基础配置 — 不注入脚本、不拦截站内点击 */

const CHROME_UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

function setupVideoWebviewContents(contents) {
  contents.setUserAgent(CHROME_UA);

  contents.setWindowOpenHandler(({ url }) => {
    if (url && url !== 'about:blank') {
      contents.loadURL(url);
    }
    return { action: 'deny' };
  });

  // 部分站点检测 Electron/webdriver 后会禁用交互
  contents.on('dom-ready', () => {
    contents.executeJavaScript(`
      try {
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
      } catch (e) {}
    `).catch(() => {});
  });
}

module.exports = { setupVideoWebviewContents, CHROME_UA };
