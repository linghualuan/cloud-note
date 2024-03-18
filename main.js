// import isDev from 'electron-is-dev'
const isDev = require('electron-is-dev')
const { app, Menu, ipcMain, dialog } = require("electron")
const { initialize, enable } = require('@electron/remote/main')
const path = require('path')
const menuTemplate = require('./src/menuTemplate')
const AppWindow = require('./src/AppWindow')
const Store = require('electron-store')
const QiuniuManager = require('./src/utils/QiuniuManager')
Store.initRenderer()

const settingStore = new Store({ name: 'Settings' })
const fileStore = new Store({ name: 'Fileslist' })

const createManager = () => {
    const { accessKey, secretKey, bucket } = settingStore.get('qiniuConfig')
    return new QiuniuManager(accessKey, secretKey, bucket)
}

let mainWindow
let settingWindow

app.on('ready', () => {
    const mainWindowConfig = {
        width: 1440,
        height: 768,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, './preload.js'),
            contextIsolation: false,
        }
    }
    // const url = isDev ? 'http://localhost:3000' : 'url'
    const url = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, './build/index.html')}`
    mainWindow = new AppWindow(mainWindowConfig, url)
    initialize()
    enable(mainWindow.webContents)
    mainWindow.on('closed', () => {
        mainWindow = null
    })

    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)

    ipcMain.on('open-settings-window', () => {
        const settingWindowConfig = {
            width: 700,
            height: 600,
            parent: mainWindow,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, './preload.js'),
                contextIsolation: false,
            }
        }

        const settingFileLocation = `${path.join(__dirname, './setting/setting.html')}`
        settingWindow = new AppWindow(settingWindowConfig, settingFileLocation)
        enable(settingWindow.webContents)
        settingWindow.on('closed', () => {
            settingWindow = null
        })
    })

    ipcMain.on('setQiniuConfig', (event, data) => {
        mainWindow.webContents.send('setQiniuConfigToApp', data)
    })

    ipcMain.on('config-is-saved', () => {
        let qiniuMenu = process.platform === 'darwin' ? menu.items[3] : menu.items[2]
        const switchItems = (toggle) => {
            [1, 2, 3].forEach(number => {
                qiniuMenu.submenu.items[number].enabled = toggle
            })
        }
        let qiniuConfig = settingStore.get('qiniuConfig')
        const qiniuIsConfig = ['accessKey', 'secretKey', 'bucket'].every(key => ((key in qiniuConfig && qiniuConfig[key].trim() !== '')))
        if (qiniuIsConfig) {
            switchItems(true)
        } else {
            switchItems(false)
        }
    })

    ipcMain.on('upload-file', (event, data) => {
        const manager = createManager()
        manager.uploadFile(data.key, data.path).then(res => {
            mainWindow.webContents.send('active-file-uploaded', data.id)
        }).catch(err => {
            dialog.showErrorBox('同步失败', '请检查七牛云参数是否正确')
        })
    })

    ipcMain.on('download-file', (event, data) => {
        const manager = createManager()
        manager.getStat(data.key).then(res => {
            const serverUpdatedTime = Math.round(res.putTime / 10000)
            const localUpdatedTime = data.updatedAt

            if (serverUpdatedTime > localUpdatedTime || !localUpdatedTime) {
                manager.downloadFile(data.key, `${data.path}\\${data.filename}`).then((res) => {
                    mainWindow.webContents.send('file-download', { status: 'download-success', id: data.id, serverUpdatedTime })
                })
            } else {
                mainWindow.webContents.send('file-download', { status: 'no-new-file', id: data.id })
            }
        }, err => {
            if (err.statusCode === 612) {
                mainWindow.webContents.send('file-download', { status: 'no-file', id: data.id })
            }
        })
    })

    ipcMain.on('upload-all-to-qiniu', () => {
        const manager = createManager()
        const fileObj = fileStore.get('fileslist') || {}
        let updatePromiseArr = fileObj.map(file => {
            return manager.uploadFile(file.filename, `${file.path}\\${file.filename}`)
        })

        Promise.all(updatePromiseArr).then(res => {
            console.log(res)
            dialog.showMessageBox({
                type: 'info',
                title: `成功上传了${res.length}个文件`,
                message: `成功上传了${res.length}个文件`
            })
            mainWindow.webContents.send('files-uploaded')
        }).catch(() => {
            dialog.showErrorBox('同步失败', '请检查七牛云参数是否正确')
        })
    })
})