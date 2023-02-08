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
    height: 1100,
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
        }
      );
    }
  }).catch((err) => {
    console.log(err);
  });
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLW1haW4uanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImltcG9ydCB7IGFwcCwgQnJvd3NlcldpbmRvdywgaXBjTWFpbiwgbmF0aXZlVGhlbWUgfSBmcm9tIFwiZWxlY3Ryb25cIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgb3MgZnJvbSBcIm9zXCI7XG5jb25zdCB7IGRpYWxvZyB9ID0gcmVxdWlyZSgnZWxlY3Ryb24nKVxuY29uc3QgZnMgPSByZXF1aXJlKCdmcycpO1xuXG5pbXBvcnQgaW5zdGFsbEV4dGVuc2lvbiwgeyBWVUVKUzNfREVWVE9PTFMgfSBmcm9tIFwiZWxlY3Ryb24tZGV2dG9vbHMtaW5zdGFsbGVyXCI7XG52YXIgeyBYTUxQYXJzZXIsIFhNTEJ1aWxkZXIsIFhNTFZhbGlkYXRvciB9ID0gcmVxdWlyZShcImZhc3QteG1sLXBhcnNlclwiKTtcbi8vIG5lZWRlZCBpbiBjYXNlIHByb2Nlc3MgaXMgdW5kZWZpbmVkIHVuZGVyIExpbnV4XG5jb25zdCBwbGF0Zm9ybSA9IHByb2Nlc3MucGxhdGZvcm0gfHwgb3MucGxhdGZvcm0oKTtcbnRyeVxue1xuICBpZiAocGxhdGZvcm0gPT09IFwid2luMzJcIiAmJiBuYXRpdmVUaGVtZS5zaG91bGRVc2VEYXJrQ29sb3JzID09PSB0cnVlKVxuICB7XG4gICAgcmVxdWlyZShcImZzXCIpLnVubGlua1N5bmMoXG4gICAgICBwYXRoLmpvaW4oYXBwLmdldFBhdGgoXCJ1c2VyRGF0YVwiKSwgXCJEZXZUb29scyBFeHRlbnNpb25zXCIpXG4gICAgKTtcbiAgfVxufSBjYXRjaCAoXykgeyB9XG5cbmxldCBtYWluV2luZG93O1xuXG5mdW5jdGlvbiBjcmVhdGVXaW5kb3coKVxue1xuICAvKipcbiAgICogSW5pdGlhbCB3aW5kb3cgb3B0aW9uc1xuICAgKi9cbiAgbWFpbldpbmRvdyA9IG5ldyBCcm93c2VyV2luZG93KHtcbiAgICBpY29uOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcImljb25zL2ljb24ucG5nXCIpLCAvLyB0cmF5IGljb25cbiAgICB0aXRsZUJhclN0eWxlOiAnaGlkZGVuJyxcbiAgICB0aXRsZUJhck92ZXJsYXk6IGZhbHNlLFxuICAgIHdpZHRoOiAxNDUwLFxuICAgIGhlaWdodDogMTEwMCxcbiAgICByZXNpemFibGU6IGZhbHNlLFxuICAgIHVzZUNvbnRlbnRTaXplOiB0cnVlLFxuICAgIHdlYlByZWZlcmVuY2VzOiB7XG4gICAgICBlbmFibGVSZW1vdGVNb2R1bGU6IGZhbHNlLFxuICAgICAgY29udGV4dElzb2xhdGlvbjogdHJ1ZSxcbiAgICAgIG5vZGVJbnRlZ3JhdGlvbjogdHJ1ZSxcbiAgICAgIC8vIE1vcmUgaW5mbzogaHR0cHM6Ly92Mi5xdWFzYXIuZGV2L3F1YXNhci1jbGktdml0ZS9kZXZlbG9waW5nLWVsZWN0cm9uLWFwcHMvZWxlY3Ryb24tcHJlbG9hZC1zY3JpcHRcbiAgICAgIHByZWxvYWQ6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIHByb2Nlc3MuZW52LlFVQVNBUl9FTEVDVFJPTl9QUkVMT0FEKSxcbiAgICB9LFxuICB9KTtcblxuICBtYWluV2luZG93LmxvYWRVUkwocHJvY2Vzcy5lbnYuQVBQX1VSTCk7XG5cbiAgaWYgKHByb2Nlc3MuZW52LkRFQlVHR0lORylcbiAge1xuICAgIC8vIGlmIG9uIERFViBvciBQcm9kdWN0aW9uIHdpdGggZGVidWcgZW5hYmxlZFxuICAgIHRyeVxuICAgIHtcbiAgICAgIGluc3RhbGxFeHRlbnNpb24oW1wibmhkb2dqbWVqaWdsaXBjY3Bubm5hbmhibGVkYWpicGRcIl0pXG4gICAgICAgIC50aGVuKChuYW1lKSA9PiBjb25zb2xlLmxvZyhgQWRkZWQgRXh0ZW5zaW9uOiAgJHtuYW1lfWApKVxuICAgICAgICAuY2F0Y2goKGVycikgPT4gY29uc29sZS5sb2coXCJBbiBlcnJvciBvY2N1cnJlZDogXCIsIGVycikpO1xuICAgIH0gY2F0Y2ggKGUpXG4gICAge1xuICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgfVxuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub3BlbkRldlRvb2xzKCk7XG4gIH0gZWxzZVxuICB7XG4gICAgLy8gd2UncmUgb24gcHJvZHVjdGlvbjsgbm8gYWNjZXNzIHRvIGRldnRvb2xzIHBsc1xuICAgIG1haW5XaW5kb3cud2ViQ29udGVudHMub24oXCJkZXZ0b29scy1vcGVuZWRcIiwgKCkgPT5cbiAgICB7XG4gICAgICBtYWluV2luZG93LndlYkNvbnRlbnRzLmNsb3NlRGV2VG9vbHMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG1haW5XaW5kb3cub24oXCJjbG9zZWRcIiwgKCkgPT5cbiAge1xuICAgIG1haW5XaW5kb3cgPSBudWxsO1xuICB9KTtcbn1cblxuYXBwLndoZW5SZWFkeSgpLnRoZW4oKHJlYWR5KSA9Plxue1xuICBjb25zb2xlLmxvZyhyZWFkeSk7XG5cbiAgY3JlYXRlV2luZG93KCk7XG59KTtcblxuYXBwLm9uKFwid2luZG93LWFsbC1jbG9zZWRcIiwgKCkgPT5cbntcbiAgaWYgKHBsYXRmb3JtICE9PSBcImRhcndpblwiKVxuICB7XG4gICAgYXBwLnF1aXQoKTtcbiAgfVxufSk7XG5cbmFwcC5vbihcImFjdGl2YXRlXCIsICgpID0+XG57XG4gIGlmIChtYWluV2luZG93ID09PSBudWxsKVxuICB7XG4gICAgY3JlYXRlV2luZG93KCk7XG4gIH1cbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcInF1aXQtYXBwXCIsICgpID0+XG57XG4gIGFwcC5xdWl0KCk7XG59KTtcblxuaXBjTWFpbi5oYW5kbGUoXCJtaW4tYXBwXCIsICgpID0+XG57XG4gIG1haW5XaW5kb3cubWluaW1pemUoKTtcbn0pO1xuXG5pcGNNYWluLmhhbmRsZShcIm1heC1hcHBcIiwgKCkgPT5cbntcbiAgaWYgKG1haW5XaW5kb3cuaXNNYXhpbWl6ZWQoKSlcbiAge1xuICAgIG1haW5XaW5kb3cudW5tYXhpbWl6ZSgpXG4gIH0gZWxzZVxuICB7XG4gICAgbWFpbldpbmRvdy5tYXhpbWl6ZSgpXG4gIH1cblxufSk7XG5cblxuaXBjTWFpbi5oYW5kbGUoXCJzYXZlLXBhY2thZ2VcIiwgYXN5bmMgKHZhbHVlLCAuLi5hcmdzKSA9Plxue1xuICBjb25zb2xlLmxvZyh2YWx1ZSwgYXJnc1swXSlcbiAgZGlhbG9nLnNob3dTYXZlRGlhbG9nKHtcbiAgICB0aXRsZTogJ1NlbGVjdCB0aGUgRmlsZSBQYXRoIHRvIHNhdmUnLFxuICAgIGRlZmF1bHRQYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vLi4vLi4vcGFja2FnZScpLFxuICAgIC8vIGRlZmF1bHRQYXRoOiBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4vYXNzZXRzLycpLFxuICAgIGJ1dHRvbkxhYmVsOiAnU2F2ZScsXG4gICAgLy8gUmVzdHJpY3RpbmcgdGhlIHVzZXIgdG8gb25seSBUZXh0IEZpbGVzLlxuICAgIGZpbHRlcnM6IFtcbiAgICAgIHtcbiAgICAgICAgbmFtZTogJ3htbCcsXG4gICAgICAgIGV4dGVuc2lvbnM6IFsneG1sJ11cbiAgICAgIH0sXSxcbiAgICBwcm9wZXJ0aWVzOiBbXVxuICB9KS50aGVuKGZpbGUgPT5cbiAge1xuICAgIC8vIFN0YXRpbmcgd2hldGhlciBkaWFsb2cgb3BlcmF0aW9uIHdhcyBjYW5jZWxsZWQgb3Igbm90LlxuICAgIGNvbnNvbGUubG9nKGZpbGUuY2FuY2VsZWQpO1xuICAgIGlmICghZmlsZS5jYW5jZWxlZClcbiAgICB7XG4gICAgICBjb25zb2xlLmxvZyhmaWxlLmZpbGVQYXRoLnRvU3RyaW5nKCkpO1xuXG4gICAgICAvLyBDcmVhdGluZyBhbmQgV3JpdGluZyB0byB0aGUgc2FtcGxlLnR4dCBmaWxlXG4gICAgICBmcy53cml0ZUZpbGUoZmlsZS5maWxlUGF0aC50b1N0cmluZygpLFxuICAgICAgICBhcmdzWzBdLCBmdW5jdGlvbiAoZXJyKVxuICAgICAge1xuICAgICAgICBpZiAoZXJyKSB0aHJvdyBlcnI7XG4gICAgICAgIGNvbnNvbGUubG9nKCdTYXZlZCEnKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSkuY2F0Y2goZXJyID0+XG4gIHtcbiAgICBjb25zb2xlLmxvZyhlcnIpXG4gIH0pO1xuXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsc0JBQXlEO0FBQ3pELGtCQUFpQjtBQUNqQixnQkFBZTtBQUlmLHlDQUFrRDtBQUhsRCxJQUFNLEVBQUUsT0FBTyxJQUFJLFFBQVE7QUFDM0IsSUFBTSxLQUFLLFFBQVE7QUFHbkIsSUFBSSxFQUFFLFdBQVcsWUFBWSxhQUFhLElBQUksUUFBUTtBQUV0RCxJQUFNLFdBQVcsUUFBUSxZQUFZLFVBQUFBLFFBQUcsU0FBUztBQUNqRCxJQUNBO0FBQ0UsTUFBSSxhQUFhLFdBQVcsNEJBQVksd0JBQXdCLE1BQ2hFO0FBQ0UsWUFBUSxNQUFNO0FBQUEsTUFDWixZQUFBQyxRQUFLLEtBQUssb0JBQUksUUFBUSxVQUFVLEdBQUcscUJBQXFCO0FBQUEsSUFDMUQ7QUFBQSxFQUNGO0FBQ0YsU0FBUyxHQUFQO0FBQVk7QUFFZCxJQUFJO0FBRUosU0FBUyxlQUNUO0FBSUUsZUFBYSxJQUFJLDhCQUFjO0FBQUEsSUFDN0IsTUFBTSxZQUFBQSxRQUFLLFFBQVEsV0FBVyxnQkFBZ0I7QUFBQSxJQUM5QyxlQUFlO0FBQUEsSUFDZixpQkFBaUI7QUFBQSxJQUNqQixPQUFPO0FBQUEsSUFDUCxRQUFRO0FBQUEsSUFDUixXQUFXO0FBQUEsSUFDWCxnQkFBZ0I7QUFBQSxJQUNoQixnQkFBZ0I7QUFBQSxNQUNkLG9CQUFvQjtBQUFBLE1BQ3BCLGtCQUFrQjtBQUFBLE1BQ2xCLGlCQUFpQjtBQUFBLE1BRWpCLFNBQVMsWUFBQUEsUUFBSyxRQUFRLFdBQVcsMkZBQW1DO0FBQUEsSUFDdEU7QUFBQSxFQUNGLENBQUM7QUFFRCxhQUFXLFFBQVEsdUJBQW1CO0FBRXRDLE1BQUksTUFDSjtBQUVFLFFBQ0E7QUFDRSw2Q0FBQUMsU0FBaUIsQ0FBQyxrQ0FBa0MsQ0FBQyxFQUNsRCxLQUFLLENBQUMsU0FBUyxRQUFRLElBQUkscUJBQXFCLE1BQU0sQ0FBQyxFQUN2RCxNQUFNLENBQUMsUUFBUSxRQUFRLElBQUksdUJBQXVCLEdBQUcsQ0FBQztBQUFBLElBQzNELFNBQVMsR0FBUDtBQUVBLGNBQVEsSUFBSSxDQUFDO0FBQUEsSUFDZjtBQUNBLGVBQVcsWUFBWSxhQUFhO0FBQUEsRUFDdEMsT0FDQTtBQUVFLGVBQVcsWUFBWSxHQUFHLG1CQUFtQixNQUM3QztBQUNFLGlCQUFXLFlBQVksY0FBYztBQUFBLElBQ3ZDLENBQUM7QUFBQSxFQUNIO0FBRUEsYUFBVyxHQUFHLFVBQVUsTUFDeEI7QUFDRSxpQkFBYTtBQUFBLEVBQ2YsQ0FBQztBQUNIO0FBRUEsb0JBQUksVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUN0QjtBQUNFLFVBQVEsSUFBSSxLQUFLO0FBRWpCLGVBQWE7QUFDZixDQUFDO0FBRUQsb0JBQUksR0FBRyxxQkFBcUIsTUFDNUI7QUFDRSxNQUFJLGFBQWEsVUFDakI7QUFDRSx3QkFBSSxLQUFLO0FBQUEsRUFDWDtBQUNGLENBQUM7QUFFRCxvQkFBSSxHQUFHLFlBQVksTUFDbkI7QUFDRSxNQUFJLGVBQWUsTUFDbkI7QUFDRSxpQkFBYTtBQUFBLEVBQ2Y7QUFDRixDQUFDO0FBRUQsd0JBQVEsT0FBTyxZQUFZLE1BQzNCO0FBQ0Usc0JBQUksS0FBSztBQUNYLENBQUM7QUFFRCx3QkFBUSxPQUFPLFdBQVcsTUFDMUI7QUFDRSxhQUFXLFNBQVM7QUFDdEIsQ0FBQztBQUVELHdCQUFRLE9BQU8sV0FBVyxNQUMxQjtBQUNFLE1BQUksV0FBVyxZQUFZLEdBQzNCO0FBQ0UsZUFBVyxXQUFXO0FBQUEsRUFDeEIsT0FDQTtBQUNFLGVBQVcsU0FBUztBQUFBLEVBQ3RCO0FBRUYsQ0FBQztBQUdELHdCQUFRLE9BQU8sZ0JBQWdCLE9BQU8sVUFBVSxTQUNoRDtBQUNFLFVBQVEsSUFBSSxPQUFPLEtBQUssRUFBRTtBQUMxQixTQUFPLGVBQWU7QUFBQSxJQUNwQixPQUFPO0FBQUEsSUFDUCxhQUFhLFlBQUFELFFBQUssS0FBSyxXQUFXLGtCQUFrQjtBQUFBLElBRXBELGFBQWE7QUFBQSxJQUViLFNBQVM7QUFBQSxNQUNQO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixZQUFZLENBQUMsS0FBSztBQUFBLE1BQ3BCO0FBQUEsSUFBRTtBQUFBLElBQ0osWUFBWSxDQUFDO0FBQUEsRUFDZixDQUFDLEVBQUUsS0FBSyxVQUNSO0FBRUUsWUFBUSxJQUFJLEtBQUssUUFBUTtBQUN6QixRQUFJLENBQUMsS0FBSyxVQUNWO0FBQ0UsY0FBUSxJQUFJLEtBQUssU0FBUyxTQUFTLENBQUM7QUFHcEMsU0FBRztBQUFBLFFBQVUsS0FBSyxTQUFTLFNBQVM7QUFBQSxRQUNsQyxLQUFLO0FBQUEsUUFBSSxTQUFVLEtBQ3JCO0FBQ0UsY0FBSTtBQUFLLGtCQUFNO0FBQ2Ysa0JBQVEsSUFBSSxRQUFRO0FBQUEsUUFDdEI7QUFBQSxNQUFDO0FBQUEsSUFDSDtBQUFBLEVBQ0YsQ0FBQyxFQUFFLE1BQU0sU0FDVDtBQUNFLFlBQVEsSUFBSSxHQUFHO0FBQUEsRUFDakIsQ0FBQztBQUVILENBQUM7IiwKICAibmFtZXMiOiBbIm9zIiwgInBhdGgiLCAiaW5zdGFsbEV4dGVuc2lvbiJdCn0K
