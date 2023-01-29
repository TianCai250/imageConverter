const { app, BrowserWindow, Menu, Tray } = require("electron");
const path = require("path");

const createWindow = () => {
  // 隐藏菜单栏
  Menu.setApplicationMenu(null);

  // 创建浏览窗口
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    resizable: false,
  });

  // 加载 index.html
  mainWindow.loadFile("index.html");
  // 设置图标
  mainWindow.setIcon(__dirname + "/images/logo.jpg");
  // 托盘图标
  let appTray = new Tray(__dirname + "/images/logo.jpg");
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "显示主界面",
      click() {
        mainWindow.show();
      },
    },
    {
      label: "退出",
      click() {
        app.quit();
      },
    },
  ]);
  appTray.setToolTip("图片黑白转换器");
  appTray.setContextMenu(contextMenu);
  // 托盘点击
  appTray.on("click", () => {
    mainWindow.show();
  });

  // 打开开发工具
//   mainWindow.webContents.openDevTools();
};

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    // 在 macOS 系统内, 如果没有已开启的应用窗口
    // 点击托盘图标时通常会重新创建一个新窗口
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此, 通常
// 对应用程序和它们的菜单栏来说应该时刻保持激活状态,
// 直到用户使用 Cmd + Q 明确退出
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
