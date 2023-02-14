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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgbmF0aXZlVGhlbWUsIE5vdGlmaWNhdGlvbiwgc2hlbGwgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgb3MgZnJvbSBcIm9zXCI7XG5jb25zdCB7IGRpYWxvZyB9ID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuaW1wb3J0IHsgZXhlYywgZXhlY1N5bmMgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiO1xuXG5cbmltcG9ydCBpbnN0YWxsRXh0ZW5zaW9uLCB7IFZVRUpTM19ERVZUT09MUyB9IGZyb20gXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIjtcbnZhciB7IFhNTFBhcnNlciwgWE1MQnVpbGRlciwgWE1MVmFsaWRhdG9yIH0gPSByZXF1aXJlKFwiZmFzdC14bWwtcGFyc2VyXCIpO1xuLy8gbmVlZGVkIGluIGNhc2UgcHJvY2VzcyBpcyB1bmRlZmluZWQgdW5kZXIgTGludXhcbmNvbnN0IHBsYXRmb3JtID0gcHJvY2Vzcy5wbGF0Zm9ybSB8fCBvcy5wbGF0Zm9ybSgpO1xudHJ5XG57XG4gIGlmIChwbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiICYmIG5hdGl2ZVRoZW1lLnNob3VsZFVzZURhcmtDb2xvcnMgPT09IHRydWUpXG4gIHtcbiAgICByZXF1aXJlKFwiZnNcIikudW5saW5rU3luYyhcbiAgICAgIHBhdGguam9pbihhcHAuZ2V0UGF0aChcInVzZXJEYXRhXCIpLCBcIkRldlRvb2xzIEV4dGVuc2lvbnNcIilcbiAgICApO1xuICB9XG59IGNhdGNoIChfKSB7IH1cblxubGV0IG1haW5XaW5kb3c7XG5cbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpXG57XG4gIC8qKlxuICAgKiBJbml0aWFsIHdpbmRvdyBvcHRpb25zXG4gICAqL1xuICBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgIGljb246IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiaWNvbnMvaWNvbi5wbmdcIiksIC8vIHRyYXkgaWNvblxuICAgIHRpdGxlQmFyU3R5bGU6ICdoaWRkZW4nLFxuICAgIHRpdGxlQmFyT3ZlcmxheTogZmFsc2UsXG4gICAgd2lkdGg6IDE0NTAsXG4gICAgaGVpZ2h0OiAxMDAxLFxuICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgdXNlQ29udGVudFNpemU6IHRydWUsXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgIGVuYWJsZVJlbW90ZU1vZHVsZTogZmFsc2UsXG4gICAgICBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLFxuICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgLy8gTW9yZSBpbmZvOiBodHRwczovL3YyLnF1YXNhci5kZXYvcXVhc2FyLWNsaS12aXRlL2RldmVsb3BpbmctZWxlY3Ryb24tYXBwcy9lbGVjdHJvbi1wcmVsb2FkLXNjcmlwdFxuICAgICAgcHJlbG9hZDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgcHJvY2Vzcy5lbnYuUVVBU0FSX0VMRUNUUk9OX1BSRUxPQUQpLFxuICAgIH0sXG4gIH0pO1xuXG4gIG1haW5XaW5kb3cubG9hZFVSTChwcm9jZXNzLmVudi5BUFBfVVJMKTtcblxuICBpZiAocHJvY2Vzcy5lbnYuREVCVUdHSU5HKVxuICB7XG4gICAgLy8gaWYgb24gREVWIG9yIFByb2R1Y3Rpb24gd2l0aCBkZWJ1ZyBlbmFibGVkXG4gICAgdHJ5XG4gICAge1xuICAgICAgaW5zdGFsbEV4dGVuc2lvbihbXCJuaGRvZ2ptZWppZ2xpcGNjcG5ubmFuaGJsZWRhamJwZFwiXSlcbiAgICAgICAgLnRoZW4oKG5hbWUpID0+IGNvbnNvbGUubG9nKGBBZGRlZCBFeHRlbnNpb246ICAke25hbWV9YCkpXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmxvZyhcIkFuIGVycm9yIG9jY3VycmVkOiBcIiwgZXJyKSk7XG4gICAgfSBjYXRjaCAoZSlcbiAgICB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9XG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgfSBlbHNlXG4gIHtcbiAgICAvLyB3ZSdyZSBvbiBwcm9kdWN0aW9uOyBubyBhY2Nlc3MgdG8gZGV2dG9vbHMgcGxzXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vbihcImRldnRvb2xzLW9wZW5lZFwiLCAoKSA9PlxuICAgIHtcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuY2xvc2VEZXZUb29scygpO1xuICAgIH0pO1xuICB9XG5cbiAgbWFpbldpbmRvdy5vbihcImNsb3NlZFwiLCAoKSA9PlxuICB7XG4gICAgbWFpbldpbmRvdyA9IG51bGw7XG4gIH0pO1xufVxuXG5hcHAud2hlblJlYWR5KCkudGhlbigocmVhZHkpID0+XG57XG4gIGNvbnNvbGUubG9nKHJlYWR5KTtcblxuICBjcmVhdGVXaW5kb3coKTtcblxuXG59KTtcblxuYXBwLm9uKFwid2luZG93LWFsbC1jbG9zZWRcIiwgKCkgPT5cbntcbiAgaWYgKHBsYXRmb3JtICE9PSBcImRhcndpblwiKVxuICB7XG4gICAgYXBwLnF1aXQoKTtcbiAgfVxufSk7XG5cbmFwcC5vbihcImFjdGl2YXRlXCIsICgpID0+XG57XG4gIGlmIChtYWluV2luZG93ID09PSBudWxsKVxuICB7XG4gICAgY3JlYXRlV2luZG93KCk7XG4gIH1cbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcInF1aXQtYXBwXCIsICgpID0+XG57XG4gIGFwcC5xdWl0KCk7XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJtaW4tYXBwXCIsICgpID0+XG57XG4gIG1haW5XaW5kb3cubWluaW1pemUoKTtcbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcIm1heC1hcHBcIiwgKCkgPT5cbntcbiAgaWYgKG1haW5XaW5kb3cuaXNNYXhpbWl6ZWQoKSlcbiAge1xuICAgIG1haW5XaW5kb3cudW5tYXhpbWl6ZSgpXG4gIH0gZWxzZVxuICB7XG4gICAgbWFpbldpbmRvdy5tYXhpbWl6ZSgpXG4gIH1cblxufSk7XG5cbmlwY01haW4uaGFuZGxlKFwic2F2ZS1wYWNrYWdlXCIsIGFzeW5jICh2YWx1ZSwgLi4uYXJncykgPT5cbntcbiAgY29uc29sZS5sb2codmFsdWUsIGFyZ3NbMF0pXG4gIGRpYWxvZy5zaG93U2F2ZURpYWxvZyh7XG4gICAgdGl0bGU6ICdTZWxlY3QgdGhlIEZpbGUgUGF0aCB0byBzYXZlJyxcbiAgICBkZWZhdWx0UGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uLy4uLy4uL3BhY2thZ2UnKSxcbiAgICAvLyBkZWZhdWx0UGF0aDogcGF0aC5qb2luKF9fZGlybmFtZSwgJy4uL2Fzc2V0cy8nKSxcbiAgICBidXR0b25MYWJlbDogJ1NhdmUnLFxuICAgIC8vIFJlc3RyaWN0aW5nIHRoZSB1c2VyIHRvIG9ubHkgVGV4dCBGaWxlcy5cbiAgICBmaWx0ZXJzOiBbXG4gICAgICB7XG4gICAgICAgIG5hbWU6ICd4bWwnLFxuICAgICAgICBleHRlbnNpb25zOiBbJ3htbCddXG4gICAgICB9LF0sXG4gICAgcHJvcGVydGllczogW11cbiAgfSkudGhlbihmaWxlID0+XG4gIHtcbiAgICAvLyBTdGF0aW5nIHdoZXRoZXIgZGlhbG9nIG9wZXJhdGlvbiB3YXMgY2FuY2VsbGVkIG9yIG5vdC5cbiAgICBjb25zb2xlLmxvZyhmaWxlLmNhbmNlbGVkKTtcbiAgICBpZiAoIWZpbGUuY2FuY2VsZWQpXG4gICAge1xuICAgICAgY29uc29sZS5sb2coZmlsZS5maWxlUGF0aC50b1N0cmluZygpKTtcblxuICAgICAgLy8gQ3JlYXRpbmcgYW5kIFdyaXRpbmcgdG8gdGhlIHNhbXBsZS50eHQgZmlsZVxuICAgICAgZnMud3JpdGVGaWxlKGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSxcbiAgICAgICAgYXJnc1swXSwgZnVuY3Rpb24gKGVycilcbiAgICAgIHtcbiAgICAgICAgaWYgKGVycikgdGhyb3cgZXJyO1xuICAgICAgICBjb25zb2xlLmxvZygnU2F2ZWQhJyk7XG4gICAgICAgIC8vbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdub3RpZnktc2F2ZWQteG1sJywgZmlsZS5maWxlUGF0aC50b1N0cmluZygpKTtcbiAgICAgICAgbmV3IE5vdGlmaWNhdGlvbih7IHRpdGxlOiAnWE1MRW5qb3llcicsIGJvZHk6ICdYTUwgUGFja2FnZSBzYWx2YXRvOlxcbicgKyBmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCkgfSkuc2hvdygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9KS5jYXRjaChlcnIgPT5cbiAge1xuICAgIGNvbnNvbGUubG9nKGVycilcbiAgfSk7XG5cbn0pO1xuXG5cbmlwY01haW4uaGFuZGxlKCdhdXRoLWxpc3QnLCBhc3luYyAoKSA9Plxue1xuICAvKiAgIGxldCBfQ0xJID0gZXhlYygnc2ZkeCBmb3JjZTphdXRoOmxpc3QgLS1qc29uJywge1xuICAgICAgbWF4QnVmZmVyOiAxMDI0ICogMTAyNCAqIDgsXG4gICAgfSk7XG5cbiAgICBsZXQgYnVmZmVyRGF0YSA9ICcnO1xuXG4gICAgX0NMSS5zdGRvdXQub24oJ2RhdGEnLCAoY2h1bmspID0+XG4gICAge1xuICAgICAgLy8gICAgY29uc29sZS5sb2coJ0NIVU5LJywgY2h1bmspO1xuICAgICAgYnVmZmVyRGF0YSArPSBjaHVuaztcbiAgICB9KTtcblxuICAgIF9DTEkuc3RkaW4ub24oJ2RhdGEnLCAoZGF0YSkgPT5cbiAgICB7XG4gICAgICAvLyAgICBjb25zb2xlLmxvZygnSU4nLCBkYXRhKTtcbiAgICB9KTtcblxuICAgIF9DTEkuc3RkZXJyLm9uKCdkYXRhJywgKGRhdGEpID0+XG4gICAge1xuICAgICAgLy8gICAgY29uc29sZS5sb2coJ0VSUicsIGRhdGEpO1xuICAgIH0pO1xuXG4gICAgX0NMSS5vbignZXhpdCcsIChjb2RlLCBzaWduYWwpID0+XG4gICAge1xuICAgICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5zZW5kKCdhdXRoLWxpc3QtcmVhZGVkJywgYnVmZmVyRGF0YSk7XG4gICAgfSk7ICovXG5cbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAnc2ZkeCBmb3JjZTphdXRoOmxpc3QgLS1qc29uJywge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICB9KTtcbiAgbGV0IGJ1ZmZlckRhdGEgPSBzdGRvdXQ7XG5cbiAgcmV0dXJuIEpTT04ucGFyc2UoYnVmZmVyRGF0YSk7XG5cbn0pO1xuXG5pcGNNYWluLmhhbmRsZSgnbG9nb3V0LW9yZycsICh2YWx1ZSwgLi4uYXJncykgPT5cbntcblxuICBsZXQgX0NMSSA9IGV4ZWMoJ3NmZHggYXV0aDpsb2dvdXQgLXUgJyArIGFyZ3NbMF0gKyAnIC1wJywge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICB9KTtcblxuICBfQ0xJLnN0ZGVyci5vbignZGF0YScsIChkYXRhKSA9PlxuICB7XG4gICAgY29uc29sZS5sb2coJ0VSUicsIGRhdGEpO1xuICB9KTtcblxuICBfQ0xJLm9uKCdleGl0JywgKGNvZGUsIHNpZ25hbCkgPT5cbiAge1xuICAgIC8vdXBkYXRlT25Mb2dPcGVyYXRpb24oKTtcbiAgfSk7XG59KTtcblxuLyoqXG4gKiAnc2ZkeCBmb3JjZTphdXRoOndlYjpsb2dpbiAtYSAnXG4gICAgICArIGFyZ3NbMF0uYWxpYXNcbiAgICAgICsgJyAtciAnICsgYXJnc1swXS51cmxcbiAgICAgICsgJyAtLWpzb24nLCB7XG4gICAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOFxuICovXG5cblxuXG5pcGNNYWluLmhhbmRsZSgnbG9naW4tb3JnJywgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICAvKipcbiAgICogJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xuICAgICAgICArIGFyZ3NbMF0uYWxpYXNcbiAgICAgICAgKyAnIC1yICcgKyBhcmdzWzBdLnVybFxuICAgICAgICArICcgLS1qc29uJ1xuICAgKi9cblxuXG4gIHRyeVxuICB7XG4gICAgbGV0IHBpZCA9IGF3YWl0IGdldFBJRDE3MTcoKTtcbiAgICBpZiAocGlkICE9IC0xKVxuICAgIHtcbiAgICAgIHByb2Nlc3Mua2lsbChwaWQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKVxuICB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfVxuXG4gIGNvbnN0IHV0aWwgPSByZXF1aXJlKCdub2RlOnV0aWwnKTtcbiAgY29uc3QgZXhlY2MgPSB1dGlsLnByb21pc2lmeShyZXF1aXJlKCdub2RlOmNoaWxkX3Byb2Nlc3MnKS5leGVjKTtcbiAgY29uc3QgeyBzdGRvdXQsIHN0ZGVyciB9ID0gYXdhaXQgZXhlY2MoXG4gICAgJ3NmZHggZm9yY2U6YXV0aDp3ZWI6bG9naW4gLWEgJ1xuICAgICsgYXJnc1swXS5hbGlhc1xuICAgICsgJyAtciAnICsgYXJnc1swXS51cmxcbiAgICArICcgLS1qc29uJywge1xuICAgIHdpbmRvd3NIaWRlOiB0cnVlLFxuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuXG4gIH0pO1xuICBsZXQgYnVmZmVyRGF0YSA9IHN0ZG91dDtcblxuICByZXR1cm4gSlNPTi5wYXJzZShidWZmZXJEYXRhKTtcbn0pO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRQSUQxNzE3KClcbntcbiAgbGV0IHNwaWQgPSAtMTtcbiAgY29uc3QgdXRpbCA9IHJlcXVpcmUoJ25vZGU6dXRpbCcpO1xuICBjb25zdCBleGVjYyA9IHV0aWwucHJvbWlzaWZ5KHJlcXVpcmUoJ25vZGU6Y2hpbGRfcHJvY2VzcycpLmV4ZWMpO1xuICBjb25zdCB7IHN0ZG91dCwgc3RkZXJyIH0gPSBhd2FpdCBleGVjYyhcbiAgICAnbmV0c3RhdCAtYW9uJywge1xuICAgIG1heEJ1ZmZlcjogMTAyNCAqIDEwMjQgKiA4LFxuICB9KTtcbiAgbGV0IGNodW5rID0gc3Rkb3V0O1xuICBsZXQgc3ViY2h1Y2sgPSBjaHVuay5zcGxpdCgnXFxuJyk7XG4gIHN1YmNodWNrLmZvckVhY2goY2ggPT5cbiAge1xuICAgIGlmIChjaC5pbmNsdWRlcygnOjE3MTcnKSlcbiAgICB7XG4gICAgICBsZXQgcGlkID0gY2guc3BsaXQoJyAnKVxuICAgICAgcGlkID0gcGlkLmF0KC0xKTtcblxuICAgICAgc3BpZCA9PSAtMSA/IHNwaWQgPSBwaWQgOiBudWxsO1xuICAgIH1cbiAgfSlcbiAgcmV0dXJuIHNwaWQ7XG59XG5cbmlwY01haW4uaGFuZGxlKCdpbnRlcnJ1cHQtbG9naW4nLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIHRyeVxuICB7XG4gICAgbGV0IHBpZCA9IGF3YWl0IGdldFBJRDE3MTcoKTtcbiAgICBpZiAocGlkICE9IC0xKVxuICAgIHtcbiAgICAgIHByb2Nlc3Mua2lsbChwaWQpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyKVxuICB7XG4gICAgY29uc29sZS5sb2coZXJyKTtcbiAgfVxufSk7XG5cblxuaXBjTWFpbi5oYW5kbGUoJ3JldHJpZXZlLW1ldGFkYXRhJywgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICBjb25zdCB1dGlsID0gcmVxdWlyZSgnbm9kZTp1dGlsJyk7XG4gIGNvbnN0IGV4ZWNjID0gdXRpbC5wcm9taXNpZnkocmVxdWlyZSgnbm9kZTpjaGlsZF9wcm9jZXNzJykuZXhlYyk7XG4gIGNvbnN0IHsgc3Rkb3V0LCBzdGRlcnIgfSA9IGF3YWl0IGV4ZWNjKFxuICAgICdzZmR4IGZvcmNlOm1kYXBpOmxpc3RtZXRhZGF0YSAtLWpzb24gLXUgJ1xuICAgICsgYXJnc1swXS5vcmdcbiAgICArICcgLW0gJyArIGFyZ3NbMF0ubWR0TmFtZVxuICAgICsgJyAtYSAnICsgYXJnc1swXS5hcGksIHtcbiAgICBtYXhCdWZmZXI6IDEwMjQgKiAxMDI0ICogOCxcbiAgfSk7XG4gIGxldCBidWZmZXJEYXRhID0gc3Rkb3V0O1xuXG4gIHJldHVybiBidWZmZXJEYXRhO1xuXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQkFBOEU7QUFDOUUsa0JBQWlCO0FBQ2pCLGdCQUFlO0FBR2YsMkJBQStCO0FBRy9CLHlDQUFrRDtBQUxsRCxJQUFNLEVBQUUsT0FBTyxJQUFJLFFBQVE7QUFDM0IsSUFBTSxLQUFLLFFBQVE7QUFLbkIsSUFBSSxFQUFFLFdBQVcsWUFBWSxhQUFhLElBQUksUUFBUTtBQUV0RCxJQUFNLFdBQVcsUUFBUSxZQUFZLFVBQUFBLFFBQUcsU0FBUztBQUNqRCxJQUNBO0FBQ0UsTUFBSSxhQUFhLFdBQVcsNEJBQVksd0JBQXdCLE1BQ2hFO0FBQ0UsWUFBUSxNQUFNO0FBQUEsTUFDWixZQUFBQyxRQUFLLEtBQUssb0JBQUksUUFBUSxVQUFVLEdBQUcscUJBQXFCO0FBQUEsSUFDMUQ7QUFBQSxFQUNGO0FBQ0YsU0FBUyxHQUFQO0FBQVk7QUFFZCxJQUFJO0FBRUosU0FBUyxlQUNUO0FBSUUsZUFBYSxJQUFJLDhCQUFjO0FBQUEsSUFDN0IsTUFBTSxZQUFBQSxRQUFLLFFBQVEsV0FBVyxnQkFBZ0I7QUFBQSxJQUM5QyxlQUFlO0FBQUEsSUFDZixpQkFBaUI7QUFBQSxJQUNqQixPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxnQkFBZ0I7QUFBQSxJQUNoQixnQkFBZ0I7QUFBQSxNQUNkLG9CQUFvQjtBQUFBLE1BQ3BCLGtCQUFrQjtBQUFBLE1BQ2xCLGlCQUFpQjtBQUFBLE1BRWpCLFNBQVMsWUFBQUEsUUFBSyxRQUFRLFdBQVcsMkZBQW1DO0FBQUEsSUFDdEU7QUFBQSxFQUNGLENBQUM7QUFFRCxhQUFXLFFBQVEsdUJBQW1CO0FBRXRDLE1BQUksTUFDSjtBQUVFLFFBQ0E7QUFDRSw2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
