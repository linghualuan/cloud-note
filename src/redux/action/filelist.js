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

// 删除左侧文件中的某一项
export const deleteFileAction = data => ({ type: DELETEFILEACTION, data })

// 编辑左侧文件中的某项的文件名
export const editFileAction = data => ({ type: EDITFILEACTION, data })

// 左侧顶部过滤
export const filterFileAction = data => ({ type: FILTERFILEACTION, data })

// 点击关闭一项tab
export const deleteTabShowAction = data => ({ type: DELETETABSHOWACTION, data })

// 点击左侧文件列表中的某一项
export const clickCurrentFile = data => ({ type: CLICKCURRENTFILE, data })

// 当文件内容改变时
export const changeCurentFileContentAction = data => ({ type: CHANGECURRENTFILECONTENT, data })

// 新建文件
export const createNewFileAction = data => ({ type: CREATENEWFILEACTION, data })

// 当新建文件时，点击叉号，用以删除文件
export const delUnSavedNewFileAction = data => ({ type: DELUNSAVEDNEWFILEACTION, data })

// 保存当前文件更改的内容
export const saveCurrentFileContentAction = data => ({ type: SAVECURRENTFILECONTENTACTION, data })

// 从缓存中获取文件列表
export const getAllFileListAction = data => ({ type: GETALLFILELISTACTION, data })

// 导入新文件
export const importFileAction = data => ({ type: IMPORTFILEACTION, data })

// 设置默认文件存储路径
export const setSavedlocationAction = data => ({ type: SETSAVEDLOCATIONACTION, data })

export const setQiniuConfigAction = data => ({ type: SETQINIUCONFIOGACTION, data })

export const setFileSyncAndUpdatedAtAction = data => ({ type: SETFILESYNCEDANDUPDATEDATACTION, data })

