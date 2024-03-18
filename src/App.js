import FileAside from './components/FileAside/FileAside'
import FileContent from './components/FileContent/FileContent'
import { connect } from 'react-redux'
import { getAllFileListAction, setSavedlocationAction, setQiniuConfigAction, setFileSyncAndUpdatedAtAction } from './redux/action/filelist'
import { useEffect } from 'react'
import './App.scss'

const { ipcRenderer } = window.require('electron')

function App({ onGetAllFileList, onSetSavedLocation, onSetQiniuConfigAction, onSetFileSyncAndUpdatedAtAction }) {
    useEffect(() => {
        onGetAllFileList()
        onSetSavedLocation('C:\\Program Files\\')
    }, [])

    useEffect(() => {
        ipcRenderer.on('setQiniuConfigToApp', (event, data) => {
            onSetQiniuConfigAction(data)
        })

        ipcRenderer.on('active-file-uploaded', (event, id) => {
            onSetFileSyncAndUpdatedAtAction(id)
        })

        const callback = () => {
            console.log('linghualuan')
        }
        ipcRenderer.on('create-new-file', callback)
        return () => {
            ipcRenderer.removeListener('create-new-file', callback)
        }
    })
    return (
        <div className="app">
            <div className='app-left'>
                <FileAside />
            </div>
            <div className='app-right'>
                <FileContent />
            </div>
        </div>
    )
}
const mapDispatchToProps = (dispatch) => {
    return {
        onGetAllFileList: () => {
            dispatch(getAllFileListAction())
        },
        onSetSavedLocation: (data) => {
            dispatch(setSavedlocationAction(data))
        },
        onSetQiniuConfigAction: (data) => {
            dispatch(setQiniuConfigAction(data))
        },
        onSetFileSyncAndUpdatedAtAction: (id) => {
            dispatch(setFileSyncAndUpdatedAtAction(id))
        }
    }
}
export default connect(null, mapDispatchToProps)(App)
