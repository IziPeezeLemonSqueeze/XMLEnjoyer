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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgbmF0aXZlVGhlbWUsIE5vdGlmaWNhdGlvbiwgc2hlbGwsIGNsaXBib2FyZCB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBvcyBmcm9tIFwib3NcIjtcbmNvbnN0IHsgZGlhbG9nIH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5pbXBvcnQgeyBleGVjLCBleGVjU3luYyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XG5cblxuLyogaW1wb3J0IGluc3RhbGxFeHRlbnNpb24sIHtcbiAgVlVFSlNfREVWVE9PTFNcbn0gZnJvbSBcImVsZWN0cm9uLWRldnRvb2xzLWluc3RhbGxlclwiOyAqL1xuLyogdmFyIHsgWE1MUGFyc2VyLCBYTUxCdWlsZGVyLCBYTUxWYWxpZGF0b3IgfSA9IHJlcXVpcmUoXCJmYXN0LXhtbC1wYXJzZXJcIik7ICovXG4vLyBuZWVkZWQgaW4gY2FzZSBwcm9jZXNzIGlzIHVuZGVmaW5lZCB1bmRlciBMaW51eFxuY29uc3QgcGxhdGZvcm0gPSBwcm9jZXNzLnBsYXRmb3JtIHx8IG9zLnBsYXRmb3JtKCk7XG50cnlcbntcbiAgaWYgKHBsYXRmb3JtID09PSBcIndpbjMyXCIgJiYgbmF0aXZlVGhlbWUuc2hvdWxkVXNlRGFya0NvbG9ycyA9PT0gdHJ1ZSlcbiAge1xuICAgIHJlcXVpcmUoXCJmc1wiKS51bmxpbmtTeW5jKFxuICAgICAgcGF0aC5qb2luKGFwcC5nZXRQYXRoKFwidXNlckRhdGFcIiksIFwiRGV2VG9vbHMgRXh0ZW5zaW9uc1wiKVxuICAgICk7XG4gIH1cbn0gY2F0Y2ggKF8pIHsgfVxuXG5sZXQgbWFpbldpbmRvdztcblxuYXN5bmMgZnVuY3Rpb24gY3JlYXRlV2luZG93KClcbntcbiAgLyoqXG4gICAqIEluaXRpYWwgd2luZG93IG9wdGlvbnNcbiAgICovXG4gIG1haW5XaW5kb3cgPSBuZXcgQnJvd3NlcldpbmRvdyh7XG4gICAgaWNvbjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJpY29ucy9pY29uLnBuZ1wiKSwgLy8gdHJheSBpY29uXG5cbiAgICB0cmFuc3BhcmVudDogdHJ1ZSxcbiAgICB0aXRsZUJhclN0eWxlOiAnaGlkZGVuJyxcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMDBGRkZGRkYnLFxuICAgIGZyYW1lOiBmYWxzZSxcbiAgICB3aWR0aDogMTQ1MCxcbiAgICBoZWlnaHQ6IDEwMDEsXG4gICAgcmVzaXphYmxlOiBmYWxzZSxcbiAgICB1c2VDb250ZW50U2l6ZTogZmFsc2UsXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgIGVuYWJsZVJlbW90ZU1vZHVsZTogZmFsc2UsXG4gICAgICBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLFxuICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgLy8gTW9yZSBpbmZvOiBodHRwczovL3YyLnF1YXNhci5kZXYvcXVhc2FyLWNsaS12aXRlL2RldmVsb3BpbmctZWxlY3Ryb24tYXBwcy9lbGVjdHJvbi1wcmVsb2FkLXNjcmlwdFxuICAgICAgcHJlbG9hZDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgcHJvY2Vzcy5lbnYuUVVBU0FSX0VMRUNUUk9OX1BSRUxPQUQpLFxuICAgIH0sXG4gIH0pO1xuXG5cblxuICBtYWluV2luZG93LmxvYWRVUkwocHJvY2Vzcy5lbnYuQVBQX1VSTCk7XG5cbiAgaWYgKHByb2Nlc3MuZW52LkRFQlVHR0lORylcbiAge1xuICAgIC8vIGlmIG9uIERFViBvciBQcm9kdWN0aW9uIHdpdGggZGVidWcgZW5hYmxlZFxuICAgIHRyeVxuICAgIHtcbiAgICAgIGluc3RhbGxFeHRlbnNpb24oXCJuaGRvZ2ptZWppZ2xpcGNjcG5ubmFuaGJsZWRhamJwZFwiKVxuICAgICAgICAudGhlbigobmFtZSkgPT4gY29uc29sZS5sb2coYEFkZGVkIEV4dGVuc2lvbjogICR7bmFtZX1gKSlcbiAgICAgICAgLmNhdGNoKChlcnIpID0+IGNvbnNvbGUubG9nKFwiQW4gZXJyb3Igb2NjdXJyZWQ6IFwiLCBlcnIpKTtcbiAgICAgIGF3YWl0IGluc3RhbGxFeHRlbnNpb24oVlVFSlMzX0RFVlRPT0xTKTtcblxuICAgIH0gY2F0Y2ggKGUpXG4gICAge1xuICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgfVxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XG5cbiAgfSBlbHNlXG4gIHtcbiAgICAvLyB3ZSdyZSBvbiBwcm9kdWN0aW9uOyBubyBhY2Nlc3MgdG8gZGV2dG9vbHMgcGxzXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vbihcImRldnRvb2xzLW9wZW5lZFwiLCAoKSA9PlxuICAgIHtcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuY2xvc2VEZXZUb29scygpO1xuICAgIH0pO1xuICB9XG5cbiAgbWFpbldpbmRvdy5vbihcImNsb3NlZFwiLCAoKSA9PlxuICB7XG4gICAgbWFpbldpbmRvdyA9IG51bGw7XG4gIH0pO1xufVxuXG5hcHAud2hlblJlYWR5KCkudGhlbigocmVhZHkpID0+XG57XG4gIC8vY29uc29sZS5sb2cocmVhZHkpO1xuXG4gIGNyZWF0ZVdpbmRvdygpO1xuXG5cbn0pO1xuXG5hcHAub24oXCJ3aW5kb3ctYWxsLWNsb3NlZFwiLCAoKSA9Plxue1xuICBpZiAocGxhdGZvcm0gIT09IFwiZGFyd2luXCIpXG4gIHtcbiAgICBhcHAucXVpdCgpO1xuICB9XG59KTtcblxuYXBwLm9uKFwiYWN0aXZhdGVcIiwgKCkgPT5cbntcbiAgaWYgKG1haW5XaW5kb3cgPT09IG51bGwpXG4gIHtcbiAgICBjcmVhdGVXaW5kb3coKTtcbiAgfVxufSk7XG5cbmlwY01haW4uaGFuZGxlKFwicXVpdC1hcHBcIiwgKCkgPT5cbntcbiAgYXBwLnF1aXQoKTtcbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcIm1pbi1hcHBcIiwgKCkgPT5cbntcbiAgbWFpbldpbmRvdy5taW5pbWl6ZSgpO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKFwibWF4LWFwcFwiLCAoKSA9Plxue1xuICBpZiAobWFpbldpbmRvdy5pc01heGltaXplZCgpKVxuICB7XG4gICAgbWFpbldpbmRvdy51bm1heGltaXplKClcbiAgfSBlbHNlXG4gIHtcbiAgICBtYWluV2luZG93Lm1heGltaXplKClcbiAgfVxuXG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJzYXZlLXBhY2thZ2VcIiwgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICAvL2NvbnNvbGUubG9nKHZhbHVlLCBhcmdzWzBdKVxuICBkaWFsb2cuc2hvd1NhdmVEaWFsb2coe1xuICAgIHRpdGxlOiAnU2VsZWN0IHRoZSBGaWxlIFBhdGggdG8gc2F2ZScsXG4gICAgZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9wYWNrYWdlJyksXG4gICAgLy8gZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9hc3NldHMvJyksXG4gICAgYnV0dG9uTGFiZWw6ICdTYXZlJyxcbiAgICAvLyBSZXN0cmljdGluZyB0aGUgdXNlciB0byBvbmx5IFRleHQgRmlsZXMuXG4gICAgZmlsdGVyczogW1xuICAgICAge1xuICAgICAgICBuYW1lOiAneG1sJyxcbiAgICAgICAgZXh0ZW5zaW9uczogWyd4bWwnXVxuICAgICAgfSxdLFxuICAgIHByb3BlcnRpZXM6IFtdXG4gIH0pLnRoZW4oZmlsZSA9PlxuICB7XG4gICAgLy8gU3RhdGluZyB3aGV0aGVyIGRpYWxvZyBvcGVyYXRpb24gd2FzIGNhbmNlbGxlZCBvciBub3QuXG4gICAgLy9jb25zb2xlLmxvZyhmaWxlLmNhbmNlbGVkKTtcbiAgICBpZiAoIWZpbGUuY2FuY2VsZWQpXG4gICAge1xuICAgICAgLy9jb25zb2xlLmxvZyhmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCkpO1xuXG4gICAgICAvLyBDcmVhdGluZyBhbmQgV3JpdGluZyB0byB0aGUgc2FtcGxlLnR4dCBmaWxlXG4gICAgICBmcy53cml0ZUZpbGUoZmlsZS5maWxlUGF0aC50b1N0cmluZygpLFxuICAgICAgICBhcmdzWzBdLCBmdW5jdGlvbiAoZXJyKVxuICAgICAge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ1NhdmVkIScpO1xuICAgICAgICAvL21haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnbm90aWZ5LXNhdmVkLXhtbCcsIGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIG5ldyBOb3RpZmljYXRpb24oeyB0aXRsZTogJ1hNTEVuam95ZXInLCBib2R5OiAnWE1MIFBhY2thZ2Ugc2FsdmF0bzpcXG4nICsgZmlsZS5maWxlUGF0aC50b1N0cmluZygpIH0pLnNob3coKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkuY2F0Y2goZXJyID0+XG4gIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpXG4gIH0pO1xuXG59KTtcblxuXG5pcGNNYWluLmhhbmRsZSgnYXV0aC1saXN0JywgYXN5bmMgKCkgPT5cbntcbiAgLyogICBsZXQgX0NMSSA9IGV4ZWMoJ3NmZHggZm9yY2U6YXV0aDpsaXN0IC0tanNvbicsIHtcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICAgIH0pO1xuXG4gICAgbGV0IGJ1ZmZlckRhdGEgPSAnJztcblxuICAgIF9DTEkuc3Rkb3V0Lm9uKCdkYXRhJywgKGNodW5rKSA9PlxuICAgIHtcbiAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdDSFVOSycsIGNodW5rKTtcbiAgICAgIGJ1ZmZlckRhdGEgKz0gY2h1bms7XG4gICAgfSk7XG5cbiAgICBfQ0xJLnN0ZGluLm9uKCdkYXRhJywgKGRhdGEpID0+XG4gICAge1xuICAgICAgLy8gICAgY29uc29sZS5sb2coJ0lOJywgZGF0YSk7XG4gICAgfSk7XG5cbiAgICBfQ0xJLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PlxuICAgIHtcbiAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdFUlInLCBkYXRhKTtcbiAgICB9KTtcblxuICAgIF9DTEkub24oJ2V4aXQnLCAoY29kZSwgc2lnbmFsKSA9PlxuICAgIHtcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnYXV0aC1saXN0LXJlYWRlZCcsIGJ1ZmZlckRhdGEpO1xuICAgIH0pOyAqL1xuXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcbiAgdHJ5XG4gIHtcbiAgICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAgICdzZiBvcmcgbGlzdCBhdXRoIC0tanNvbicsIHtcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICAgIH0pO1xuICAgIGlmIChzdGRvdXQgPT09ICcnIHx8ICFzdGRvdXQpXG4gICAge1xuICAgICAgY29uc29sZS5sb2coJ0VSUk9SIEdFVCBBVVRIIExJU1QgT1JHIDogJywgc3RkZXJyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcblxuICAgIHJldHVybiBKU09OLnBhcnNlKGJ1ZmZlckRhdGEpO1xuICB9IGNhdGNoIChlKVxuICB7XG4gICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgICAnc2ZkeCBvcmcgbGlzdCBhdXRoIC0tanNvbicsIHtcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICAgIH0pO1xuICAgIGlmIChzdGRvdXQgPT09ICcnIHx8ICFzdGRvdXQpXG4gICAge1xuICAgICAgY29uc29sZS5sb2coJ0VSUk9SIEdFVCBBVVRIIExJU1QgT1JHIDogJywgc3RkZXJyKTtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcblxuICAgIHJldHVybiBKU09OLnBhcnNlKGJ1ZmZlckRhdGEpO1xuICB9XG59KTtcblxuXG5pcGNNYWluLmhhbmRsZSgnY2hlY2stY2xpLWluc3RhbGxlZCcsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cbntcbiAgbGV0IGNsaUZvdW5kZWQgPSBmYWxzZTtcbiAgdHJ5XG4gIHtcbiAgICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XG4gICAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcbiAgICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAgICdzZmR4Jywge1xuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gICAgfSk7XG4gICAgaWYgKHN0ZG91dClcbiAgICB7XG4gICAgICAvLyAgY29uc29sZS5sb2coJ0NIRUNLIFNGIExPRyA6ICcsIHN0ZG91dCk7XG4gICAgICBjbGlGb3VuZGVkID0gdHJ1ZTtcbiAgICB9XG4gIH0gY2F0Y2ggKGUpIHsgY2xpRm91bmRlZCA9IGZhbHNlOyB9XG5cbiAgaWYgKGNsaUZvdW5kZWQpXG4gIHtcbiAgICByZXR1cm4gY2xpRm91bmRlZDtcbiAgfVxuXG4gIHRyeVxuICB7XG4gICAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xuICAgIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZSgnbm9kZTpjaGlsZF9wcm9jZXNzJykuZXhlYyk7XG4gICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgICAnc2YnLCB7XG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgICB9KTtcbiAgICBpZiAoc3Rkb3V0KVxuICAgIHtcbiAgICAgIGNvbnNvbGUubG9nKCdDSEVDSyBTRiBMT0cgOiAnLCBzdGRvdXQpO1xuICAgICAgY2xpRm91bmRlZCA9IHRydWU7XG4gICAgfVxuICB9IGNhdGNoIChlKSB7IGNsaUZvdW5kZWQgPSBmYWxzZTsgfVxuXG4gIHJldHVybiBjbGlGb3VuZGVkO1xufSk7XG5cblxuXG5pcGNNYWluLmhhbmRsZSgnbG9nb3V0LW9yZycsICh2YWx1ZSwgLi4uYXJncykgPT5cbntcblxuICBsZXQgX0NMSSA9IGV4ZWMoJ3NmZHggYXV0aDpsb2dvdXQgLXUgJyArIGFyZ3NbMF0gKyAnIC1wJywge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICB9KTtcblxuICBfQ0xJLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PlxuICB7XG4gICAgY29uc29sZS5sb2coJ0VSUicsIGRhdGEpO1xuICB9KTtcblxuICBfQ0xJLm9uKCdleGl0JywgKGNvZGUsIHNpZ25hbCkgPT5cbiAge1xuICAgIC8vdXBkYXRlT25Mb2dPcGVyYXRpb24oKTtcbiAgfSk7XG59KTtcblxuLyoqXG4gKiAnc2ZkeCBmb3JjZTphdXRoOndlYjpsb2dpbiAtYSAnXG4gICAgICArIGFyZ3NbMF0uYWxpYXNcbiAgICAgICsgJyAtciAnICsgYXJnc1swXS51cmxcbiAgICAgICsgJyAtLWpzb24nLCB7XG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOFxuICovXG5cblxuXG5pcGNNYWluLmhhbmRsZSgnbG9naW4tb3JnJywgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICAvKipcbiAgICogJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xuICAgICAgICArIGFyZ3NbMF0uYWxpYXNcbiAgICAgICAgKyAnIC1yICcgKyBhcmdzWzBdLnVybFxuICAgICAgICArICcgLS1qc29uJ1xuICAgKi9cblxuXG4gIHRyeVxuICB7XG4gICAgbGV0IHBpZCA9IGF3YWl0IGdldFBJRDE3MTcoKTtcbiAgICBpZiAocGlkICE9IC0xKVxuICAgIHtcbiAgICAgIHByb2Nlc3Mua2lsbChwaWQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKVxuICB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfVxuXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcbiAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xuICAgICsgYXJnc1swXS5hbGlhc1xuICAgICsgJyAtciAnICsgYXJnc1swXS51cmxcbiAgICArICcgLS1qc29uJywge1xuICAgIHdpbmRvd3NIaWRlOiB0cnVlLFxuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuXG4gIH0pO1xuICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcblxuICByZXR1cm4gSlNPTi5wYXJzZShidWZmZXJEYXRhKTtcbn0pO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRQSUQxNzE3KClcbntcbiAgbGV0IHNwaWQgPSAtMTtcbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAnbmV0c3RhdCAtYW9uJywge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICB9KTtcbiAgbGV0IGNodW5rID0gc3Rkb3V0O1xuICBsZXQgc3ViY2h1Y2sgPSBjaHVuay5zcGxpdCgnXFxuJyk7XG4gIHN1YmNodWNrLmZvckVhY2goY2ggPT5cbiAge1xuICAgIGlmIChjaC5pbmNsdWRlcygnOjE3MTcnKSlcbiAgICB7XG4gICAgICBsZXQgcGlkID0gY2guc3BsaXQoJyAnKVxuICAgICAgcGlkID0gcGlkLmF0KC0xKTtcblxuICAgICAgc3BpZCA9PSAtMSA/IHNwaWQgPSBwaWQgOiBudWxsO1xuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHNwaWQ7XG59XG5cbmlwY01haW4uaGFuZGxlKCdpbnRlcnJ1cHQtbG9naW4nLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIHRyeVxuICB7XG4gICAgbGV0IHBpZCA9IGF3YWl0IGdldFBJRDE3MTcoKTtcbiAgICBpZiAocGlkICE9IC0xKVxuICAgIHtcbiAgICAgIHByb2Nlc3Mua2lsbChwaWQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKVxuICB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfVxufSk7XG5cblxuaXBjTWFpbi5oYW5kbGUoJ3JldHJpZXZlLW1ldGFkYXRhJywgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XG4gIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZSgnbm9kZTpjaGlsZF9wcm9jZXNzJykuZXhlYyk7XG4gIC8vb2xkXG4gIC8qICAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgICAnc2ZkeCBmb3JjZTptZGFwaTpsaXN0bWV0YWRhdGEgLS1qc29uIC11ICdcbiAgICAgICsgYXJnc1swXS5vcmdcbiAgICAgICsgJyAtbSAnICsgYXJnc1swXS5tZHROYW1lXG4gICAgICArICcgLWEgJyArIGFyZ3NbMF0uYXBpLCB7XG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgICB9KTsgKi9cbiAgLy9uZXdcbiAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgJ3NmIG9yZyBsaXN0IG1ldGFkYXRhIC0tanNvbiAtbyAnXG4gICAgKyBhcmdzWzBdLm9yZ1xuICAgICsgJyAtbSAnICsgYXJnc1swXS5tZHROYW1lXG4gICAgKyAnIC0tYXBpLXZlcnNpb24gJyArIGFyZ3NbMF0uYXBpLCB7XG4gICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gIH0pO1xuXG4gIGxldCBidWZmZXJEYXRhID0gc3Rkb3V0O1xuICByZXR1cm4gYnVmZmVyRGF0YTtcblxufSk7XG5cbmlwY01haW4uaGFuZGxlKCdnZXQtY2xpcGJvYXJkJywgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICBjb25zdCB0ZXh0ID0gY2xpcGJvYXJkLnJlYWRUZXh0KCk7XG4gIGlmICh0ZXh0Lmxlbmd0aCA+IDAgfHwgdGV4dClcbiAge1xuICAgIHJldHVybiB0ZXh0O1xuICB9XG4gIGNsaXBib2FyZC5jbGVhcigpO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKCdjaGVjay1zZmR4LXVwZGF0ZScsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cbntcbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAnc2ZkeCAtdiAnLCB7XG4gICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gIH0pO1xuICBsZXQgYnVmZmVyRGF0YTtcbiAgaWYgKHN0ZG91dClcbiAge1xuICAgIGNvbnNvbGUubG9nKCdDSEVDSyBWRVJTSU9OIExPRyA6ICcsIHN0ZG91dCk7XG4gICAgaWYgKHN0ZG91dC5pbmNsdWRlcygnc2ZkeC1jbGkvJykpXG4gICAge1xuICAgICAgYnVmZmVyRGF0YSA9IHsgdmVyc2lvbjogc3Rkb3V0LnN1YnN0cmluZyg5LCAxNyksIG9ic29sZXRlVmVyc2lvbjogdHJ1ZSB9O1xuICAgIH0gZWxzZSBpZiAoc3Rkb3V0LmluY2x1ZGVzKCdAc2FsZXNmb3JjZS9jbGkvJykpXG4gICAge1xuICAgICAgYnVmZmVyRGF0YSA9IHsgdmVyc2lvbjogc3Rkb3V0LnN1YnN0cmluZygxNiwgMjMpLCBvYnNvbGV0ZVZlcnNpb246IGZhbHNlIH07XG4gICAgfVxuICAgIHJldHVybiBidWZmZXJEYXRhO1xuICB9IGVsc2VcbiAge1xuICAgIGNvbnNvbGUubG9nKCdFUlJPUiA6IENIRUNLIFZFUlNJT04gTE9HIDogJywgc3Rkb3V0KTtcbiAgICBidWZmZXJEYXRhID0gc3RkZXJyO1xuICB9XG4gIHJldHVybiBidWZmZXJEYXRhO1xufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNCQUF5RjtBQUN6RixrQkFBaUI7QUFDakIsZ0JBQWU7QUFHZiwyQkFBK0I7QUFGL0IsSUFBTSxFQUFFLE9BQU8sSUFBSSxRQUFRO0FBQzNCLElBQU0sS0FBSyxRQUFRO0FBU25CLElBQU0sV0FBVyxRQUFRLFlBQVksVUFBQUEsUUFBRyxTQUFTO0FBQ2pELElBQ0E7QUFDRSxNQUFJLGFBQWEsV0FBVyw0QkFBWSx3QkFBd0IsTUFDaEU7QUFDRSxZQUFRLE1BQU07QUFBQSxNQUNaLFlBQUFDLFFBQUssS0FBSyxvQkFBSSxRQUFRLFVBQVUsR0FBRyxxQkFBcUI7QUFBQSxJQUMxRDtBQUFBLEVBQ0Y7QUFDRixTQUFTLEdBQVA7QUFBWTtBQUVkLElBQUk7QUFFSixlQUFlLGVBQ2Y7QUFJRSxlQUFhLElBQUksOEJBQWM7QUFBQSxJQUM3QixNQUFNLFlBQUFBLFFBQUssUUFBUSxXQUFXLGdCQUFnQjtBQUFBLElBRTlDLGFBQWE7QUFBQSxJQUNiLGVBQWU7QUFBQSxJQUNmLGlCQUFpQjtBQUFBLElBQ2pCLE9BQU87QUFBQSxJQUNQLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGdCQUFnQjtBQUFBLElBQ2hCLGdCQUFnQjtBQUFBLE1BQ2Qsb0JBQW9CO0FBQUEsTUFDcEIsa0JBQWtCO0FBQUEsTUFDbEIsaUJBQWlCO0FBQUEsTUFFakIsU0FBUyxZQUFBQSxRQUFLLFFBQVEs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
