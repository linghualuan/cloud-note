import { v4 as uuidv4 } from 'uuid'
import { connect } from 'react-redux'
import { createNewFileAction, importFileAction } from '../../redux/action/filelist'
import './AsideFooter.scss'
import useIpcRenderer from '../../hooks/useIpcRenderer'

const remote = window.require('@electron/remote')
const path = window.require('path')

const AsideFooter = ({ onCreateNewFile, filelist, onImportFileAction, savedLocation }) => {
    const handleCreateNewFile = () => {
        const file = {
            id: uuidv4(),
            title: '',
            content: '## 请输入内容',
            path: savedLocation,
            filename: '',
            time: Date.now(),
            isNew: true,
            isSynced: false,
            updatedAt: ''
        }

        onCreateNewFile(file)
    }

    useIpcRenderer({
        'create-new-file': handleCreateNewFile
    })

    const handleImportFile = async () => {
        let res = await remote.dialog.showOpenDialog({
            title: '选择导入的Markdown文件',
            properties: ['openFile', 'multiSelections'],
            filters: [
                {
                    name: 'Markdown files',
                    extensions: ['md']
                }
            ]
        })

        const filterFile = res.filePaths.filter(filePath => {
            let titleName = path.basename(filePath, path.extname(filePath))
            const isExit = filelist.find(file => {
                return titleName === file.title
            })
            return !isExit
        })

        const importNewFileList = filterFile.map(filePath => {
            let theItem = {
                id: uuidv4(),
                title: path.basename(filePath, path.extname(filePath)),
                path: path.dirname(filePath),
                filename: path.basename(filePath),
                time: Date.now(),
                isSynced: false,
                updatedAt: ''
            }

            return theItem
        })
        onImportFileAction(importNewFileList)
    }

    return (
        <div className="asidefooter">
            <button onClick={handleCreateNewFile}>
                <span>新建</span>
                <span className='iconfont icon-xinjianpushu'></span>
            </button>
            <button onClick={handleImportFile}>
                <span>导入</span>
                <span className='iconfont icon-daoru-tianchong'></span>
            </button>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        onCreateNewFile: (data) => {
            dispatch(createNewFileAction(data))
        },
        onImportFileAction: (data) => {
            dispatch(importFileAction(data))
        }
    }
}

const mapStateToProps = (state) => {
    return {
        filelist: state.filelist.intialState,
        savedLocation: state.filelist.savedLocation
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AsideFooter)