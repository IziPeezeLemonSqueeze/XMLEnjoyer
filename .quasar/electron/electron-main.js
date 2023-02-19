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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgbmF0aXZlVGhlbWUsIE5vdGlmaWNhdGlvbiwgc2hlbGwgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgb3MgZnJvbSBcIm9zXCI7XG5jb25zdCB7IGRpYWxvZyB9ID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuaW1wb3J0IHsgZXhlYywgZXhlY1N5bmMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuXG5cbmltcG9ydCBpbnN0YWxsRXh0ZW5zaW9uLCB7IFZVRUpTM19ERVZUT09MUyB9IGZyb20gXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIjtcbnZhciB7IFhNTFBhcnNlciwgWE1MQnVpbGRlciwgWE1MVmFsaWRhdG9yIH0gPSByZXF1aXJlKFwiZmFzdC14bWwtcGFyc2VyXCIpO1xuLy8gbmVlZGVkIGluIGNhc2UgcHJvY2VzcyBpcyB1bmRlZmluZWQgdW5kZXIgTGludXhcbmNvbnN0IHBsYXRmb3JtID0gcHJvY2Vzcy5wbGF0Zm9ybSB8fCBvcy5wbGF0Zm9ybSgpO1xudHJ5XG57XG4gIGlmIChwbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiICYmIG5hdGl2ZVRoZW1lLnNob3VsZFVzZURhcmtDb2xvcnMgPT09IHRydWUpXG4gIHtcbiAgICByZXF1aXJlKFwiZnNcIikudW5saW5rU3luYyhcbiAgICAgIHBhdGguam9pbihhcHAuZ2V0UGF0aChcInVzZXJEYXRhXCIpLCBcIkRldlRvb2xzIEV4dGVuc2lvbnNcIilcbiAgICApO1xuICB9XG59IGNhdGNoIChfKSB7IH1cblxubGV0IG1haW5XaW5kb3c7XG5cbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpXG57XG4gIC8qKlxuICAgKiBJbml0aWFsIHdpbmRvdyBvcHRpb25zXG4gICAqL1xuICBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgIGljb246IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiaWNvbnMvaWNvbi5wbmdcIiksIC8vIHRyYXkgaWNvblxuICAgIHRpdGxlQmFyU3R5bGU6ICdoaWRkZW4nLFxuICAgIHRpdGxlQmFyT3ZlcmxheTogZmFsc2UsXG4gICAgd2lkdGg6IDE0NTAsXG4gICAgaGVpZ2h0OiAxMDAxLFxuICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgdXNlQ29udGVudFNpemU6IHRydWUsXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgIGVuYWJsZVJlbW90ZU1vZHVsZTogZmFsc2UsXG4gICAgICBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLFxuICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgLy8gTW9yZSBpbmZvOiBodHRwczovL3YyLnF1YXNhci5kZXYvcXVhc2FyLWNsaS12aXRlL2RldmVsb3BpbmctZWxlY3Ryb24tYXBwcy9lbGVjdHJvbi1wcmVsb2FkLXNjcmlwdFxuICAgICAgcHJlbG9hZDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgcHJvY2Vzcy5lbnYuUVVBU0FSX0VMRUNUUk9OX1BSRUxPQUQpLFxuICAgIH0sXG4gIH0pO1xuXG4gIG1haW5XaW5kb3cubG9hZFVSTChwcm9jZXNzLmVudi5BUFBfVVJMKTtcblxuICBpZiAocHJvY2Vzcy5lbnYuREVCVUdHSU5HKVxuICB7XG4gICAgLy8gaWYgb24gREVWIG9yIFByb2R1Y3Rpb24gd2l0aCBkZWJ1ZyBlbmFibGVkXG4gICAgdHJ5XG4gICAge1xuICAgICAgaW5zdGFsbEV4dGVuc2lvbihbXCJuaGRvZ2ptZWppZ2xpcGNjcG5ubmFuaGJsZWRhamJwZFwiXSlcbiAgICAgICAgLnRoZW4oKG5hbWUpID0+IGNvbnNvbGUubG9nKGBBZGRlZCBFeHRlbnNpb246ICAke25hbWV9YCkpXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmxvZyhcIkFuIGVycm9yIG9jY3VycmVkOiBcIiwgZXJyKSk7XG4gICAgfSBjYXRjaCAoZSlcbiAgICB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9XG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgfSBlbHNlXG4gIHtcbiAgICAvLyB3ZSdyZSBvbiBwcm9kdWN0aW9uOyBubyBhY2Nlc3MgdG8gZGV2dG9vbHMgcGxzXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vbihcImRldnRvb2xzLW9wZW5lZFwiLCAoKSA9PlxuICAgIHtcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuY2xvc2VEZXZUb29scygpO1xuICAgIH0pO1xuICB9XG5cbiAgbWFpbldpbmRvdy5vbihcImNsb3NlZFwiLCAoKSA9PlxuICB7XG4gICAgbWFpbldpbmRvdyA9IG51bGw7XG4gIH0pO1xufVxuXG5hcHAud2hlblJlYWR5KCkudGhlbigocmVhZHkpID0+XG57XG4gIC8vY29uc29sZS5sb2cocmVhZHkpO1xuXG4gIGNyZWF0ZVdpbmRvdygpO1xuXG5cbn0pO1xuXG5hcHAub24oXCJ3aW5kb3ctYWxsLWNsb3NlZFwiLCAoKSA9Plxue1xuICBpZiAocGxhdGZvcm0gIT09IFwiZGFyd2luXCIpXG4gIHtcbiAgICBhcHAucXVpdCgpO1xuICB9XG59KTtcblxuYXBwLm9uKFwiYWN0aXZhdGVcIiwgKCkgPT5cbntcbiAgaWYgKG1haW5XaW5kb3cgPT09IG51bGwpXG4gIHtcbiAgICBjcmVhdGVXaW5kb3coKTtcbiAgfVxufSk7XG5cbmlwY01haW4uaGFuZGxlKFwicXVpdC1hcHBcIiwgKCkgPT5cbntcbiAgYXBwLnF1aXQoKTtcbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcIm1pbi1hcHBcIiwgKCkgPT5cbntcbiAgbWFpbldpbmRvdy5taW5pbWl6ZSgpO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKFwibWF4LWFwcFwiLCAoKSA9Plxue1xuICBpZiAobWFpbldpbmRvdy5pc01heGltaXplZCgpKVxuICB7XG4gICAgbWFpbldpbmRvdy51bm1heGltaXplKClcbiAgfSBlbHNlXG4gIHtcbiAgICBtYWluV2luZG93Lm1heGltaXplKClcbiAgfVxuXG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJzYXZlLXBhY2thZ2VcIiwgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICAvL2NvbnNvbGUubG9nKHZhbHVlLCBhcmdzWzBdKVxuICBkaWFsb2cuc2hvd1NhdmVEaWFsb2coe1xuICAgIHRpdGxlOiAnU2VsZWN0IHRoZSBGaWxlIFBhdGggdG8gc2F2ZScsXG4gICAgZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9wYWNrYWdlJyksXG4gICAgLy8gZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9hc3NldHMvJyksXG4gICAgYnV0dG9uTGFiZWw6ICdTYXZlJyxcbiAgICAvLyBSZXN0cmljdGluZyB0aGUgdXNlciB0byBvbmx5IFRleHQgRmlsZXMuXG4gICAgZmlsdGVyczogW1xuICAgICAge1xuICAgICAgICBuYW1lOiAneG1sJyxcbiAgICAgICAgZXh0ZW5zaW9uczogWyd4bWwnXVxuICAgICAgfSxdLFxuICAgIHByb3BlcnRpZXM6IFtdXG4gIH0pLnRoZW4oZmlsZSA9PlxuICB7XG4gICAgLy8gU3RhdGluZyB3aGV0aGVyIGRpYWxvZyBvcGVyYXRpb24gd2FzIGNhbmNlbGxlZCBvciBub3QuXG4gICAgLy9jb25zb2xlLmxvZyhmaWxlLmNhbmNlbGVkKTtcbiAgICBpZiAoIWZpbGUuY2FuY2VsZWQpXG4gICAge1xuICAgICAgLy9jb25zb2xlLmxvZyhmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCkpO1xuXG4gICAgICAvLyBDcmVhdGluZyBhbmQgV3JpdGluZyB0byB0aGUgc2FtcGxlLnR4dCBmaWxlXG4gICAgICBmcy53cml0ZUZpbGUoZmlsZS5maWxlUGF0aC50b1N0cmluZygpLFxuICAgICAgICBhcmdzWzBdLCBmdW5jdGlvbiAoZXJyKVxuICAgICAge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ1NhdmVkIScpO1xuICAgICAgICAvL21haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnbm90aWZ5LXNhdmVkLXhtbCcsIGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIG5ldyBOb3RpZmljYXRpb24oeyB0aXRsZTogJ1hNTEVuam95ZXInLCBib2R5OiAnWE1MIFBhY2thZ2Ugc2FsdmF0bzpcXG4nICsgZmlsZS5maWxlUGF0aC50b1N0cmluZygpIH0pLnNob3coKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkuY2F0Y2goZXJyID0+XG4gIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpXG4gIH0pO1xuXG59KTtcblxuXG5pcGNNYWluLmhhbmRsZSgnYXV0aC1saXN0JywgYXN5bmMgKCkgPT5cbntcbiAgLyogICBsZXQgX0NMSSA9IGV4ZWMoJ3NmZHggZm9yY2U6YXV0aDpsaXN0IC0tanNvbicsIHtcbiAgICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICAgIH0pO1xuXG4gICAgbGV0IGJ1ZmZlckRhdGEgPSAnJztcblxuICAgIF9DTEkuc3Rkb3V0Lm9uKCdkYXRhJywgKGNodW5rKSA9PlxuICAgIHtcbiAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdDSFVOSycsIGNodW5rKTtcbiAgICAgIGJ1ZmZlckRhdGEgKz0gY2h1bms7XG4gICAgfSk7XG5cbiAgICBfQ0xJLnN0ZGluLm9uKCdkYXRhJywgKGRhdGEpID0+XG4gICAge1xuICAgICAgLy8gICAgY29uc29sZS5sb2coJ0lOJywgZGF0YSk7XG4gICAgfSk7XG5cbiAgICBfQ0xJLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PlxuICAgIHtcbiAgICAgIC8vICAgIGNvbnNvbGUubG9nKCdFUlInLCBkYXRhKTtcbiAgICB9KTtcblxuICAgIF9DTEkub24oJ2V4aXQnLCAoY29kZSwgc2lnbmFsKSA9PlxuICAgIHtcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnYXV0aC1saXN0LXJlYWRlZCcsIGJ1ZmZlckRhdGEpO1xuICAgIH0pOyAqL1xuXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcbiAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgJ3NmZHggZm9yY2U6YXV0aDpsaXN0IC0tanNvbicsIHtcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgfSk7XG4gIGxldCBidWZmZXJEYXRhID0gc3Rkb3V0O1xuXG4gIHJldHVybiBKU09OLnBhcnNlKGJ1ZmZlckRhdGEpO1xuXG59KTtcblxuaXBjTWFpbi5oYW5kbGUoJ2xvZ291dC1vcmcnLCAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG5cbiAgbGV0IF9DTEkgPSBleGVjKCdzZmR4IGF1dGg6bG9nb3V0IC11ICcgKyBhcmdzWzBdICsgJyAtcCcsIHtcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgfSk7XG5cbiAgX0NMSS5zdGRlcnIub24oJ2RhdGEnLCAoZGF0YSkgPT5cbiAge1xuICAgIGNvbnNvbGUubG9nKCdFUlInLCBkYXRhKTtcbiAgfSk7XG5cbiAgX0NMSS5vbignZXhpdCcsIChjb2RlLCBzaWduYWwpID0+XG4gIHtcbiAgICAvL3VwZGF0ZU9uTG9nT3BlcmF0aW9uKCk7XG4gIH0pO1xufSk7XG5cbi8qKlxuICogJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xuICAgICAgKyBhcmdzWzBdLmFsaWFzXG4gICAgICArICcgLXIgJyArIGFyZ3NbMF0udXJsXG4gICAgICArICcgLS1qc29uJywge1xuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDhcbiAqL1xuXG5cblxuaXBjTWFpbi5oYW5kbGUoJ2xvZ2luLW9yZycsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cbntcbiAgLyoqXG4gICAqICdzZmR4IGZvcmNlOmF1dGg6d2ViOmxvZ2luIC1hICdcbiAgICAgICAgKyBhcmdzWzBdLmFsaWFzXG4gICAgICAgICsgJyAtciAnICsgYXJnc1swXS51cmxcbiAgICAgICAgKyAnIC0tanNvbidcbiAgICovXG5cblxuICB0cnlcbiAge1xuICAgIGxldCBwaWQgPSBhd2FpdCBnZXRQSUQxNzE3KCk7XG4gICAgaWYgKHBpZCAhPSAtMSlcbiAgICB7XG4gICAgICBwcm9jZXNzLmtpbGwocGlkKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycilcbiAge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH1cblxuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XG4gIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZSgnbm9kZTpjaGlsZF9wcm9jZXNzJykuZXhlYyk7XG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxuICAgICdzZmR4IGZvcmNlOmF1dGg6d2ViOmxvZ2luIC1hICdcbiAgICArIGFyZ3NbMF0uYWxpYXNcbiAgICArICcgLXIgJyArIGFyZ3NbMF0udXJsXG4gICAgKyAnIC0tanNvbicsIHtcbiAgICB3aW5kb3dzSGlkZTogdHJ1ZSxcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcblxuICB9KTtcbiAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XG5cbiAgcmV0dXJuIEpTT04ucGFyc2UoYnVmZmVyRGF0YSk7XG59KTtcblxuYXN5bmMgZnVuY3Rpb24gZ2V0UElEMTcxNygpXG57XG4gIGxldCBzcGlkID0gLTE7XG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcbiAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgJ25ldHN0YXQgLWFvbicsIHtcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgfSk7XG4gIGxldCBjaHVuayA9IHN0ZG91dDtcbiAgbGV0IHN1YmNodWNrID0gY2h1bmsuc3BsaXQoJ1xcbicpO1xuICBzdWJjaHVjay5mb3JFYWNoKGNoID0+XG4gIHtcbiAgICBpZiAoY2guaW5jbHVkZXMoJzoxNzE3JykpXG4gICAge1xuICAgICAgbGV0IHBpZCA9IGNoLnNwbGl0KCcgJylcbiAgICAgIHBpZCA9IHBpZC5hdCgtMSk7XG5cbiAgICAgIHNwaWQgPT0gLTEgPyBzcGlkID0gcGlkIDogbnVsbDtcbiAgICB9XG4gIH0pXG4gIHJldHVybiBzcGlkO1xufVxuXG5pcGNNYWluLmhhbmRsZSgnaW50ZXJydXB0LWxvZ2luJywgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICB0cnlcbiAge1xuICAgIGxldCBwaWQgPSBhd2FpdCBnZXRQSUQxNzE3KCk7XG4gICAgaWYgKHBpZCAhPSAtMSlcbiAgICB7XG4gICAgICBwcm9jZXNzLmtpbGwocGlkKTtcbiAgICB9XG4gIH0gY2F0Y2ggKGVycilcbiAge1xuICAgIGNvbnNvbGUubG9nKGVycik7XG4gIH1cbn0pO1xuXG5cbmlwY01haW4uaGFuZGxlKCdyZXRyaWV2ZS1tZXRhZGF0YScsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cbntcbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAnc2ZkeCBmb3JjZTptZGFwaTpsaXN0bWV0YWRhdGEgLS1qc29uIC11ICdcbiAgICArIGFyZ3NbMF0ub3JnXG4gICAgKyAnIC1tICcgKyBhcmdzWzBdLm1kdE5hbWVcbiAgICArICcgLWEgJyArIGFyZ3NbMF0uYXBpLCB7XG4gICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gIH0pO1xuICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcbiAgcmV0dXJuIGJ1ZmZlckRhdGE7XG5cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLHNCQUE4RTtBQUM5RSxrQkFBaUI7QUFDakIsZ0JBQWU7QUFHZiwyQkFBK0I7QUFHL0IseUNBQWtEO0FBTGxELElBQU0sRUFBRSxPQUFPLElBQUksUUFBUTtBQUMzQixJQUFNLEtBQUssUUFBUTtBQUtuQixJQUFJLEVBQUUsV0FBVyxZQUFZLGFBQWEsSUFBSSxRQUFRO0FBRXRELElBQU0sV0FBVyxRQUFRLFlBQVksVUFBQUEsUUFBRyxTQUFTO0FBQ2pELElBQ0E7QUFDRSxNQUFJLGFBQWEsV0FBVyw0QkFBWSx3QkFBd0IsTUFDaEU7QUFDRSxZQUFRLE1BQU07QUFBQSxNQUNaLFlBQUFDLFFBQUssS0FBSyxvQkFBSSxRQUFRLFVBQVUsR0FBRyxxQkFBcUI7QUFBQSxJQUMxRDtBQUFBLEVBQ0Y7QUFDRixTQUFTLEdBQVA7QUFBWTtBQUVkLElBQUk7QUFFSixTQUFTLGVBQ1Q7QUFJRSxlQUFhLElBQUksOEJBQWM7QUFBQSxJQUM3QixNQUFNLFlBQUFBLFFBQUssUUFBUSxXQUFXLGdCQUFnQjtBQUFBLElBQzlDLGVBQWU7QUFBQSxJQUNmLGlCQUFpQjtBQUFBLElBQ2pCLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQSxJQUNYLGdCQUFnQjtBQUFBLElBQ2hCLGdCQUFnQjtBQUFBLE1BQ2Qsb0JBQW9CO0FBQUEsTUFDcEIsa0JBQWtCO0FBQUEsTUFDbEIsaUJBQWlCO0FBQUEsTUFFakIsU0FBUyxZQUFBQSxRQUFLLFFBQVEsV0FBVywyRkFBbUM7QUFBQSxJQUN0RTtBQUFBLEVBQ0YsQ0FBQztBQUVELGFBQVcsUUFBUSx1QkFBbUI7QUFFdEMsTUFBSSxNQUNKO0FBRUUsUUFD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QU8sTUFBTTtBQUFBLElBQzVCO0FBQUEsRUFDRixDQUFDO0FBQ0QsU0FBTztBQUNUO0FBRUEsd0JBQVEsT0FBTyxtQkFBbUIsT0FBTyxVQUFVLFNBQ25EO0FBQ0UsTUFDQTtBQUNFLFFBQUksTUFBTSxNQUFNLFdBQVc7QUFDM0IsUUFBSSxPQUFPLElBQ1g7QUFDRSxjQUFRLEtBQUssR0FBRztBQUFBLElBQ2xCO0FBQUEsRUFDRixTQUFTLEtBQVA7QUFFQSxZQUFRLElBQUksR0FBRztBQUFBLEVBQ2pCO0FBQ0YsQ0FBQztBQUdELHdCQUFRLE9BQU8scUJBQXFCLE9BQU8sVUFBVSxTQUNyRDtBQUNFLFFBQU0sT0FBTyxRQUFRO0FBQ3JCLFFBQU0sUUFBUSxLQUFLLFVBQVUsUUFBUSxzQkFBc0IsSUFBSTtBQUMvRCxRQUFNLEVBQUUsUUFBUSxPQUFPLElBQUksTUFBTTtBQUFBLElBQy9CLDZDQUNFLEtBQUssR0FBRyxNQUNSLFNBQVMsS0FBSyxHQUFHLFVBQ2pCLFNBQVMsS0FBSyxHQUFHO0FBQUEsSUFBSztBQUFBLE1BQ3hCLFdBQVcsT0FBTyxPQUFPO0FBQUEsSUFDM0I7QUFBQSxFQUFDO0FBQ0QsTUFBSSxhQUFhO0FBQ2pCLFNBQU87QUFFVCxDQUFDOyIsCiAgIm5hbWVzIjogWyJvcyIsICJwYXRoIiwgImluc3RhbGxFeHRlbnNpb24iXQp9Cg==
