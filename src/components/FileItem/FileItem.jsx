import { useState, useRef } from 'react'
import { connect } from 'react-redux'
import { deleteFileAction, editFileAction, clickCurrentFile, delUnSavedNewFileAction } from '../../redux/action/filelist'
import fileHelper from '../../utils/fileHelper.js'
import Alert from '../Alert/Alert'
import useContextMenu from '../../hooks/useContextMenu'
import getParentNode from '../../utils/getParentNode'
import './FileItem.scss'

const path = window.require('path')

const FileItem = ({ fileinfo, fileList, onDeleteFile, onEditFile, onClickCurrentFile, currentActivedId, onDelUnSavedNewFileAction }) => {
    const [isEdit, setIsEdit] = useState(false)
    const [inputVal, setInputVal] = useState('')
    const [isFileNameSame, setIsFileNameSame] = useState(false)
    const currentClickRef = useRef(null)

    const clickElement = useContextMenu([
        {
            label: '打开',
            click: () => {
                const node = getParentNode(clickElement.current, 'fileitem-title-content')
                console.log('node', node)

                if (node) {
                    let file = JSON.parse(node.dataset.file)
                    node && onClickCurrentFile(file.id)
                }
            }
        },
        {
            label: '删除',
            click: () => {
                const node = getParentNode(clickElement.current, 'fileitem-title-content')
                if (node) {
                    let file = JSON.parse(node.dataset.file)
                    node && onDeleteFile(file.id)
                }
            }
        },
        {
            label: '重命名',
            click: () => {
                const node = getParentNode(clickElement.current, 'fileitem-title-content')
                if (node) {
                    let file = JSON.parse(node.dataset.file)
                    setInputVal(file.title)
                }
                setIsEdit(true)
            }
        }
    ], currentClickRef)

    // 点击编辑按钮
    const handleEditItem = (event, file) => {
        event.stopPropagation()
        setIsEdit(true)
        setInputVal(file.title)
    }

    // 点击删除
    const handleDelItem = (event, id) => {
        event.stopPropagation()
        onDeleteFile(id)
        // 删除本地文件
        fileHelper.deleteFile(path.join(`${fileinfo.path}\\${fileinfo.filename}`))
    }

    // 选中一项
    const handleClickFile = () => {
        onClickCurrentFile(fileinfo.id)
    }

    // 点击关闭icon
    const handleCloseEdit = () => {
        setIsEdit(false)
        setInputVal('')

        if (fileinfo?.isNew) {
            onDelUnSavedNewFileAction(fileinfo.id)
        }
    }

    // 输入框值变化
    const handleInputChange = (e) => {
        let value = e.target.value
        setInputVal(value)
    }

    // 按键按下
    const handleKeyDown = (e) => {
        let { keyCode } = e

        if (keyCode === 13) {
            let isFileNameSame = fileList.some(item => {
                return item.title === inputVal.trim()
            })
            if (isFileNameSame) {
                setIsFileNameSame(true)
            } else if (inputVal.trim()) {
                if (fileinfo?.isNew) {
                    try {
                        delete fileinfo.isNew
                        let title = inputVal
                        let filename = `${inputVal}.md`
                        let data = { ...fileinfo, title, filename }
                        onEditFile(data)

                        fileHelper.writeFile(path.join(fileinfo.path, `${inputVal}.md`), fileinfo.content)
                    } catch (err) {
                        console.log('err', err)
                    }
                } else {
                    try {
                        let title = inputVal
                        let filename = `${inputVal}.md`
                        let data = { ...fileinfo, title, filename }
                        onEditFile(data)
                        fileHelper.renameFile(path.join(fileinfo.path, fileinfo.filename), path.join(fileinfo.path, filename))
                    } catch (err) {
                        console.log('err', err)
                    }
                }

                setIsEdit(false)
                setInputVal('')
            }
        } else if (keyCode === 27) {
            setIsEdit(false)
            setInputVal('')
        }
    }

    const handleAlert = (data) => {
        setIsFileNameSame(data)
    }

    return (
        <div className="fileitem" style={{ backgroundColor: (currentActivedId === fileinfo.id) ? "#66666699" : '' }}>
            <div className='fileitem-title'>
                {
                    isEdit || fileinfo.isNew ?
                        <div className='fileitem-title-input'>
                            <input type="text" value={inputVal} onChange={handleInputChange} onKeyDown={handleKeyDown} autoFocus />
                        </div>
                        :
                        <div className='fileitem-title-content' onClick={handleClickFile} ref={currentClickRef} data-file={JSON.stringify(fileinfo)}>
                            <span className='iconfont icon-markdown'></span>
                            <span>{fileinfo.title}</span>
                        </div>
                }

            </div>
            <div className='fileitem-btns'>
                {
                    isEdit || fileinfo.isNew ?
                        <>
                            <div className='fileitem-btns-close' onClick={handleCloseEdit}>
                                <span className='iconfont icon-guanbi'></span>
                            </div>
                        </>
                        :
                        <>
                            <button className='fileitem-btns-edit' onClick={(event) => handleEditItem(event, fileinfo)}>编辑</button>
                            <button className='fileitem-btns-delete' onClick={(event) => handleDelItem(event, fileinfo.id)}>删除</button>
                        </>
                }
            </div>
            {
                isFileNameSame && <Alert setAlert={handleAlert} title={'文件已经存在，请更换文件名'} type={'danger'} />
            }
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteFile: (id) => dispatch(deleteFileAction(id)),
        onEditFile: (data) => dispatch(editFileAction(data)),
        onClickCurrentFile: (current) => dispatch(clickCurrentFile(current)),
        onDelUnSavedNewFileAction: (file) => dispatch(delUnSavedNewFileAction(file))
    }
}

const mapStateToProps = (state) => {
    return {
        currentActivedId: state.filelist.currentActivedId,
        fileList: state.filelist.intialState
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileItem)