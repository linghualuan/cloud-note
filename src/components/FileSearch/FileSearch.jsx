import { useState } from 'react'
import { connect } from 'react-redux'
import { filterFileAction } from '../../redux/action/filelist'
import './FileSearch.scss'

const FileSearch = ({ onFilterFile, title }) => {
    const [value, setValue] = useState('')
    const [inputActive, setInputActive] = useState(false)

    const handleChangeValue = (e) => {
        setValue(e.target.value)
    }

    // 搜索或关闭
    const handleCloseOrSearch = () => {
        setInputActive(!inputActive)
        setValue('')
    }

    // 点击按键事件
    const handleKeyDown = (e) => {
        let code = e.keyCode
        if (code === 13) {
            onFilterFile(value)
            handleCloseOrSearch()
        } else if (code === 27) {
            handleCloseOrSearch()
        }
    }

    return (
        <>
            <div className='FileSearch'>
                <div className="FileSearch-input">
                    {
                        inputActive ? <input type="text" onChange={handleChangeValue} onKeyDown={handleKeyDown} /> : <span>{title}</span>
                    }
                </div>
                <div className="FileSearch-button">
                    {
                        inputActive
                            ?
                            <div onClick={handleCloseOrSearch}>
                                <span className='button-font iconfont icon-guanbi'></span>
                            </div> : <div onClick={handleCloseOrSearch}>
                                <span className='button-font iconfont icon-sousuo'></span>
                            </div>
                    }
                </div>
            </div>
        </>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        onFilterFile: (keywords) => {
            dispatch(filterFileAction(keywords))
        }
    }
}

export default connect(null, mapDispatchToProps)(FileSearch)