var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src-electron/electron-main.js
var import_electron = require("electron");
var import_path = __toESM(require("path"));
var import_os = __toESM(require("os"));
var import_child_process = require("child_process");
var import_electron_devtools_installer = __toESM(require("electron-devtools-installer"));
var { dialog } = require("electron");
var fs = require("fs");
var { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
var platform = process.platform || import_os.default.platform();
try {
  if (platform === "win32" && import_electron.nativeTheme.shouldUseDarkColors === true) {
    require("fs").unlinkSync(
      import_path.default.join(import_electron.app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) {
}
var mainWindow;
function createWindow() {
  mainWindow = new import_electron.BrowserWindow({
    icon: import_path.default.resolve(__dirname, "icons/icon.png"),
    titleBarStyle: "hidden",
    titleBarOverlay: false,
    width: 1450,
    height: 1001,
    resizable: false,
    useContentSize: true,
    webPreferences: {
      enableRemoteModule: false,
      contextIsolation: true,
      nodeIntegration: true,
      preload: import_path.default.resolve(__dirname, "C:\\Users\\galax\\OneDrive\\Documenti\\XMLEnjoyer\\.quasar\\electron\\electron-preload.js")
    }
  });
  mainWindow.loadURL("http://localhost:9300");
  if (true) {
    try {
      (0, import_electron_devtools_installer.default)(["nhdogjmejiglipccpnnnanhbledajbpd"]).then((name) => console.log(`Added Extension:  ${name}`)).catch((err) => console.log("An error occurred: ", err));
    } catch (e) {
      console.log(e);
    }
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.webContents.on("devtools-opened", () => {
      mainWindow.webContents.closeDevTools();
    });
  }
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}
import_electron.app.whenReady().then((ready) => {
  console.log(ready);
  createWindow();
});
import_electron.app.on("window-all-closed", () => {
  if (platform !== "darwin") {
    import_electron.app.quit();
  }
});
import_electron.app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
import_electron.ipcMain.handle("quit-app", () => {
  import_electron.app.quit();
});
import_electron.ipcMain.handle("min-app", () => {
  mainWindow.minimize();
});
import_electron.ipcMain.handle("max-app", () => {
  if (mainWindow.isMaximized()) {
    mainWindow.unmaximize();
  } else {
    mainWindow.maximize();
  }
});
import_electron.ipcMain.handle("save-package", async (value, ...args) => {
  console.log(value, args[0]);
  dialog.showSaveDialog({
    title: "Select the File Path to save",
    defaultPath: import_path.default.join(__dirname, "../../../package"),
    buttonLabel: "Save",
    filters: [
      {
        name: "xml",
        extensions: ["xml"]
      }
    ],
    properties: []
  }).then((file) => {
    console.log(file.canceled);
    if (!file.canceled) {
      console.log(file.filePath.toString());
      fs.writeFile(
        file.filePath.toString(),
        args[0],
        function(err) {
          if (err)
            throw err;
          console.log("Saved!");
          new import_electron.Notification({ title: "XMLEnjoyer", body: "XML Package salvato:\n" + file.filePath.toString() }).show();
        }
      );
    }
  }).catch((err) => {
    console.log(err);
  });
});
function updateOnLogOperation() {
  let _CLI = (0, import_child_process.exec)("sfdx force:auth:list --json", {
    maxBuffer: 1024 * 1024 * 8
  });
  let bufferData = "";
  _CLI.stdout.on("data", (chunk) => {
    bufferData += chunk;
  });
  _CLI.on("exit", (code, signal) => {
    mainWindow.webContents.send("auth-list-readed", bufferData);
  });
}
import_electron.ipcMain.handle("auth-list", () => {
  updateOnLogOperation();
});
import_electron.ipcMain.handle("logout-org", (value, ...args) => {
  let _CLI = (0, import_child_process.exec)("sfdx auth:logout -u " + args[0] + " -p", {
    maxBuffer: 1024 * 1024 * 8
  });
  _CLI.stderr.on("data", (data) => {
    console.log("ERR", data);
  });
  _CLI.on("exit", (code, signal) => {
    updateOnLogOperation();
  });
});
import_electron.ipcMain.handle("login-org", (value, ...args) => {
  console.log("LOGIN ALIAS", args[0]);
  let _CLI = (0, import_child_process.exec)("sfdx force:auth:web:login -a " + args[0], {
    maxBuffer: 1024 * 1024 * 8,
    timeout: 1e4
  });
  _CLI.on("exit", (code, signal) => {
    updateOnLogOperation();
  });
});
import_electron.ipcMain.handle("retrieve-metadata", async (value, ...args) => {
  const util = require("node:util");
  const execc = util.promisify(require("node:child_process").exec);
  const { stdout, stderr } = await execc(
    "sfdx force:mdapi:listmetadata --json -u " + args[0].org + " -m " + args[0].mdtName + " -a " + args[0].api,
    {
      maxBuffer: 1024 * 1024 * 8
    }
  );
  let bufferData = stdout;
  return bufferData;
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgbmF0aXZlVGhlbWUsIE5vdGlmaWNhdGlvbiB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBvcyBmcm9tIFwib3NcIjtcbmNvbnN0IHsgZGlhbG9nIH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5pbXBvcnQgeyBleGVjIH0gZnJvbSBcImNoaWxkX3Byb2Nlc3NcIjtcblxuXG5pbXBvcnQgaW5zdGFsbEV4dGVuc2lvbiwgeyBWVUVKUzNfREVWVE9PTFMgfSBmcm9tIFwiZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyXCI7XG52YXIgeyBYTUxQYXJzZXIsIFhNTEJ1aWxkZXIsIFhNTFZhbGlkYXRvciB9ID0gcmVxdWlyZShcImZhc3QteG1sLXBhcnNlclwiKTtcbi8vIG5lZWRlZCBpbiBjYXNlIHByb2Nlc3MgaXMgdW5kZWZpbmVkIHVuZGVyIExpbnV4XG5jb25zdCBwbGF0Zm9ybSA9IHByb2Nlc3MucGxhdGZvcm0gfHwgb3MucGxhdGZvcm0oKTtcbnRyeVxue1xuICBpZiAocGxhdGZvcm0gPT09IFwid2luMzJcIiAmJiBuYXRpdmVUaGVtZS5zaG91bGRVc2VEYXJrQ29sb3JzID09PSB0cnVlKVxuICB7XG4gICAgcmVxdWlyZShcImZzXCIpLnVubGlua1N5bmMoXG4gICAgICBwYXRoLmpvaW4oYXBwLmdldFBhdGgoXCJ1c2VyRGF0YVwiKSwgXCJEZXZUb29scyBFeHRlbnNpb25zXCIpXG4gICAgKTtcbiAgfVxufSBjYXRjaCAoXykgeyB9XG5cbmxldCBtYWluV2luZG93O1xuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKVxue1xuICAvKipcbiAgICogSW5pdGlhbCB3aW5kb3cgb3B0aW9uc1xuICAgKi9cbiAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICBpY29uOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImljb25zL2ljb24ucG5nXCIpLCAvLyB0cmF5IGljb25cbiAgICB0aXRsZUJhclN0eWxlOiAnaGlkZGVuJyxcbiAgICB0aXRsZUJhck92ZXJsYXk6IGZhbHNlLFxuICAgIHdpZHRoOiAxNDUwLFxuICAgIGhlaWdodDogMTAwMSxcbiAgICByZXNpemFibGU6IGZhbHNlLFxuICAgIHVzZUNvbnRlbnRTaXplOiB0cnVlLFxuICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICBlbmFibGVSZW1vdGVNb2R1bGU6IGZhbHNlLFxuICAgICAgY29udGV4dElzb2xhdGlvbjogdHJ1ZSxcbiAgICAgIG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSxcbiAgICAgIC8vIE1vcmUgaW5mbzogaHR0cHM6Ly92Mi5xdWFzYXIuZGV2L3F1YXNhci1jbGktdml0ZS9kZXZlbG9waW5nLWVsZWN0cm9uLWFwcHMvZWxlY3Ryb24tcHJlbG9hZC1zY3JpcHRcbiAgICAgIHByZWxvYWQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHByb2Nlc3MuZW52LlFVQVNBUl9FTEVDVFJPTl9QUkVMT0FEKSxcbiAgICB9LFxuICB9KTtcblxuICBtYWluV2luZG93LmxvYWRVUkwocHJvY2Vzcy5lbnYuQVBQX1VSTCk7XG5cbiAgaWYgKHByb2Nlc3MuZW52LkRFQlVHR0lORylcbiAge1xuICAgIC8vIGlmIG9uIERFViBvciBQcm9kdWN0aW9uIHdpdGggZGVidWcgZW5hYmxlZFxuICAgIHRyeVxuICAgIHtcbiAgICAgIGluc3RhbGxFeHRlbnNpb24oW1wibmhkb2dqbWVqaWdsaXBjY3Bubm5hbmhibGVkYWpicGRcIl0pXG4gICAgICAgIC50aGVuKChuYW1lKSA9PiBjb25zb2xlLmxvZyhgQWRkZWQgRXh0ZW5zaW9uOiAgJHtuYW1lfWApKVxuICAgICAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5sb2coXCJBbiBlcnJvciBvY2N1cnJlZDogXCIsIGVycikpO1xuICAgIH0gY2F0Y2ggKGUpXG4gICAge1xuICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgfVxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XG4gIH0gZWxzZVxuICB7XG4gICAgLy8gd2UncmUgb24gcHJvZHVjdGlvbjsgbm8gYWNjZXNzIHRvIGRldnRvb2xzIHBsc1xuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub24oXCJkZXZ0b29scy1vcGVuZWRcIiwgKCkgPT5cbiAgICB7XG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLmNsb3NlRGV2VG9vbHMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG1haW5XaW5kb3cub24oXCJjbG9zZWRcIiwgKCkgPT5cbiAge1xuICAgIG1haW5XaW5kb3cgPSBudWxsO1xuICB9KTtcbn1cblxuYXBwLndoZW5SZWFkeSgpLnRoZW4oKHJlYWR5KSA9Plxue1xuICBjb25zb2xlLmxvZyhyZWFkeSk7XG5cbiAgY3JlYXRlV2luZG93KCk7XG5cblxufSk7XG5cbmFwcC5vbihcIndpbmRvdy1hbGwtY2xvc2VkXCIsICgpID0+XG57XG4gIGlmIChwbGF0Zm9ybSAhPT0gXCJkYXJ3aW5cIilcbiAge1xuICAgIGFwcC5xdWl0KCk7XG4gIH1cbn0pO1xuXG5hcHAub24oXCJhY3RpdmF0ZVwiLCAoKSA9Plxue1xuICBpZiAobWFpbldpbmRvdyA9PT0gbnVsbClcbiAge1xuICAgIGNyZWF0ZVdpbmRvdygpO1xuICB9XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJxdWl0LWFwcFwiLCAoKSA9Plxue1xuICBhcHAucXVpdCgpO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKFwibWluLWFwcFwiLCAoKSA9Plxue1xuICBtYWluV2luZG93Lm1pbmltaXplKCk7XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJtYXgtYXBwXCIsICgpID0+XG57XG4gIGlmIChtYWluV2luZG93LmlzTWF4aW1pemVkKCkpXG4gIHtcbiAgICBtYWluV2luZG93LnVubWF4aW1pemUoKVxuICB9IGVsc2VcbiAge1xuICAgIG1haW5XaW5kb3cubWF4aW1pemUoKVxuICB9XG5cbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcInNhdmUtcGFja2FnZVwiLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIGNvbnNvbGUubG9nKHZhbHVlLCBhcmdzWzBdKVxuICBkaWFsb2cuc2hvd1NhdmVEaWFsb2coe1xuICAgIHRpdGxlOiAnU2VsZWN0IHRoZSBGaWxlIFBhdGggdG8gc2F2ZScsXG4gICAgZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9wYWNrYWdlJyksXG4gICAgLy8gZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9hc3NldHMvJyksXG4gICAgYnV0dG9uTGFiZWw6ICdTYXZlJyxcbiAgICAvLyBSZXN0cmljdGluZyB0aGUgdXNlciB0byBvbmx5IFRleHQgRmlsZXMuXG4gICAgZmlsdGVyczogW1xuICAgICAge1xuICAgICAgICBuYW1lOiAneG1sJyxcbiAgICAgICAgZXh0ZW5zaW9uczogWyd4bWwnXVxuICAgICAgfSxdLFxuICAgIHByb3BlcnRpZXM6IFtdXG4gIH0pLnRoZW4oZmlsZSA9PlxuICB7XG4gICAgLy8gU3RhdGluZyB3aGV0aGVyIGRpYWxvZyBvcGVyYXRpb24gd2FzIGNhbmNlbGxlZCBvciBub3QuXG4gICAgY29uc29sZS5sb2coZmlsZS5jYW5jZWxlZCk7XG4gICAgaWYgKCFmaWxlLmNhbmNlbGVkKVxuICAgIHtcbiAgICAgIGNvbnNvbGUubG9nKGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XG5cbiAgICAgIC8vIENyZWF0aW5nIGFuZCBXcml0aW5nIHRvIHRoZSBzYW1wbGUudHh0IGZpbGVcbiAgICAgIGZzLndyaXRlRmlsZShmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCksXG4gICAgICAgIGFyZ3NbMF0sIGZ1bmN0aW9uIChlcnIpXG4gICAgICB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgY29uc29sZS5sb2coJ1NhdmVkIScpO1xuICAgICAgICAvL21haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnbm90aWZ5LXNhdmVkLXhtbCcsIGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIG5ldyBOb3RpZmljYXRpb24oeyB0aXRsZTogJ1hNTEVuam95ZXInLCBib2R5OiAnWE1MIFBhY2thZ2Ugc2FsdmF0bzpcXG4nICsgZmlsZS5maWxlUGF0aC50b1N0cmluZygpIH0pLnNob3coKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkuY2F0Y2goZXJyID0+XG4gIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpXG4gIH0pO1xuXG59KTtcblxuZnVuY3Rpb24gdXBkYXRlT25Mb2dPcGVyYXRpb24oKVxue1xuICBsZXQgX0NMSSA9IGV4ZWMoJ3NmZHggZm9yY2U6YXV0aDpsaXN0IC0tanNvbicsIHtcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgfSk7XG5cbiAgbGV0IGJ1ZmZlckRhdGEgPSAnJztcblxuICBfQ0xJLnN0ZG91dC5vbignZGF0YScsIChjaHVuaykgPT5cbiAge1xuICAgIC8vICAgIGNvbnNvbGUubG9nKCdDSFVOSycsIGNodW5rKTtcbiAgICBidWZmZXJEYXRhICs9IGNodW5rO1xuICB9KTtcblxuICBfQ0xJLm9uKCdleGl0JywgKGNvZGUsIHNpZ25hbCkgPT5cbiAge1xuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnYXV0aC1saXN0LXJlYWRlZCcsIGJ1ZmZlckRhdGEpO1xuICB9KTtcbn1cblxuaXBjTWFpbi5oYW5kbGUoJ2F1dGgtbGlzdCcsICgpID0+XG57XG4gIC8qICAgbGV0IF9DTEkgPSBleGVjKCdzZmR4IGZvcmNlOmF1dGg6bGlzdCAtLWpzb24nLCB7XG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgICB9KTtcblxuICAgIGxldCBidWZmZXJEYXRhID0gJyc7XG5cbiAgICBfQ0xJLnN0ZG91dC5vbignZGF0YScsIChjaHVuaykgPT5cbiAgICB7XG4gICAgICAvLyAgICBjb25zb2xlLmxvZygnQ0hVTksnLCBjaHVuayk7XG4gICAgICBidWZmZXJEYXRhICs9IGNodW5rO1xuICAgIH0pO1xuXG4gICAgX0NMSS5zdGRpbi5vbignZGF0YScsIChkYXRhKSA9PlxuICAgIHtcbiAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdJTicsIGRhdGEpO1xuICAgIH0pO1xuXG4gICAgX0NMSS5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT5cbiAgICB7XG4gICAgICAvLyAgICBjb25zb2xlLmxvZygnRVJSJywgZGF0YSk7XG4gICAgfSk7XG5cbiAgICBfQ0xJLm9uKCdleGl0JywgKGNvZGUsIHNpZ25hbCkgPT5cbiAgICB7XG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2F1dGgtbGlzdC1yZWFkZWQnLCBidWZmZXJEYXRhKTtcbiAgICB9KTsgKi9cblxuICB1cGRhdGVPbkxvZ09wZXJhdGlvbigpXG5cbn0pO1xuXG5pcGNNYWluLmhhbmRsZSgnbG9nb3V0LW9yZycsICh2YWx1ZSwgLi4uYXJncykgPT5cbntcblxuICBsZXQgX0NMSSA9IGV4ZWMoJ3NmZHggYXV0aDpsb2dvdXQgLXUgJyArIGFyZ3NbMF0gKyAnIC1wJywge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICB9KTtcblxuICBfQ0xJLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PlxuICB7XG4gICAgY29uc29sZS5sb2coJ0VSUicsIGRhdGEpO1xuICB9KTtcblxuICBfQ0xJLm9uKCdleGl0JywgKGNvZGUsIHNpZ25hbCkgPT5cbiAge1xuICAgIHVwZGF0ZU9uTG9nT3BlcmF0aW9uKCk7XG4gIH0pO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKCdsb2dpbi1vcmcnLCAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIGNvbnNvbGUubG9nKCdMT0dJTiBBTElBUycsIGFyZ3NbMF0pXG4gIGxldCBfQ0xJID0gZXhlYygnc2ZkeCBmb3JjZTphdXRoOndlYjpsb2dpbiAtYSAnICsgYXJnc1swXSwge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICAgIHRpbWVvdXQ6IDEwMDAwXG4gIH0pO1xuXG4gIF9DTEkub24oJ2V4aXQnLCAoY29kZSwgc2lnbmFsKSA9PlxuICB7XG4gICAgdXBkYXRlT25Mb2dPcGVyYXRpb24oKTtcbiAgfSk7XG59KTtcblxuXG5pcGNNYWluLmhhbmRsZSgncmV0cmlldmUtbWV0YWRhdGEnLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcbiAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgJ3NmZHggZm9yY2U6bWRhcGk6bGlzdG1ldGFkYXRhIC0tanNvbiAtdSAnXG4gICAgKyBhcmdzWzBdLm9yZ1xuICAgICsgJyAtbSAnICsgYXJnc1swXS5tZHROYW1lXG4gICAgKyAnIC1hICcgKyBhcmdzWzBdLmFwaSwge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICB9KTtcbiAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XG5cbiAgLyogX0NMSS5zdGRvdXQub24oJ2RhdGEnLCAoY2h1bmspID0+XG4gIHtcbiAgICAvLyAgICBjb25zb2xlLmxvZygnQ0hVTksnLCBjaHVuayk7XG4gICAgYnVmZmVyRGF0YSArPSBjaHVuaztcbiAgfSk7XG5cbiAgX0NMSS5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT5cbiAge1xuICAgIGNvbnNvbGUubG9nKCdFUlInLCBkYXRhKTtcbiAgfSk7XG5cbiAgX0NMSS5vbignZXhpdCcsIChjb2RlLCBzaWduYWwpID0+XG4gIHtcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ21kdC1yZXRyaWV2ZWQnLCBidWZmZXJEYXRhKTtcblxuICB9KTsgKi9cblxuICByZXR1cm4gYnVmZmVyRGF0YTtcblxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0JBQXVFO0FBQ3ZFLGtCQUFpQjtBQUNqQixnQkFBZTtBQUdmLDJCQUFxQjtBQUdyQix5Q0FBa0Q7QUFMbEQsSUFBTSxFQUFFLE9BQU8sSUFBSSxRQUFRO0FBQzNCLElBQU0sS0FBSyxRQUFRO0FBS25CLElBQUksRUFBRSxXQUFXLFlBQVksYUFBYSxJQUFJLFFBQVE7QUFFdEQsSUFBTSxXQUFXLFFBQVEsWUFBWSxVQUFBQSxRQUFHLFNBQVM7QUFDakQsSUFDQTtBQUNFLE1BQUksYUFBYSxXQUFXLDRCQUFZLHdCQUF3QixNQUNoRTtBQUNFLFlBQVEsTUFBTTtBQUFBLE1BQ1osWUFBQUMsUUFBSyxLQUFLLG9CQUFJLFFBQVEsVUFBVSxHQUFHLHFCQUFxQjtBQUFBLElBQzFEO0FBQUEsRUFDRjtBQUNGLFNBQVMsR0FBUDtBQUFZO0FBRWQsSUFBSTtBQUVKLFNBQVMsZUFDVDtBQUlFLGVBQWEsSUFBSSw4QkFBYztBQUFBLElBQzdCLE1BQU0sWUFBQUEsUUFBSyxRQUFRLFdBQVcsZ0JBQWdCO0FBQUEsSUFDOUMsZUFBZTtBQUFBLElBQ2YsaUJBQWlCO0FBQUEsSUFDakIsT0FBTztBQUFBLElBQ1AsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsZ0JBQWdCO0FBQUEsSUFDaEIsZ0JBQWdCO0FBQUEsTUFDZCxvQkFBb0I7QUFBQSxNQUNwQixrQkFBa0I7QUFBQSxNQUNsQixpQkFBaUI7QUFBQSxNQUVqQixTQUFTLFlBQUFBLFFBQUssUUFBUSxXQUFXLDJGQUFtQztBQUFBLElBQ3RFO0FBQUEsRUFDRixDQUFDO0FBRUQsYUFBVyxRQUFRLHVCQUFtQjtBQUV0QyxNQUFJLE1BQ0o7QUFFRSxRQUNBO0FBQ0UsNkNBQUFDLFNBQWlCLENBQUMsa0NBQWtDLENBQUMsRUFDbEQs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
