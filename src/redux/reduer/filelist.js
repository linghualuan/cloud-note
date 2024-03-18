import {
    DELETEFILEACTION,
    EDITFILEACTION,
    FILTERFILEACTION,
    DELETETABSHOWACTION,
    CLICKCURRENTFILE,
    CHANGECURRENTFILECONTENT,
    CREATENEWFILEACTION,
    DELUNSAVEDNEWFILEACTION,
    SAVECURRENTFILECONTENTACTION,
    GETALLFILELISTACTION,
    IMPORTFILEACTION,
    SETSAVEDLOCATIONACTION,
    SETQINIUCONFIOGACTION,
    SETFILESYNCEDANDUPDATEDATACTION
} from '../contant'

const Store = window.require('electron-store')

const fileStore = new Store({ name: 'Fileslist' })
const settingStore = new Store({ name: 'Settings' })

// 初始化存储
fileStore.set('fileslist', fileStore.get('fileslist') || [])

const intialState = [
    // {
    //     id: 1,
    //     title: '文件1',
    //     content: '## 这是我的文件1',
    //     time: '2024-03-11'
    // },
    // {
    //     id: 2,
    //     title: '文件2',
    //     content: '这是我的文件2',
    //     time: '2024-03-12'
    // },
    // {
    //     id: 3,
    //     title: '文件3',
    //     content: '这是我的文件3',
    //     time: '2024-03-13'
    // },
    // {
    //     id: 4,
    //     title: '文件4',
    //     content: '这是我的文件4',
    //     time: '2024-03-14'
    // },
    // {
    //     id: 5,
    //     title: '文件5',
    //     content: '这是我的文件5',
    //     time: '2024-03-15'
    // },
    // {
    //     id: 6,
    //     title: '文件6',
    //     content: '这是我的文件6',
    //     time: '2024-03-16'
    // },
    // {
    //     id: 7,
    //     title: '文件7',
    //     content: '这是我的文件7',
    //     time: '2024-03-17'
    // },
    // {
    //     id: 8,
    //     title: '文件8',
    //     content: '这是我的文件8',
    //     time: '2024-03-17'
    // },
]

const showTabList = [
    // {
    //     id: 1,
    //     parentId: 1,
    //     saved: true,
    //     showed: true,
    //     title: '文件1'
    // },
    // {
    //     id: 2,
    //     parentId: 2,
    //     saved: false,
    //     showed: true,
    //     title: '文件2'
    // },
    // {
    //     id: 3,
    //     parentId: 3,
    //     saved: false,
    //     showed: false,
    //     title: '文件3'
    // },
    // {
    //     id: 4,
    //     parentId: 4,
    //     saved: true,
    //     showed: false,
    //     title: '文件4'
    // },
    // {
    //     id: 5,
    //     parentId: 5,
    //     saved: true,
    //     showed: true,
    //     title: '文件5'
    // },
    // {
    //     id: 6,
    //     parentId: 6,
    //     saved: false,
    //     showed: false,
    //     title: '文件6'
    // },
    // {
    //     id: 7,
    //     parentId: 7,
    //     saved: false,
    //     showed: false,
    //     title: '文件7'
    // },
    // {
    //     id: 8,
    //     parentId: 8,
    //     saved: false,
    //     showed: false,
    //     title: '文件8'
    // },
]

const state = {
    keywords: '',
    intialState,
    showTabList,
    currentActivedId: '',
    savedLocation: '',
    qiniuConfig: {}
}

