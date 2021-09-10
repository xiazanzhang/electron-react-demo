// main.js

// Modules to control application life and create native browser window
const { app, BrowserWindow, Menu } = require('electron')
const path = require('path')
const process = require('child_process');
const { createServer } = require('./koa');

const port = 8888


async function createWindow() {
    const url = await createServer(port)

    Menu.setApplicationMenu(null)
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1920,
        height: 1080,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    })

    // and load the index.html of the app.
    // mainWindow.loadFile('./build/index.html')

    mainWindow.loadURL(url)

    // mainWindow.loadURL('https://www.59kok.com/app/home')

    // Open the DevTools.
    // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// 部分 API 在 ready 事件触发后才能使用。
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. 也可以拆分成几个文件，然后用 require 导入。