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
    width: 1450,
    height: 940,
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
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgbmF0aXZlVGhlbWUgfSBmcm9tIFwiZWxlY3Ryb25cIjtcclxuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IG9zIGZyb20gXCJvc1wiO1xyXG5pbXBvcnQgaW5zdGFsbEV4dGVuc2lvbiwgeyBWVUVKUzNfREVWVE9PTFMgfSBmcm9tIFwiZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyXCI7XHJcbnZhciB7IFhNTFBhcnNlciwgWE1MQnVpbGRlciwgWE1MVmFsaWRhdG9yIH0gPSByZXF1aXJlKFwiZmFzdC14bWwtcGFyc2VyXCIpO1xyXG4vLyBuZWVkZWQgaW4gY2FzZSBwcm9jZXNzIGlzIHVuZGVmaW5lZCB1bmRlciBMaW51eFxyXG5jb25zdCBwbGF0Zm9ybSA9IHByb2Nlc3MucGxhdGZvcm0gfHwgb3MucGxhdGZvcm0oKTtcclxudHJ5IHtcclxuICBpZiAocGxhdGZvcm0gPT09IFwid2luMzJcIiAmJiBuYXRpdmVUaGVtZS5zaG91bGRVc2VEYXJrQ29sb3JzID09PSB0cnVlKSB7XHJcbiAgICByZXF1aXJlKFwiZnNcIikudW5saW5rU3luYyhcclxuICAgICAgcGF0aC5qb2luKGFwcC5nZXRQYXRoKFwidXNlckRhdGFcIiksIFwiRGV2VG9vbHMgRXh0ZW5zaW9uc1wiKVxyXG4gICAgKTtcclxuICB9XHJcbn0gY2F0Y2ggKF8pIHt9XHJcblxyXG5sZXQgbWFpbldpbmRvdztcclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZVdpbmRvdygpIHtcclxuICAvKipcclxuICAgKiBJbml0aWFsIHdpbmRvdyBvcHRpb25zXHJcbiAgICovXHJcbiAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcclxuICAgIGljb246IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiaWNvbnMvaWNvbi5wbmdcIiksIC8vIHRyYXkgaWNvblxyXG4gICAgd2lkdGg6IDE0NTAsXHJcbiAgICBoZWlnaHQ6IDk0MCxcclxuICAgIHVzZUNvbnRlbnRTaXplOiB0cnVlLFxyXG4gICAgd2ViUHJlZmVyZW5jZXM6IHtcclxuICAgICAgZW5hYmxlUmVtb3RlTW9kdWxlOiBmYWxzZSxcclxuICAgICAgY29udGV4dElzb2xhdGlvbjogdHJ1ZSxcclxuICAgICAgbm9kZUludGVncmF0aW9uOiB0cnVlLFxyXG4gICAgICAvLyBNb3JlIGluZm86IGh0dHBzOi8vdjIucXVhc2FyLmRldi9xdWFzYXItY2xpLXZpdGUvZGV2ZWxvcGluZy1lbGVjdHJvbi1hcHBzL2VsZWN0cm9uLXByZWxvYWQtc2NyaXB0XHJcbiAgICAgIHByZWxvYWQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHByb2Nlc3MuZW52LlFVQVNBUl9FTEVDVFJPTl9QUkVMT0FEKSxcclxuICAgIH0sXHJcbiAgfSk7XHJcblxyXG4gIG1haW5XaW5kb3cubG9hZFVSTChwcm9jZXNzLmVudi5BUFBfVVJMKTtcclxuXHJcbiAgaWYgKHByb2Nlc3MuZW52LkRFQlVHR0lORykge1xyXG4gICAgLy8gaWYgb24gREVWIG9yIFByb2R1Y3Rpb24gd2l0aCBkZWJ1ZyBlbmFibGVkXHJcbiAgICB0cnkge1xyXG4gICAgICBpbnN0YWxsRXh0ZW5zaW9uKFtcIm5oZG9nam1lamlnbGlwY2Nwbm5uYW5oYmxlZGFqYnBkXCJdKVxyXG4gICAgICAgIC50aGVuKChuYW1lKSA9PiBjb25zb2xlLmxvZyhgQWRkZWQgRXh0ZW5zaW9uOiAgJHtuYW1lfWApKVxyXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmxvZyhcIkFuIGVycm9yIG9jY3VycmVkOiBcIiwgZXJyKSk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKGUpO1xyXG4gICAgfVxyXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vcGVuRGV2VG9vbHMoKTtcclxuICB9IGVsc2Uge1xyXG4gICAgLy8gd2UncmUgb24gcHJvZHVjdGlvbjsgbm8gYWNjZXNzIHRvIGRldnRvb2xzIHBsc1xyXG4gICAgbWFpbldpbmRvdy53ZWJDb250ZW50cy5vbihcImRldnRvb2xzLW9wZW5lZFwiLCAoKSA9PiB7XHJcbiAgICAgIC8vIG1haW5XaW5kb3cud2ViQ29udGVudHMuY2xvc2VEZXZUb29scygpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBtYWluV2luZG93Lm9uKFwiY2xvc2VkXCIsICgpID0+IHtcclxuICAgIG1haW5XaW5kb3cgPSBudWxsO1xyXG4gIH0pO1xyXG59XHJcblxyXG5hcHAud2hlblJlYWR5KCkudGhlbigocmVhZHkpID0+IHtcclxuICBjb25zb2xlLmxvZyhyZWFkeSk7XHJcblxyXG4gIGNyZWF0ZVdpbmRvdygpO1xyXG59KTtcclxuXHJcbmFwcC5vbihcIndpbmRvdy1hbGwtY2xvc2VkXCIsICgpID0+IHtcclxuICBpZiAocGxhdGZvcm0gIT09IFwiZGFyd2luXCIpIHtcclxuICAgIGFwcC5xdWl0KCk7XHJcbiAgfVxyXG59KTtcclxuXHJcbmFwcC5vbihcImFjdGl2YXRlXCIsICgpID0+IHtcclxuICBpZiAobWFpbldpbmRvdyA9PT0gbnVsbCkge1xyXG4gICAgY3JlYXRlV2luZG93KCk7XHJcbiAgfVxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxzQkFBeUQ7QUFDekQsa0JBQWlCO0FBQ2pCLGdCQUFlO0FBQ2YseUNBQWtEO0FBQ2xELElBQUksRUFBRSxXQUFXLFlBQVksYUFBYSxJQUFJLFFBQVE7QUFFdEQsSUFBTSxXQUFXLFFBQVEsWUFBWSxVQUFBQSxRQUFHLFNBQVM7QUFDakQsSUFBSTtBQUNGLE1BQUksYUFBYSxXQUFXLDRCQUFZLHdCQUF3QixNQUFNO0FBQ3BFLFlBQVEsTUFBTTtBQUFBLE1BQ1osWUFBQUMsUUFBSyxLQUFLLG9CQUFJLFFBQVEsVUFBVSxHQUFHLHFCQUFxQjtBQUFBLElBQzFEO0FBQUEsRUFDRjtBQUNGLFNBQVMsR0FBUDtBQUFXO0FBRWIsSUFBSTtBQUVKLFNBQVMsZUFBZTtBQUl0QixlQUFhLElBQUksOEJBQWM7QUFBQSxJQUM3QixNQUFNLFlBQUFBLFFBQUssUUFBUSxXQUFXLGdCQUFnQjtBQUFBLElBQzlDLE9BQU87QUFBQSxJQUNQLFFBQVE7QUFBQSxJQUNSLGdCQUFnQjtBQUFBLElBQ2hCLGdCQUFnQjtBQUFBLE1BQ2Qsb0JBQW9CO0FBQUEsTUFDcEIsa0JBQWtCO0FBQUEsTUFDbEIsaUJBQWlCO0FBQUEsTUFFakIsU0FBUyxZQUFBQSxRQUFLLFFBQVEsV0FBVywyRkFBbUM7QUFBQSxJQUN0RTtBQUFBLEVBQ0YsQ0FBQztBQUVELGFBQVcsUUFBUSx1QkFBbUI7QUFFdEMsTUFBSSxNQUF1QjtBQUV6QixRQUFJO0FBQ0YsNkNBQUFDLFNBQWlCLENBQUMsa0NBQWtDLENBQUMsRUFDbEQsS0FBSyxDQUFDLFNBQVMsUUFBUSxJQUFJLHFCQUFxQixNQUFNLENBQUMsRUFDdkQsTUFBTSxDQUFDLFFBQVEsUUFBUSxJQUFJLHVCQUF1QixHQUFHLENBQUM7QUFBQSxJQUMzRCxTQUFTLEdBQVA7QUFDQSxjQUFRLElBQUksQ0FBQztBQUFBLElBQ2Y7QUFDQSxlQUFXLFlBQVksYUFBYTtBQUFBLEVBQ3RDLE9BQU87QUFFTCxlQUFXLFlBQVksR0FBRyxtQkFBbUIsTUFBTTtBQUFBLElBRW5ELENBQUM7QUFBQSxFQUNIO0FBRUEsYUFBVyxHQUFHLFVBQVUsTUFBTTtBQUM1QixpQkFBYTtBQUFBLEVBQ2YsQ0FBQztBQUNIO0FBRUEsb0JBQUksVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVO0FBQzlCLFVBQVEsSUFBSSxLQUFLO0FBRWpCLGVBQWE7QUFDZixDQUFDO0FBRUQsb0JBQUksR0FBRyxxQkFBcUIsTUFBTTtBQUNoQyxNQUFJLGFBQWEsVUFBVTtBQUN6Qix3QkFBSSxLQUFLO0FBQUEsRUFDWDtBQUNGLENBQUM7QUFFRCxvQkFBSSxHQUFHLFlBQVksTUFBTTtBQUN2QixNQUFJLGVBQWUsTUFBTTtBQUN2QixpQkFBYTtBQUFBLEVBQ2Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogWyJvcyIsICJwYXRoIiwgImluc3RhbGxFeHRlbnNpb24iXQp9Cg==
