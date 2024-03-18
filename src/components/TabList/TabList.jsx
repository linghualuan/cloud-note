import { useState } from 'react'
import { connect } from 'react-redux'
import { deleteTabShowAction, clickCurrentFile } from '../../redux/action/filelist'
import './TabList.scss'

const TabList = ({ currentInfo, onTabClick, onCloseTab, onDeleteShowTab, onClickCurrentFile, currentActivedId }) => {
    const [isMouseMove, setIsouseMove] = useState(false)

    const handleMouseEnter = () => {
        setIsouseMove(true)
    }

    const handleMouseLeave = () => {
        setIsouseMove(false)
    }

    const handleCloseTab = (id) => {
        onDeleteShowTab(id)
    }

    const handleClickTab = () => {
        onClickCurrentFile(currentInfo.parentId)
    }

    return (
        <div className="tablist" style={{ backgroundColor: currentActivedId === currentInfo.parentId ? '#ccc' : '' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <span className='tablist-title' onClick={handleClickTab}>
                {currentInfo.title}
            </span>
            <span
                className={`tablist-icon iconfont ${(currentInfo.saved || isMouseMove) ? '' : 'icon-yuandian'} ${isMouseMove || (currentActivedId === currentInfo.parentId) ? 'icon-chahao' : ''}`}
                onClick={() => handleCloseTab(currentInfo.id)}
            ></span>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        onDeleteShowTab: (id) => {
            dispatch(deleteTabShowAction(id))
        },
        onClickCurrentFile: (id) => {
            dispatch(clickCurrentFile(id))
        }
    }
}

const mapStateToProps = (state) => {
    return {
        currentActivedId: state.filelist.currentActivedId,
        showTabList: state.filelist.showTabList
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabList)