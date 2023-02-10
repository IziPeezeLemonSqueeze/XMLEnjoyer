/**
 * This file is used specifically for security reasons.
 * Here you can access Nodejs stuff and inject functionality into
 * the renderer thread (accessible there through the "window" object)
 *
 * WARNING!
 * If you import anything from node_modules, then make sure that the package is specified
 * in package.json > dependencies and NOT in devDependencies
 *
 * Example (injects window.myAPI.doAThing() into renderer thread):
 *
 *   import { contextBridge } from 'electron'
 *
 *   contextBridge.exposeInMainWorld('myAPI', {
 *     doAThing: () => {}
 *   })
 */
import { contextBridge, ipcRenderer } from "electron";
import { Notify } from "quasar";


contextBridge.exposeInMainWorld("myAPI", {

  quitApp: () =>
  {
    ipcRenderer.invoke("quit-app")
  },

  minimizeApp: () =>
  {
    ipcRenderer.invoke("min-app")
  },

  maximizeApp: () =>
  {
    ipcRenderer.invoke("max-app")
  },

  savePackage: (value) =>
  {
    ipcRenderer.invoke("save-package", value)
  }

});

/* ipcRenderer.on('notify-saved-xml', (e, data) =>
{
  console.log('saved not', Notify)
  Notify.create({ message: 'XML SALVATO: ' + data });
}) */
