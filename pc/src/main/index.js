import { app, shell, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'

let mainWindow;
function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    minWidth: 400,
    minHeight: 400,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  });

  mainWindow.webContents.send('reader-json-file-data','4356');
  //处理serialApi
  serialApiHandle(mainWindow);

  //处理bleApi
  bleApiHandle(mainWindow);

  //以下为显示窗口
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
  
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  // IPC test
  ipcMain.on('ping', () => console.log('pong'))

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

//兼容MAC系统
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
let open_port = '';
function serialApiHandle(mainWindow){

  mainWindow.webContents.session.on('select-serial-port', async (event, portList, webContents, callback) => {
    // Add listeners to handle ports being added or removed before the callback for `select-serial-port`
    // is called.
    mainWindow.webContents.session.on('serial-port-added', (event, port) => {
      console.log('serial-port-added FIRED WITH', port)
      // Optionally update portList to add the new port
      
      mainWindow.webContents.send('reader-re-port',port);
    })

    mainWindow.webContents.session.on('serial-port-removed', (event, port) => {
      console.log('serial-port-removed FIRED WITH', port)
      // Optionally update portList to remove the port
      mainWindow.webContents.send('reader-re-port',port);
    })

    event.preventDefault();
    console.log(portList,'portList')

      mainWindow.webContents.send('reader-json-file-data',portList);

      if(open_port != '')
      {
        for (let item of portList) { // 使用for...of正确遍历数组元素
          if( item.portId ==open_port ) // 处理每个元素...
          {
            callback(open_port); 
            console.log('open'+open_port);
            return;
          }
        }
      }
      console.log('null_open');
      callback('');
  })
  ipcMain.on('message-open-port', (event, port) => {
    console.log('message-open-port', port);
  
    // 向渲染进程发送回复
    open_port = port;
  });


//授权
  mainWindow.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === 'serial') {
      return true
    }

    return false
  })
//授权
  mainWindow.webContents.session.setDevicePermissionHandler((details) => {
    if (details.deviceType === 'serial') {
      return true
    }

    return false
  })
}

//处理蓝牙事件
let open_ble = '';
function bleApiHandle(mainWindow){

  mainWindow.webContents.on('select-bluetooth-device', (event, deviceList, callback) => {
    event.preventDefault()
    //selectBluetoothCallback = callback

    console.log("deviceList",deviceList);
    
    if(open_ble != '')
    {
      for (let item of deviceList) { // 使用for...of正确遍历数组元素
        if( item.deviceId ==open_ble ) // 处理每个元素...
        {
          callback(open_ble); 
          console.log('open'+open_ble);
          //mainWindow.webContents.send('reader-ble-open-done',open_ble);
          return;
        }
      }
    }
  
    mainWindow.webContents.send('reader-ble-dev-list',deviceList);
    // const result = deviceList.find((device) => {
    //   return device.deviceName === 'test'
    // })
    // if (result) {
    //   callback(result.deviceId)
    // } else {
    //   // The device wasn't found so we need to either wait longer (eg until the
    //   // device is turned on) or until the user cancels the request
    // }
  })
  ipcMain.on('message-open-ble-mac', (event, ble_mac) => {
    console.log('message-open-ble-mac', ble_mac);
    // 向渲染进程发送回复
    open_ble = ble_mac;
  });
}
