const remote = require('@electron/remote')
const Store = window.require('electron-store')
const settingStore = new Store({ name: 'Settings' })
const { ipcRenderer } = require('electron')

const $ = (id) => {
    return document.getElementById(id)
}

document.addEventListener('DOMContentLoaded', () => {
    let settingLocation = settingStore.get('settingLocation')
    let qiniuConfig = settingStore.get('qiniuConfig') || {}

    if (Object.keys(qiniuConfig).length) {
        $('AccessKey').value = qiniuConfig.accessKey
        $('SecretKey').value = qiniuConfig.secretKey
        $('Bucket').value = qiniuConfig.bucket
    }

    if (settingLocation) {
        $('address-input').value = settingLocation
    }

    $('address-select-btn').addEventListener('click', async () => {
        let res = await remote.dialog.showOpenDialog({
            properties: ['openDirectory'],
            message: '选择文件的储存路径'
        })

        if (Array.isArray(res.filePaths)) {
            $('address-input').value = res.filePaths[0] || settingLocation
            settingLocation = res.filePaths[0]
        }
    })

    $('filelocation-save-btn').addEventListener('click', () => {
        settingStore.set('settingLocation', settingLocation)
        remote.getCurrentWindow().close()
    })

    $('qiniu-save-btn').addEventListener('click', async () => {
        let qiniuConfig = {
            accessKey: $('AccessKey').value,
            secretKey: $('SecretKey').value,
            bucket: $('Bucket').value
        }

        settingStore.set('qiniuConfig', qiniuConfig)
        ipcRenderer.send('setQiniuConfig', qiniuConfig)
        ipcRenderer.send('config-is-saved')
        remote.getCurrentWindow().close()
    })
})