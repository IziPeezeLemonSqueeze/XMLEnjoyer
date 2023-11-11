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
async function createWindow() {
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
      preload: import_path.default.resolve(__dirname, "C:\\Users\\galax\\Documents\\GitHub\\XMLEnjoyer\\.quasar\\electron\\electron-preload.js")
    }
  });
  mainWindow.loadURL("http://localhost:9300");
  if (true) {
    try {
      (0, import_electron_devtools_installer.default)("nhdogjmejiglipccpnnnanhbledajbpd").then((name) => console.log(`Added Extension:  ${name}`)).catch((err) => console.log("An error occurred: ", err));
      await (0, import_electron_devtools_installer.default)(VUEJS3_DEVTOOLS);
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgbmF0aXZlVGhlbWUsIE5vdGlmaWNhdGlvbiwgc2hlbGwsIGNsaXBib2FyZCB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBvcyBmcm9tIFwib3NcIjtcbmNvbnN0IHsgZGlhbG9nIH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5pbXBvcnQgeyBleGVjLCBleGVjU3luYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5cblxuaW1wb3J0IGluc3RhbGxFeHRlbnNpb24sIHtcbiAgVlVFSlNfREVWVE9PTFNcbn0gZnJvbSBcImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlclwiO1xudmFyIHsgWE1MUGFyc2VyLCBYTUxCdWlsZGVyLCBYTUxWYWxpZGF0b3IgfSA9IHJlcXVpcmUoXCJmYXN0LXhtbC1wYXJzZXJcIik7XG4vLyBuZWVkZWQgaW4gY2FzZSBwcm9jZXNzIGlzIHVuZGVmaW5lZCB1bmRlciBMaW51eFxuY29uc3QgcGxhdGZvcm0gPSBwcm9jZXNzLnBsYXRmb3JtIHx8IG9zLnBsYXRmb3JtKCk7XG50cnlcbntcbiAgaWYgKHBsYXRmb3JtID09PSBcIndpbjMyXCIgJiYgbmF0aXZlVGhlbWUuc2hvdWxkVXNlRGFya0NvbG9ycyA9PT0gdHJ1ZSlcbiAge1xuICAgIHJlcXVpcmUoXCJmc1wiKS51bmxpbmtTeW5jKFxuICAgICAgcGF0aC5qb2luKGFwcC5nZXRQYXRoKFwidXNlckRhdGFcIiksIFwiRGV2VG9vbHMgRXh0ZW5zaW9uc1wiKVxuICAgICk7XG4gIH1cbn0gY2F0Y2ggKF8pIHsgfVxuXG5sZXQgbWFpbldpbmRvdztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2luZG93KClcbntcbiAgLyoqXG4gICAqIEluaXRpYWwgd2luZG93IG9wdGlvbnNcbiAgICovXG4gIG1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgaWNvbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJpY29ucy9pY29uLnBuZ1wiKSwgLy8gdHJheSBpY29uXG4gICAgdGl0bGVCYXJTdHlsZTogJ2hpZGRlbicsXG4gICAgdGl0bGVCYXJPdmVybGF5OiBmYWxzZSxcbiAgICB3aWR0aDogMTQ1MCxcbiAgICBoZWlnaHQ6IDEwMDEsXG4gICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICB1c2VDb250ZW50U2l6ZTogdHJ1ZSxcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xuICAgICAgZW5hYmxlUmVtb3RlTW9kdWxlOiBmYWxzZSxcbiAgICAgIGNvbnRleHRJc29sYXRpb246IHRydWUsXG4gICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXG4gICAgICAvLyBNb3JlIGluZm86IGh0dHBzOi8vdjIucXVhc2FyLmRldi9xdWFzYXItY2xpLXZpdGUvZGV2ZWxvcGluZy1lbGVjdHJvbi1hcHBzL2VsZWN0cm9uLXByZWxvYWQtc2NyaXB0XG4gICAgICBwcmVsb2FkOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBwcm9jZXNzLmVudi5RVUFTQVJfRUxFQ1RST05fUFJFTE9BRCksXG4gICAgfSxcbiAgfSk7XG5cbiAgbWFpbldpbmRvdy5sb2FkVVJMKHByb2Nlc3MuZW52LkFQUF9VUkwpO1xuXG4gIGlmIChwcm9jZXNzLmVudi5ERUJVR0dJTkcpXG4gIHtcbiAgICAvLyBpZiBvbiBERVYgb3IgUHJvZHVjdGlvbiB3aXRoIGRlYnVnIGVuYWJsZWRcbiAgICB0cnlcbiAgICB7XG4gICAgICBpbnN0YWxsRXh0ZW5zaW9uKFwibmhkb2dqbWVqaWdsaXBjY3Bubm5hbmhibGVkYWpicGRcIilcbiAgICAgICAgLnRoZW4oKG5hbWUpID0+IGNvbnNvbGUubG9nKGBBZGRlZCBFeHRlbnNpb246ICAke25hbWV9YCkpXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmxvZyhcIkFuIGVycm9yIG9jY3VycmVkOiBcIiwgZXJyKSk7XG4gICAgICBhd2FpdCBpbnN0YWxsRXh0ZW5zaW9uKFZVRUpTM19ERVZUT09MUyk7XG5cbiAgICB9IGNhdGNoIChlKVxuICAgIHtcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgIH1cbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xuXG4gIH0gZWxzZVxuICB7XG4gICAgLy8gd2UncmUgb24gcHJvZHVjdGlvbjsgbm8gYWNjZXNzIHRvIGRldnRvb2xzIHBsc1xuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub24oXCJkZXZ0b29scy1vcGVuZWRcIiwgKCkgPT5cbiAgICB7XG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLmNsb3NlRGV2VG9vbHMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG1haW5XaW5kb3cub24oXCJjbG9zZWRcIiwgKCkgPT5cbiAge1xuICAgIG1haW5XaW5kb3cgPSBudWxsO1xuICB9KTtcbn1cblxuYXBwLndoZW5SZWFkeSgpLnRoZW4oKHJlYWR5KSA9Plxue1xuICAvL2NvbnNvbGUubG9nKHJlYWR5KTtcblxuICBjcmVhdGVXaW5kb3coKTtcblxuXG59KTtcblxuYXBwLm9uKFwid2luZG93LWFsbC1jbG9zZWRcIiwgKCkgPT5cbntcbiAgaWYgKHBsYXRmb3JtICE9PSBcImRhcndpblwiKVxuICB7XG4gICAgYXBwLnF1aXQoKTtcbiAgfVxufSk7XG5cbmFwcC5vbihcImFjdGl2YXRlXCIsICgpID0+XG57XG4gIGlmIChtYWluV2luZG93ID09PSBudWxsKVxuICB7XG4gICAgY3JlYXRlV2luZG93KCk7XG4gIH1cbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcInF1aXQtYXBwXCIsICgpID0+XG57XG4gIGFwcC5xdWl0KCk7XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJtaW4tYXBwXCIsICgpID0+XG57XG4gIG1haW5XaW5kb3cubWluaW1pemUoKTtcbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcIm1heC1hcHBcIiwgKCkgPT5cbntcbiAgaWYgKG1haW5XaW5kb3cuaXNNYXhpbWl6ZWQoKSlcbiAge1xuICAgIG1haW5XaW5kb3cudW5tYXhpbWl6ZSgpXG4gIH0gZWxzZVxuICB7XG4gICAgbWFpbldpbmRvdy5tYXhpbWl6ZSgpXG4gIH1cblxufSk7XG5cbmlwY01haW4uaGFuZGxlKFwic2F2ZS1wYWNrYWdlXCIsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cbntcbiAgLy9jb25zb2xlLmxvZyh2YWx1ZSwgYXJnc1swXSlcbiAgZGlhbG9nLnNob3dTYXZlRGlhbG9nKHtcbiAgICB0aXRsZTogJ1NlbGVjdCB0aGUgRmlsZSBQYXRoIHRvIHNhdmUnLFxuICAgIGRlZmF1bHRQYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vcGFja2FnZScpLFxuICAgIC8vIGRlZmF1bHRQYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vYXNzZXRzLycpLFxuICAgIGJ1dHRvbkxhYmVsOiAnU2F2ZScsXG4gICAgLy8gUmVzdHJpY3RpbmcgdGhlIHVzZXIgdG8gb25seSBUZXh0IEZpbGVzLlxuICAgIGZpbHRlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3htbCcsXG4gICAgICAgIGV4dGVuc2lvbnM6IFsneG1sJ11cbiAgICAgIH0sXSxcbiAgICBwcm9wZXJ0aWVzOiBbXVxuICB9KS50aGVuKGZpbGUgPT5cbiAge1xuICAgIC8vIFN0YXRpbmcgd2hldGhlciBkaWFsb2cgb3BlcmF0aW9uIHdhcyBjYW5jZWxsZWQgb3Igbm90LlxuICAgIC8vY29uc29sZS5sb2coZmlsZS5jYW5jZWxlZCk7XG4gICAgaWYgKCFmaWxlLmNhbmNlbGVkKVxuICAgIHtcbiAgICAgIC8vY29uc29sZS5sb2coZmlsZS5maWxlUGF0aC50b1N0cmluZygpKTtcblxuICAgICAgLy8gQ3JlYXRpbmcgYW5kIFdyaXRpbmcgdG8gdGhlIHNhbXBsZS50eHQgZmlsZVxuICAgICAgZnMud3JpdGVGaWxlKGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSxcbiAgICAgICAgYXJnc1swXSwgZnVuY3Rpb24gKGVycilcbiAgICAgIHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdTYXZlZCEnKTtcbiAgICAgICAgLy9tYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ25vdGlmeS1zYXZlZC14bWwnLCBmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCkpO1xuICAgICAgICBuZXcgTm90aWZpY2F0aW9uKHsgdGl0bGU6ICdYTUxFbmpveWVyJywgYm9keTogJ1hNTCBQYWNrYWdlIHNhbHZhdG86XFxuJyArIGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSB9KS5zaG93KCk7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pLmNhdGNoKGVyciA9PlxuICB7XG4gICAgY29uc29sZS5sb2coZXJyKVxuICB9KTtcblxufSk7XG5cblxuaXBjTWFpbi5oYW5kbGUoJ2F1dGgtbGlzdCcsIGFzeW5jICgpID0+XG57XG4gIC8qICAgbGV0IF9DTEkgPSBleGVjKCdzZmR4IGZvcmNlOmF1dGg6bGlzdCAtLWpzb24nLCB7XG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgICB9KTtcblxuICAgIGxldCBidWZmZXJEYXRhID0gJyc7XG5cbiAgICBfQ0xJLnN0ZG91dC5vbignZGF0YScsIChjaHVuaykgPT5cbiAgICB7XG4gICAgICAvLyAgICBjb25zb2xlLmxvZygnQ0hVTksnLCBjaHVuayk7XG4gICAgICBidWZmZXJEYXRhICs9IGNodW5rO1xuICAgIH0pO1xuXG4gICAgX0NMSS5zdGRpbi5vbignZGF0YScsIChkYXRhKSA9PlxuICAgIHtcbiAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdJTicsIGRhdGEpO1xuICAgIH0pO1xuXG4gICAgX0NMSS5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT5cbiAgICB7XG4gICAgICAvLyAgICBjb25zb2xlLmxvZygnRVJSJywgZGF0YSk7XG4gICAgfSk7XG5cbiAgICBfQ0xJLm9uKCdleGl0JywgKGNvZGUsIHNpZ25hbCkgPT5cbiAgICB7XG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2F1dGgtbGlzdC1yZWFkZWQnLCBidWZmZXJEYXRhKTtcbiAgICB9KTsgKi9cblxuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XG4gIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZSgnbm9kZTpjaGlsZF9wcm9jZXNzJykuZXhlYyk7XG4gIHRyeVxuICB7XG4gICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgICAnc2Ygb3JnIGxpc3QgYXV0aCAtLWpzb24nLCB7XG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgICB9KTtcbiAgICBpZiAoc3Rkb3V0ID09PSAnJyB8fCAhc3Rkb3V0KVxuICAgIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFUlJPUiBHRVQgQVVUSCBMSVNUIE9SRyA6ICcsIHN0ZGVycik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XG5cbiAgICByZXR1cm4gSlNPTi5wYXJzZShidWZmZXJEYXRhKTtcbiAgfSBjYXRjaCAoZSlcbiAge1xuICAgIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxuICAgICAgJ3NmZHggb3JnIGxpc3QgYXV0aCAtLWpzb24nLCB7XG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgICB9KTtcbiAgICBpZiAoc3Rkb3V0ID09PSAnJyB8fCAhc3Rkb3V0KVxuICAgIHtcbiAgICAgIGNvbnNvbGUubG9nKCdFUlJPUiBHRVQgQVVUSCBMSVNUIE9SRyA6ICcsIHN0ZGVycik7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XG5cbiAgICByZXR1cm4gSlNPTi5wYXJzZShidWZmZXJEYXRhKTtcbiAgfVxufSk7XG5cblxuaXBjTWFpbi5oYW5kbGUoJ2NoZWNrLWNsaS1pbnN0YWxsZWQnLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIGxldCBjbGlGb3VuZGVkID0gZmFsc2U7XG4gIHRyeVxuICB7XG4gICAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xuICAgIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZSgnbm9kZTpjaGlsZF9wcm9jZXNzJykuZXhlYyk7XG4gICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgICAnc2ZkeCcsIHtcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICAgIH0pO1xuICAgIGlmIChzdGRvdXQpXG4gICAge1xuICAgICAgLy8gIGNvbnNvbGUubG9nKCdDSEVDSyBTRiBMT0cgOiAnLCBzdGRvdXQpO1xuICAgICAgY2xpRm91bmRlZCA9IHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7IGNsaUZvdW5kZWQgPSBmYWxzZTsgfVxuXG4gIGlmIChjbGlGb3VuZGVkKVxuICB7XG4gICAgcmV0dXJuIGNsaUZvdW5kZWQ7XG4gIH1cblxuICB0cnlcbiAge1xuICAgIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcbiAgICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xuICAgIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxuICAgICAgJ3NmJywge1xuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gICAgfSk7XG4gICAgaWYgKHN0ZG91dClcbiAgICB7XG4gICAgICBjb25zb2xlLmxvZygnQ0hFQ0sgU0YgTE9HIDogJywgc3Rkb3V0KTtcbiAgICAgIGNsaUZvdW5kZWQgPSB0cnVlO1xuICAgIH1cbiAgfSBjYXRjaCAoZSkgeyBjbGlGb3VuZGVkID0gZmFsc2U7IH1cblxuICByZXR1cm4gY2xpRm91bmRlZDtcbn0pO1xuXG5cblxuaXBjTWFpbi5oYW5kbGUoJ2xvZ291dC1vcmcnLCAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG5cbiAgbGV0IF9DTEkgPSBleGVjKCdzZmR4IGF1dGg6bG9nb3V0IC11ICcgKyBhcmdzWzBdICsgJyAtcCcsIHtcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgfSk7XG5cbiAgX0NMSS5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT5cbiAge1xuICAgIGNvbnNvbGUubG9nKCdFUlInLCBkYXRhKTtcbiAgfSk7XG5cbiAgX0NMSS5vbignZXhpdCcsIChjb2RlLCBzaWduYWwpID0+XG4gIHtcbiAgICAvL3VwZGF0ZU9uTG9nT3BlcmF0aW9uKCk7XG4gIH0pO1xufSk7XG5cbi8qKlxuICogJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xuICAgICAgKyBhcmdzWzBdLmFsaWFzXG4gICAgICArICcgLXIgJyArIGFyZ3NbMF0udXJsXG4gICAgICArICcgLS1qc29uJywge1xuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDhcbiAqL1xuXG5cblxuaXBjTWFpbi5oYW5kbGUoJ2xvZ2luLW9yZycsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cbntcbiAgLyoqXG4gICAqICdzZmR4IGZvcmNlOmF1dGg6d2ViOmxvZ2luIC1hICdcbiAgICAgICAgKyBhcmdzWzBdLmFsaWFzXG4gICAgICAgICsgJyAtciAnICsgYXJnc1swXS51cmxcbiAgICAgICAgKyAnIC0tanNvbidcbiAgICovXG5cblxuICB0cnlcbiAge1xuICAgIGxldCBwaWQgPSBhd2FpdCBnZXRQSUQxNzE3KCk7XG4gICAgaWYgKHBpZCAhPSAtMSlcbiAgICB7XG4gICAgICBwcm9jZXNzLmtpbGwocGlkKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycilcbiAge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH1cblxuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XG4gIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZSgnbm9kZTpjaGlsZF9wcm9jZXNzJykuZXhlYyk7XG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxuICAgICdzZmR4IGZvcmNlOmF1dGg6d2ViOmxvZ2luIC1hICdcbiAgICArIGFyZ3NbMF0uYWxpYXNcbiAgICArICcgLXIgJyArIGFyZ3NbMF0udXJsXG4gICAgKyAnIC0tanNvbicsIHtcbiAgICB3aW5kb3dzSGlkZTogdHJ1ZSxcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcblxuICB9KTtcbiAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XG5cbiAgcmV0dXJuIEpTT04ucGFyc2UoYnVmZmVyRGF0YSk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0UElEMTcxNygpXG57XG4gIGxldCBzcGlkID0gLTE7XG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcbiAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgJ25ldHN0YXQgLWFvbicsIHtcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgfSk7XG4gIGxldCBjaHVuayA9IHN0ZG91dDtcbiAgbGV0IHN1YmNodWNrID0gY2h1bmsuc3BsaXQoJ1xcbicpO1xuICBzdWJjaHVjay5mb3JFYWNoKGNoID0+XG4gIHtcbiAgICBpZiAoY2guaW5jbHVkZXMoJzoxNzE3JykpXG4gICAge1xuICAgICAgbGV0IHBpZCA9IGNoLnNwbGl0KCcgJylcbiAgICAgIHBpZCA9IHBpZC5hdCgtMSk7XG5cbiAgICAgIHNwaWQgPT0gLTEgPyBzcGlkID0gcGlkIDogbnVsbDtcbiAgICB9XG4gIH0pXG4gIHJldHVybiBzcGlkO1xufVxuXG5pcGNNYWluLmhhbmRsZSgnaW50ZXJydXB0LWxvZ2luJywgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICB0cnlcbiAge1xuICAgIGxldCBwaWQgPSBhd2FpdCBnZXRQSUQxNzE3KCk7XG4gICAgaWYgKHBpZCAhPSAtMSlcbiAgICB7XG4gICAgICBwcm9jZXNzLmtpbGwocGlkKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycilcbiAge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH1cbn0pO1xuXG5cbmlwY01haW4uaGFuZGxlKCdyZXRyaWV2ZS1tZXRhZGF0YScsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cbntcbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xuICAvL29sZFxuICAvKiAgIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxuICAgICAgJ3NmZHggZm9yY2U6bWRhcGk6bGlzdG1ldGFkYXRhIC0tanNvbiAtdSAnXG4gICAgICArIGFyZ3NbMF0ub3JnXG4gICAgICArICcgLW0gJyArIGFyZ3NbMF0ubWR0TmFtZVxuICAgICAgKyAnIC1hICcgKyBhcmdzWzBdLmFwaSwge1xuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gICAgfSk7ICovXG4gIC8vbmV3XG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxuICAgICdzZiBvcmcgbGlzdCBtZXRhZGF0YSAtLWpzb24gLW8gJ1xuICAgICsgYXJnc1swXS5vcmdcbiAgICArICcgLW0gJyArIGFyZ3NbMF0ubWR0TmFtZVxuICAgICsgJyAtLWFwaS12ZXJzaW9uICcgKyBhcmdzWzBdLmFwaSwge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICB9KTtcblxuICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcbiAgcmV0dXJuIGJ1ZmZlckRhdGE7XG5cbn0pO1xuXG5pcGNNYWluLmhhbmRsZSgnZ2V0LWNsaXBib2FyZCcsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cbntcbiAgY29uc3QgdGV4dCA9IGNsaXBib2FyZC5yZWFkVGV4dCgpO1xuICBpZiAodGV4dC5sZW5ndGggPiAwIHx8IHRleHQpXG4gIHtcbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuICBjbGlwYm9hcmQuY2xlYXIoKTtcbn0pO1xuXG5pcGNNYWluLmhhbmRsZSgnY2hlY2stc2ZkeC11cGRhdGUnLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcbiAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgJ3NmZHggLXYgJywge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICB9KTtcbiAgbGV0IGJ1ZmZlckRhdGE7XG4gIGlmIChzdGRvdXQpXG4gIHtcbiAgICBjb25zb2xlLmxvZygnQ0hFQ0sgVkVSU0lPTiBMT0cgOiAnLCBzdGRvdXQpO1xuICAgIGlmIChzdGRvdXQuaW5jbHVkZXMoJ3NmZHgtY2xpLycpKVxuICAgIHtcbiAgICAgIGJ1ZmZlckRhdGEgPSB7IHZlcnNpb246IHN0ZG91dC5zdWJzdHJpbmcoOSwgMTcpLCBvYnNvbGV0ZVZlcnNpb246IHRydWUgfTtcbiAgICB9IGVsc2UgaWYgKHN0ZG91dC5pbmNsdWRlcygnQHNhbGVzZm9yY2UvY2xpLycpKVxuICAgIHtcbiAgICAgIGJ1ZmZlckRhdGEgPSB7IHZlcnNpb246IHN0ZG91dC5zdWJzdHJpbmcoMTYsIDIzKSwgb2Jzb2xldGVWZXJzaW9uOiBmYWxzZSB9O1xuICAgIH1cbiAgICByZXR1cm4gYnVmZmVyRGF0YTtcbiAgfSBlbHNlXG4gIHtcbiAgICBjb25zb2xlLmxvZygnRVJST1IgOiBDSEVDSyBWRVJTSU9OIExPRyA6ICcsIHN0ZG91dCk7XG4gICAgYnVmZmVyRGF0YSA9IHN0ZGVycjtcbiAgfVxuICByZXR1cm4gYnVmZmVyRGF0YTtcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQkFBeUY7QUFDekYsa0JBQWlCO0FBQ2pCLGdCQUFlO0FBR2YsMkJBQStCO0FBRy9CLHlDQUVPO0FBUFAsSUFBTSxFQUFFLE9BQU8sSUFBSSxRQUFRO0FBQzNCLElBQU0sS0FBSyxRQUFRO0FBT25CLElBQUksRUFBRSxXQUFXLFlBQVksYUFBYSxJQUFJLFFBQVE7QUFFdEQsSUFBTSxXQUFXLFFBQVEsWUFBWSxVQUFBQSxRQUFHLFNBQVM7QUFDakQsSUFDQTtBQUNFLE1BQUksYUFBYSxXQUFXLDRCQUFZLHdCQUF3QixNQUNoRTtBQUNFLFlBQVEsTUFBTTtBQUFBLE1BQ1osWUFBQUMsUUFBSyxLQUFLLG9CQUFJLFFBQVEsVUFBVSxHQUFHLHFCQUFxQjtBQUFBLElBQzFEO0FBQUEsRUFDRjtBQUNGLFNBQVMsR0FBUDtBQUFZO0FBRWQsSUFBSTtBQUVKLGVBQWUsZUFDZjtBQUlFLGVBQWEsSUFBSSw4QkFBYztBQUFBLElBQzdCLE1BQU0sWUFBQUEsUUFBSyxRQUFRLFdBQVcsZ0JBQWdCO0FBQUEsSUFDOUMsZUFBZTtBQUFBLElBQ2YsaUJBQWlCO0FBQUEsSUFDakIsT0FBTztBQUFBLElBQ1AsUUFBUTtBQUFBLElBQ1IsV0FBVztBQUFBLElBQ1gsZ0JBQWdCO0FBQUEsSUFDaEIsZ0JBQWdCO0FBQUEsTUFDZCxvQkFBb0I7QUFBQSxNQUNwQixrQkFBa0I7QUFBQSxNQUNsQixpQkFBaUI7QUFBQSxNQUVqQixTQUFTLFlBQUFBLFFBQUssUUFBUSxXQUFXLHlGQUFtQztBQUFBLElBQ3RFO0FBQUEsRUFDRixDQUFDO0FBRUQsYUFB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QUFRLEtBQUssVUFBVSxRQUFRLHNCQUFzQixJQUFJO0FBQy9ELFFBQU0sRUFBRSxRQUFRLE9BQU8sSUFBSSxNQUFNO0FBQUEsSUFDL0I7QUFBQSxJQUFZO0FBQUEsTUFDWixXQUFXLE9BQU8sT0FBTztBQUFBLElBQzNCO0FBQUEsRUFBQztBQUNELE1BQUk7QUFDSixNQUFJLFFBQ0o7QUFDRSxZQUFRLElBQUksd0JBQXdCLE1BQU07QUFDMUMsUUFBSSxPQUFPLFNBQVMsV0FBVyxHQUMvQjtBQUNFLG1CQUFhLEVBQUUsU0FBUyxPQUFPLFVBQVUsR0FBRyxFQUFFLEdBQUcsaUJBQWlCLEtBQUs7QUFBQSxJQUN6RSxXQUFXLE9BQU8sU0FBUyxrQkFBa0IsR0FDN0M7QUFDRSxtQkFBYSxFQUFFLFNBQVMsT0FBTyxVQUFVLElBQUksRUFBRSxHQUFHLGlCQUFpQixNQUFNO0FBQUEsSUFDM0U7QUFDQSxXQUFPO0FBQUEsRUFDVCxPQUNBO0FBQ0UsWUFBUSxJQUFJLGdDQUFnQyxNQUFNO0FBQ2xELGlCQUFhO0FBQUEsRUFDZjtBQUNBLFNBQU87QUFDVCxDQUFDOyIsCiAgIm5hbWVzIjogWyJvcyIsICJwYXRoIiwgImluc3RhbGxFeHRlbnNpb24iXQp9Cg==
