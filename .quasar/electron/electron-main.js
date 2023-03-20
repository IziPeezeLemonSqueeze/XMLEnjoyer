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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgbmF0aXZlVGhlbWUsIE5vdGlmaWNhdGlvbiwgc2hlbGwsIGNsaXBib2FyZCB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBvcyBmcm9tIFwib3NcIjtcbmNvbnN0IHsgZGlhbG9nIH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5pbXBvcnQgeyBleGVjLCBleGVjU3luYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5cblxuaW1wb3J0IGluc3RhbGxFeHRlbnNpb24sIHsgVlVFSlMzX0RFVlRPT0xTIH0gZnJvbSBcImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlclwiO1xudmFyIHsgWE1MUGFyc2VyLCBYTUxCdWlsZGVyLCBYTUxWYWxpZGF0b3IgfSA9IHJlcXVpcmUoXCJmYXN0LXhtbC1wYXJzZXJcIik7XG4vLyBuZWVkZWQgaW4gY2FzZSBwcm9jZXNzIGlzIHVuZGVmaW5lZCB1bmRlciBMaW51eFxuY29uc3QgcGxhdGZvcm0gPSBwcm9jZXNzLnBsYXRmb3JtIHx8IG9zLnBsYXRmb3JtKCk7XG50cnlcbntcbiAgaWYgKHBsYXRmb3JtID09PSBcIndpbjMyXCIgJiYgbmF0aXZlVGhlbWUuc2hvdWxkVXNlRGFya0NvbG9ycyA9PT0gdHJ1ZSlcbiAge1xuICAgIHJlcXVpcmUoXCJmc1wiKS51bmxpbmtTeW5jKFxuICAgICAgcGF0aC5qb2luKGFwcC5nZXRQYXRoKFwidXNlckRhdGFcIiksIFwiRGV2VG9vbHMgRXh0ZW5zaW9uc1wiKVxuICAgICk7XG4gIH1cbn0gY2F0Y2ggKF8pIHsgfVxuXG5sZXQgbWFpbldpbmRvdztcblxuZnVuY3Rpb24gY3JlYXRlV2luZG93KClcbntcbiAgLyoqXG4gICAqIEluaXRpYWwgd2luZG93IG9wdGlvbnNcbiAgICovXG4gIG1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgaWNvbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJpY29ucy9pY29uLnBuZ1wiKSwgLy8gdHJheSBpY29uXG4gICAgdGl0bGVCYXJTdHlsZTogJ2hpZGRlbicsXG4gICAgdGl0bGVCYXJPdmVybGF5OiBmYWxzZSxcbiAgICB3aWR0aDogMTQ1MCxcbiAgICBoZWlnaHQ6IDEwMDEsXG4gICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICB1c2VDb250ZW50U2l6ZTogdHJ1ZSxcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgZW5hYmxlUmVtb3RlTW9kdWxlOiBmYWxzZSxcbiAgICAgIGNvbnRleHRJc29sYXRpb246IHRydWUsXG4gICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXG4gICAgICAvLyBNb3JlIGluZm86IGh0dHBzOi8vdjIucXVhc2FyLmRldi9xdWFzYXItY2xpLXZpdGUvZGV2ZWxvcGluZy1lbGVjdHJvbi1hcHBzL2VsZWN0cm9uLXByZWxvYWQtc2NyaXB0XG4gICAgICBwcmVsb2FkOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBwcm9jZXNzLmVudi5RVUFTQVJfRUxFQ1RST05fUFJFTE9BRCksXG4gICAgfSxcbiAgfSk7XG5cbiAgbWFpbldpbmRvdy5sb2FkVVJMKHByb2Nlc3MuZW52LkFQUF9VUkwpO1xuXG4gIGlmIChwcm9jZXNzLmVudi5ERUJVR0dJTkcpXG4gIHtcbiAgICAvLyBpZiBvbiBERVYgb3IgUHJvZHVjdGlvbiB3aXRoIGRlYnVnIGVuYWJsZWRcbiAgICB0cnlcbiAgICB7XG4gICAgICBpbnN0YWxsRXh0ZW5zaW9uKFtcIm5oZG9nam1lamlnbGlwY2Nwbm5uYW5oYmxlZGFqYnBkXCJdKVxuICAgICAgICAudGhlbigobmFtZSkgPT4gY29uc29sZS5sb2coYEFkZGVkIEV4dGVuc2lvbjogICR7bmFtZX1gKSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUubG9nKFwiQW4gZXJyb3Igb2NjdXJyZWQ6IFwiLCBlcnIpKTtcbiAgICB9IGNhdGNoIChlKVxuICAgIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIH1cbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuICB9IGVsc2VcbiAge1xuICAgIC8vIHdlJ3JlIG9uIHByb2R1Y3Rpb247IG5vIGFjY2VzcyB0byBkZXZ0b29scyBwbHNcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9uKFwiZGV2dG9vbHMtb3BlbmVkXCIsICgpID0+XG4gICAge1xuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5jbG9zZURldlRvb2xzKCk7XG4gICAgfSk7XG4gIH1cblxuICBtYWluV2luZG93Lm9uKFwiY2xvc2VkXCIsICgpID0+XG4gIHtcbiAgICBtYWluV2luZG93ID0gbnVsbDtcbiAgfSk7XG59XG5cbmFwcC53aGVuUmVhZHkoKS50aGVuKChyZWFkeSkgPT5cbntcbiAgLy9jb25zb2xlLmxvZyhyZWFkeSk7XG5cbiAgY3JlYXRlV2luZG93KCk7XG5cblxufSk7XG5cbmFwcC5vbihcIndpbmRvdy1hbGwtY2xvc2VkXCIsICgpID0+XG57XG4gIGlmIChwbGF0Zm9ybSAhPT0gXCJkYXJ3aW5cIilcbiAge1xuICAgIGFwcC5xdWl0KCk7XG4gIH1cbn0pO1xuXG5hcHAub24oXCJhY3RpdmF0ZVwiLCAoKSA9Plxue1xuICBpZiAobWFpbldpbmRvdyA9PT0gbnVsbClcbiAge1xuICAgIGNyZWF0ZVdpbmRvdygpO1xuICB9XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJxdWl0LWFwcFwiLCAoKSA9Plxue1xuICBhcHAucXVpdCgpO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKFwibWluLWFwcFwiLCAoKSA9Plxue1xuICBtYWluV2luZG93Lm1pbmltaXplKCk7XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJtYXgtYXBwXCIsICgpID0+XG57XG4gIGlmIChtYWluV2luZG93LmlzTWF4aW1pemVkKCkpXG4gIHtcbiAgICBtYWluV2luZG93LnVubWF4aW1pemUoKVxuICB9IGVsc2VcbiAge1xuICAgIG1haW5XaW5kb3cubWF4aW1pemUoKVxuICB9XG5cbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcInNhdmUtcGFja2FnZVwiLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIC8vY29uc29sZS5sb2codmFsdWUsIGFyZ3NbMF0pXG4gIGRpYWxvZy5zaG93U2F2ZURpYWxvZyh7XG4gICAgdGl0bGU6ICdTZWxlY3QgdGhlIEZpbGUgUGF0aCB0byBzYXZlJyxcbiAgICBkZWZhdWx0UGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uL3BhY2thZ2UnKSxcbiAgICAvLyBkZWZhdWx0UGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2Fzc2V0cy8nKSxcbiAgICBidXR0b25MYWJlbDogJ1NhdmUnLFxuICAgIC8vIFJlc3RyaWN0aW5nIHRoZSB1c2VyIHRvIG9ubHkgVGV4dCBGaWxlcy5cbiAgICBmaWx0ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd4bWwnLFxuICAgICAgICBleHRlbnNpb25zOiBbJ3htbCddXG4gICAgICB9LF0sXG4gICAgcHJvcGVydGllczogW11cbiAgfSkudGhlbihmaWxlID0+XG4gIHtcbiAgICAvLyBTdGF0aW5nIHdoZXRoZXIgZGlhbG9nIG9wZXJhdGlvbiB3YXMgY2FuY2VsbGVkIG9yIG5vdC5cbiAgICAvL2NvbnNvbGUubG9nKGZpbGUuY2FuY2VsZWQpO1xuICAgIGlmICghZmlsZS5jYW5jZWxlZClcbiAgICB7XG4gICAgICAvL2NvbnNvbGUubG9nKGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XG5cbiAgICAgIC8vIENyZWF0aW5nIGFuZCBXcml0aW5nIHRvIHRoZSBzYW1wbGUudHh0IGZpbGVcbiAgICAgIGZzLndyaXRlRmlsZShmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCksXG4gICAgICAgIGFyZ3NbMF0sIGZ1bmN0aW9uIChlcnIpXG4gICAgICB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnU2F2ZWQhJyk7XG4gICAgICAgIC8vbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdub3RpZnktc2F2ZWQteG1sJywgZmlsZS5maWxlUGF0aC50b1N0cmluZygpKTtcbiAgICAgICAgbmV3IE5vdGlmaWNhdGlvbih7IHRpdGxlOiAnWE1MRW5qb3llcicsIGJvZHk6ICdYTUwgUGFja2FnZSBzYWx2YXRvOlxcbicgKyBmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCkgfSkuc2hvdygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KS5jYXRjaChlcnIgPT5cbiAge1xuICAgIGNvbnNvbGUubG9nKGVycilcbiAgfSk7XG5cbn0pO1xuXG5cbmlwY01haW4uaGFuZGxlKCdhdXRoLWxpc3QnLCBhc3luYyAoKSA9Plxue1xuICAvKiAgIGxldCBfQ0xJID0gZXhlYygnc2ZkeCBmb3JjZTphdXRoOmxpc3QgLS1qc29uJywge1xuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gICAgfSk7XG5cbiAgICBsZXQgYnVmZmVyRGF0YSA9ICcnO1xuXG4gICAgX0NMSS5zdGRvdXQub24oJ2RhdGEnLCAoY2h1bmspID0+XG4gICAge1xuICAgICAgLy8gICAgY29uc29sZS5sb2coJ0NIVU5LJywgY2h1bmspO1xuICAgICAgYnVmZmVyRGF0YSArPSBjaHVuaztcbiAgICB9KTtcblxuICAgIF9DTEkuc3RkaW4ub24oJ2RhdGEnLCAoZGF0YSkgPT5cbiAgICB7XG4gICAgICAvLyAgICBjb25zb2xlLmxvZygnSU4nLCBkYXRhKTtcbiAgICB9KTtcblxuICAgIF9DTEkuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+XG4gICAge1xuICAgICAgLy8gICAgY29uc29sZS5sb2coJ0VSUicsIGRhdGEpO1xuICAgIH0pO1xuXG4gICAgX0NMSS5vbignZXhpdCcsIChjb2RlLCBzaWduYWwpID0+XG4gICAge1xuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdhdXRoLWxpc3QtcmVhZGVkJywgYnVmZmVyRGF0YSk7XG4gICAgfSk7ICovXG5cbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAnc2ZkeCBmb3JjZTphdXRoOmxpc3QgLS1qc29uJywge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICB9KTtcbiAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XG5cbiAgcmV0dXJuIEpTT04ucGFyc2UoYnVmZmVyRGF0YSk7XG5cbn0pO1xuXG5pcGNNYWluLmhhbmRsZSgnbG9nb3V0LW9yZycsICh2YWx1ZSwgLi4uYXJncykgPT5cbntcblxuICBsZXQgX0NMSSA9IGV4ZWMoJ3NmZHggYXV0aDpsb2dvdXQgLXUgJyArIGFyZ3NbMF0gKyAnIC1wJywge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICB9KTtcblxuICBfQ0xJLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PlxuICB7XG4gICAgY29uc29sZS5sb2coJ0VSUicsIGRhdGEpO1xuICB9KTtcblxuICBfQ0xJLm9uKCdleGl0JywgKGNvZGUsIHNpZ25hbCkgPT5cbiAge1xuICAgIC8vdXBkYXRlT25Mb2dPcGVyYXRpb24oKTtcbiAgfSk7XG59KTtcblxuLyoqXG4gKiAnc2ZkeCBmb3JjZTphdXRoOndlYjpsb2dpbiAtYSAnXG4gICAgICArIGFyZ3NbMF0uYWxpYXNcbiAgICAgICsgJyAtciAnICsgYXJnc1swXS51cmxcbiAgICAgICsgJyAtLWpzb24nLCB7XG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOFxuICovXG5cblxuXG5pcGNNYWluLmhhbmRsZSgnbG9naW4tb3JnJywgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICAvKipcbiAgICogJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xuICAgICAgICArIGFyZ3NbMF0uYWxpYXNcbiAgICAgICAgKyAnIC1yICcgKyBhcmdzWzBdLnVybFxuICAgICAgICArICcgLS1qc29uJ1xuICAgKi9cblxuXG4gIHRyeVxuICB7XG4gICAgbGV0IHBpZCA9IGF3YWl0IGdldFBJRDE3MTcoKTtcbiAgICBpZiAocGlkICE9IC0xKVxuICAgIHtcbiAgICAgIHByb2Nlc3Mua2lsbChwaWQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKVxuICB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfVxuXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcbiAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xuICAgICsgYXJnc1swXS5hbGlhc1xuICAgICsgJyAtciAnICsgYXJnc1swXS51cmxcbiAgICArICcgLS1qc29uJywge1xuICAgIHdpbmRvd3NIaWRlOiB0cnVlLFxuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuXG4gIH0pO1xuICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcblxuICByZXR1cm4gSlNPTi5wYXJzZShidWZmZXJEYXRhKTtcbn0pO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRQSUQxNzE3KClcbntcbiAgbGV0IHNwaWQgPSAtMTtcbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAnbmV0c3RhdCAtYW9uJywge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICB9KTtcbiAgbGV0IGNodW5rID0gc3Rkb3V0O1xuICBsZXQgc3ViY2h1Y2sgPSBjaHVuay5zcGxpdCgnXFxuJyk7XG4gIHN1YmNodWNrLmZvckVhY2goY2ggPT5cbiAge1xuICAgIGlmIChjaC5pbmNsdWRlcygnOjE3MTcnKSlcbiAgICB7XG4gICAgICBsZXQgcGlkID0gY2guc3BsaXQoJyAnKVxuICAgICAgcGlkID0gcGlkLmF0KC0xKTtcblxuICAgICAgc3BpZCA9PSAtMSA/IHNwaWQgPSBwaWQgOiBudWxsO1xuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHNwaWQ7XG59XG5cbmlwY01haW4uaGFuZGxlKCdpbnRlcnJ1cHQtbG9naW4nLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIHRyeVxuICB7XG4gICAgbGV0IHBpZCA9IGF3YWl0IGdldFBJRDE3MTcoKTtcbiAgICBpZiAocGlkICE9IC0xKVxuICAgIHtcbiAgICAgIHByb2Nlc3Mua2lsbChwaWQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKVxuICB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfVxufSk7XG5cblxuaXBjTWFpbi5oYW5kbGUoJ3JldHJpZXZlLW1ldGFkYXRhJywgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XG4gIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZSgnbm9kZTpjaGlsZF9wcm9jZXNzJykuZXhlYyk7XG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxuICAgICdzZmR4IGZvcmNlOm1kYXBpOmxpc3RtZXRhZGF0YSAtLWpzb24gLXUgJ1xuICAgICsgYXJnc1swXS5vcmdcbiAgICArICcgLW0gJyArIGFyZ3NbMF0ubWR0TmFtZVxuICAgICsgJyAtYSAnICsgYXJnc1swXS5hcGksIHtcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgfSk7XG4gIGxldCBidWZmZXJEYXRhID0gc3Rkb3V0O1xuICByZXR1cm4gYnVmZmVyRGF0YTtcblxufSk7XG5cbmlwY01haW4uaGFuZGxlKCdnZXQtY2xpcGJvYXJkJywgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICBjb25zdCB0ZXh0ID0gY2xpcGJvYXJkLnJlYWRUZXh0KCk7XG4gIGlmICh0ZXh0Lmxlbmd0aCA+IDAgfHwgdGV4dClcbiAge1xuICAgIHJldHVybiB0ZXh0O1xuICB9XG4gIGNsaXBib2FyZC5jbGVhcigpO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNCQUF5RjtBQUN6RixrQkFBaUI7QUFDakIsZ0JBQWU7QUFHZiwyQkFBK0I7QUFHL0IseUNBQWtEO0FBTGxELElBQU0sRUFBRSxPQUFPLElBQUksUUFBUTtBQUMzQixJQUFNLEtBQUssUUFBUTtBQUtuQixJQUFJLEVBQUUsV0FBVyxZQUFZLGFBQWEsSUFBSSxRQUFRO0FBRXRELElBQU0sV0FBVyxRQUFRLFlBQVksVUFBQUEsUUFBRyxTQUFTO0FBQ2pELElBQ0E7QUFDRSxNQUFJLGFBQWEsV0FBVyw0QkFBWSx3QkFBd0IsTUFDaEU7QUFDRSxZQUFRLE1BQU07QUFBQSxNQUNaLFlBQUFDLFFBQUssS0FBSyxvQkFBSSxRQUFRLFVBQVUsR0FBRyxxQkFBcUI7QUFBQSxJQUMxRDtBQUFBLEVBQ0Y7QUFDRixTQUFTLEdBQVA7QUFBWTtBQUVkLElBQUk7QUFFSixTQUFTLGVBQ1Q7QUFJRSxlQUFhLElBQUksOEJBQWM7QUFBQSxJQUM3QixNQUFNLFlBQUFBLFFBQUssUUFBUSxXQUFXLGdCQUFnQjtBQUFBLElBQzlDLGVBQWU7QUFBQSxJQUNmLGlCQUFpQjtBQUFBLElBQ2pCLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGdCQUFnQjtBQUFBLElBQ2hCLGdCQUFnQjtBQUFBLE1BQ2Qsb0JBQW9CO0FBQUEsTUFDcEIsa0JBQWtCO0FBQUEsTUFDbEIsaUJBQWlCO0FBQUEsTUFFakIsU0FBUyxZQUFBQSxRQUFLLFFBQVEsV0FBVywyRkFBbUM7QUFBQSxJQUN0RTtBQUFBLEVBQ0YsQ0FBQztBQUVELGFBQVcsUUFBUSx1QkFBbUI7QUFFdEMsTUFBSSxNQUNKO0FBRUUsUUFDQTtBQUNFLDZDQUFBQyxTQUFpQixDQUFDLGtDQUFrQyxDQUFDLEVBQ2xELEtBQUssQ0FBQyxTQUFTLFFBQVEsSUFBSSxxQkFBcUIsTUFBTSxDQUFDLEVBQ3ZELE1BQU0sQ0FBQyxRQUFRLFFBQVEsSUFBSSx1QkFBdUIsR0FBRyxDQUFDO0FBQUEsSUFDM0QsU0FBUyxHQUFQO0FBRUEsY0FBUSxJQUFJLENBQUM7QUFBQSxJQUNmO0FBQ0EsZUFBVyxZQUFZLGFBQWE7QUFBQSxFQUN0QyxPQUNBO0FBRUUsZUFBVyxZQUFZLEdBQUcsbUJBQW1CLE1BQzdDO0FBQ0UsaUJBQVcsWUFBWSxjQUFjO0FBQUEsSUFDdkMsQ0FBQztBQUFBLEVBQ0g7QUFFQSxhQUFXLEdBQUcsVUFBVSxNQUN4QjtBQUNFLGlCQUFhO0FBQUEsRUFDZixDQUFDO0FBQ0g7QUFFQSxvQkFBSSxVQUFVLEVBQUUsS0FBSyxDQUFDLFVBQ3RCO0FBR0UsZUFBYTtBQUdmLENBQUM7QUFFRCxvQkFBSSxHQUFHLHFCQUFxQixNQUM1QjtBQUNFLE1BQUksYUFBYSxVQUNqQjtBQUNFLHdCQUFJLEtBQUs7QUFBQSxFQUNYO0FBQ0YsQ0FBQztBQUVELG9CQUFJLEdBQUcsWUFBWSxNQUNuQjtBQUNFLE1BQUksZUFBZSxNQUNuQjtBQUNFLGlCQUFhO0FBQUEsRUFDZjtBQUNGLENBQUM7QUFFRCx3QkFBUSxPQUFPLFlBQVksTUFDM0I7QUFDRSxzQkFBSSxLQUFLO0FBQ1gsQ0FBQztBQUVELHdCQUFRLE9BQU8sV0FBVyxNQUMxQjtBQUNFLGFBQVcsU0FBUztBQUN0QixDQUFDO0FBRUQsd0JBQVEsT0FBTyxXQUFXLE1BQzFCO0FBQ0UsTUFBSSxXQUFXLFlBQVksR0FDM0I7QUFDRSxlQUFXLFdBQVc7QUFBQSxFQUN4QixPQUNBO0FBQ0UsZUFBVyxTQUFTO0FBQUEsRUFDdEI7QUFFRixDQUFDO0FBRUQsd0JBQVEsT0FBTyxnQkFBZ0IsT0FBTyxVQUFVLFNBQ2hEO0FBRUUsU0FBTyxlQUFlO0FBQUEsSUFDcEIsT0FBTztBQUFBLElBQ1AsYUFBYSxZQUFBRCxRQUFLLEtBQUssV0FBVyxrQkFBa0I7QUFBQSxJQUVwRCxhQUFhO0FBQUEsSUFFYixTQUFTO0FBQUEsTUFDUDtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sWUFBWSxDQUFDLEtBQUs7QUFBQSxNQUNwQjtBQUFBLElBQUU7QUFBQSxJQUNKLFlBQVksQ0FBQztBQUFBLEVBQ2YsQ0FBQyxFQUFFLEtBQUssVUFDUjtBQUdFLFFBQUksQ0FBQyxLQUFLLFVBQ1Y7QUFJRSxTQUFHO0FBQUEsUUFBVSxLQUFLLFNBQVMsU0FBUztBQUFBLFFBQ2xDLEtBQUs7QUFBQSxRQUFJLFNBQVUsS0FDckI7QUFDRSxjQUFJO0FBQUssa0JBQU07QUFHZixjQUFJLDZCQUFhLEVBQUUsT0FBTyxjQUFjLE1BQU0sMkJBQTJCLEtBQUssU0FBUyxTQUFTLEVBQUUsQ0FBQyxFQUFFLEtBQUs7QUFBQSxRQUM1RztBQUFBLE1BQUM7QUFBQSxJQUNIO0FBQUEsRUFDRixDQUFDLEVBQUUsTUFBTSxTQUNUO0FBQ0UsWUFBUSxJQUFJLEdBQUc7QUFBQSxFQUNqQixDQUFDO0FBRUgsQ0FBQztBQUdELHdCQUFRLE9BQU8sYUFBYSxZQUM1QjtBQTRCRSxRQUFNLE9BQU8sUUFBUTtBQUNyQixRQUFNLFFBQVEsS0FBSyxVQUFVLFFBQVEsc0JBQXNCLElBQUk7QUFDL0QsUUFBTSxFQUFFLFFBQVEsT0FBTyxJQUFJLE1BQU07QUFBQSxJQUMvQjtBQUFBLElBQStCO0FBQUEsTUFDL0IsV0FBVyxPQUFPLE9BQU87QUFBQSxJQUMzQjtBQUFBLEVBQUM7QUFDRCxNQUFJLGFBQWE7QUFFakIsU0FBTyxLQUFLLE1BQU0sVUFBVTtBQUU5QixDQUFDO0FBRUQsd0JBQVEsT0FBTyxjQUFjLENBQUMsVUFBVSxTQUN4QztBQUVFLE1BQUksV0FBTywyQkFBSyx5QkFBeUIsS0FBSyxLQUFLLE9BQU87QUFBQSxJQUN4RCxXQUFXLE9BQU8sT0FBTztBQUFBLEVBQzNCLENBQUM7QUFFRCxPQUFLLE9BQU8sR0FBRyxRQUFRLENBQUMsU0FDeEI7QUFDRSxZQUFRLElBQUksT0FBTyxJQUFJO0FBQUEsRUFDekIsQ0FBQztBQUVELE9BQUssR0FBRyxRQUFRLENBQUMsTUFBTSxXQUN2QjtBQUFBLEVBRUEsQ0FBQztBQUNILENBQUM7QUFZRCx3QkFBUSxPQUFPLGFBQWEsT0FBTyxVQUFVLFNBQzdDO0FBU0UsTUFDQTtBQUNFLFFBQUksTUFBTSxNQUFNLFdBQVc7QUFDM0IsUUFBSSxPQUFPLElBQ1g7QUFDRSxjQUFRLEtBQUssR0FBRztBQUFBLElBQ2xCO0FBQUEsRUFDRixTQUFTLEtBQVA7QUFFQSxZQUFRLElBQUksR0FBRztBQUFBLEVBQ2pCO0FBRUEsUUFBTSxPQUFPLFFBQVE7QUFDckIsUUFBTSxRQUFRLEtBQUssVUFBVSxRQUFRLHNCQUFzQixJQUFJO0FBQy9ELFFBQU0sRUFBRSxRQUFRLE9BQU8sSUFBSSxNQUFNO0FBQUEsSUFDL0Isa0NBQ0UsS0FBSyxHQUFHLFFBQ1IsU0FBUyxLQUFLLEdBQUcsTUFDakI7QUFBQSxJQUFXO0FBQUEsTUFDYixhQUFhO0FBQUEsTUFDYixXQUFXLE9BQU8sT0FBTztBQUFBLElBRTNCO0FBQUEsRUFBQztBQUNELE1BQUksYUFBYTtBQUVqQixTQUFPLEtBQUssTUFBTSxVQUFVO0FBQzlCLENBQUM7QUFFRCxlQUFlLGFBQ2Y7QUFDRSxNQUFJLE9BQU87QUFDWCxRQUFNLE9BQU8sUUFBUTtBQUNyQixRQUFNLFFBQVEsS0FBSyxVQUFVLFFBQVEsc0JBQXNCLElBQUk7QUFDL0QsUUFBTSxFQUFFLFFBQVEsT0FBTyxJQUFJLE1BQU07QUFBQSxJQUMvQjtBQUFBLElBQWdCO0FBQUEsTUFDaEIsV0FBVyxPQUFPLE9BQU87QUFBQSxJQUMzQjtBQUFBLEVBQUM7QUFDRCxNQUFJLFFBQVE7QUFDWixNQUFJLFdBQVcsTUFBTSxNQUFNLElBQUk7QUFDL0IsV0FBUyxRQUFRLFFBQ2pCO0FBQ0UsUUFBSSxHQUFHLFNBQVMsT0FBTyxHQUN2QjtBQUNFLFVBQUksTUFBTSxHQUFHLE1BQU0sR0FBRztBQUN0QixZQUFNLElBQUksR0FBRyxFQUFFO0FBRWYsY0FBUSxLQUFLLE9BQU8sTUFBTTtBQUFBLElBQzVCO0FBQUEsRUFDRixDQUFDO0FBQ0QsU0FBTztBQUNUO0FBRUEsd0JBQVEsT0FBTyxtQkFBbUIsT0FBTyxVQUFVLFNBQ25EO0FBQ0UsTUFDQTtBQUNFLFFBQUksTUFBTSxNQUFNLFdBQVc7QUFDM0IsUUFBSSxPQUFPLElBQ1g7QUFDRSxjQUFRLEtBQUssR0FBRztBQUFBLElBQ2xCO0FBQUEsRUFDRixTQUFTLEtBQVA7QUFFQSxZQUFRLElBQUksR0FBRztBQUFBLEVBQ2pCO0FBQ0YsQ0FBQztBQUdELHdCQUFRLE9BQU8scUJBQXFCLE9BQU8sVUFBVSxTQUNyRDtBQUNFLFFBQU0sT0FBTyxRQUFRO0FBQ3JCLFFBQU0sUUFBUSxLQUFLLFVBQVUsUUFBUSxzQkFBc0IsSUFBSTtBQUMvRCxRQUFNLEVBQUUsUUFBUSxPQUFPLElBQUksTUFBTTtBQUFBLElBQy9CLDZDQUNFLEtBQUssR0FBRyxNQUNSLFNBQVMsS0FBSyxHQUFHLFVBQ2pCLFNBQVMsS0FBSyxHQUFHO0FBQUEsSUFBSztBQUFBLE1BQ3hCLFdBQVcsT0FBTyxPQUFPO0FBQUEsSUFDM0I7QUFBQSxFQUFDO0FBQ0QsTUFBSSxhQUFhO0FBQ2pCLFNBQU87QUFFVCxDQUFDO0FBRUQsd0JBQVEsT0FBTyxpQkFBaUIsT0FBTyxVQUFVLFNBQ2pEO0FBQ0UsUUFBTSxPQUFPLDBCQUFVLFNBQVM7QUFDaEMsTUFBSSxLQUFLLFNBQVMsS0FBSyxNQUN2QjtBQUNFLFdBQU87QUFBQSxFQUNUO0FBQ0EsNEJBQVUsTUFBTTtBQUNsQixDQUFDOyIsCiAgIm5hbWVzIjogWyJvcyIsICJwYXRoIiwgImluc3RhbGxFeHRlbnNpb24iXQp9Cg==
