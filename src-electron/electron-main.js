import { app, BrowserWindow, ipcMain, nativeTheme } from "electron";
import path from "path";
import os from "os";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
var { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
// needed in case process is undefined under Linux
const platform = process.platform || os.platform();
try {
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {}

let mainWindow;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    width: 1450,
    height: 940,
    useContentSize: true,
    webPreferences: {
      enableRemoteModule: false,
      contextIsolation: true,
      nodeIntegration: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING) {
    // if on DEV or Production with debug enabled
    try {
      installExtension(["nhdogjmejiglipccpnnnanhbledajbpd"])
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err));
    } catch (e) {
      console.log(e);
    }
    mainWindow.webContents.openDevTools();
  } else {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () => {
      // mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then((ready) => {
  console.log(ready);

  createWindow();
});

app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
