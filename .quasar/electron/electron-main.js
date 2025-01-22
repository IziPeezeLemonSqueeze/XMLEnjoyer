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
var { dialog } = require("electron");
var fs = require("fs");
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
async function createWindow() {
  mainWindow = new import_electron.BrowserWindow({
    icon: import_path.default.resolve(__dirname, "icons/icon.png"),
    transparent: true,
    titleBarStyle: "hidden",
    backgroundColor: "#00FFFFFF",
    frame: false,
    width: 1450,
    height: 1001,
    resizable: false,
    useContentSize: false,
    webPreferences: {
      enableRemoteModule: false,
      contextIsolation: true,
      nodeIntegration: true,
      preload: import_path.default.resolve(__dirname, "C:\\Users\\galax\\Documents\\GitHub\\XMLEnjoyer\\.quasar\\electron\\electron-preload.js")
    }
  });
  mainWindow.loadURL("http://localhost:9300");
  if (true) {
    try {
      installExtension("nhdogjmejiglipccpnnnanhbledajbpd").then((name) => console.log(`Added Extension:  ${name}`)).catch((err) => console.log("An error occurred: ", err));
      await installExtension(VUEJS3_DEVTOOLS);
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
  try {
    const { stdout, stderr } = await execc(
      "sf org list auth --json",
      {
        maxBuffer: 1024 * 1024 * 8
      }
    );
    if (stdout === "" || !stdout) {
      console.log("ERROR GET AUTH LIST ORG : ", stderr);
      return null;
    }
    let bufferData = stdout;
    return JSON.parse(bufferData);
  } catch (e) {
    const { stdout, stderr } = await execc(
      "sfdx org list auth --json",
      {
        maxBuffer: 1024 * 1024 * 8
      }
    );
    if (stdout === "" || !stdout) {
      console.log("ERROR GET AUTH LIST ORG : ", stderr);
      return null;
    }
    let bufferData = stdout;
    return JSON.parse(bufferData);
  }
});
import_electron.ipcMain.handle("check-cli-installed", async (value, ...args) => {
  let cliFounded = false;
  try {
    const util = require("node:util");
    const execc = util.promisify(require("node:child_process").exec);
    const { stdout, stderr } = await execc(
      "sfdx",
      {
        maxBuffer: 1024 * 1024 * 8
      }
    );
    if (stdout) {
      cliFounded = true;
    }
  } catch (e) {
    cliFounded = false;
  }
  if (cliFounded) {
    return cliFounded;
  }
  try {
    const util = require("node:util");
    const execc = util.promisify(require("node:child_process").exec);
    const { stdout, stderr } = await execc(
      "sf",
      {
        maxBuffer: 1024 * 1024 * 8
      }
    );
    if (stdout) {
      console.log("CHECK SF LOG : ", stdout);
      cliFounded = true;
    }
  } catch (e) {
    cliFounded = false;
  }
  return cliFounded;
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
  let bufferData;
  if (stdout) {
    console.log("CHECK VERSION LOG : ", stdout);
    if (stdout.includes("sfdx-cli/")) {
      bufferData = { version: stdout.substring(9, 17), obsoleteVersion: true };
    } else if (stdout.includes("@salesforce/cli/")) {
      bufferData = { version: stdout.substring(16, 23), obsoleteVersion: false };
    }
    return bufferData;
  } else {
    console.log("ERROR : CHECK VERSION LOG : ", stdout);
    bufferData = stderr;
  }
  return bufferData;
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgbmF0aXZlVGhlbWUsIE5vdGlmaWNhdGlvbiwgc2hlbGwsIGNsaXBib2FyZCB9IGZyb20gXCJlbGVjdHJvblwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgb3MgZnJvbSBcIm9zXCI7XHJcbmNvbnN0IHsgZGlhbG9nIH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXHJcbmNvbnN0IGZzID0gcmVxdWlyZSgnZnMnKTtcclxuaW1wb3J0IHsgZXhlYywgZXhlY1N5bmMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xyXG5cclxuXHJcbi8qIGltcG9ydCBpbnN0YWxsRXh0ZW5zaW9uLCB7XHJcbiAgVlVFSlNfREVWVE9PTFNcclxufSBmcm9tIFwiZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyXCI7ICovXHJcbi8qIHZhciB7IFhNTFBhcnNlciwgWE1MQnVpbGRlciwgWE1MVmFsaWRhdG9yIH0gPSByZXF1aXJlKFwiZmFzdC14bWwtcGFyc2VyXCIpOyAqL1xyXG4vLyBuZWVkZWQgaW4gY2FzZSBwcm9jZXNzIGlzIHVuZGVmaW5lZCB1bmRlciBMaW51eFxyXG5jb25zdCBwbGF0Zm9ybSA9IHByb2Nlc3MucGxhdGZvcm0gfHwgb3MucGxhdGZvcm0oKTtcclxudHJ5XHJcbntcclxuICBpZiAocGxhdGZvcm0gPT09IFwid2luMzJcIiAmJiBuYXRpdmVUaGVtZS5zaG91bGRVc2VEYXJrQ29sb3JzID09PSB0cnVlKVxyXG4gIHtcclxuICAgIHJlcXVpcmUoXCJmc1wiKS51bmxpbmtTeW5jKFxyXG4gICAgICBwYXRoLmpvaW4oYXBwLmdldFBhdGgoXCJ1c2VyRGF0YVwiKSwgXCJEZXZUb29scyBFeHRlbnNpb25zXCIpXHJcbiAgICApO1xyXG4gIH1cclxufSBjYXRjaCAoXykgeyB9XHJcblxyXG5sZXQgbWFpbldpbmRvdztcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpXHJcbntcclxuICAvKipcclxuICAgKiBJbml0aWFsIHdpbmRvdyBvcHRpb25zXHJcbiAgICovXHJcbiAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcclxuICAgIGljb246IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiaWNvbnMvaWNvbi5wbmdcIiksIC8vIHRyYXkgaWNvblxyXG5cclxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxyXG4gICAgdGl0bGVCYXJTdHlsZTogJ2hpZGRlbicsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDBGRkZGRkYnLFxyXG4gICAgZnJhbWU6IGZhbHNlLFxyXG4gICAgd2lkdGg6IDE0NTAsXHJcbiAgICBoZWlnaHQ6IDEwMDEsXHJcbiAgICByZXNpemFibGU6IGZhbHNlLFxyXG4gICAgdXNlQ29udGVudFNpemU6IGZhbHNlLFxyXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcclxuICAgICAgZW5hYmxlUmVtb3RlTW9kdWxlOiBmYWxzZSxcclxuICAgICAgY29udGV4dElzb2xhdGlvbjogdHJ1ZSxcclxuICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxyXG4gICAgICAvLyBNb3JlIGluZm86IGh0dHBzOi8vdjIucXVhc2FyLmRldi9xdWFzYXItY2xpLXZpdGUvZGV2ZWxvcGluZy1lbGVjdHJvbi1hcHBzL2VsZWN0cm9uLXByZWxvYWQtc2NyaXB0XHJcbiAgICAgIHByZWxvYWQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHByb2Nlc3MuZW52LlFVQVNBUl9FTEVDVFJPTl9QUkVMT0FEKSxcclxuICAgIH0sXHJcbiAgfSk7XHJcblxyXG5cclxuXHJcbiAgbWFpbldpbmRvdy5sb2FkVVJMKHByb2Nlc3MuZW52LkFQUF9VUkwpO1xyXG5cclxuICBpZiAocHJvY2Vzcy5lbnYuREVCVUdHSU5HKVxyXG4gIHtcclxuICAgIC8vIGlmIG9uIERFViBvciBQcm9kdWN0aW9uIHdpdGggZGVidWcgZW5hYmxlZFxyXG4gICAgdHJ5XHJcbiAgICB7XHJcbiAgICAgIGluc3RhbGxFeHRlbnNpb24oXCJuaGRvZ2ptZWppZ2xpcGNjcG5ubmFuaGJsZWRhamJwZFwiKVxyXG4gICAgICAgIC50aGVuKChuYW1lKSA9PiBjb25zb2xlLmxvZyhgQWRkZWQgRXh0ZW5zaW9uOiAgJHtuYW1lfWApKVxyXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmxvZyhcIkFuIGVycm9yIG9jY3VycmVkOiBcIiwgZXJyKSk7XHJcbiAgICAgIGF3YWl0IGluc3RhbGxFeHRlbnNpb24oVlVFSlMzX0RFVlRPT0xTKTtcclxuXHJcbiAgICB9IGNhdGNoIChlKVxyXG4gICAge1xyXG4gICAgICBjb25zb2xlLmxvZyhlKTtcclxuICAgIH1cclxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XHJcblxyXG4gIH0gZWxzZVxyXG4gIHtcclxuICAgIC8vIHdlJ3JlIG9uIHByb2R1Y3Rpb247IG5vIGFjY2VzcyB0byBkZXZ0b29scyBwbHNcclxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub24oXCJkZXZ0b29scy1vcGVuZWRcIiwgKCkgPT5cclxuICAgIHtcclxuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5jbG9zZURldlRvb2xzKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG1haW5XaW5kb3cub24oXCJjbG9zZWRcIiwgKCkgPT5cclxuICB7XHJcbiAgICBtYWluV2luZG93ID0gbnVsbDtcclxuICB9KTtcclxufVxyXG5cclxuYXBwLndoZW5SZWFkeSgpLnRoZW4oKHJlYWR5KSA9PlxyXG57XHJcbiAgLy9jb25zb2xlLmxvZyhyZWFkeSk7XHJcblxyXG4gIGNyZWF0ZVdpbmRvdygpO1xyXG5cclxuXHJcbn0pO1xyXG5cclxuYXBwLm9uKFwid2luZG93LWFsbC1jbG9zZWRcIiwgKCkgPT5cclxue1xyXG4gIGlmIChwbGF0Zm9ybSAhPT0gXCJkYXJ3aW5cIilcclxuICB7XHJcbiAgICBhcHAucXVpdCgpO1xyXG4gIH1cclxufSk7XHJcblxyXG5hcHAub24oXCJhY3RpdmF0ZVwiLCAoKSA9PlxyXG57XHJcbiAgaWYgKG1haW5XaW5kb3cgPT09IG51bGwpXHJcbiAge1xyXG4gICAgY3JlYXRlV2luZG93KCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmlwY01haW4uaGFuZGxlKFwicXVpdC1hcHBcIiwgKCkgPT5cclxue1xyXG4gIGFwcC5xdWl0KCk7XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5oYW5kbGUoXCJtaW4tYXBwXCIsICgpID0+XHJcbntcclxuICBtYWluV2luZG93Lm1pbmltaXplKCk7XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5oYW5kbGUoXCJtYXgtYXBwXCIsICgpID0+XHJcbntcclxuICBpZiAobWFpbldpbmRvdy5pc01heGltaXplZCgpKVxyXG4gIHtcclxuICAgIG1haW5XaW5kb3cudW5tYXhpbWl6ZSgpXHJcbiAgfSBlbHNlXHJcbiAge1xyXG4gICAgbWFpbldpbmRvdy5tYXhpbWl6ZSgpXHJcbiAgfVxyXG5cclxufSk7XHJcblxyXG5pcGNNYWluLmhhbmRsZShcInNhdmUtcGFja2FnZVwiLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XHJcbntcclxuICAvL2NvbnNvbGUubG9nKHZhbHVlLCBhcmdzWzBdKVxyXG4gIGRpYWxvZy5zaG93U2F2ZURpYWxvZyh7XHJcbiAgICB0aXRsZTogJ1NlbGVjdCB0aGUgRmlsZSBQYXRoIHRvIHNhdmUnLFxyXG4gICAgZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9wYWNrYWdlJyksXHJcbiAgICAvLyBkZWZhdWx0UGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2Fzc2V0cy8nKSxcclxuICAgIGJ1dHRvbkxhYmVsOiAnU2F2ZScsXHJcbiAgICAvLyBSZXN0cmljdGluZyB0aGUgdXNlciB0byBvbmx5IFRleHQgRmlsZXMuXHJcbiAgICBmaWx0ZXJzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICBuYW1lOiAneG1sJyxcclxuICAgICAgICBleHRlbnNpb25zOiBbJ3htbCddXHJcbiAgICAgIH0sXSxcclxuICAgIHByb3BlcnRpZXM6IFtdXHJcbiAgfSkudGhlbihmaWxlID0+XHJcbiAge1xyXG4gICAgLy8gU3RhdGluZyB3aGV0aGVyIGRpYWxvZyBvcGVyYXRpb24gd2FzIGNhbmNlbGxlZCBvciBub3QuXHJcbiAgICAvL2NvbnNvbGUubG9nKGZpbGUuY2FuY2VsZWQpO1xyXG4gICAgaWYgKCFmaWxlLmNhbmNlbGVkKVxyXG4gICAge1xyXG4gICAgICAvL2NvbnNvbGUubG9nKGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAvLyBDcmVhdGluZyBhbmQgV3JpdGluZyB0byB0aGUgc2FtcGxlLnR4dCBmaWxlXHJcbiAgICAgIGZzLndyaXRlRmlsZShmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCksXHJcbiAgICAgICAgYXJnc1swXSwgZnVuY3Rpb24gKGVycilcclxuICAgICAge1xyXG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdTYXZlZCEnKTtcclxuICAgICAgICAvL21haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnbm90aWZ5LXNhdmVkLXhtbCcsIGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgbmV3IE5vdGlmaWNhdGlvbih7IHRpdGxlOiAnWE1MRW5qb3llcicsIGJvZHk6ICdYTUwgUGFja2FnZSBzYWx2YXRvOlxcbicgKyBmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCkgfSkuc2hvdygpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9KS5jYXRjaChlcnIgPT5cclxuICB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIpXHJcbiAgfSk7XHJcblxyXG59KTtcclxuXHJcblxyXG5pcGNNYWluLmhhbmRsZSgnYXV0aC1saXN0JywgYXN5bmMgKCkgPT5cclxue1xyXG4gIC8qICAgbGV0IF9DTEkgPSBleGVjKCdzZmR4IGZvcmNlOmF1dGg6bGlzdCAtLWpzb24nLCB7XHJcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGJ1ZmZlckRhdGEgPSAnJztcclxuXHJcbiAgICBfQ0xJLnN0ZG91dC5vbignZGF0YScsIChjaHVuaykgPT5cclxuICAgIHtcclxuICAgICAgLy8gICAgY29uc29sZS5sb2coJ0NIVU5LJywgY2h1bmspO1xyXG4gICAgICBidWZmZXJEYXRhICs9IGNodW5rO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX0NMSS5zdGRpbi5vbignZGF0YScsIChkYXRhKSA9PlxyXG4gICAge1xyXG4gICAgICAvLyAgICBjb25zb2xlLmxvZygnSU4nLCBkYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIF9DTEkuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+XHJcbiAgICB7XHJcbiAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdFUlInLCBkYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIF9DTEkub24oJ2V4aXQnLCAoY29kZSwgc2lnbmFsKSA9PlxyXG4gICAge1xyXG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2F1dGgtbGlzdC1yZWFkZWQnLCBidWZmZXJEYXRhKTtcclxuICAgIH0pOyAqL1xyXG5cclxuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XHJcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcclxuICB0cnlcclxuICB7XHJcbiAgICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcclxuICAgICAgJ3NmIG9yZyBsaXN0IGF1dGggLS1qc29uJywge1xyXG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcclxuICAgIH0pO1xyXG4gICAgaWYgKHN0ZG91dCA9PT0gJycgfHwgIXN0ZG91dClcclxuICAgIHtcclxuICAgICAgY29uc29sZS5sb2coJ0VSUk9SIEdFVCBBVVRIIExJU1QgT1JHIDogJywgc3RkZXJyKTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcclxuXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShidWZmZXJEYXRhKTtcclxuICB9IGNhdGNoIChlKVxyXG4gIHtcclxuICAgIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxyXG4gICAgICAnc2ZkeCBvcmcgbGlzdCBhdXRoIC0tanNvbicsIHtcclxuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXHJcbiAgICB9KTtcclxuICAgIGlmIChzdGRvdXQgPT09ICcnIHx8ICFzdGRvdXQpXHJcbiAgICB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdFUlJPUiBHRVQgQVVUSCBMSVNUIE9SRyA6ICcsIHN0ZGVycik7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XHJcblxyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYnVmZmVyRGF0YSk7XHJcbiAgfVxyXG59KTtcclxuXHJcblxyXG5pcGNNYWluLmhhbmRsZSgnY2hlY2stY2xpLWluc3RhbGxlZCcsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cclxue1xyXG4gIGxldCBjbGlGb3VuZGVkID0gZmFsc2U7XHJcbiAgdHJ5XHJcbiAge1xyXG4gICAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xyXG4gICAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcclxuICAgIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxyXG4gICAgICAnc2ZkeCcsIHtcclxuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXHJcbiAgICB9KTtcclxuICAgIGlmIChzdGRvdXQpXHJcbiAgICB7XHJcbiAgICAgIC8vICBjb25zb2xlLmxvZygnQ0hFQ0sgU0YgTE9HIDogJywgc3Rkb3V0KTtcclxuICAgICAgY2xpRm91bmRlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkgeyBjbGlGb3VuZGVkID0gZmFsc2U7IH1cclxuXHJcbiAgaWYgKGNsaUZvdW5kZWQpXHJcbiAge1xyXG4gICAgcmV0dXJuIGNsaUZvdW5kZWQ7XHJcbiAgfVxyXG5cclxuICB0cnlcclxuICB7XHJcbiAgICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XHJcbiAgICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xyXG4gICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXHJcbiAgICAgICdzZicsIHtcclxuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXHJcbiAgICB9KTtcclxuICAgIGlmIChzdGRvdXQpXHJcbiAgICB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdDSEVDSyBTRiBMT0cgOiAnLCBzdGRvdXQpO1xyXG4gICAgICBjbGlGb3VuZGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7IGNsaUZvdW5kZWQgPSBmYWxzZTsgfVxyXG5cclxuICByZXR1cm4gY2xpRm91bmRlZDtcclxufSk7XHJcblxyXG5cclxuXHJcbmlwY01haW4uaGFuZGxlKCdsb2dvdXQtb3JnJywgKHZhbHVlLCAuLi5hcmdzKSA9PlxyXG57XHJcblxyXG4gIGxldCBfQ0xJID0gZXhlYygnc2ZkeCBhdXRoOmxvZ291dCAtdSAnICsgYXJnc1swXSArICcgLXAnLCB7XHJcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcclxuICB9KTtcclxuXHJcbiAgX0NMSS5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT5cclxuICB7XHJcbiAgICBjb25zb2xlLmxvZygnRVJSJywgZGF0YSk7XHJcbiAgfSk7XHJcblxyXG4gIF9DTEkub24oJ2V4aXQnLCAoY29kZSwgc2lnbmFsKSA9PlxyXG4gIHtcclxuICAgIC8vdXBkYXRlT25Mb2dPcGVyYXRpb24oKTtcclxuICB9KTtcclxufSk7XHJcblxyXG4vKipcclxuICogJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xyXG4gICAgICArIGFyZ3NbMF0uYWxpYXNcclxuICAgICAgKyAnIC1yICcgKyBhcmdzWzBdLnVybFxyXG4gICAgICArICcgLS1qc29uJywge1xyXG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOFxyXG4gKi9cclxuXHJcblxyXG5cclxuaXBjTWFpbi5oYW5kbGUoJ2xvZ2luLW9yZycsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cclxue1xyXG4gIC8qKlxyXG4gICAqICdzZmR4IGZvcmNlOmF1dGg6d2ViOmxvZ2luIC1hICdcclxuICAgICAgICArIGFyZ3NbMF0uYWxpYXNcclxuICAgICAgICArICcgLXIgJyArIGFyZ3NbMF0udXJsXHJcbiAgICAgICAgKyAnIC0tanNvbidcclxuICAgKi9cclxuXHJcblxyXG4gIHRyeVxyXG4gIHtcclxuICAgIGxldCBwaWQgPSBhd2FpdCBnZXRQSUQxNzE3KCk7XHJcbiAgICBpZiAocGlkICE9IC0xKVxyXG4gICAge1xyXG4gICAgICBwcm9jZXNzLmtpbGwocGlkKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnIpXHJcbiAge1xyXG4gICAgY29uc29sZS5sb2coZXJyKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcclxuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xyXG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxyXG4gICAgJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xyXG4gICAgKyBhcmdzWzBdLmFsaWFzXHJcbiAgICArICcgLXIgJyArIGFyZ3NbMF0udXJsXHJcbiAgICArICcgLS1qc29uJywge1xyXG4gICAgd2luZG93c0hpZGU6IHRydWUsXHJcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcclxuXHJcbiAgfSk7XHJcbiAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XHJcblxyXG4gIHJldHVybiBKU09OLnBhcnNlKGJ1ZmZlckRhdGEpO1xyXG59KTtcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGdldFBJRDE3MTcoKVxyXG57XHJcbiAgbGV0IHNwaWQgPSAtMTtcclxuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XHJcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcclxuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcclxuICAgICduZXRzdGF0IC1hb24nLCB7XHJcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcclxuICB9KTtcclxuICBsZXQgY2h1bmsgPSBzdGRvdXQ7XHJcbiAgbGV0IHN1YmNodWNrID0gY2h1bmsuc3BsaXQoJ1xcbicpO1xyXG4gIHN1YmNodWNrLmZvckVhY2goY2ggPT5cclxuICB7XHJcbiAgICBpZiAoY2guaW5jbHVkZXMoJzoxNzE3JykpXHJcbiAgICB7XHJcbiAgICAgIGxldCBwaWQgPSBjaC5zcGxpdCgnICcpXHJcbiAgICAgIHBpZCA9IHBpZC5hdCgtMSk7XHJcblxyXG4gICAgICBzcGlkID09IC0xID8gc3BpZCA9IHBpZCA6IG51bGw7XHJcbiAgICB9XHJcbiAgfSlcclxuICByZXR1cm4gc3BpZDtcclxufVxyXG5cclxuaXBjTWFpbi5oYW5kbGUoJ2ludGVycnVwdC1sb2dpbicsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cclxue1xyXG4gIHRyeVxyXG4gIHtcclxuICAgIGxldCBwaWQgPSBhd2FpdCBnZXRQSUQxNzE3KCk7XHJcbiAgICBpZiAocGlkICE9IC0xKVxyXG4gICAge1xyXG4gICAgICBwcm9jZXNzLmtpbGwocGlkKTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlcnIpXHJcbiAge1xyXG4gICAgY29uc29sZS5sb2coZXJyKTtcclxuICB9XHJcbn0pO1xyXG5cclxuXHJcbmlwY01haW4uaGFuZGxlKCdyZXRyaWV2ZS1tZXRhZGF0YScsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cclxue1xyXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcclxuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xyXG4gIC8vb2xkXHJcbiAgLyogICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcclxuICAgICAgJ3NmZHggZm9yY2U6bWRhcGk6bGlzdG1ldGFkYXRhIC0tanNvbiAtdSAnXHJcbiAgICAgICsgYXJnc1swXS5vcmdcclxuICAgICAgKyAnIC1tICcgKyBhcmdzWzBdLm1kdE5hbWVcclxuICAgICAgKyAnIC1hICcgKyBhcmdzWzBdLmFwaSwge1xyXG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcclxuICAgIH0pOyAqL1xyXG4gIC8vbmV3XHJcbiAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXHJcbiAgICAnc2Ygb3JnIGxpc3QgbWV0YWRhdGEgLS1qc29uIC1vICdcclxuICAgICsgYXJnc1swXS5vcmdcclxuICAgICsgJyAtbSAnICsgYXJnc1swXS5tZHROYW1lXHJcbiAgICArICcgLS1hcGktdmVyc2lvbiAnICsgYXJnc1swXS5hcGksIHtcclxuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxyXG4gIH0pO1xyXG5cclxuICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcclxuICByZXR1cm4gYnVmZmVyRGF0YTtcclxuXHJcbn0pO1xyXG5cclxuaXBjTWFpbi5oYW5kbGUoJ2dldC1jbGlwYm9hcmQnLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XHJcbntcclxuICBjb25zdCB0ZXh0ID0gY2xpcGJvYXJkLnJlYWRUZXh0KCk7XHJcbiAgaWYgKHRleHQubGVuZ3RoID4gMCB8fCB0ZXh0KVxyXG4gIHtcclxuICAgIHJldHVybiB0ZXh0O1xyXG4gIH1cclxuICBjbGlwYm9hcmQuY2xlYXIoKTtcclxufSk7XHJcblxyXG5pcGNNYWluLmhhbmRsZSgnY2hlY2stc2ZkeC11cGRhdGUnLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XHJcbntcclxuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XHJcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcclxuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcclxuICAgICdzZmR4IC12ICcsIHtcclxuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxyXG4gIH0pO1xyXG4gIGxldCBidWZmZXJEYXRhO1xyXG4gIGlmIChzdGRvdXQpXHJcbiAge1xyXG4gICAgY29uc29sZS5sb2coJ0NIRUNLIFZFUlNJT04gTE9HIDogJywgc3Rkb3V0KTtcclxuICAgIGlmIChzdGRvdXQuaW5jbHVkZXMoJ3NmZHgtY2xpLycpKVxyXG4gICAge1xyXG4gICAgICBidWZmZXJEYXRhID0geyB2ZXJzaW9uOiBzdGRvdXQuc3Vic3RyaW5nKDksIDE3KSwgb2Jzb2xldGVWZXJzaW9uOiB0cnVlIH07XHJcbiAgICB9IGVsc2UgaWYgKHN0ZG91dC5pbmNsdWRlcygnQHNhbGVzZm9yY2UvY2xpLycpKVxyXG4gICAge1xyXG4gICAgICBidWZmZXJEYXRhID0geyB2ZXJzaW9uOiBzdGRvdXQuc3Vic3RyaW5nKDE2LCAyMyksIG9ic29sZXRlVmVyc2lvbjogZmFsc2UgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBidWZmZXJEYXRhO1xyXG4gIH0gZWxzZVxyXG4gIHtcclxuICAgIGNvbnNvbGUubG9nKCdFUlJPUiA6IENIRUNLIFZFUlNJT04gTE9HIDogJywgc3Rkb3V0KTtcclxuICAgIGJ1ZmZlckRhdGEgPSBzdGRlcnI7XHJcbiAgfVxyXG4gIHJldHVybiBidWZmZXJEYXRhO1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQkFBeUY7QUFDekYsa0JBQWlCO0FBQ2pCLGdCQUFlO0FBR2YsMkJBQStCO0FBRi9CLElBQU0sRUFBRSxPQUFPLElBQUksUUFBUTtBQUMzQixJQUFNLEtBQUssUUFBUTtBQVNuQixJQUFNLFdBQVcsUUFBUSxZQUFZLFVBQUFBLFFBQUcsU0FBUztBQUNqRCxJQUNBO0FBQ0UsTUFBSSxhQUFhLFdBQVcsNEJBQVksd0JBQXdCLE1BQ2hFO0FBQ0UsWUFBUSxNQUFNO0FBQUEsTUFDWixZQUFBQyxRQUFLLEtBQUssb0JBQUksUUFBUSxVQUFVLEdBQUcscUJBQXFCO0FBQUEsSUFDMUQ7QUFBQSxFQUNGO0FBQ0YsU0FBUyxHQUFQO0FBQVk7QUFFZCxJQUFJO0FBRUosZUFBZSxlQUNmO0FBSUUsZUFBYSxJQUFJLDhCQUFjO0FBQUEsSUFDN0IsTUFBTSxZQUFBQSxRQUFLLFFBQVEsV0FBVyxnQkFBZ0I7QUFBQSxJQUU5QyxhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsSUFDZixpQkFBaUI7QUFBQSxJQUNqQixPQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxnQkFBZ0I7QUFBQSxJQUNoQixnQkFBZ0I7QUFBQSxNQUNkLG9CQUFvQjtBQUFBLE1BQ3BCLGtCQUFrQjtBQUFBLE1BQ2xCLGlCQUFpQjtBQUFBLE1BRWpCLFNBQVMsWUFBQUEsUUFBSyxRQUFRLFdB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
