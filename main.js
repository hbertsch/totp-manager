const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 900,
        height: 1500,
        backgroundColor: '#ffffff',
        // electron-builder configuration
        //icon: path.join(__dirname, "./build/r_icon.png"),
        // electron-packager configuration
        icon: `file://${__dirname}/dist/assets/logo.png`,
        
        // webPreferences: {
        //     webSecurity: false
        //   }
    })

    //win.setResizable(false)
    //win.setAlwaysOnTop(true);
    //win.loadFile(`file://${__dirname}/dist/index.html`)
    //win.loadURL(`file://${__dirname}/dist/index.html`)

    //electron-packager configuration
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'dist/index.html'),
        protocol: 'file:',
        slashes: true
      }));
    
    // electron-builder configuration
    // win.loadURL(
    //     url.format({
    //     pathname: path.join(__dirname, "./build/index.html"),
    //     protocol: "file",
    //     slashes: true
    //     })
    //    );
    
    // uncomment below to open the DevTools.
    //win.webContents.openDevTools()
    
    // Event when the window is closed.
    win.on('closed', function () {
        win = null
    })

    win.on('resize', function () {
        var size   = win.getSize();
        var width  = 800;
        var height = size[1];
        win.setSize(width,height);
    });
}


// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // macOS specific close process
    if (win === null) {
        createWindow()
    }
})