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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgbmF0aXZlVGhlbWUsIE5vdGlmaWNhdGlvbiB9IGZyb20gXCJlbGVjdHJvblwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBvcyBmcm9tIFwib3NcIjtcbmNvbnN0IHsgZGlhbG9nIH0gPSByZXF1aXJlKCdlbGVjdHJvbicpXG5jb25zdCBmcyA9IHJlcXVpcmUoJ2ZzJyk7XG5cbmltcG9ydCBpbnN0YWxsRXh0ZW5zaW9uLCB7IFZVRUpTM19ERVZUT09MUyB9IGZyb20gXCJlbGVjdHJvbi1kZXZ0b29scy1pbnN0YWxsZXJcIjtcbnZhciB7IFhNTFBhcnNlciwgWE1MQnVpbGRlciwgWE1MVmFsaWRhdG9yIH0gPSByZXF1aXJlKFwiZmFzdC14bWwtcGFyc2VyXCIpO1xuLy8gbmVlZGVkIGluIGNhc2UgcHJvY2VzcyBpcyB1bmRlZmluZWQgdW5kZXIgTGludXhcbmNvbnN0IHBsYXRmb3JtID0gcHJvY2Vzcy5wbGF0Zm9ybSB8fCBvcy5wbGF0Zm9ybSgpO1xudHJ5XG57XG4gIGlmIChwbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiICYmIG5hdGl2ZVRoZW1lLnNob3VsZFVzZURhcmtDb2xvcnMgPT09IHRydWUpXG4gIHtcbiAgICByZXF1aXJlKFwiZnNcIikudW5saW5rU3luYyhcbiAgICAgIHBhdGguam9pbihhcHAuZ2V0UGF0aChcInVzZXJEYXRhXCIpLCBcIkRldlRvb2xzIEV4dGVuc2lvbnNcIilcbiAgICApO1xuICB9XG59IGNhdGNoIChfKSB7IH1cblxubGV0IG1haW5XaW5kb3c7XG5cbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpXG57XG4gIC8qKlxuICAgKiBJbml0aWFsIHdpbmRvdyBvcHRpb25zXG4gICAqL1xuICBtYWluV2luZG93ID0gbmV3IEJyb3dzZXJXaW5kb3coe1xuICAgIGljb246IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiaWNvbnMvaWNvbi5wbmdcIiksIC8vIHRyYXkgaWNvblxuICAgIHRpdGxlQmFyU3R5bGU6ICdoaWRkZW4nLFxuICAgIHRpdGxlQmFyT3ZlcmxheTogZmFsc2UsXG4gICAgd2lkdGg6IDE0NTAsXG4gICAgaGVpZ2h0OiAxMDAxLFxuICAgIHJlc2l6YWJsZTogZmFsc2UsXG4gICAgdXNlQ29udGVudFNpemU6IHRydWUsXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcbiAgICAgIGVuYWJsZVJlbW90ZU1vZHVsZTogZmFsc2UsXG4gICAgICBjb250ZXh0SXNvbGF0aW9uOiB0cnVlLFxuICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxuICAgICAgLy8gTW9yZSBpbmZvOiBodHRwczovL3YyLnF1YXNhci5kZXYvcXVhc2FyLWNsaS12aXRlL2RldmVsb3BpbmctZWxlY3Ryb24tYXBwcy9lbGVjdHJvbi1wcmVsb2FkLXNjcmlwdFxuICAgICAgcHJlbG9hZDogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgcHJvY2Vzcy5lbnYuUVVBU0FSX0VMRUNUUk9OX1BSRUxPQUQpLFxuICAgIH0sXG4gIH0pO1xuXG4gIG1haW5XaW5kb3cubG9hZFVSTChwcm9jZXNzLmVudi5BUFBfVVJMKTtcblxuICBpZiAocHJvY2Vzcy5lbnYuREVCVUdHSU5HKVxuICB7XG4gICAgLy8gaWYgb24gREVWIG9yIFByb2R1Y3Rpb24gd2l0aCBkZWJ1ZyBlbmFibGVkXG4gICAgdHJ5XG4gICAge1xuICAgICAgaW5zdGFsbEV4dGVuc2lvbihbXCJuaGRvZ2ptZWppZ2xpcGNjcG5ubmFuaGJsZWRhamJwZFwiXSlcbiAgICAgICAgLnRoZW4oKG5hbWUpID0+IGNvbnNvbGUubG9nKGBBZGRlZCBFeHRlbnNpb246ICAke25hbWV9YCkpXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmxvZyhcIkFuIGVycm9yIG9jY3VycmVkOiBcIiwgZXJyKSk7XG4gICAgfSBjYXRjaCAoZSlcbiAgICB7XG4gICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICB9XG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcbiAgfSBlbHNlXG4gIHtcbiAgICAvLyB3ZSdyZSBvbiBwcm9kdWN0aW9uOyBubyBhY2Nlc3MgdG8gZGV2dG9vbHMgcGxzXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vbihcImRldnRvb2xzLW9wZW5lZFwiLCAoKSA9PlxuICAgIHtcbiAgICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMuY2xvc2VEZXZUb29scygpO1xuICAgIH0pO1xuICB9XG5cbiAgbWFpbldpbmRvdy5vbihcImNsb3NlZFwiLCAoKSA9PlxuICB7XG4gICAgbWFpbldpbmRvdyA9IG51bGw7XG4gIH0pO1xufVxuXG5hcHAud2hlblJlYWR5KCkudGhlbigocmVhZHkpID0+XG57XG4gIGNvbnNvbGUubG9nKHJlYWR5KTtcblxuICBjcmVhdGVXaW5kb3coKTtcbn0pO1xuXG5hcHAub24oXCJ3aW5kb3ctYWxsLWNsb3NlZFwiLCAoKSA9Plxue1xuICBpZiAocGxhdGZvcm0gIT09IFwiZGFyd2luXCIpXG4gIHtcbiAgICBhcHAucXVpdCgpO1xuICB9XG59KTtcblxuYXBwLm9uKFwiYWN0aXZhdGVcIiwgKCkgPT5cbntcbiAgaWYgKG1haW5XaW5kb3cgPT09IG51bGwpXG4gIHtcbiAgICBjcmVhdGVXaW5kb3coKTtcbiAgfVxufSk7XG5cbmlwY01haW4uaGFuZGxlKFwicXVpdC1hcHBcIiwgKCkgPT5cbntcbiAgYXBwLnF1aXQoKTtcbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcIm1pbi1hcHBcIiwgKCkgPT5cbntcbiAgbWFpbldpbmRvdy5taW5pbWl6ZSgpO1xufSk7XG5cbmlwY01haW4uaGFuZGxlKFwibWF4LWFwcFwiLCAoKSA9Plxue1xuICBpZiAobWFpbldpbmRvdy5pc01heGltaXplZCgpKVxuICB7XG4gICAgbWFpbldpbmRvdy51bm1heGltaXplKClcbiAgfSBlbHNlXG4gIHtcbiAgICBtYWluV2luZG93Lm1heGltaXplKClcbiAgfVxuXG59KTtcblxuXG5pcGNNYWluLmhhbmRsZShcInNhdmUtcGFja2FnZVwiLCBhc3luYyAodmFsdWUsIC4uLmFyZ3MpID0+XG57XG4gIGNvbnNvbGUubG9nKHZhbHVlLCBhcmdzWzBdKVxuICBkaWFsb2cuc2hvd1NhdmVEaWFsb2coe1xuICAgIHRpdGxlOiAnU2VsZWN0IHRoZSBGaWxlIFBhdGggdG8gc2F2ZScsXG4gICAgZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi8uLi8uLi9wYWNrYWdlJyksXG4gICAgLy8gZGVmYXVsdFBhdGg6IHBhdGguam9pbihfX2Rpcm5hbWUsICcuLi9hc3NldHMvJyksXG4gICAgYnV0dG9uTGFiZWw6ICdTYXZlJyxcbiAgICAvLyBSZXN0cmljdGluZyB0aGUgdXNlciB0byBvbmx5IFRleHQgRmlsZXMuXG4gICAgZmlsdGVyczogW1xuICAgICAge1xuICAgICAgICBuYW1lOiAneG1sJyxcbiAgICAgICAgZXh0ZW5zaW9uczogWyd4bWwnXVxuICAgICAgfSxdLFxuICAgIHByb3BlcnRpZXM6IFtdXG4gIH0pLnRoZW4oZmlsZSA9PlxuICB7XG4gICAgLy8gU3RhdGluZyB3aGV0aGVyIGRpYWxvZyBvcGVyYXRpb24gd2FzIGNhbmNlbGxlZCBvciBub3QuXG4gICAgY29uc29sZS5sb2coZmlsZS5jYW5jZWxlZCk7XG4gICAgaWYgKCFmaWxlLmNhbmNlbGVkKVxuICAgIHtcbiAgICAgIGNvbnNvbGUubG9nKGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XG5cbiAgICAgIC8vIENyZWF0aW5nIGFuZCBXcml0aW5nIHRvIHRoZSBzYW1wbGUudHh0IGZpbGVcbiAgICAgIGZzLndyaXRlRmlsZShmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCksXG4gICAgICAgIGFyZ3NbMF0sIGZ1bmN0aW9uIChlcnIpXG4gICAgICB7XG4gICAgICAgIGlmIChlcnIpIHRocm93IGVycjtcbiAgICAgICAgY29uc29sZS5sb2coJ1NhdmVkIScpO1xuICAgICAgICAvL21haW5XaW5kb3cud2ViQ29udGVudHMuc2VuZCgnbm90aWZ5LXNhdmVkLXhtbCcsIGZpbGUuZmlsZVBhdGgudG9TdHJpbmcoKSk7XG4gICAgICAgIG5ldyBOb3RpZmljYXRpb24oeyB0aXRsZTogJ1hNTEVuam95ZXInLCBib2R5OiAnWE1MIFBhY2thZ2Ugc2FsdmF0bzpcXG4nICsgZmlsZS5maWxlUGF0aC50b1N0cmluZygpIH0pLnNob3coKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkuY2F0Y2goZXJyID0+XG4gIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpXG4gIH0pO1xuXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0JBQXVFO0FBQ3ZFLGtCQUFpQjtBQUNqQixnQkFBZTtBQUlmLHlDQUFrRDtBQUhsRCxJQUFNLEVBQUUsT0FBTyxJQUFJLFFBQVE7QUFDM0IsSUFBTSxLQUFLLFFBQVE7QUFHbkIsSUFBSSxFQUFFLFdBQVcsWUFBWSxhQUFhLElBQUksUUFBUTtBQUV0RCxJQUFNLFdBQVcsUUFBUSxZQUFZLFVBQUFBLFFBQUcsU0FBUztBQUNqRCxJQUNBO0FBQ0UsTUFBSSxhQUFhLFdBQVcsNEJBQVksd0JBQXdCLE1BQ2hFO0FBQ0UsWUFBUSxNQUFNO0FBQUEsTUFDWixZQUFBQyxRQUFLLEtBQUssb0JBQUksUUFBUSxVQUFVLEdBQUcscUJBQXFCO0FBQUEsSUFDMUQ7QUFBQSxFQUNGO0FBQ0YsU0FBUyxHQUFQO0FBQVk7QUFFZCxJQUFJO0FBRUosU0FBUyxlQUNUO0FBSUUsZUFBYSxJQUFJLDhCQUFjO0FBQUEsSUFDN0IsTUFBTSxZQUFBQSxRQUFLLFFBQVEsV0FBVyxnQkFBZ0I7QUFBQSxJQUM5QyxlQUFlO0FBQUEsSUFDZixpQkFBaUI7QUFBQSxJQUNqQixPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxnQkFBZ0I7QUFBQSxJQUNoQixnQkFBZ0I7QUFBQSxN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
