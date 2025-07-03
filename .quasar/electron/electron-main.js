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
      preload: import_path.default.resolve(__dirname, "C:\\Users\\stpastor\\OneDrive - NTT DATA EMEAL\\Documents\\XMLEnjoyer\\.quasar\\electron\\electron-preload.js")
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7XG4gIGFwcCxcbiAgQnJvd3NlcldpbmRvdyxcbiAgaXBjTWFpbixcbiAgbmF0aXZlVGhlbWUsXG4gIE5vdGlmaWNhdGlvbixcbiAgc2hlbGwsXG4gIGNsaXBib2FyZCxcbn0gZnJvbSBcImVsZWN0cm9uXCI7XG5pbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IG9zIGZyb20gXCJvc1wiO1xuY29uc3QgeyBkaWFsb2cgfSA9IHJlcXVpcmUoXCJlbGVjdHJvblwiKTtcbmNvbnN0IGZzID0gcmVxdWlyZShcImZzXCIpO1xuaW1wb3J0IHsgZXhlYywgZXhlY1N5bmMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuXG4vKiBpbXBvcnQgaW5zdGFsbEV4dGVuc2lvbiwge1xuICBWVUVKU19ERVZUT09MU1xufSBmcm9tIFwiZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyXCI7ICovXG4vKiB2YXIgeyBYTUxQYXJzZXIsIFhNTEJ1aWxkZXIsIFhNTFZhbGlkYXRvciB9ID0gcmVxdWlyZShcImZhc3QteG1sLXBhcnNlclwiKTsgKi9cbi8vIG5lZWRlZCBpbiBjYXNlIHByb2Nlc3MgaXMgdW5kZWZpbmVkIHVuZGVyIExpbnV4XG5jb25zdCBwbGF0Zm9ybSA9IHByb2Nlc3MucGxhdGZvcm0gfHwgb3MucGxhdGZvcm0oKTtcbnRyeSB7XG4gIGlmIChwbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiICYmIG5hdGl2ZVRoZW1lLnNob3VsZFVzZURhcmtDb2xvcnMgPT09IHRydWUpIHtcbiAgICByZXF1aXJlKFwiZnNcIikudW5saW5rU3luYyhcbiAgICAgIHBhdGguam9pbihhcHAuZ2V0UGF0aChcInVzZXJEYXRhXCIpLCBcIkRldlRvb2xzIEV4dGVuc2lvbnNcIilcbiAgICApO1xuICB9XG59IGNhdGNoIChfKSB7fVxuXG5sZXQgbWFpbldpbmRvdztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2luZG93KCkge1xuICAvKipcbiAgICogSW5pdGlhbCB3aW5kb3cgb3B0aW9uc1xuICAgKi9cbiAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICBpY29uOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImljb25zL2ljb24ucG5nXCIpLCAvLyB0cmF5IGljb25cblxuICAgIHRyYW5zcGFyZW50OiB0cnVlLFxuICAgIHRpdGxlQmFyU3R5bGU6IFwiaGlkZGVuXCIsXG4gICAgYmFja2dyb3VuZENvbG9yOiBcIiMwMEZGRkZGRlwiLFxuICAgIGZyYW1lOiBmYWxzZSxcbiAgICB3aWR0aDogMTQ1MCxcbiAgICBoZWlnaHQ6IDEwMDEsXG4gICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICB1c2VDb250ZW50U2l6ZTogZmFsc2UsXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgIGVuYWJsZVJlbW90ZU1vZHVsZTogZmFsc2UsXG4gICAgICBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLFxuICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgLy8gTW9yZSBpbmZvOiBodHRwczovL3YyLnF1YXNhci5kZXYvcXVhc2FyLWNsaS12aXRlL2RldmVsb3BpbmctZWxlY3Ryb24tYXBwcy9lbGVjdHJvbi1wcmVsb2FkLXNjcmlwdFxuICAgICAgcHJlbG9hZDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgcHJvY2Vzcy5lbnYuUVVBU0FSX0VMRUNUUk9OX1BSRUxPQUQpLFxuICAgIH0sXG4gIH0pO1xuXG4gIG1haW5XaW5kb3cubG9hZFVSTChwcm9jZXNzLmVudi5BUFBfVVJMKTtcblxuICBpZiAocHJvY2Vzcy5lbnYuREVCVUdHSU5HKSB7XG4gICAgLy8gaWYgb24gREVWIG9yIFByb2R1Y3Rpb24gd2l0aCBkZWJ1ZyBlbmFibGVkXG4gICAgdHJ5IHtcbiAgICAgIGluc3RhbGxFeHRlbnNpb24oXCJuaGRvZ2ptZWppZ2xpcGNjcG5ubmFuaGJsZWRhamJwZFwiKVxuICAgICAgICAudGhlbigobmFtZSkgPT4gY29uc29sZS5sb2coYEFkZGVkIEV4dGVuc2lvbjogICR7bmFtZX1gKSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUubG9nKFwiQW4gZXJyb3Igb2NjdXJyZWQ6IFwiLCBlcnIpKTtcbiAgICAgIGF3YWl0IGluc3RhbGxFeHRlbnNpb24oVlVFSlMzX0RFVlRPT0xTKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9XG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgfSBlbHNlIHtcbiAgICAvLyB3ZSdyZSBvbiBwcm9kdWN0aW9uOyBubyBhY2Nlc3MgdG8gZGV2dG9vbHMgcGxzXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vbihcImRldnRvb2xzLW9wZW5lZFwiLCAoKSA9PiB7XG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLmNsb3NlRGV2VG9vbHMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG1haW5XaW5kb3cub24oXCJjbG9zZWRcIiwgKCkgPT4ge1xuICAgIG1haW5XaW5kb3cgPSBudWxsO1xuICB9KTtcbn1cblxuYXBwLndoZW5SZWFkeSgpLnRoZW4oKHJlYWR5KSA9PiB7XG4gIC8vY29uc29sZS5sb2cocmVhZHkpO1xuXG4gIGNyZWF0ZVdpbmRvdygpO1xufSk7XG5cbmFwcC5vbihcIndpbmRvdy1hbGwtY2xvc2VkXCIsICgpID0+IHtcbiAgaWYgKHBsYXRmb3JtICE9PSBcImRhcndpblwiKSB7XG4gICAgYXBwLnF1aXQoKTtcbiAgfVxufSk7XG5cbmFwcC5vbihcImFjdGl2YXRlXCIsICgpID0+IHtcbiAgaWYgKG1haW5XaW5kb3cgPT09IG51bGwpIHtcbiAgICBjcmVhdGVXaW5kb3coKTtcbiAgfVxufSk7XG5cbmlwY01haW4uaGFuZGxlKFwicXVpdC1hcHBcIiwgKCkgPT4ge1xuICBhcHAucXVpdCgpO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKFwibWluLWFwcFwiLCAoKSA9PiB7XG4gIG1haW5XaW5kb3cubWluaW1pemUoKTtcbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcIm1heC1hcHBcIiwgKCkgPT4ge1xuICBpZiAobWFpbldpbmRvdy5pc01heGltaXplZCgpKSB7XG4gICAgbWFpbldpbmRvdy51bm1heGltaXplKCk7XG4gIH0gZWxzZSB7XG4gICAgbWFpbldpbmRvdy5tYXhpbWl6ZSgpO1xuICB9XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJzYXZlLXBhY2thZ2VcIiwgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9PiB7XG4gIC8vY29uc29sZS5sb2codmFsdWUsIGFyZ3NbMF0pXG4gIGRpYWxvZ1xuICAgIC5zaG93U2F2ZURpYWxvZyh7XG4gICAgICB0aXRsZTogXCJTZWxlY3QgdGhlIEZpbGUgUGF0aCB0byBzYXZlXCIsXG4gICAgICBkZWZhdWx0UGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgXCIuLi8uLi8uLi9wYWNrYWdlXCIpLFxuICAgICAgLy8gZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9hc3NldHMvJyksXG4gICAgICBidXR0b25MYWJlbDogXCJTYXZlXCIsXG4gICAgICAvLyBSZXN0cmljdGluZyB0aGUgdXNlciB0byBvbmx5IFRleHQgRmlsZXMuXG4gICAgICBmaWx0ZXJzOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBuYW1lOiBcInhtbFwiLFxuICAgICAgICAgIGV4dGVuc2lvbnM6IFtcInhtbFwiXSxcbiAgICAgICAgfSxcbiAgICAgIF0sXG4gICAgICBwcm9wZXJ0aWVzOiBbXSxcbiAgICB9KVxuICAgIC50aGVuKChmaWxlKSA9PiB7XG4gICAgICAvLyBTdGF0aW5nIHdoZXRoZXIgZGlhbG9nIG9wZXJhdGlvbiB3YXMgY2FuY2VsbGVkIG9yIG5vdC5cbiAgICAgIC8vY29uc29sZS5sb2coZmlsZS5jYW5jZWxlZCk7XG4gICAgICBpZiAoIWZpbGUuY2FuY2VsZWQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCkpO1xuXG4gICAgICAgIC8vIENyZWF0aW5nIGFuZCBXcml0aW5nIHRvIHRoZSBzYW1wbGUudHh0IGZpbGVcbiAgICAgICAgZnMud3JpdGVGaWxlKGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSwgYXJnc1swXSwgZnVuY3Rpb24gKGVycikge1xuICAgICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgICAvL2NvbnNvbGUubG9nKCdTYXZlZCEnKTtcbiAgICAgICAgICAvL21haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnbm90aWZ5LXNhdmVkLXhtbCcsIGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XG4gICAgICAgICAgbmV3IE5vdGlmaWNhdGlvbih7XG4gICAgICAgICAgICB0aXRsZTogXCJYTUxFbmpveWVyXCIsXG4gICAgICAgICAgICBib2R5OiBcIlhNTCBQYWNrYWdlIHNhbHZhdG86XFxuXCIgKyBmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCksXG4gICAgICAgICAgfSkuc2hvdygpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KVxuICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgIH0pO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKFwiYXV0aC1saXN0XCIsIGFzeW5jICgpID0+IHtcbiAgLyogICBsZXQgX0NMSSA9IGV4ZWMoJ3NmZHggZm9yY2U6YXV0aDpsaXN0IC0tanNvbicsIHtcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICAgIH0pO1xuXG4gICAgbGV0IGJ1ZmZlckRhdGEgPSAnJztcblxuICAgIF9DTEkuc3Rkb3V0Lm9uKCdkYXRhJywgKGNodW5rKSA9PlxuICAgIHtcbiAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdDSFVOSycsIGNodW5rKTtcbiAgICAgIGJ1ZmZlckRhdGEgKz0gY2h1bms7XG4gICAgfSk7XG5cbiAgICBfQ0xJLnN0ZGluLm9uKCdkYXRhJywgKGRhdGEpID0+XG4gICAge1xuICAgICAgLy8gICAgY29uc29sZS5sb2coJ0lOJywgZGF0YSk7XG4gICAgfSk7XG5cbiAgICBfQ0xJLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PlxuICAgIHtcbiAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdFUlInLCBkYXRhKTtcbiAgICB9KTtcblxuICAgIF9DTEkub24oJ2V4aXQnLCAoY29kZSwgc2lnbmFsKSA9PlxuICAgIHtcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnYXV0aC1saXN0LXJlYWRlZCcsIGJ1ZmZlckRhdGEpO1xuICAgIH0pOyAqL1xuXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKFwibm9kZTp1dGlsXCIpO1xuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoXCJub2RlOmNoaWxkX3Byb2Nlc3NcIikuZXhlYyk7XG4gIHRyeSB7XG4gICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXCJzZiBvcmcgbGlzdCBhdXRoIC0tanNvblwiLCB7XG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgICB9KTtcbiAgICBpZiAoc3Rkb3V0ID09PSBcIlwiIHx8ICFzdGRvdXQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwiRVJST1IgR0VUIEFVVEggTElTVCBPUkcgOiBcIiwgc3RkZXJyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcblxuICAgIHJldHVybiBKU09OLnBhcnNlKGJ1ZmZlckRhdGEpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXCJzZmR4IG9yZyBsaXN0IGF1dGggLS1qc29uXCIsIHtcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICAgIH0pO1xuICAgIGlmIChzdGRvdXQgPT09IFwiXCIgfHwgIXN0ZG91dCkge1xuICAgICAgY29uc29sZS5sb2coXCJFUlJPUiBHRVQgQVVUSCBMSVNUIE9SRyA6IFwiLCBzdGRlcnIpO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGxldCBidWZmZXJEYXRhID0gc3Rkb3V0O1xuXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoYnVmZmVyRGF0YSk7XG4gIH1cbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcImNoZWNrLWNsaS1pbnN0YWxsZWRcIiwgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9PiB7XG4gIGxldCBjbGlGb3VuZGVkID0gZmFsc2U7XG4gIHRyeSB7XG4gICAgY29uc3QgdXRpbCA9IHJlcXVpcmUoXCJub2RlOnV0aWxcIik7XG4gICAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKFwibm9kZTpjaGlsZF9wcm9jZXNzXCIpLmV4ZWMpO1xuICAgIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFwic2ZkeFwiLCB7XG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgICB9KTtcbiAgICBpZiAoc3Rkb3V0KSB7XG4gICAgICAvLyAgY29uc29sZS5sb2coJ0NIRUNLIFNGIExPRyA6ICcsIHN0ZG91dCk7XG4gICAgICBjbGlGb3VuZGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjbGlGb3VuZGVkID0gZmFsc2U7XG4gIH1cblxuICBpZiAoY2xpRm91bmRlZCkge1xuICAgIHJldHVybiBjbGlGb3VuZGVkO1xuICB9XG5cbiAgdHJ5IHtcbiAgICBjb25zdCB1dGlsID0gcmVxdWlyZShcIm5vZGU6dXRpbFwiKTtcbiAgICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoXCJub2RlOmNoaWxkX3Byb2Nlc3NcIikuZXhlYyk7XG4gICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXCJzZlwiLCB7XG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgICB9KTtcbiAgICBpZiAoc3Rkb3V0KSB7XG4gICAgICBjb25zb2xlLmxvZyhcIkNIRUNLIFNGIExPRyA6IFwiLCBzdGRvdXQpO1xuICAgICAgY2xpRm91bmRlZCA9IHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7XG4gICAgY2xpRm91bmRlZCA9IGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGNsaUZvdW5kZWQ7XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJsb2dvdXQtb3JnXCIsICh2YWx1ZSwgLi4uYXJncykgPT4ge1xuICBsZXQgX0NMSSA9IGV4ZWMoXCJzZmR4IGF1dGg6bG9nb3V0IC11IFwiICsgYXJnc1swXSArIFwiIC1wXCIsIHtcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgfSk7XG5cbiAgX0NMSS5zdGRlcnIub24oXCJkYXRhXCIsIChkYXRhKSA9PiB7XG4gICAgY29uc29sZS5sb2coXCJFUlJcIiwgZGF0YSk7XG4gIH0pO1xuXG4gIF9DTEkub24oXCJleGl0XCIsIChjb2RlLCBzaWduYWwpID0+IHtcbiAgICAvL3VwZGF0ZU9uTG9nT3BlcmF0aW9uKCk7XG4gIH0pO1xufSk7XG5cbi8qKlxuICogJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xuICAgICAgKyBhcmdzWzBdLmFsaWFzXG4gICAgICArICcgLXIgJyArIGFyZ3NbMF0udXJsXG4gICAgICArICcgLS1qc29uJywge1xuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDhcbiAqL1xuXG5pcGNNYWluLmhhbmRsZShcImxvZ2luLW9yZ1wiLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+IHtcbiAgLyoqXG4gICAqICdzZmR4IGZvcmNlOmF1dGg6d2ViOmxvZ2luIC1hICdcbiAgICAgICAgKyBhcmdzWzBdLmFsaWFzXG4gICAgICAgICsgJyAtciAnICsgYXJnc1swXS51cmxcbiAgICAgICAgKyAnIC0tanNvbidcbiAgICovXG5cbiAgdHJ5IHtcbiAgICBsZXQgcGlkID0gYXdhaXQgZ2V0UElEMTcxNygpO1xuICAgIGlmIChwaWQgIT0gLTEpIHtcbiAgICAgIHByb2Nlc3Mua2lsbChwaWQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfVxuXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKFwibm9kZTp1dGlsXCIpO1xuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoXCJub2RlOmNoaWxkX3Byb2Nlc3NcIikuZXhlYyk7XG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxuICAgIFwic2ZkeCBmb3JjZTphdXRoOndlYjpsb2dpbiAtYSBcIiArXG4gICAgICBhcmdzWzBdLmFsaWFzICtcbiAgICAgIFwiIC1yIFwiICtcbiAgICAgIGFyZ3NbMF0udXJsICtcbiAgICAgIFwiIC0tanNvblwiLFxuICAgIHtcbiAgICAgIHdpbmRvd3NIaWRlOiB0cnVlLFxuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gICAgfVxuICApO1xuICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcblxuICByZXR1cm4gSlNPTi5wYXJzZShidWZmZXJEYXRhKTtcbn0pO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRQSUQxNzE3KCkge1xuICBsZXQgc3BpZCA9IC0xO1xuICBjb25zdCB1dGlsID0gcmVxdWlyZShcIm5vZGU6dXRpbFwiKTtcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKFwibm9kZTpjaGlsZF9wcm9jZXNzXCIpLmV4ZWMpO1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcIm5ldHN0YXQgLWFvblwiLCB7XG4gICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gIH0pO1xuICBsZXQgY2h1bmsgPSBzdGRvdXQ7XG4gIGxldCBzdWJjaHVjayA9IGNodW5rLnNwbGl0KFwiXFxuXCIpO1xuICBzdWJjaHVjay5mb3JFYWNoKChjaCkgPT4ge1xuICAgIGlmIChjaC5pbmNsdWRlcyhcIjoxNzE3XCIpKSB7XG4gICAgICBsZXQgcGlkID0gY2guc3BsaXQoXCIgXCIpO1xuICAgICAgcGlkID0gcGlkLmF0KC0xKTtcblxuICAgICAgc3BpZCA9PSAtMSA/IChzcGlkID0gcGlkKSA6IG51bGw7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHNwaWQ7XG59XG5cbmlwY01haW4uaGFuZGxlKFwiaW50ZXJydXB0LWxvZ2luXCIsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT4ge1xuICB0cnkge1xuICAgIGxldCBwaWQgPSBhd2FpdCBnZXRQSUQxNzE3KCk7XG4gICAgaWYgKHBpZCAhPSAtMSkge1xuICAgICAgcHJvY2Vzcy5raWxsKHBpZCk7XG4gICAgfVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpO1xuICB9XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJyZXRyaWV2ZS1tZXRhZGF0YVwiLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+IHtcbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoXCJub2RlOnV0aWxcIik7XG4gIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZShcIm5vZGU6Y2hpbGRfcHJvY2Vzc1wiKS5leGVjKTtcbiAgLy9vbGRcbiAgLyogICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAgICdzZmR4IGZvcmNlOm1kYXBpOmxpc3RtZXRhZGF0YSAtLWpzb24gLXUgJ1xuICAgICAgKyBhcmdzWzBdLm9yZ1xuICAgICAgKyAnIC1tICcgKyBhcmdzWzBdLm1kdE5hbWVcbiAgICAgICsgJyAtYSAnICsgYXJnc1swXS5hcGksIHtcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICAgIH0pOyAqL1xuICAvL25ld1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICBcInNmIG9yZyBsaXN0IG1ldGFkYXRhIC0tanNvbiAtbyBcIiArXG4gICAgICBhcmdzWzBdLm9yZyArXG4gICAgICBcIiAtbSBcIiArXG4gICAgICBhcmdzWzBdLm1kdE5hbWUgK1xuICAgICAgXCIgLS1hcGktdmVyc2lvbiBcIiArXG4gICAgICBhcmdzWzBdLmFwaSxcbiAgICB7XG4gICAgICBtYXhCdWZmZXI6IDIwNDggKiAxMDI0ICogOCxcbiAgICB9XG4gICk7XG5cbiAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XG4gIHJldHVybiBidWZmZXJEYXRhO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKFwiZ2V0LWNsaXBib2FyZFwiLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+IHtcbiAgY29uc3QgdGV4dCA9IGNsaXBib2FyZC5yZWFkVGV4dCgpO1xuICBpZiAodGV4dC5sZW5ndGggPiAwIHx8IHRleHQpIHtcbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuICBjbGlwYm9hcmQuY2xlYXIoKTtcbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcImNoZWNrLXNmZHgtdXBkYXRlXCIsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT4ge1xuICBjb25zdCB1dGlsID0gcmVxdWlyZShcIm5vZGU6dXRpbFwiKTtcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKFwibm9kZTpjaGlsZF9wcm9jZXNzXCIpLmV4ZWMpO1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcInNmZHggLXYgXCIsIHtcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgfSk7XG4gIGxldCBidWZmZXJEYXRhO1xuICBpZiAoc3Rkb3V0KSB7XG4gICAgY29uc29sZS5sb2coXCJDSEVDSyBWRVJTSU9OIExPRyA6IFwiLCBzdGRvdXQpO1xuICAgIGlmIChzdGRvdXQuaW5jbHVkZXMoXCJzZmR4LWNsaS9cIikpIHtcbiAgICAgIGJ1ZmZlckRhdGEgPSB7IHZlcnNpb246IHN0ZG91dC5zdWJzdHJpbmcoOSwgMTcpLCBvYnNvbGV0ZVZlcnNpb246IHRydWUgfTtcbiAgICB9IGVsc2UgaWYgKHN0ZG91dC5pbmNsdWRlcyhcIkBzYWxlc2ZvcmNlL2NsaS9cIikpIHtcbiAgICAgIGJ1ZmZlckRhdGEgPSB7XG4gICAgICAgIHZlcnNpb246IHN0ZG91dC5zdWJzdHJpbmcoMTYsIDIzKSxcbiAgICAgICAgb2Jzb2xldGVWZXJzaW9uOiBmYWxzZSxcbiAgICAgIH07XG4gICAgfVxuICAgIHJldHVybiBidWZmZXJEYXRhO1xuICB9IGVsc2Uge1xuICAgIGNvbnNvbGUubG9nKFwiRVJST1IgOiBDSEVDSyBWRVJTSU9OIExPRyA6IFwiLCBzdGRvdXQpO1xuICAgIGJ1ZmZlckRhdGEgPSBzdGRlcnI7XG4gIH1cbiAgcmV0dXJuIGJ1ZmZlckRhdGE7XG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0JBUU87QUFDUCxrQkFBaUI7QUFDakIsZ0JBQWU7QUFHZiwyQkFBK0I7QUFGL0IsSUFBTSxFQUFFLE9BQU8sSUFBSSxRQUFRO0FBQzNCLElBQU0sS0FBSyxRQUFRO0FBUW5CLElBQU0sV0FBVyxRQUFRLFlBQVksVUFBQUEsUUFBRyxTQUFTO0FBQ2pELElBQUk7QUFDRixNQUFJLGFBQWEsV0FBVyw0QkFBWSx3QkFBd0IsTUFBTTtBQUNwRSxZQUFRLE1BQU07QUFBQSxNQUNaLFlBQUFDLFFBQUssS0FBSyxvQkFBSSxRQUFRLFVBQVUsR0FBRyxxQkFBcUI7QUFBQSxJQUMxRDtBQUFBLEVBQ0Y7QUFDRixTQUFTLEdBQVA7QUFBVztBQUViLElBQUk7QUFFSixlQUFlLGVBQWU7QUFJNUIsZUFBYSxJQUFJLDhCQUFjO0FBQUEsSUFDN0IsTUFBTSxZQUFBQSxRQUFLLFFBQVEsV0FBVyxnQkFBZ0I7QUFBQSxJQUU5QyxhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsSUFDZixpQkFBaUI7QUFBQSxJQUNqQixPQUFPO0FBQUEsSUFDUCxPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixX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
