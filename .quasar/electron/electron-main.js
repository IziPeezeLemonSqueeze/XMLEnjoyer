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
      preload: import_path.default.resolve(__dirname, "C:\\Users\\galax\\OneDrive\\Documenti\\GitHub\\XMLEnjoyer\\.quasar\\electron\\electron-preload.js")
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
    if (!file.canceled) {
      fs.writeFile(
        file.filePath.toString(),
        args[0],
        function(err) {
          if (err)
            throw err;
          new import_electron.Notification({ title: "XMLEnjoyer", body: "XML Package salvato:\n" + file.filePath.toString() }).show();
        }
      );
    }
  }).catch((err) => {
    console.log(err);
  });
});
import_electron.ipcMain.handle("auth-list", async () => {
  const util = require("node:util");
  const execc = util.promisify(require("node:child_process").exec);
  const { stdout, stderr } = await execc(
    "sfdx force:auth:list --json",
    {
      maxBuffer: 1024 * 1024 * 8
    }
  );
  let bufferData = stdout;
  return JSON.parse(bufferData);
});
import_electron.ipcMain.handle("logout-org", (value, ...args) => {
  let _CLI = (0, import_child_process.exec)("sfdx auth:logout -u " + args[0] + " -p", {
    maxBuffer: 1024 * 1024 * 8
  });
  _CLI.stderr.on("data", (data) => {
    console.log("ERR", data);
  });
  _CLI.on("exit", (code, signal) => {
  });
});
import_electron.ipcMain.handle("login-org", async (value, ...args) => {
  try {
    let pid = await getPID1717();
    if (pid != -1) {
      process.kill(pid);
    }
  } catch (err) {
    console.log(err);
  }
  const util = require("node:util");
  const execc = util.promisify(require("node:child_process").exec);
  const { stdout, stderr } = await execc(
    "sfdx force:auth:web:login -a " + args[0].alias + " -r " + args[0].url + " --json",
    {
      windowsHide: true,
      maxBuffer: 1024 * 1024 * 8
    }
  );
  let bufferData = stdout;
  return JSON.parse(bufferData);
});
async function getPID1717() {
  let spid = -1;
  const util = require("node:util");
  const execc = util.promisify(require("node:child_process").exec);
  const { stdout, stderr } = await execc(
    "netstat -aon",
    {
      maxBuffer: 1024 * 1024 * 8
    }
  );
  let chunk = stdout;
  let subchuck = chunk.split("\n");
  subchuck.forEach((ch) => {
    if (ch.includes(":1717")) {
      let pid = ch.split(" ");
      pid = pid.at(-1);
      spid == -1 ? spid = pid : null;
    }
  });
  return spid;
}
import_electron.ipcMain.handle("interrupt-login", async (value, ...args) => {
  try {
    let pid = await getPID1717();
    if (pid != -1) {
      process.kill(pid);
    }
  } catch (err) {
    console.log(err);
  }
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
import_electron.ipcMain.handle("get-clipboard", async (value, ...args) => {
  const text = import_electron.clipboard.readText();
  if (text.length > 0 || text) {
    return text;
  }
  import_electron.clipboard.clear();
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgbmF0aXZlVGhlbWUsIE5vdGlmaWNhdGlvbiwgc2hlbGwsIGNsaXBib2FyZCB9IGZyb20gXCJlbGVjdHJvblwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgb3MgZnJvbSBcIm9zXCI7XHJcbmNvbnN0IHsgZGlhbG9nIH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXHJcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcclxuaW1wb3J0IHsgZXhlYywgZXhlY1N5bmMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xyXG5cclxuXHJcbmltcG9ydCBpbnN0YWxsRXh0ZW5zaW9uLCB7IFZVRUpTM19ERVZUT09MUyB9IGZyb20gXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIjtcclxudmFyIHsgWE1MUGFyc2VyLCBYTUxCdWlsZGVyLCBYTUxWYWxpZGF0b3IgfSA9IHJlcXVpcmUoXCJmYXN0LXhtbC1wYXJzZXJcIik7XHJcbi8vIG5lZWRlZCBpbiBjYXNlIHByb2Nlc3MgaXMgdW5kZWZpbmVkIHVuZGVyIExpbnV4XHJcbmNvbnN0IHBsYXRmb3JtID0gcHJvY2Vzcy5wbGF0Zm9ybSB8fCBvcy5wbGF0Zm9ybSgpO1xyXG50cnlcclxue1xyXG4gIGlmIChwbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiICYmIG5hdGl2ZVRoZW1lLnNob3VsZFVzZURhcmtDb2xvcnMgPT09IHRydWUpXHJcbiAge1xyXG4gICAgcmVxdWlyZShcImZzXCIpLnVubGlua1N5bmMoXHJcbiAgICAgIHBhdGguam9pbihhcHAuZ2V0UGF0aChcInVzZXJEYXRhXCIpLCBcIkRldlRvb2xzIEV4dGVuc2lvbnNcIilcclxuICAgICk7XHJcbiAgfVxyXG59IGNhdGNoIChfKSB7IH1cclxuXHJcbmxldCBtYWluV2luZG93O1xyXG5cclxuZnVuY3Rpb24gY3JlYXRlV2luZG93KClcclxue1xyXG4gIC8qKlxyXG4gICAqIEluaXRpYWwgd2luZG93IG9wdGlvbnNcclxuICAgKi9cclxuICBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xyXG4gICAgaWNvbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJpY29ucy9pY29uLnBuZ1wiKSwgLy8gdHJheSBpY29uXHJcbiAgICB0aXRsZUJhclN0eWxlOiAnaGlkZGVuJyxcclxuICAgIHRpdGxlQmFyT3ZlcmxheTogZmFsc2UsXHJcbiAgICB3aWR0aDogMTQ1MCxcclxuICAgIGhlaWdodDogMTAwMSxcclxuICAgIHJlc2l6YWJsZTogZmFsc2UsXHJcbiAgICB1c2VDb250ZW50U2l6ZTogdHJ1ZSxcclxuICAgIHdlYlByZWZlcmVuY2VzOiB7XHJcbiAgICAgIGVuYWJsZVJlbW90ZU1vZHVsZTogZmFsc2UsXHJcbiAgICAgIGNvbnRleHRJc29sYXRpb246IHRydWUsXHJcbiAgICAgIG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSxcclxuICAgICAgLy8gTW9yZSBpbmZvOiBodHRwczovL3YyLnF1YXNhci5kZXYvcXVhc2FyLWNsaS12aXRlL2RldmVsb3BpbmctZWxlY3Ryb24tYXBwcy9lbGVjdHJvbi1wcmVsb2FkLXNjcmlwdFxyXG4gICAgICBwcmVsb2FkOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBwcm9jZXNzLmVudi5RVUFTQVJfRUxFQ1RST05fUFJFTE9BRCksXHJcbiAgICB9LFxyXG4gIH0pO1xyXG5cclxuICBtYWluV2luZG93LmxvYWRVUkwocHJvY2Vzcy5lbnYuQVBQX1VSTCk7XHJcblxyXG4gIGlmIChwcm9jZXNzLmVudi5ERUJVR0dJTkcpXHJcbiAge1xyXG4gICAgLy8gaWYgb24gREVWIG9yIFByb2R1Y3Rpb24gd2l0aCBkZWJ1ZyBlbmFibGVkXHJcbiAgICB0cnlcclxuICAgIHtcclxuICAgICAgaW5zdGFsbEV4dGVuc2lvbihbXCJuaGRvZ2ptZWppZ2xpcGNjcG5ubmFuaGJsZWRhamJwZFwiXSlcclxuICAgICAgICAudGhlbigobmFtZSkgPT4gY29uc29sZS5sb2coYEFkZGVkIEV4dGVuc2lvbjogICR7bmFtZX1gKSlcclxuICAgICAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5sb2coXCJBbiBlcnJvciBvY2N1cnJlZDogXCIsIGVycikpO1xyXG4gICAgfSBjYXRjaCAoZSlcclxuICAgIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICB9XHJcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xyXG4gIH0gZWxzZVxyXG4gIHtcclxuICAgIC8vIHdlJ3JlIG9uIHByb2R1Y3Rpb247IG5vIGFjY2VzcyB0byBkZXZ0b29scyBwbHNcclxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub24oXCJkZXZ0b29scy1vcGVuZWRcIiwgKCkgPT5cclxuICAgIHtcclxuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5jbG9zZURldlRvb2xzKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG1haW5XaW5kb3cub24oXCJjbG9zZWRcIiwgKCkgPT5cclxuICB7XHJcbiAgICBtYWluV2luZG93ID0gbnVsbDtcclxuICB9KTtcclxufVxyXG5cclxuYXBwLndoZW5SZWFkeSgpLnRoZW4oKHJlYWR5KSA9PlxyXG57XHJcbiAgLy9jb25zb2xlLmxvZyhyZWFkeSk7XHJcblxyXG4gIGNyZWF0ZVdpbmRvdygpO1xyXG5cclxuXHJcbn0pO1xyXG5cclxuYXBwLm9uKFwid2luZG93LWFsbC1jbG9zZWRcIiwgKCkgPT5cclxue1xyXG4gIGlmIChwbGF0Zm9ybSAhPT0gXCJkYXJ3aW5cIilcclxuICB7XHJcbiAgICBhcHAucXVpdCgpO1xyXG4gIH1cclxufSk7XHJcblxyXG5hcHAub24oXCJhY3RpdmF0ZVwiLCAoKSA9PlxyXG57XHJcbiAgaWYgKG1haW5XaW5kb3cgPT09IG51bGwpXHJcbiAge1xyXG4gICAgY3JlYXRlV2luZG93KCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmlwY01haW4uaGFuZGxlKFwicXVpdC1hcHBcIiwgKCkgPT5cclxue1xyXG4gIGFwcC5xdWl0KCk7XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5oYW5kbGUoXCJtaW4tYXBwXCIsICgpID0+XHJcbntcclxuICBtYWluV2luZG93Lm1pbmltaXplKCk7XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5oYW5kbGUoXCJtYXgtYXBwXCIsICgpID0+XHJcbntcclxuICBpZiAobWFpbldpbmRvdy5pc01heGltaXplZCgpKVxyXG4gIHtcclxuICAgIG1haW5XaW5kb3cudW5tYXhpbWl6ZSgpXHJcbiAgfSBlbHNlXHJcbiAge1xyXG4gICAgbWFpbldpbmRvdy5tYXhpbWl6ZSgpXHJcbiAgfVxyXG5cclxufSk7XHJcblxyXG5pcGNNYWluLmhhbmRsZShcInNhdmUtcGFja2FnZVwiLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XHJcbntcclxuICAvL2NvbnNvbGUubG9nKHZhbHVlLCBhcmdzWzBdKVxyXG4gIGRpYWxvZy5zaG93U2F2ZURpYWxvZyh7XHJcbiAgICB0aXRsZTogJ1NlbGVjdCB0aGUgRmlsZSBQYXRoIHRvIHNhdmUnLFxyXG4gICAgZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9wYWNrYWdlJyksXHJcbiAgICAvLyBkZWZhdWx0UGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2Fzc2V0cy8nKSxcclxuICAgIGJ1dHRvbkxhYmVsOiAnU2F2ZScsXHJcbiAgICAvLyBSZXN0cmljdGluZyB0aGUgdXNlciB0byBvbmx5IFRleHQgRmlsZXMuXHJcbiAgICBmaWx0ZXJzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAneG1sJyxcclxuICAgICAgICBleHRlbnNpb25zOiBbJ3htbCddXHJcbiAgICAgIH0sXSxcclxuICAgIHByb3BlcnRpZXM6IFtdXHJcbiAgfSkudGhlbihmaWxlID0+XHJcbiAge1xyXG4gICAgLy8gU3RhdGluZyB3aGV0aGVyIGRpYWxvZyBvcGVyYXRpb24gd2FzIGNhbmNlbGxlZCBvciBub3QuXHJcbiAgICAvL2NvbnNvbGUubG9nKGZpbGUuY2FuY2VsZWQpO1xyXG4gICAgaWYgKCFmaWxlLmNhbmNlbGVkKVxyXG4gICAge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAvLyBDcmVhdGluZyBhbmQgV3JpdGluZyB0byB0aGUgc2FtcGxlLnR4dCBmaWxlXHJcbiAgICAgIGZzLndyaXRlRmlsZShmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCksXHJcbiAgICAgICAgYXJnc1swXSwgZnVuY3Rpb24gKGVycilcclxuICAgICAge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdTYXZlZCEnKTtcclxuICAgICAgICAvL21haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnbm90aWZ5LXNhdmVkLXhtbCcsIGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgbmV3IE5vdGlmaWNhdGlvbih7IHRpdGxlOiAnWE1MRW5qb3llcicsIGJvZHk6ICdYTUwgUGFja2FnZSBzYWx2YXRvOlxcbicgKyBmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCkgfSkuc2hvdygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KS5jYXRjaChlcnIgPT5cclxuICB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgfSk7XHJcblxyXG59KTtcclxuXHJcblxyXG5pcGNNYWluLmhhbmRsZSgnYXV0aC1saXN0JywgYXN5bmMgKCkgPT5cclxue1xyXG4gIC8qICAgbGV0IF9DTEkgPSBleGVjKCdzZmR4IGZvcmNlOmF1dGg6bGlzdCAtLWpzb24nLCB7XHJcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGJ1ZmZlckRhdGEgPSAnJztcclxuXHJcbiAgICBfQ0xJLnN0ZG91dC5vbignZGF0YScsIChjaHVuaykgPT5cclxuICAgIHtcclxuICAgICAgLy8gICAgY29uc29sZS5sb2coJ0NIVU5LJywgY2h1bmspO1xyXG4gICAgICBidWZmZXJEYXRhICs9IGNodW5rO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX0NMSS5zdGRpbi5vbignZGF0YScsIChkYXRhKSA9PlxyXG4gICAge1xyXG4gICAgICAvLyAgICBjb25zb2xlLmxvZygnSU4nLCBkYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIF9DTEkuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+XHJcbiAgICB7XHJcbiAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdFUlInLCBkYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIF9DTEkub24oJ2V4aXQnLCAoY29kZSwgc2lnbmFsKSA9PlxyXG4gICAge1xyXG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2F1dGgtbGlzdC1yZWFkZWQnLCBidWZmZXJEYXRhKTtcclxuICAgIH0pOyAqL1xyXG5cclxuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XHJcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcclxuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcclxuICAgICdzZmR4IGZvcmNlOmF1dGg6bGlzdCAtLWpzb24nLCB7XHJcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcclxuICB9KTtcclxuICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcclxuXHJcbiAgcmV0dXJuIEpTT04ucGFyc2UoYnVmZmVyRGF0YSk7XHJcblxyXG59KTtcclxuXHJcbmlwY01haW4uaGFuZGxlKCdsb2dvdXQtb3JnJywgKHZhbHVlLCAuLi5hcmdzKSA9PlxyXG57XHJcblxyXG4gIGxldCBfQ0xJID0gZXhlYygnc2ZkeCBhdXRoOmxvZ291dCAtdSAnICsgYXJnc1swXSArICcgLXAnLCB7XHJcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcclxuICB9KTtcclxuXHJcbiAgX0NMSS5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT5cclxuICB7XHJcbiAgICBjb25zb2xlLmxvZygnRVJSJywgZGF0YSk7XHJcbiAgfSk7XHJcblxyXG4gIF9DTEkub24oJ2V4aXQnLCAoY29kZSwgc2lnbmFsKSA9PlxyXG4gIHtcclxuICAgIC8vdXBkYXRlT25Mb2dPcGVyYXRpb24oKTtcclxuICB9KTtcclxufSk7XHJcblxyXG4vKipcclxuICogJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xyXG4gICAgICArIGFyZ3NbMF0uYWxpYXNcclxuICAgICAgKyAnIC1yICcgKyBhcmdzWzBdLnVybFxyXG4gICAgICArICcgLS1qc29uJywge1xyXG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOFxyXG4gKi9cclxuXHJcblxyXG5cclxuaXBjTWFpbi5oYW5kbGUoJ2xvZ2luLW9yZycsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cclxue1xyXG4gIC8qKlxyXG4gICAqICdzZmR4IGZvcmNlOmF1dGg6d2ViOmxvZ2luIC1hICdcclxuICAgICAgICArIGFyZ3NbMF0uYWxpYXNcclxuICAgICAgICArICcgLXIgJyArIGFyZ3NbMF0udXJsXHJcbiAgICAgICAgKyAnIC0tanNvbidcclxuICAgKi9cclxuXHJcblxyXG4gIHRyeVxyXG4gIHtcclxuICAgIGxldCBwaWQgPSBhd2FpdCBnZXRQSUQxNzE3KCk7XHJcbiAgICBpZiAocGlkICE9IC0xKVxyXG4gICAge1xyXG4gICAgICBwcm9jZXNzLmtpbGwocGlkKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnIpXHJcbiAge1xyXG4gICAgY29uc29sZS5sb2coZXJyKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcclxuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xyXG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxyXG4gICAgJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xyXG4gICAgKyBhcmdzWzBdLmFsaWFzXHJcbiAgICArICcgLXIgJyArIGFyZ3NbMF0udXJsXHJcbiAgICArICcgLS1qc29uJywge1xyXG4gICAgd2luZG93c0hpZGU6IHRydWUsXHJcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcclxuXHJcbiAgfSk7XHJcbiAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XHJcblxyXG4gIHJldHVybiBKU09OLnBhcnNlKGJ1ZmZlckRhdGEpO1xyXG59KTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFBJRDE3MTcoKVxyXG57XHJcbiAgbGV0IHNwaWQgPSAtMTtcclxuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XHJcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcclxuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcclxuICAgICduZXRzdGF0IC1hb24nLCB7XHJcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcclxuICB9KTtcclxuICBsZXQgY2h1bmsgPSBzdGRvdXQ7XHJcbiAgbGV0IHN1YmNodWNrID0gY2h1bmsuc3BsaXQoJ1xcbicpO1xyXG4gIHN1YmNodWNrLmZvckVhY2goY2ggPT5cclxuICB7XHJcbiAgICBpZiAoY2guaW5jbHVkZXMoJzoxNzE3JykpXHJcbiAgICB7XHJcbiAgICAgIGxldCBwaWQgPSBjaC5zcGxpdCgnICcpXHJcbiAgICAgIHBpZCA9IHBpZC5hdCgtMSk7XHJcblxyXG4gICAgICBzcGlkID09IC0xID8gc3BpZCA9IHBpZCA6IG51bGw7XHJcbiAgICB9XHJcbiAgfSlcclxuICByZXR1cm4gc3BpZDtcclxufVxyXG5cclxuaXBjTWFpbi5oYW5kbGUoJ2ludGVycnVwdC1sb2dpbicsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cclxue1xyXG4gIHRyeVxyXG4gIHtcclxuICAgIGxldCBwaWQgPSBhd2FpdCBnZXRQSUQxNzE3KCk7XHJcbiAgICBpZiAocGlkICE9IC0xKVxyXG4gICAge1xyXG4gICAgICBwcm9jZXNzLmtpbGwocGlkKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnIpXHJcbiAge1xyXG4gICAgY29uc29sZS5sb2coZXJyKTtcclxuICB9XHJcbn0pO1xyXG5cclxuXHJcbmlwY01haW4uaGFuZGxlKCdyZXRyaWV2ZS1tZXRhZGF0YScsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cclxue1xyXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcclxuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xyXG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxyXG4gICAgJ3NmZHggZm9yY2U6bWRhcGk6bGlzdG1ldGFkYXRhIC0tanNvbiAtdSAnXHJcbiAgICArIGFyZ3NbMF0ub3JnXHJcbiAgICArICcgLW0gJyArIGFyZ3NbMF0ubWR0TmFtZVxyXG4gICAgKyAnIC1hICcgKyBhcmdzWzBdLmFwaSwge1xyXG4gICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXHJcbiAgfSk7XHJcbiAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XHJcbiAgcmV0dXJuIGJ1ZmZlckRhdGE7XHJcblxyXG59KTtcclxuXHJcbmlwY01haW4uaGFuZGxlKCdnZXQtY2xpcGJvYXJkJywgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9PlxyXG57XHJcbiAgY29uc3QgdGV4dCA9IGNsaXBib2FyZC5yZWFkVGV4dCgpO1xyXG4gIGlmICh0ZXh0Lmxlbmd0aCA+IDAgfHwgdGV4dClcclxuICB7XHJcbiAgICByZXR1cm4gdGV4dDtcclxuICB9XHJcbiAgY2xpcGJvYXJkLmNsZWFyKCk7XHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNCQUF5RjtBQUN6RixrQkFBaUI7QUFDakIsZ0JBQWU7QUFHZiwyQkFBK0I7QUFHL0IseUNBQWtEO0FBTGxELElBQU0sRUFBRSxPQUFPLElBQUksUUFBUTtBQUMzQixJQUFNLEtBQUssUUFBUTtBQUtuQixJQUFJLEVBQUUsV0FBVyxZQUFZLGFBQWEsSUFBSSxRQUFRO0FBRXRELElBQU0sV0FBVyxRQUFRLFlBQVksVUFBQUEsUUFBRyxTQUFTO0FBQ2pELElBQ0E7QUFDRSxNQUFJLGFBQWEsV0FBVyw0QkFBWSx3QkFBd0IsTUFDaEU7QUFDRSxZQUFRLE1BQU07QUFBQSxNQUNaLFlBQUFDLFFBQUssS0FBSyxvQkFBSSxRQUFRLFVBQVUsR0FBRyxxQkFBcUI7QUFBQSxJQUMxRDtBQUFBLEVBQ0Y7QUFDRixTQUFTLEdBQVA7QUFBWTtBQUVkLElBQUk7QUFFSixTQUFTLGVBQ1Q7QUFJRSxlQUFhLElBQUksOEJBQWM7QUFBQSxJQUM3QixNQUFNLFlBQUFBLFFBQUssUUFBUSxXQUFXLGdCQUFnQjtBQUFBLElBQzlDLGVBQWU7QUFBQSxJQUNmLGlCQUFpQjtBQUFBLElBQ2pCLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGdCQUFnQjtBQUFBLElBQ2hCLGdCQUFnQjtBQUFBLE1BQ2Qsb0JBQW9CO0FBQUEsTUFDcEIsa0JBQWtCO0FBQUEsTUFDbEIsaUJBQWlCO0FBQUEsTUFFakIsU0FBUyxZQUFBQSxRQUFLLFFBQVEsV0FBVyxtR0FBbUM7QUFBQSxJQUN0RTtBQUFBLEVBQ0YsQ0FBQztBQUVELGFBQVcsUUFBUSx1QkFBbUI7QUFFdEMsTUFBSSxNQUNKO0FBRUUsUUFDQTtBQUNFLDZDQUFBQyxTQUFpQixDQUFDLGtD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
