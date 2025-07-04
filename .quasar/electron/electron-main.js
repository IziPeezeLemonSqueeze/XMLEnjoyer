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
      fs.writeFile(file.filePath.toString(), args[0], function(err) {
        if (err)
          throw err;
        new import_electron.Notification({
          title: "XMLEnjoyer",
          body: "XML Package salvato:\n" + file.filePath.toString()
        }).show();
      });
    }
  }).catch((err) => {
    console.log(err);
  });
});
import_electron.ipcMain.handle("auth-list", async () => {
  const util = require("node:util");
  const execc = util.promisify(require("node:child_process").exec);
  try {
    const { stdout, stderr } = await execc("sf org list auth --json", {
      maxBuffer: 1024 * 1024 * 8
    });
    if (stdout === "" || !stdout) {
      console.log("ERROR GET AUTH LIST ORG : ", stderr);
      return null;
    }
    let bufferData = stdout;
    return JSON.parse(bufferData);
  } catch (e) {
    const { stdout, stderr } = await execc("sfdx org list auth --json", {
      maxBuffer: 1024 * 1024 * 8
    });
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
    const { stdout, stderr } = await execc("sfdx", {
      maxBuffer: 1024 * 1024 * 8
    });
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
    const { stdout, stderr } = await execc("sf", {
      maxBuffer: 1024 * 1024 * 8
    });
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
  const { stdout, stderr } = await execc("netstat -aon", {
    maxBuffer: 1024 * 1024 * 8
  });
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
      maxBuffer: 2048 * 1024 * 8
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
  const { stdout, stderr } = await execc("sfdx -v ", {
    maxBuffer: 1024 * 1024 * 8
  });
  let bufferData;
  if (stdout) {
    console.log("CHECK VERSION LOG : ", stdout);
    if (stdout.includes("sfdx-cli/")) {
      bufferData = { version: stdout.substring(9, 17), obsoleteVersion: true };
    } else if (stdout.includes("@salesforce/cli/")) {
      bufferData = {
        version: stdout.substring(16, 23),
        obsoleteVersion: false
      };
    }
    return bufferData;
  } else {
    console.log("ERROR : CHECK VERSION LOG : ", stdout);
    bufferData = stderr;
  }
  return bufferData;
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7XHJcbiAgYXBwLFxyXG4gIEJyb3dzZXJXaW5kb3csXHJcbiAgaXBjTWFpbixcclxuICBuYXRpdmVUaGVtZSxcclxuICBOb3RpZmljYXRpb24sXHJcbiAgc2hlbGwsXHJcbiAgY2xpcGJvYXJkLFxyXG59IGZyb20gXCJlbGVjdHJvblwiO1xyXG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgb3MgZnJvbSBcIm9zXCI7XHJcbmNvbnN0IHsgZGlhbG9nIH0gPSByZXF1aXJlKFwiZWxlY3Ryb25cIik7XHJcbmNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xyXG5pbXBvcnQgeyBleGVjLCBleGVjU3luYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XHJcblxyXG4vKiBpbXBvcnQgaW5zdGFsbEV4dGVuc2lvbiwge1xyXG4gIFZVRUpTX0RFVlRPT0xTXHJcbn0gZnJvbSBcImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlclwiOyAqL1xyXG4vKiB2YXIgeyBYTUxQYXJzZXIsIFhNTEJ1aWxkZXIsIFhNTFZhbGlkYXRvciB9ID0gcmVxdWlyZShcImZhc3QteG1sLXBhcnNlclwiKTsgKi9cclxuLy8gbmVlZGVkIGluIGNhc2UgcHJvY2VzcyBpcyB1bmRlZmluZWQgdW5kZXIgTGludXhcclxuY29uc3QgcGxhdGZvcm0gPSBwcm9jZXNzLnBsYXRmb3JtIHx8IG9zLnBsYXRmb3JtKCk7XHJcbnRyeSB7XHJcbiAgaWYgKHBsYXRmb3JtID09PSBcIndpbjMyXCIgJiYgbmF0aXZlVGhlbWUuc2hvdWxkVXNlRGFya0NvbG9ycyA9PT0gdHJ1ZSkge1xyXG4gICAgcmVxdWlyZShcImZzXCIpLnVubGlua1N5bmMoXHJcbiAgICAgIHBhdGguam9pbihhcHAuZ2V0UGF0aChcInVzZXJEYXRhXCIpLCBcIkRldlRvb2xzIEV4dGVuc2lvbnNcIilcclxuICAgICk7XHJcbiAgfVxyXG59IGNhdGNoIChfKSB7fVxyXG5cclxubGV0IG1haW5XaW5kb3c7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBjcmVhdGVXaW5kb3coKSB7XHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbCB3aW5kb3cgb3B0aW9uc1xyXG4gICAqL1xyXG4gIG1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XHJcbiAgICBpY29uOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImljb25zL2ljb24ucG5nXCIpLCAvLyB0cmF5IGljb25cclxuXHJcbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcclxuICAgIHRpdGxlQmFyU3R5bGU6IFwiaGlkZGVuXCIsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFwiIzAwRkZGRkZGXCIsXHJcbiAgICBmcmFtZTogZmFsc2UsXHJcbiAgICB3aWR0aDogMTQ1MCxcclxuICAgIGhlaWdodDogMTAwMSxcclxuICAgIHJlc2l6YWJsZTogZmFsc2UsXHJcbiAgICB1c2VDb250ZW50U2l6ZTogZmFsc2UsXHJcbiAgICB3ZWJQcmVmZXJlbmNlczoge1xyXG4gICAgICBlbmFibGVSZW1vdGVNb2R1bGU6IGZhbHNlLFxyXG4gICAgICBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLFxyXG4gICAgICBub2RlSW50ZWdyYXRpb246IHRydWUsXHJcbiAgICAgIC8vIE1vcmUgaW5mbzogaHR0cHM6Ly92Mi5xdWFzYXIuZGV2L3F1YXNhci1jbGktdml0ZS9kZXZlbG9waW5nLWVsZWN0cm9uLWFwcHMvZWxlY3Ryb24tcHJlbG9hZC1zY3JpcHRcclxuICAgICAgcHJlbG9hZDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgcHJvY2Vzcy5lbnYuUVVBU0FSX0VMRUNUUk9OX1BSRUxPQUQpLFxyXG4gICAgfSxcclxuICB9KTtcclxuXHJcbiAgbWFpbldpbmRvdy5sb2FkVVJMKHByb2Nlc3MuZW52LkFQUF9VUkwpO1xyXG5cclxuICBpZiAocHJvY2Vzcy5lbnYuREVCVUdHSU5HKSB7XHJcbiAgICAvLyBpZiBvbiBERVYgb3IgUHJvZHVjdGlvbiB3aXRoIGRlYnVnIGVuYWJsZWRcclxuICAgIHRyeSB7XHJcbiAgICAgIGluc3RhbGxFeHRlbnNpb24oXCJuaGRvZ2ptZWppZ2xpcGNjcG5ubmFuaGJsZWRhamJwZFwiKVxyXG4gICAgICAgIC50aGVuKChuYW1lKSA9PiBjb25zb2xlLmxvZyhgQWRkZWQgRXh0ZW5zaW9uOiAgJHtuYW1lfWApKVxyXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmxvZyhcIkFuIGVycm9yIG9jY3VycmVkOiBcIiwgZXJyKSk7XHJcbiAgICAgIGF3YWl0IGluc3RhbGxFeHRlbnNpb24oVlVFSlMzX0RFVlRPT0xTKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5sb2coZSk7XHJcbiAgICB9XHJcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9wZW5EZXZUb29scygpO1xyXG4gIH0gZWxzZSB7XHJcbiAgICAvLyB3ZSdyZSBvbiBwcm9kdWN0aW9uOyBubyBhY2Nlc3MgdG8gZGV2dG9vbHMgcGxzXHJcbiAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLm9uKFwiZGV2dG9vbHMtb3BlbmVkXCIsICgpID0+IHtcclxuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5jbG9zZURldlRvb2xzKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG1haW5XaW5kb3cub24oXCJjbG9zZWRcIiwgKCkgPT4ge1xyXG4gICAgbWFpbldpbmRvdyA9IG51bGw7XHJcbiAgfSk7XHJcbn1cclxuXHJcbmFwcC53aGVuUmVhZHkoKS50aGVuKChyZWFkeSkgPT4ge1xyXG4gIC8vY29uc29sZS5sb2cocmVhZHkpO1xyXG5cclxuICBjcmVhdGVXaW5kb3coKTtcclxufSk7XHJcblxyXG5hcHAub24oXCJ3aW5kb3ctYWxsLWNsb3NlZFwiLCAoKSA9PiB7XHJcbiAgaWYgKHBsYXRmb3JtICE9PSBcImRhcndpblwiKSB7XHJcbiAgICBhcHAucXVpdCgpO1xyXG4gIH1cclxufSk7XHJcblxyXG5hcHAub24oXCJhY3RpdmF0ZVwiLCAoKSA9PiB7XHJcbiAgaWYgKG1haW5XaW5kb3cgPT09IG51bGwpIHtcclxuICAgIGNyZWF0ZVdpbmRvdygpO1xyXG4gIH1cclxufSk7XHJcblxyXG5pcGNNYWluLmhhbmRsZShcInF1aXQtYXBwXCIsICgpID0+IHtcclxuICBhcHAucXVpdCgpO1xyXG59KTtcclxuXHJcbmlwY01haW4uaGFuZGxlKFwibWluLWFwcFwiLCAoKSA9PiB7XHJcbiAgbWFpbldpbmRvdy5taW5pbWl6ZSgpO1xyXG59KTtcclxuXHJcbmlwY01haW4uaGFuZGxlKFwibWF4LWFwcFwiLCAoKSA9PiB7XHJcbiAgaWYgKG1haW5XaW5kb3cuaXNNYXhpbWl6ZWQoKSkge1xyXG4gICAgbWFpbldpbmRvdy51bm1heGltaXplKCk7XHJcbiAgfSBlbHNlIHtcclxuICAgIG1haW5XaW5kb3cubWF4aW1pemUoKTtcclxuICB9XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5oYW5kbGUoXCJzYXZlLXBhY2thZ2VcIiwgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9PiB7XHJcbiAgLy9jb25zb2xlLmxvZyh2YWx1ZSwgYXJnc1swXSlcclxuICBkaWFsb2dcclxuICAgIC5zaG93U2F2ZURpYWxvZyh7XHJcbiAgICAgIHRpdGxlOiBcIlNlbGVjdCB0aGUgRmlsZSBQYXRoIHRvIHNhdmVcIixcclxuICAgICAgZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsIFwiLi4vLi4vLi4vcGFja2FnZVwiKSxcclxuICAgICAgLy8gZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9hc3NldHMvJyksXHJcbiAgICAgIGJ1dHRvbkxhYmVsOiBcIlNhdmVcIixcclxuICAgICAgLy8gUmVzdHJpY3RpbmcgdGhlIHVzZXIgdG8gb25seSBUZXh0IEZpbGVzLlxyXG4gICAgICBmaWx0ZXJzOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgbmFtZTogXCJ4bWxcIixcclxuICAgICAgICAgIGV4dGVuc2lvbnM6IFtcInhtbFwiXSxcclxuICAgICAgICB9LFxyXG4gICAgICBdLFxyXG4gICAgICBwcm9wZXJ0aWVzOiBbXSxcclxuICAgIH0pXHJcbiAgICAudGhlbigoZmlsZSkgPT4ge1xyXG4gICAgICAvLyBTdGF0aW5nIHdoZXRoZXIgZGlhbG9nIG9wZXJhdGlvbiB3YXMgY2FuY2VsbGVkIG9yIG5vdC5cclxuICAgICAgLy9jb25zb2xlLmxvZyhmaWxlLmNhbmNlbGVkKTtcclxuICAgICAgaWYgKCFmaWxlLmNhbmNlbGVkKSB7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICAvLyBDcmVhdGluZyBhbmQgV3JpdGluZyB0byB0aGUgc2FtcGxlLnR4dCBmaWxlXHJcbiAgICAgICAgZnMud3JpdGVGaWxlKGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSwgYXJnc1swXSwgZnVuY3Rpb24gKGVycikge1xyXG4gICAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xyXG4gICAgICAgICAgLy9jb25zb2xlLmxvZygnU2F2ZWQhJyk7XHJcbiAgICAgICAgICAvL21haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnbm90aWZ5LXNhdmVkLXhtbCcsIGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICBuZXcgTm90aWZpY2F0aW9uKHtcclxuICAgICAgICAgICAgdGl0bGU6IFwiWE1MRW5qb3llclwiLFxyXG4gICAgICAgICAgICBib2R5OiBcIlhNTCBQYWNrYWdlIHNhbHZhdG86XFxuXCIgKyBmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCksXHJcbiAgICAgICAgICB9KS5zaG93KCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5oYW5kbGUoXCJhdXRoLWxpc3RcIiwgYXN5bmMgKCkgPT4ge1xyXG4gIC8qICAgbGV0IF9DTEkgPSBleGVjKCdzZmR4IGZvcmNlOmF1dGg6bGlzdCAtLWpzb24nLCB7XHJcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxyXG4gICAgfSk7XHJcblxyXG4gICAgbGV0IGJ1ZmZlckRhdGEgPSAnJztcclxuXHJcbiAgICBfQ0xJLnN0ZG91dC5vbignZGF0YScsIChjaHVuaykgPT5cclxuICAgIHtcclxuICAgICAgLy8gICAgY29uc29sZS5sb2coJ0NIVU5LJywgY2h1bmspO1xyXG4gICAgICBidWZmZXJEYXRhICs9IGNodW5rO1xyXG4gICAgfSk7XHJcblxyXG4gICAgX0NMSS5zdGRpbi5vbignZGF0YScsIChkYXRhKSA9PlxyXG4gICAge1xyXG4gICAgICAvLyAgICBjb25zb2xlLmxvZygnSU4nLCBkYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIF9DTEkuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+XHJcbiAgICB7XHJcbiAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdFUlInLCBkYXRhKTtcclxuICAgIH0pO1xyXG5cclxuICAgIF9DTEkub24oJ2V4aXQnLCAoY29kZSwgc2lnbmFsKSA9PlxyXG4gICAge1xyXG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLnNlbmQoJ2F1dGgtbGlzdC1yZWFkZWQnLCBidWZmZXJEYXRhKTtcclxuICAgIH0pOyAqL1xyXG5cclxuICBjb25zdCB1dGlsID0gcmVxdWlyZShcIm5vZGU6dXRpbFwiKTtcclxuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoXCJub2RlOmNoaWxkX3Byb2Nlc3NcIikuZXhlYyk7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFwic2Ygb3JnIGxpc3QgYXV0aCAtLWpzb25cIiwge1xyXG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcclxuICAgIH0pO1xyXG4gICAgaWYgKHN0ZG91dCA9PT0gXCJcIiB8fCAhc3Rkb3V0KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiRVJST1IgR0VUIEFVVEggTElTVCBPUkcgOiBcIiwgc3RkZXJyKTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcclxuXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShidWZmZXJEYXRhKTtcclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcInNmZHggb3JnIGxpc3QgYXV0aCAtLWpzb25cIiwge1xyXG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcclxuICAgIH0pO1xyXG4gICAgaWYgKHN0ZG91dCA9PT0gXCJcIiB8fCAhc3Rkb3V0KSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKFwiRVJST1IgR0VUIEFVVEggTElTVCBPUkcgOiBcIiwgc3RkZXJyKTtcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbiAgICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcclxuXHJcbiAgICByZXR1cm4gSlNPTi5wYXJzZShidWZmZXJEYXRhKTtcclxuICB9XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5oYW5kbGUoXCJjaGVjay1jbGktaW5zdGFsbGVkXCIsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT4ge1xyXG4gIGxldCBjbGlGb3VuZGVkID0gZmFsc2U7XHJcbiAgdHJ5IHtcclxuICAgIGNvbnN0IHV0aWwgPSByZXF1aXJlKFwibm9kZTp1dGlsXCIpO1xyXG4gICAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKFwibm9kZTpjaGlsZF9wcm9jZXNzXCIpLmV4ZWMpO1xyXG4gICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXCJzZmR4XCIsIHtcclxuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXHJcbiAgICB9KTtcclxuICAgIGlmIChzdGRvdXQpIHtcclxuICAgICAgLy8gIGNvbnNvbGUubG9nKCdDSEVDSyBTRiBMT0cgOiAnLCBzdGRvdXQpO1xyXG4gICAgICBjbGlGb3VuZGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9IGNhdGNoIChlKSB7XHJcbiAgICBjbGlGb3VuZGVkID0gZmFsc2U7XHJcbiAgfVxyXG5cclxuICBpZiAoY2xpRm91bmRlZCkge1xyXG4gICAgcmV0dXJuIGNsaUZvdW5kZWQ7XHJcbiAgfVxyXG5cclxuICB0cnkge1xyXG4gICAgY29uc3QgdXRpbCA9IHJlcXVpcmUoXCJub2RlOnV0aWxcIik7XHJcbiAgICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoXCJub2RlOmNoaWxkX3Byb2Nlc3NcIikuZXhlYyk7XHJcbiAgICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcInNmXCIsIHtcclxuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXHJcbiAgICB9KTtcclxuICAgIGlmIChzdGRvdXQpIHtcclxuICAgICAgY29uc29sZS5sb2coXCJDSEVDSyBTRiBMT0cgOiBcIiwgc3Rkb3V0KTtcclxuICAgICAgY2xpRm91bmRlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgY2xpRm91bmRlZCA9IGZhbHNlO1xyXG4gIH1cclxuXHJcbiAgcmV0dXJuIGNsaUZvdW5kZWQ7XHJcbn0pO1xyXG5cclxuaXBjTWFpbi5oYW5kbGUoXCJsb2dvdXQtb3JnXCIsICh2YWx1ZSwgLi4uYXJncykgPT4ge1xyXG4gIGxldCBfQ0xJID0gZXhlYyhcInNmZHggYXV0aDpsb2dvdXQgLXUgXCIgKyBhcmdzWzBdICsgXCIgLXBcIiwge1xyXG4gICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXHJcbiAgfSk7XHJcblxyXG4gIF9DTEkuc3RkZXJyLm9uKFwiZGF0YVwiLCAoZGF0YSkgPT4ge1xyXG4gICAgY29uc29sZS5sb2coXCJFUlJcIiwgZGF0YSk7XHJcbiAgfSk7XHJcblxyXG4gIF9DTEkub24oXCJleGl0XCIsIChjb2RlLCBzaWduYWwpID0+IHtcclxuICAgIC8vdXBkYXRlT25Mb2dPcGVyYXRpb24oKTtcclxuICB9KTtcclxufSk7XHJcblxyXG4vKipcclxuICogJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xyXG4gICAgICArIGFyZ3NbMF0uYWxpYXNcclxuICAgICAgKyAnIC1yICcgKyBhcmdzWzBdLnVybFxyXG4gICAgICArICcgLS1qc29uJywge1xyXG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOFxyXG4gKi9cclxuXHJcbmlwY01haW4uaGFuZGxlKFwibG9naW4tb3JnXCIsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT4ge1xyXG4gIC8qKlxyXG4gICAqICdzZmR4IGZvcmNlOmF1dGg6d2ViOmxvZ2luIC1hICdcclxuICAgICAgICArIGFyZ3NbMF0uYWxpYXNcclxuICAgICAgICArICcgLXIgJyArIGFyZ3NbMF0udXJsXHJcbiAgICAgICAgKyAnIC0tanNvbidcclxuICAgKi9cclxuXHJcbiAgdHJ5IHtcclxuICAgIGxldCBwaWQgPSBhd2FpdCBnZXRQSUQxNzE3KCk7XHJcbiAgICBpZiAocGlkICE9IC0xKSB7XHJcbiAgICAgIHByb2Nlc3Mua2lsbChwaWQpO1xyXG4gICAgfVxyXG4gIH0gY2F0Y2ggKGVycikge1xyXG4gICAgY29uc29sZS5sb2coZXJyKTtcclxuICB9XHJcblxyXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKFwibm9kZTp1dGlsXCIpO1xyXG4gIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZShcIm5vZGU6Y2hpbGRfcHJvY2Vzc1wiKS5leGVjKTtcclxuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcclxuICAgIFwic2ZkeCBmb3JjZTphdXRoOndlYjpsb2dpbiAtYSBcIiArXHJcbiAgICAgIGFyZ3NbMF0uYWxpYXMgK1xyXG4gICAgICBcIiAtciBcIiArXHJcbiAgICAgIGFyZ3NbMF0udXJsICtcclxuICAgICAgXCIgLS1qc29uXCIsXHJcbiAgICB7XHJcbiAgICAgIHdpbmRvd3NIaWRlOiB0cnVlLFxyXG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcclxuICAgIH1cclxuICApO1xyXG4gIGxldCBidWZmZXJEYXRhID0gc3Rkb3V0O1xyXG5cclxuICByZXR1cm4gSlNPTi5wYXJzZShidWZmZXJEYXRhKTtcclxufSk7XHJcblxyXG5hc3luYyBmdW5jdGlvbiBnZXRQSUQxNzE3KCkge1xyXG4gIGxldCBzcGlkID0gLTE7XHJcbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoXCJub2RlOnV0aWxcIik7XHJcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKFwibm9kZTpjaGlsZF9wcm9jZXNzXCIpLmV4ZWMpO1xyXG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFwibmV0c3RhdCAtYW9uXCIsIHtcclxuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxyXG4gIH0pO1xyXG4gIGxldCBjaHVuayA9IHN0ZG91dDtcclxuICBsZXQgc3ViY2h1Y2sgPSBjaHVuay5zcGxpdChcIlxcblwiKTtcclxuICBzdWJjaHVjay5mb3JFYWNoKChjaCkgPT4ge1xyXG4gICAgaWYgKGNoLmluY2x1ZGVzKFwiOjE3MTdcIikpIHtcclxuICAgICAgbGV0IHBpZCA9IGNoLnNwbGl0KFwiIFwiKTtcclxuICAgICAgcGlkID0gcGlkLmF0KC0xKTtcclxuXHJcbiAgICAgIHNwaWQgPT0gLTEgPyAoc3BpZCA9IHBpZCkgOiBudWxsO1xyXG4gICAgfVxyXG4gIH0pO1xyXG4gIHJldHVybiBzcGlkO1xyXG59XHJcblxyXG5pcGNNYWluLmhhbmRsZShcImludGVycnVwdC1sb2dpblwiLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+IHtcclxuICB0cnkge1xyXG4gICAgbGV0IHBpZCA9IGF3YWl0IGdldFBJRDE3MTcoKTtcclxuICAgIGlmIChwaWQgIT0gLTEpIHtcclxuICAgICAgcHJvY2Vzcy5raWxsKHBpZCk7XHJcbiAgICB9XHJcbiAgfSBjYXRjaCAoZXJyKSB7XHJcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gIH1cclxufSk7XHJcblxyXG5pcGNNYWluLmhhbmRsZShcInJldHJpZXZlLW1ldGFkYXRhXCIsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT4ge1xyXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKFwibm9kZTp1dGlsXCIpO1xyXG4gIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZShcIm5vZGU6Y2hpbGRfcHJvY2Vzc1wiKS5leGVjKTtcclxuICAvL29sZFxyXG4gIC8qICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXHJcbiAgICAgICdzZmR4IGZvcmNlOm1kYXBpOmxpc3RtZXRhZGF0YSAtLWpzb24gLXUgJ1xyXG4gICAgICArIGFyZ3NbMF0ub3JnXHJcbiAgICAgICsgJyAtbSAnICsgYXJnc1swXS5tZHROYW1lXHJcbiAgICAgICsgJyAtYSAnICsgYXJnc1swXS5hcGksIHtcclxuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXHJcbiAgICB9KTsgKi9cclxuICAvL25ld1xyXG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxyXG4gICAgXCJzZiBvcmcgbGlzdCBtZXRhZGF0YSAtLWpzb24gLW8gXCIgK1xyXG4gICAgICBhcmdzWzBdLm9yZyArXHJcbiAgICAgIFwiIC1tIFwiICtcclxuICAgICAgYXJnc1swXS5tZHROYW1lICtcclxuICAgICAgXCIgLS1hcGktdmVyc2lvbiBcIiArXHJcbiAgICAgIGFyZ3NbMF0uYXBpLFxyXG4gICAge1xyXG4gICAgICBtYXhCdWZmZXI6IDIwNDggKiAxMDI0ICogOCxcclxuICAgIH1cclxuICApO1xyXG5cclxuICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcclxuICByZXR1cm4gYnVmZmVyRGF0YTtcclxufSk7XHJcblxyXG5pcGNNYWluLmhhbmRsZShcImdldC1jbGlwYm9hcmRcIiwgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9PiB7XHJcbiAgY29uc3QgdGV4dCA9IGNsaXBib2FyZC5yZWFkVGV4dCgpO1xyXG4gIGlmICh0ZXh0Lmxlbmd0aCA+IDAgfHwgdGV4dCkge1xyXG4gICAgcmV0dXJuIHRleHQ7XHJcbiAgfVxyXG4gIGNsaXBib2FyZC5jbGVhcigpO1xyXG59KTtcclxuXHJcbmlwY01haW4uaGFuZGxlKFwiY2hlY2stc2ZkeC11cGRhdGVcIiwgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9PiB7XHJcbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoXCJub2RlOnV0aWxcIik7XHJcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKFwibm9kZTpjaGlsZF9wcm9jZXNzXCIpLmV4ZWMpO1xyXG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFwic2ZkeCAtdiBcIiwge1xyXG4gICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXHJcbiAgfSk7XHJcbiAgbGV0IGJ1ZmZlckRhdGE7XHJcbiAgaWYgKHN0ZG91dCkge1xyXG4gICAgY29uc29sZS5sb2coXCJDSEVDSyBWRVJTSU9OIExPRyA6IFwiLCBzdGRvdXQpO1xyXG4gICAgaWYgKHN0ZG91dC5pbmNsdWRlcyhcInNmZHgtY2xpL1wiKSkge1xyXG4gICAgICBidWZmZXJEYXRhID0geyB2ZXJzaW9uOiBzdGRvdXQuc3Vic3RyaW5nKDksIDE3KSwgb2Jzb2xldGVWZXJzaW9uOiB0cnVlIH07XHJcbiAgICB9IGVsc2UgaWYgKHN0ZG91dC5pbmNsdWRlcyhcIkBzYWxlc2ZvcmNlL2NsaS9cIikpIHtcclxuICAgICAgYnVmZmVyRGF0YSA9IHtcclxuICAgICAgICB2ZXJzaW9uOiBzdGRvdXQuc3Vic3RyaW5nKDE2LCAyMyksXHJcbiAgICAgICAgb2Jzb2xldGVWZXJzaW9uOiBmYWxzZSxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIHJldHVybiBidWZmZXJEYXRhO1xyXG4gIH0gZWxzZSB7XHJcbiAgICBjb25zb2xlLmxvZyhcIkVSUk9SIDogQ0hFQ0sgVkVSU0lPTiBMT0cgOiBcIiwgc3Rkb3V0KTtcclxuICAgIGJ1ZmZlckRhdGEgPSBzdGRlcnI7XHJcbiAgfVxyXG4gIHJldHVybiBidWZmZXJEYXRhO1xyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQkFRTztBQUNQLGtCQUFpQjtBQUNqQixnQkFBZTtBQUdmLDJCQUErQjtBQUYvQixJQUFNLEVBQUUsT0FBTyxJQUFJLFFBQVE7QUFDM0IsSUFBTSxLQUFLLFFBQVE7QUFRbkIsSUFBTSxXQUFXLFFBQVEsWUFBWSxVQUFBQSxRQUFHLFNBQVM7QUFDakQsSUFBSTtBQUNGLE1BQUksYUFBYSxXQUFXLDRCQUFZLHdCQUF3QixNQUFNO0FBQ3BFLFlBQVEsTUFBTTtBQUFBLE1BQ1osWUFBQUMsUUFBSyxLQUFLLG9CQUFJLFFBQVEsVUFBVSxHQUFHLHFCQUFxQjtBQUFBLElBQzFEO0FBQUEsRUFDRjtBQUNGLFNBQVMsR0FBUDtBQUFXO0FBRWIsSUFBSTtBQUVKLGVBQWUsZUFBZTtBQUk1QixlQUFhLElBQUksOEJBQWM7QUFBQSxJQUM3QixNQUFNLFlBQUFBLFFBQUssUUFBUSxXQUFXLGdCQUFnQjtBQUFBLElBRTlDLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxJQUNmLGlCQUFpQjtBQUFBLElBQ2pCLE9BQU87QUFBQSxJQUNQLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGdCQUFnQjtBQUFBLElBQ2hCLGdCQUFnQjtBQUFBLE1BQ2Qsb0JBQW9CO0FBQUEsTUFDcEIsa0JBQWtCO0FBQUEsTUFDbEIsaUJBQWlCO0FBQUEsTUFFakIsU0FBUyxZQUFB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
