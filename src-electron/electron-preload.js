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
  },


  getAuthList: async () =>
  {
    return await ipcRenderer.invoke('auth-list')
  },

  logoutOrg: (value) =>
  {
    ipcRenderer.invoke('logout-org', value);
  },

  loginOrg: async (value) =>
  {
    return await ipcRenderer.invoke('login-org', value);
  },

  interruptLogin: () =>
  {
    ipcRenderer.invoke('interrupt-login');
  },

  retrieveMetadata: async (value) =>
  {
    return await ipcRenderer.invoke('retrieve-metadata', value);
  },

  getExternalClipboard: async () =>
  {
    return await ipcRenderer.invoke('get-clipboard');
  },

  checkSfdxUpdate: async () =>
  {
    return await ipcRenderer.invoke('check-sfdx-update');
  }


});

/* ipcRenderer.on('auth-list-readed', (e, data) =>
{
  console.log(data)
  const _data = JSON.parse(data);
  if (_data.status == 0)
  {
    localStorage.setItem('orgsSetting', JSON.stringify(_data.result))
  }
}); */
/*
ipcRenderer.on('mdt-retrieved', (e, data) =>
{
  console.log('UPDATE MDT')
  const _data = JSON.parse(data);
  if (_data.status == 0)
  {
    localStorage.setItem('MDT_TEMP', _data.result);
  }
}); */
