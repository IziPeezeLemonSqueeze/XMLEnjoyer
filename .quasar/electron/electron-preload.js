// src-electron/electron-preload.js
var import_electron = require("electron");
import_electron.contextBridge.exposeInMainWorld("myAPI", {
  quitApp: () => {
    import_electron.ipcRenderer.invoke("quit-app");
  },
  minimizeApp: () => {
    import_electron.ipcRenderer.invoke("min-app");
  },
  maximizeApp: () => {
    import_electron.ipcRenderer.invoke("max-app");
  },
  savePackage: (value) => {
    import_electron.ipcRenderer.invoke("save-package", value);
  },
  getAuthList: async () => {
    return await import_electron.ipcRenderer.invoke("auth-list");
  },
  logoutOrg: (value) => {
    import_electron.ipcRenderer.invoke("logout-org", value);
  },
  loginOrg: async (value) => {
    return await import_electron.ipcRenderer.invoke("login-org", value);
  },
  interruptLogin: () => {
    import_electron.ipcRenderer.invoke("interrupt-login");
  },
  retrieveMetadata: async (value) => {
    return await import_electron.ipcRenderer.invoke("retrieve-metadata", value);
  }
});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjLWVsZWN0cm9uL2VsZWN0cm9uLXByZWxvYWQuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8qKlxuICogVGhpcyBmaWxlIGlzIHVzZWQgc3BlY2lmaWNhbGx5IGZvciBzZWN1cml0eSByZWFzb25zLlxuICogSGVyZSB5b3UgY2FuIGFjY2VzcyBOb2RlanMgc3R1ZmYgYW5kIGluamVjdCBmdW5jdGlvbmFsaXR5IGludG9cbiAqIHRoZSByZW5kZXJlciB0aHJlYWQgKGFjY2Vzc2libGUgdGhlcmUgdGhyb3VnaCB0aGUgXCJ3aW5kb3dcIiBvYmplY3QpXG4gKlxuICogV0FSTklORyFcbiAqIElmIHlvdSBpbXBvcnQgYW55dGhpbmcgZnJvbSBub2RlX21vZHVsZXMsIHRoZW4gbWFrZSBzdXJlIHRoYXQgdGhlIHBhY2thZ2UgaXMgc3BlY2lmaWVkXG4gKiBpbiBwYWNrYWdlLmpzb24gPiBkZXBlbmRlbmNpZXMgYW5kIE5PVCBpbiBkZXZEZXBlbmRlbmNpZXNcbiAqXG4gKiBFeGFtcGxlIChpbmplY3RzIHdpbmRvdy5teUFQSS5kb0FUaGluZygpIGludG8gcmVuZGVyZXIgdGhyZWFkKTpcbiAqXG4gKiAgIGltcG9ydCB7IGNvbnRleHRCcmlkZ2UgfSBmcm9tICdlbGVjdHJvbidcbiAqXG4gKiAgIGNvbnRleHRCcmlkZ2UuZXhwb3NlSW5NYWluV29ybGQoJ215QVBJJywge1xuICogICAgIGRvQVRoaW5nOiAoKSA9PiB7fVxuICogICB9KVxuICovXG5pbXBvcnQgeyBjb250ZXh0QnJpZGdlLCBpcGNSZW5kZXJlciB9IGZyb20gXCJlbGVjdHJvblwiO1xuXG5cblxuY29udGV4dEJyaWRnZS5leHBvc2VJbk1haW5Xb3JsZChcIm15QVBJXCIsIHtcblxuICBxdWl0QXBwOiAoKSA9PlxuICB7XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKFwicXVpdC1hcHBcIilcbiAgfSxcblxuICBtaW5pbWl6ZUFwcDogKCkgPT5cbiAge1xuICAgIGlwY1JlbmRlcmVyLmludm9rZShcIm1pbi1hcHBcIilcbiAgfSxcblxuICBtYXhpbWl6ZUFwcDogKCkgPT5cbiAge1xuICAgIGlwY1JlbmRlcmVyLmludm9rZShcIm1heC1hcHBcIilcbiAgfSxcblxuICBzYXZlUGFja2FnZTogKHZhbHVlKSA9PlxuICB7XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKFwic2F2ZS1wYWNrYWdlXCIsIHZhbHVlKVxuICB9LFxuXG5cbiAgZ2V0QXV0aExpc3Q6IGFzeW5jICgpID0+XG4gIHtcbiAgICByZXR1cm4gYXdhaXQgaXBjUmVuZGVyZXIuaW52b2tlKCdhdXRoLWxpc3QnKVxuICB9LFxuXG4gIGxvZ291dE9yZzogKHZhbHVlKSA9PlxuICB7XG4gICAgaXBjUmVuZGVyZXIuaW52b2tlKCdsb2dvdXQtb3JnJywgdmFsdWUpO1xuICB9LFxuXG4gIGxvZ2luT3JnOiBhc3luYyAodmFsdWUpID0+XG4gIHtcbiAgICByZXR1cm4gYXdhaXQgaXBjUmVuZGVyZXIuaW52b2tlKCdsb2dpbi1vcmcnLCB2YWx1ZSk7XG4gIH0sXG5cbiAgaW50ZXJydXB0TG9naW46ICgpID0+XG4gIHtcbiAgICBpcGNSZW5kZXJlci5pbnZva2UoJ2ludGVycnVwdC1sb2dpbicpO1xuICB9LFxuXG4gIHJldHJpZXZlTWV0YWRhdGE6IGFzeW5jICh2YWx1ZSkgPT5cbiAge1xuICAgIHJldHVybiBhd2FpdCBpcGNSZW5kZXJlci5pbnZva2UoJ3JldHJpZXZlLW1ldGFkYXRhJywgdmFsdWUpO1xuICB9XG5cbn0pO1xuXG4vKiBpcGNSZW5kZXJlci5vbignYXV0aC1saXN0LXJlYWRlZCcsIChlLCBkYXRhKSA9Plxue1xuICBjb25zb2xlLmxvZyhkYXRhKVxuICBjb25zdCBfZGF0YSA9IEpTT04ucGFyc2UoZGF0YSk7XG4gIGlmIChfZGF0YS5zdGF0dXMgPT0gMClcbiAge1xuICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKCdvcmdzU2V0dGluZycsIEpTT04uc3RyaW5naWZ5KF9kYXRhLnJlc3VsdCkpXG4gIH1cbn0pOyAqL1xuLypcbmlwY1JlbmRlcmVyLm9uKCdtZHQtcmV0cmlldmVkJywgKGUsIGRhdGEpID0+XG57XG4gIGNvbnNvbGUubG9nKCdVUERBVEUgTURUJylcbiAgY29uc3QgX2RhdGEgPSBKU09OLnBhcnNlKGRhdGEpO1xuICBpZiAoX2RhdGEuc3RhdHVzID09IDApXG4gIHtcbiAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbSgnTURUX1RFTVAnLCBfZGF0YS5yZXN1bHQpO1xuICB9XG59KTsgKi9cbiJdLAogICJtYXBwaW5ncyI6ICI7QUFpQkEsc0JBQTJDO0FBSTNDLDhCQUFjLGtCQUFrQixTQUFTO0FBQUEsRUFFdkMsU0FBUyxNQUNUO0FBQ0UsZ0NBQVksT0FBTyxVQUFVO0FBQUEsRUFDL0I7QUFBQSxFQUVBLGFBQWEsTUFDYjtBQUNFLGdDQUFZLE9BQU8sU0FBUztBQUFBLEVBQzlCO0FBQUEsRUFFQSxhQUFhLE1BQ2I7QUFDRSxnQ0FBWSxPQUFPLFNBQVM7QUFBQSxFQUM5QjtBQUFBLEVBRUEsYUFBYSxDQUFDLFVBQ2Q7QUFDRSxnQ0FBWSxPQUFPLGdCQUFnQixLQUFLO0FBQUEsRUFDMUM7QUFBQSxFQUdBLGFBQWEsWUFDYjtBQUNFLFdBQU8sTUFBTSw0QkFBWSxPQUFPLFdBQVc7QUFBQSxFQUM3QztBQUFBLEVBRUEsV0FBVyxDQUFDLFVBQ1o7QUFDRSxnQ0FBWSxPQUFPLGNBQWMsS0FBSztBQUFBLEVBQ3hDO0FBQUEsRUFFQSxVQUFVLE9BQU8sVUFDakI7QUFDRSxXQUFPLE1BQU0sNEJBQVksT0FBTyxhQUFhLEtBQUs7QUFBQSxFQUNwRDtBQUFBLEVBRUEsZ0JBQWdCLE1BQ2hCO0FBQ0UsZ0NBQVksT0FBTyxpQkFBaUI7QUFBQSxFQUN0QztBQUFBLEVBRUEsa0JBQWtCLE9BQU8sVUFDekI7QUFDRSxXQUFPLE1BQU0sNEJBQVksT0FBTyxxQkFBcUIsS0FBSztBQUFBLEVBQzVEO0FBRUYsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
