import { useState, useEffect, useCallback, memo, useMemo } from 'react'
import TabList from '../TabList/TabList'
import { connect } from 'react-redux'
import SimpleMDE from "react-simplemde-editor"
import "easymde/dist/easymde.min.css"
import * as marked from 'marked'
import { changeCurentFileContentAction, saveCurrentFileContentAction, setFileSyncAndUpdatedAtAction } from '../../redux/action/filelist'
import './FileContent.scss'
import fileHelper from '../../utils/fileHelper.js'

const Store = window.require('electron-store')
const { ipcRenderer } = window.require('electron')
const settingStore = new Store({ name: 'Settings' })

const path = window.require('path')

const getAutoSync = () => {
    let flag1 = ['accessKey', 'secretKey', 'bucket'].every(key => (key in settingStore.get('qiniuConfig')) && settingStore.get('qiniuConfig')[key])
    let flag2 = settingStore.get('enableAutoSync')
    return flag1 && flag2
}

const FileContent = memo(({ showTabList, filelist, currentActivedId, onChangeContentSaved, onSaveCurrentFileContent, onSetFileSyncAndUpdatedAtAction }) => {
    // 做一个标记，表示文件内容是否已经保存
    const [isSaved, setIsSaved] = useState(true)
    const [currentContent, setCurrentContent] = useState('')
    const [currentSyncFile, setCurrentSyncFile] = useState(null)

    useEffect(() => {
        const currentFile = filelist.find(item => {
            return item.id === currentActivedId
        })
        setCurrentSyncFile(currentFile)
        const currentShowTab = showTabList.find(item => {
            return item.parentId === currentActivedId
        })
        async function getCurrentFileContent() {
            let res = await fileHelper.readFile(path.join(currentFile.path, currentFile.filename))
            setCurrentContent(res)
        }
        if (currentFile) {
            getCurrentFileContent()
        }
        if (getAutoSync() && currentFile) {
            ipcRenderer.send('download-file', { key: currentFile.filename, path: currentFile.path, id: currentFile.id, updatedAt: currentFile.updatedAt })
        }
        currentShowTab && setIsSaved(currentShowTab.saved)
    }, [currentActivedId])

    useEffect(() => {
        const handleCallback = (event, data) => {
            if (data.status === 'download-success') {
                onSetFileSyncAndUpdatedAtAction(data)
                const currentSyncFile = filelist.find(item => {
                    return item.id === currentActivedId
                })
                setCurrentSyncFile(currentSyncFile)
            } else if (data.status === 'no-new-file') {
                console.log('文件未更新')
            }
        }
        ipcRenderer.on('file-download', handleCallback)
        return () => {
            ipcRenderer.removeListener('file-download', handleCallback)
        }
    })

    useEffect(() => {
        onChangeContentSaved({
            id: currentActivedId,
            isSaved,
        })
    }, [isSaved])

    const handleFileContentChange = useCallback((value) => {
        setIsSaved(false)
        setCurrentContent(value)
    }, [])

    const handleSaveCurrentFile = () => {
        try {
            const currentFile = filelist.find(item => {
                return item.id === currentActivedId
            })

            const { filename } = currentFile

            fileHelper.writeFile(path.join(currentFile.path + '\\' + filename), currentContent).then(res => {
                if (getAutoSync()) {
                    ipcRenderer.send('upload-file', { key: filename, path: `${currentFile.path}\\${filename}`, id: currentFile.id })

                }
            })
            setIsSaved(true)
            // 当文件保存之后，触发保存文件 action，使 tab 上的未保存原点消失
            onChangeContentSaved({
                id: currentActivedId,
                isSaved,
            })

            onSaveCurrentFileContent({
                id: currentActivedId,
                content: currentContent
            })

            let currentSyncFile = filelist.find(item => {
                return item.id === currentActivedId
            })
            setCurrentSyncFile(currentSyncFile)
        } catch (err) {
            console.log('err', err)
        }
    }

    const autofocusNoSpellcheckerOptions = useMemo(() => {
        return {
            spellChecker: false,
            previewRender: (plainText) => {
                return marked.parse(plainText)
            },
            autofocus: true,
            minHeight: 'calc(100vh - 370px)',
        }
    }, [])

    return (
        <div className="filecontent">
            <div className='filecontent-header'>
                {
                    showTabList.map(item => {
                        return <TabList
                            key={item.id}
                            currentInfo={item}
                        />
                    })
                }
            </div>
            <div className='filecontent-content'>
                {
                    currentActivedId ?
                        (
                            <>
                                <SimpleMDE
                                    value={currentContent}
                                    onChange={handleFileContentChange}
                                    options={autofocusNoSpellcheckerOptions}
                                />
                                <button onClick={handleSaveCurrentFile} className='filecontent-content-savebtn'>保存文件</button>

                                <div className='fileinfo-sync-updatedAt'>
                                    {
                                        currentSyncFile && `${currentSyncFile.isSynced ? '已同步' : '未同步'}, 上次更新时间: ${(new Date(currentSyncFile.updatedAt)).toLocaleDateString()} ${(new Date(currentSyncFile.updatedAt)).toLocaleTimeString()}`
                                    }
                                </div>
                            </>
                        ) : <div className='none-select'>
                            选择或创建新的markdown文档
                        </div>
                }
            </div>
        </div>
    )
})

const mapStateToProps = (state) => {
    return {
        filelist: state.filelist.intialState,
        showTabList: state.filelist.showTabList,
        currentActivedId: state.filelist.currentActivedId,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        onChangeContentSaved: (data) => {
            dispatch(changeCurentFileContentAction(data))
        },
        onSaveCurrentFileContent: (data) => {
            dispatch(saveCurrentFileContentAction(data))
        },
        onSetFileSyncAndUpdatedAtAction: (data) => {
            dispatch(setFileSyncAndUpdatedAtAction(data))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileContent) 