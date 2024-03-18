// 读取和写入文件
const fs = window.require('fs').promises

const fileHelper = {
    readFile, writeFile, renameFile, deleteFile
}

// 读取文件
function readFile(path) {
    return fs.readFile(path, { encoding: 'utf8' })
}

// 写入文件
function writeFile(path, content) {
    return fs.writeFile(path, content, { encoding: 'utf8' })
}

// 文件重命名
function renameFile(path, newName) {
    return fs.rename(path, newName)
}

// 文件删除
function deleteFile(path) {
    return fs.unlink(path)
}

export default fileHelper