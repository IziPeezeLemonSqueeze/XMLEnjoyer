import { app, BrowserWindow, ipcMain, nativeTheme, Notification, shell } from "electron";
import path from "path";
import os from "os";
const { dialog } = require('electron')
const fs = require('fs');
import { exec, execSync } from "child_process";


import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
var { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
// needed in case process is undefined under Linux
const platform = process.platform || os.platform();
try
{
  if (platform === "win32" && nativeTheme.shouldUseDarkColors === true)
  {
    require("fs").unlinkSync(
      path.join(app.getPath("userData"), "DevTools Extensions")
    );
  }
} catch (_) { }

let mainWindow;

function createWindow()
{
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    icon: path.resolve(__dirname, "icons/icon.png"), // tray icon
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    width: 1450,
    height: 1001,
    resizable: false,
    useContentSize: true,
    webPreferences: {
      enableRemoteModule: false,
      contextIsolation: true,
      nodeIntegration: true,
      // More info: https://v2.quasar.dev/quasar-cli-vite/developing-electron-apps/electron-preload-script
      preload: path.resolve(__dirname, process.env.QUASAR_ELECTRON_PRELOAD),
    },
  });

  mainWindow.loadURL(process.env.APP_URL);

  if (process.env.DEBUGGING)
  {
    // if on DEV or Production with debug enabled
    try
    {
      installExtension(["nhdogjmejiglipccpnnnanhbledajbpd"])
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err));
    } catch (e)
    {
      console.log(e);
    }
    mainWindow.webContents.openDevTools();
  } else
  {
    // we're on production; no access to devtools pls
    mainWindow.webContents.on("devtools-opened", () =>
    {
      mainWindow.webContents.closeDevTools();
    });
  }

  mainWindow.on("closed", () =>
  {
    mainWindow = null;
  });
}

app.whenReady().then((ready) =>
{
  console.log(ready);

  createWindow();


});

app.on("window-all-closed", () =>
{
  if (platform !== "darwin")
  {
    app.quit();
  }
});

app.on("activate", () =>
{
  if (mainWindow === null)
  {
    createWindow();
  }
});

ipcMain.handle("quit-app", () =>
{
  app.quit();
});

ipcMain.handle("min-app", () =>
{
  mainWindow.minimize();
});

ipcMain.handle("max-app", () =>
{
  if (mainWindow.isMaximized())
  {
    mainWindow.unmaximize()
  } else
  {
    mainWindow.maximize()
  }

});

ipcMain.handle("save-package", async (value, ...args) =>
{
  console.log(value, args[0])
  dialog.showSaveDialog({
    title: 'Select the File Path to save',
    defaultPath: path.join(__dirname, '../../../package'),
    // defaultPath: path.join(__dirname, '../assets/'),
    buttonLabel: 'Save',
    // Restricting the user to only Text Files.
    filters: [
      {
        name: 'xml',
        extensions: ['xml']
      },],
    properties: []
  }).then(file =>
  {
    // Stating whether dialog operation was cancelled or not.
    console.log(file.canceled);
    if (!file.canceled)
    {
      console.log(file.filePath.toString());

      // Creating and Writing to the sample.txt file
      fs.writeFile(file.filePath.toString(),
        args[0], function (err)
      {
        if (err) throw err;
        console.log('Saved!');
        //mainWindow.webContents.send('notify-saved-xml', file.filePath.toString());
        new Notification({ title: 'XMLEnjoyer', body: 'XML Package salvato:\n' + file.filePath.toString() }).show();
      });
    }
  }).catch(err =>
  {
    console.log(err)
  });

});


ipcMain.handle('auth-list', async () =>
{
  /*   let _CLI = exec('sfdx force:auth:list --json', {
      maxBuffer: 1024 * 1024 * 8,
    });

    let bufferData = '';

    _CLI.stdout.on('data', (chunk) =>
    {
      //    console.log('CHUNK', chunk);
      bufferData += chunk;
    });

    _CLI.stdin.on('data', (data) =>
    {
      //    console.log('IN', data);
    });

    _CLI.stderr.on('data', (data) =>
    {
      //    console.log('ERR', data);
    });

    _CLI.on('exit', (code, signal) =>
    {
      mainWindow.webContents.send('auth-list-readed', bufferData);
    }); */

  const util = require('node:util');
  const execc = util.promisify(require('node:child_process').exec);
  const { stdout, stderr } = await execc(
    'sfdx force:auth:list --json', {
    maxBuffer: 1024 * 1024 * 8,
  });
  let bufferData = stdout;

  return JSON.parse(bufferData);

});

ipcMain.handle('logout-org', (value, ...args) =>
{

  let _CLI = exec('sfdx auth:logout -u ' + args[0] + ' -p', {
    maxBuffer: 1024 * 1024 * 8,
  });

  _CLI.stderr.on('data', (data) =>
  {
    console.log('ERR', data);
  });

  _CLI.on('exit', (code, signal) =>
  {
    //updateOnLogOperation();
  });
});

/**
 * 'sfdx force:auth:web:login -a '
      + args[0].alias
      + ' -r ' + args[0].url
      + ' --json', {
      maxBuffer: 1024 * 1024 * 8
 */



ipcMain.handle('login-org', async (value, ...args) =>
{
  /**
   * 'sfdx force:auth:web:login -a '
        + args[0].alias
        + ' -r ' + args[0].url
        + ' --json'
   */


  try
  {
    let pid = await getPID1717();
    if (pid != -1)
    {
      process.kill(pid);
    }
  } catch (err)
  {
    console.log(err);
  }

  const util = require('node:util');
  const execc = util.promisify(require('node:child_process').exec);
  const { stdout, stderr } = await execc(
    'sfdx force:auth:web:login -a '
    + args[0].alias
    + ' -r ' + args[0].url
    + ' --json', {
    windowsHide: true,
    maxBuffer: 1024 * 1024 * 8,

  });
  let bufferData = stdout;

  return JSON.parse(bufferData);
});

async function getPID1717()
{
  let spid = -1;
  const util = require('node:util');
  const execc = util.promisify(require('node:child_process').exec);
  const { stdout, stderr } = await execc(
    'netstat -aon', {
    maxBuffer: 1024 * 1024 * 8,
  });
  let chunk = stdout;
  let subchuck = chunk.split('\n');
  subchuck.forEach(ch =>
  {
    if (ch.includes(':1717'))
    {
      let pid = ch.split(' ')
      pid = pid.at(-1);

      spid == -1 ? spid = pid : null;
    }
  })
  return spid;
}

ipcMain.handle('interrupt-login', async (value, ...args) =>
{
  try
  {
    let pid = await getPID1717();
    if (pid != -1)
    {
      process.kill(pid);
    }
  } catch (err)
  {
    console.log(err);
  }
});


ipcMain.handle('retrieve-metadata', async (value, ...args) =>
{
  const util = require('node:util');
  const execc = util.promisify(require('node:child_process').exec);
  const { stdout, stderr } = await execc(
    'sfdx force:mdapi:listmetadata --json -u '
    + args[0].org
    + ' -m ' + args[0].mdtName
    + ' -a ' + args[0].api, {
    maxBuffer: 1024 * 1024 * 8,
  });
  let bufferData = stdout;

  return bufferData;

})