function fileReduer(preState = state, action) {
    const { type, data } = action

    switch (type) {
        case DELETEFILEACTION:
            let filterFileList = preState.intialState.filter(item => {
                return item.id !== data
            })
            let filterShowList = preState.showTabList.filter(item => {
                return item.parentId !== data
            })

            let fileCurrentActivedId

            if (filterFileList.length === 0) {
                fileCurrentActivedId = ''
            } else {
                let index = preState.intialState.findIndex(item => {
                    return preState.currentActivedId === item.id
                })

                if (index === preState.intialState.length - 1) {
                    fileCurrentActivedId = filterFileList[index - 1]
                } else {
                    fileCurrentActivedId = filterFileList[index]
                }
            }

            fileStore.set('fileslist', [...filterFileList])
            return {
                ...preState,
                intialState: filterFileList,
                showTabList: filterShowList,
                currentActivedId: fileCurrentActivedId,
            }
        case EDITFILEACTION:
            // 当新建文件名或者修改文件名后传递过来的文件信息
            const deitFile = preState.intialState.map(item => {
                // 如果 ID 相同则替换这一项
                if (item.id === data.id) {
                    item = data
                }
                delete item.content
                return item
            })
            // 存储到 fileslist
            fileStore.set('fileslist', [...deitFile])
            // 同时将数据替换到 intialState
            return { ...preState, intialState: deitFile }
        case FILTERFILEACTION:
            return {
                ...preState,
                keywords: data
            }
        case DELETETABSHOWACTION:
            const index = preState.showTabList.findIndex(item => {
                return item.id === data
            })

            const filterShowTabs = preState.showTabList.filter(item => {
                return data !== item.id
            })

            let currentActivedId

            if (preState.showTabList.length === 1) {
                currentActivedId = ''
            } else if (preState.showTabList.length > 1) {
                if (index === 0) {
                    currentActivedId = preState.showTabList[index + 1].parentId
                } else if (index === preState.showTabList.length - 1) {
                    currentActivedId = preState.showTabList[index - 1].parentId
                } else {
                    currentActivedId = preState.showTabList[index + 1].parentId
                }
            }

            return { ...preState, showTabList: filterShowTabs, currentActivedId }
        case CLICKCURRENTFILE:
            let exitTab = preState.showTabList.find(item => {
                return item.parentId === data
            })
            if (!exitTab) {
                let currentItem = preState.intialState.find(item => {
                    return item.id === data
                })
                const tab = {
                    id: Date.now(),
                    parentId: data,
                    saved: true,
                    title: currentItem.title
                }
                const currentShowTabs = [
                    ...preState.showTabList,
                    tab
                ]
                return { ...preState, currentActivedId: data, showTabList: currentShowTabs }
            } else {
                return { ...preState, currentActivedId: data }
            }
        case CHANGECURRENTFILECONTENT:
            const changeStatusTab = preState.showTabList.map(item => {
                if (item.parentId == data.id) {
                    item.saved = data.isSaved
                }
                return item
            })
            return { ...preState, showTabList: changeStatusTab }

        // 新建文件
        case CREATENEWFILEACTION:
            if (preState.intialState[preState.intialState.length - 1]?.isNew) {
                return preState
            }
            const newFileList = [...preState.intialState, data]
            return { ...preState, intialState: newFileList }
        case DELUNSAVEDNEWFILEACTION:
            const delUnSavedFiles = preState.intialState.filter(item => {
                return item.id !== data
            })
            return { ...preState, intialState: delUnSavedFiles }
        case SAVECURRENTFILECONTENTACTION:
            let savedFiles = preState.intialState.map(item => {
                if (item.id === data.id) {
                    item.content = data.content
                }
                return item
            })
            return { ...preState, intialState: savedFiles }
        case GETALLFILELISTACTION:
            // fileStore.delete('fileslist')
            return { ...preState, intialState: (fileStore.get('fileslist') || []) }
        case IMPORTFILEACTION:
            console.log('data', data)
            fileStore.set('fileslist', [...preState.intialState, ...data])
            return { ...preState, intialState: [...preState.intialState, ...data] }
        case SETSAVEDLOCATIONACTION:
            let savedLocation = settingStore.get('settingLocation') || data
            return { ...preState, savedLocation }
        case SETQINIUCONFIOGACTION:
            return { ...preState, qiniuConfig: data }
        case SETFILESYNCEDANDUPDATEDATACTION:
            let fileSyncUpdate = preState.intialState.map(file => {
                if (file.id === data) {
                    file.isSynced = true
                    file.updatedAt = new Date().getTime()
                }
                return file
            })
            fileStore.set('fileslist', fileSyncUpdate)
            return { ...preState, intialState: fileSyncUpdate }
        default:
            return preState
    }
}

export default fileReduer