import ReactDOM from 'react-dom';
import './Alert.scss'

const Alert = ({ title, setAlert, type }) => {
    const colorMap = {
        'warn': '#f56c6c',
        'success': '#95d475',
        'info': '#909399',
        'peimary': '#79bbff',
        'danger': '#f56c6c'
    }

    const handleCloseAlert = () => {
        setAlert(false)
    }

    return ReactDOM.createPortal(
        <div className="alert" style={{ backgroundColor: colorMap[type] }}>
            <div className='alert-title'>{title}</div>
            <div className='alert-close' onClick={handleCloseAlert}>
                <span className='iconfont icon-chahao'></span>
            </div>
        </div>
        ,
        document.getElementById('root'))
}

export default Alert