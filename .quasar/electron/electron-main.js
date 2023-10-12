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
    "sf org list auth --json",
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
    "sf org list metadata --json -o " + args[0].org + " -m " + args[0].mdtName + " --api-version " + args[0].api,
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
import_electron.ipcMain.handle("check-sfdx-update", async (value, ...args) => {
  const util = require("node:util");
  const execc = util.promisify(require("node:child_process").exec);
  const { stdout, stderr } = await execc(
    "sfdx -v ",
    {
      maxBuffer: 1024 * 1024 * 8
    }
  );
  console.log(stdout);
  let bufferData = stdout;
  return bufferData;
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgbmF0aXZlVGhlbWUsIE5vdGlmaWNhdGlvbiwgc2hlbGwsIGNsaXBib2FyZCB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBvcyBmcm9tIFwib3NcIjtcbmNvbnN0IHsgZGlhbG9nIH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5pbXBvcnQgeyBleGVjLCBleGVjU3luYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5cblxuaW1wb3J0IGluc3RhbGxFeHRlbnNpb24sIHsgVlVFSlMzX0RFVlRPT0xTIH0gZnJvbSBcImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlclwiO1xudmFyIHsgWE1MUGFyc2VyLCBYTUxCdWlsZGVyLCBYTUxWYWxpZGF0b3IgfSA9IHJlcXVpcmUoXCJmYXN0LXhtbC1wYXJzZXJcIik7XG4vLyBuZWVkZWQgaW4gY2FzZSBwcm9jZXNzIGlzIHVuZGVmaW5lZCB1bmRlciBMaW51eFxuY29uc3QgcGxhdGZvcm0gPSBwcm9jZXNzLnBsYXRmb3JtIHx8IG9zLnBsYXRmb3JtKCk7XG50cnlcbntcbiAgaWYgKHBsYXRmb3JtID09PSBcIndpbjMyXCIgJiYgbmF0aXZlVGhlbWUuc2hvdWxkVXNlRGFya0NvbG9ycyA9PT0gdHJ1ZSlcbiAge1xuICAgIHJlcXVpcmUoXCJmc1wiKS51bmxpbmtTeW5jKFxuICAgICAgcGF0aC5qb2luKGFwcC5nZXRQYXRoKFwidXNlckRhdGFcIiksIFwiRGV2VG9vbHMgRXh0ZW5zaW9uc1wiKVxuICAgICk7XG4gIH1cbn0gY2F0Y2ggKF8pIHsgfVxuXG5sZXQgbWFpbldpbmRvdztcblxuZnVuY3Rpb24gY3JlYXRlV2luZG93KClcbntcbiAgLyoqXG4gICAqIEluaXRpYWwgd2luZG93IG9wdGlvbnNcbiAgICovXG4gIG1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgaWNvbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJpY29ucy9pY29uLnBuZ1wiKSwgLy8gdHJheSBpY29uXG4gICAgdGl0bGVCYXJTdHlsZTogJ2hpZGRlbicsXG4gICAgdGl0bGVCYXJPdmVybGF5OiBmYWxzZSxcbiAgICB3aWR0aDogMTQ1MCxcbiAgICBoZWlnaHQ6IDEwMDEsXG4gICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICB1c2VDb250ZW50U2l6ZTogdHJ1ZSxcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgZW5hYmxlUmVtb3RlTW9kdWxlOiBmYWxzZSxcbiAgICAgIGNvbnRleHRJc29sYXRpb246IHRydWUsXG4gICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXG4gICAgICAvLyBNb3JlIGluZm86IGh0dHBzOi8vdjIucXVhc2FyLmRldi9xdWFzYXItY2xpLXZpdGUvZGV2ZWxvcGluZy1lbGVjdHJvbi1hcHBzL2VsZWN0cm9uLXByZWxvYWQtc2NyaXB0XG4gICAgICBwcmVsb2FkOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBwcm9jZXNzLmVudi5RVUFTQVJfRUxFQ1RST05fUFJFTE9BRCksXG4gICAgfSxcbiAgfSk7XG5cbiAgbWFpbldpbmRvdy5sb2FkVVJMKHByb2Nlc3MuZW52LkFQUF9VUkwpO1xuXG4gIGlmIChwcm9jZXNzLmVudi5ERUJVR0dJTkcpXG4gIHtcbiAgICAvLyBpZiBvbiBERVYgb3IgUHJvZHVjdGlvbiB3aXRoIGRlYnVnIGVuYWJsZWRcbiAgICB0cnlcbiAgICB7XG4gICAgICBpbnN0YWxsRXh0ZW5zaW9uKFtcIm5oZG9nam1lamlnbGlwY2Nwbm5uYW5oYmxlZGFqYnBkXCJdKVxuICAgICAgICAudGhlbigobmFtZSkgPT4gY29uc29sZS5sb2coYEFkZGVkIEV4dGVuc2lvbjogICR7bmFtZX1gKSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUubG9nKFwiQW4gZXJyb3Igb2NjdXJyZWQ6IFwiLCBlcnIpKTtcbiAgICB9IGNhdGNoIChlKVxuICAgIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIH1cbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuICB9IGVsc2VcbiAge1xuICAgIC8vIHdlJ3JlIG9uIHByb2R1Y3Rpb247IG5vIGFjY2VzcyB0byBkZXZ0b29scyBwbHNcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9uKFwiZGV2dG9vbHMtb3BlbmVkXCIsICgpID0+XG4gICAge1xuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5jbG9zZURldlRvb2xzKCk7XG4gICAgfSk7XG4gIH1cblxuICBtYWluV2luZG93Lm9uKFwiY2xvc2VkXCIsICgpID0+XG4gIHtcbiAgICBtYWluV2luZG93ID0gbnVsbDtcbiAgfSk7XG59XG5cbmFwcC53aGVuUmVhZHkoKS50aGVuKChyZWFkeSkgPT5cbntcbiAgLy9jb25zb2xlLmxvZyhyZWFkeSk7XG5cbiAgY3JlYXRlV2luZG93KCk7XG5cblxufSk7XG5cbmFwcC5vbihcIndpbmRvdy1hbGwtY2xvc2VkXCIsICgpID0+XG57XG4gIGlmIChwbGF0Zm9ybSAhPT0gXCJkYXJ3aW5cIilcbiAge1xuICAgIGFwcC5xdWl0KCk7XG4gIH1cbn0pO1xuXG5hcHAub24oXCJhY3RpdmF0ZVwiLCAoKSA9Plxue1xuICBpZiAobWFpbldpbmRvdyA9PT0gbnVsbClcbiAge1xuICAgIGNyZWF0ZVdpbmRvdygpO1xuICB9XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJxdWl0LWFwcFwiLCAoKSA9Plxue1xuICBhcHAucXVpdCgpO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKFwibWluLWFwcFwiLCAoKSA9Plxue1xuICBtYWluV2luZG93Lm1pbmltaXplKCk7XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJtYXgtYXBwXCIsICgpID0+XG57XG4gIGlmIChtYWluV2luZG93LmlzTWF4aW1pemVkKCkpXG4gIHtcbiAgICBtYWluV2luZG93LnVubWF4aW1pemUoKVxuICB9IGVsc2VcbiAge1xuICAgIG1haW5XaW5kb3cubWF4aW1pemUoKVxuICB9XG5cbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcInNhdmUtcGFja2FnZVwiLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIC8vY29uc29sZS5sb2codmFsdWUsIGFyZ3NbMF0pXG4gIGRpYWxvZy5zaG93U2F2ZURpYWxvZyh7XG4gICAgdGl0bGU6ICdTZWxlY3QgdGhlIEZpbGUgUGF0aCB0byBzYXZlJyxcbiAgICBkZWZhdWx0UGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uL3BhY2thZ2UnKSxcbiAgICAvLyBkZWZhdWx0UGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2Fzc2V0cy8nKSxcbiAgICBidXR0b25MYWJlbDogJ1NhdmUnLFxuICAgIC8vIFJlc3RyaWN0aW5nIHRoZSB1c2VyIHRvIG9ubHkgVGV4dCBGaWxlcy5cbiAgICBmaWx0ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd4bWwnLFxuICAgICAgICBleHRlbnNpb25zOiBbJ3htbCddXG4gICAgICB9LF0sXG4gICAgcHJvcGVydGllczogW11cbiAgfSkudGhlbihmaWxlID0+XG4gIHtcbiAgICAvLyBTdGF0aW5nIHdoZXRoZXIgZGlhbG9nIG9wZXJhdGlvbiB3YXMgY2FuY2VsbGVkIG9yIG5vdC5cbiAgICAvL2NvbnNvbGUubG9nKGZpbGUuY2FuY2VsZWQpO1xuICAgIGlmICghZmlsZS5jYW5jZWxlZClcbiAgICB7XG4gICAgICAvL2NvbnNvbGUubG9nKGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XG5cbiAgICAgIC8vIENyZWF0aW5nIGFuZCBXcml0aW5nIHRvIHRoZSBzYW1wbGUudHh0IGZpbGVcbiAgICAgIGZzLndyaXRlRmlsZShmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCksXG4gICAgICAgIGFyZ3NbMF0sIGZ1bmN0aW9uIChlcnIpXG4gICAgICB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnU2F2ZWQhJyk7XG4gICAgICAgIC8vbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdub3RpZnktc2F2ZWQteG1sJywgZmlsZS5maWxlUGF0aC50b1N0cmluZygpKTtcbiAgICAgICAgbmV3IE5vdGlmaWNhdGlvbih7IHRpdGxlOiAnWE1MRW5qb3llcicsIGJvZHk6ICdYTUwgUGFja2FnZSBzYWx2YXRvOlxcbicgKyBmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCkgfSkuc2hvdygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KS5jYXRjaChlcnIgPT5cbiAge1xuICAgIGNvbnNvbGUubG9nKGVycilcbiAgfSk7XG5cbn0pO1xuXG5cbmlwY01haW4uaGFuZGxlKCdhdXRoLWxpc3QnLCBhc3luYyAoKSA9Plxue1xuICAvKiAgIGxldCBfQ0xJID0gZXhlYygnc2ZkeCBmb3JjZTphdXRoOmxpc3QgLS1qc29uJywge1xuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gICAgfSk7XG5cbiAgICBsZXQgYnVmZmVyRGF0YSA9ICcnO1xuXG4gICAgX0NMSS5zdGRvdXQub24oJ2RhdGEnLCAoY2h1bmspID0+XG4gICAge1xuICAgICAgLy8gICAgY29uc29sZS5sb2coJ0NIVU5LJywgY2h1bmspO1xuICAgICAgYnVmZmVyRGF0YSArPSBjaHVuaztcbiAgICB9KTtcblxuICAgIF9DTEkuc3RkaW4ub24oJ2RhdGEnLCAoZGF0YSkgPT5cbiAgICB7XG4gICAgICAvLyAgICBjb25zb2xlLmxvZygnSU4nLCBkYXRhKTtcbiAgICB9KTtcblxuICAgIF9DTEkuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+XG4gICAge1xuICAgICAgLy8gICAgY29uc29sZS5sb2coJ0VSUicsIGRhdGEpO1xuICAgIH0pO1xuXG4gICAgX0NMSS5vbignZXhpdCcsIChjb2RlLCBzaWduYWwpID0+XG4gICAge1xuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdhdXRoLWxpc3QtcmVhZGVkJywgYnVmZmVyRGF0YSk7XG4gICAgfSk7ICovXG5cbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAnc2Ygb3JnIGxpc3QgYXV0aCAtLWpzb24nLCB7XG4gICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gIH0pO1xuICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcblxuICByZXR1cm4gSlNPTi5wYXJzZShidWZmZXJEYXRhKTtcblxufSk7XG5cbmlwY01haW4uaGFuZGxlKCdsb2dvdXQtb3JnJywgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuXG4gIGxldCBfQ0xJID0gZXhlYygnc2ZkeCBhdXRoOmxvZ291dCAtdSAnICsgYXJnc1swXSArICcgLXAnLCB7XG4gICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gIH0pO1xuXG4gIF9DTEkuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+XG4gIHtcbiAgICBjb25zb2xlLmxvZygnRVJSJywgZGF0YSk7XG4gIH0pO1xuXG4gIF9DTEkub24oJ2V4aXQnLCAoY29kZSwgc2lnbmFsKSA9PlxuICB7XG4gICAgLy91cGRhdGVPbkxvZ09wZXJhdGlvbigpO1xuICB9KTtcbn0pO1xuXG4vKipcbiAqICdzZmR4IGZvcmNlOmF1dGg6d2ViOmxvZ2luIC1hICdcbiAgICAgICsgYXJnc1swXS5hbGlhc1xuICAgICAgKyAnIC1yICcgKyBhcmdzWzBdLnVybFxuICAgICAgKyAnIC0tanNvbicsIHtcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4XG4gKi9cblxuXG5cbmlwY01haW4uaGFuZGxlKCdsb2dpbi1vcmcnLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIC8qKlxuICAgKiAnc2ZkeCBmb3JjZTphdXRoOndlYjpsb2dpbiAtYSAnXG4gICAgICAgICsgYXJnc1swXS5hbGlhc1xuICAgICAgICArICcgLXIgJyArIGFyZ3NbMF0udXJsXG4gICAgICAgICsgJyAtLWpzb24nXG4gICAqL1xuXG5cbiAgdHJ5XG4gIHtcbiAgICBsZXQgcGlkID0gYXdhaXQgZ2V0UElEMTcxNygpO1xuICAgIGlmIChwaWQgIT0gLTEpXG4gICAge1xuICAgICAgcHJvY2Vzcy5raWxsKHBpZCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpXG4gIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9XG5cbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAnc2ZkeCBmb3JjZTphdXRoOndlYjpsb2dpbiAtYSAnXG4gICAgKyBhcmdzWzBdLmFsaWFzXG4gICAgKyAnIC1yICcgKyBhcmdzWzBdLnVybFxuICAgICsgJyAtLWpzb24nLCB7XG4gICAgd2luZG93c0hpZGU6IHRydWUsXG4gICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG5cbiAgfSk7XG4gIGxldCBidWZmZXJEYXRhID0gc3Rkb3V0O1xuXG4gIHJldHVybiBKU09OLnBhcnNlKGJ1ZmZlckRhdGEpO1xufSk7XG5cbmFzeW5jIGZ1bmN0aW9uIGdldFBJRDE3MTcoKVxue1xuICBsZXQgc3BpZCA9IC0xO1xuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XG4gIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZSgnbm9kZTpjaGlsZF9wcm9jZXNzJykuZXhlYyk7XG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxuICAgICduZXRzdGF0IC1hb24nLCB7XG4gICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gIH0pO1xuICBsZXQgY2h1bmsgPSBzdGRvdXQ7XG4gIGxldCBzdWJjaHVjayA9IGNodW5rLnNwbGl0KCdcXG4nKTtcbiAgc3ViY2h1Y2suZm9yRWFjaChjaCA9PlxuICB7XG4gICAgaWYgKGNoLmluY2x1ZGVzKCc6MTcxNycpKVxuICAgIHtcbiAgICAgIGxldCBwaWQgPSBjaC5zcGxpdCgnICcpXG4gICAgICBwaWQgPSBwaWQuYXQoLTEpO1xuXG4gICAgICBzcGlkID09IC0xID8gc3BpZCA9IHBpZCA6IG51bGw7XG4gICAgfVxuICB9KVxuICByZXR1cm4gc3BpZDtcbn1cblxuaXBjTWFpbi5oYW5kbGUoJ2ludGVycnVwdC1sb2dpbicsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cbntcbiAgdHJ5XG4gIHtcbiAgICBsZXQgcGlkID0gYXdhaXQgZ2V0UElEMTcxNygpO1xuICAgIGlmIChwaWQgIT0gLTEpXG4gICAge1xuICAgICAgcHJvY2Vzcy5raWxsKHBpZCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpXG4gIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9XG59KTtcblxuXG5pcGNNYWluLmhhbmRsZSgncmV0cmlldmUtbWV0YWRhdGEnLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcbiAgLy9vbGRcbiAgLyogICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAgICdzZmR4IGZvcmNlOm1kYXBpOmxpc3RtZXRhZGF0YSAtLWpzb24gLXUgJ1xuICAgICAgKyBhcmdzWzBdLm9yZ1xuICAgICAgKyAnIC1tICcgKyBhcmdzWzBdLm1kdE5hbWVcbiAgICAgICsgJyAtYSAnICsgYXJnc1swXS5hcGksIHtcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICAgIH0pOyAqL1xuICAvL25ld1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAnc2Ygb3JnIGxpc3QgbWV0YWRhdGEgLS1qc29uIC1vICdcbiAgICArIGFyZ3NbMF0ub3JnXG4gICAgKyAnIC1tICcgKyBhcmdzWzBdLm1kdE5hbWVcbiAgICArICcgLS1hcGktdmVyc2lvbiAnICsgYXJnc1swXS5hcGksIHtcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgfSk7XG5cbiAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XG4gIHJldHVybiBidWZmZXJEYXRhO1xuXG59KTtcblxuaXBjTWFpbi5oYW5kbGUoJ2dldC1jbGlwYm9hcmQnLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIGNvbnN0IHRleHQgPSBjbGlwYm9hcmQucmVhZFRleHQoKTtcbiAgaWYgKHRleHQubGVuZ3RoID4gMCB8fCB0ZXh0KVxuICB7XG4gICAgcmV0dXJuIHRleHQ7XG4gIH1cbiAgY2xpcGJvYXJkLmNsZWFyKCk7XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoJ2NoZWNrLXNmZHgtdXBkYXRlJywgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XG4gIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZSgnbm9kZTpjaGlsZF9wcm9jZXNzJykuZXhlYyk7XG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxuICAgICdzZmR4IC12ICcsIHtcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgfSk7XG4gIGNvbnNvbGUubG9nKHN0ZG91dCk7XG4gIGxldCBidWZmZXJEYXRh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
