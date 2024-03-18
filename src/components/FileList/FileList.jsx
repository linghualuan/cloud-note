import FileItem from "../FileItem/FileItem"
import { connect } from "react-redux"
import './FileList.scss'

const FileList = ({ filelist, keywords }) => {
    let filteredList = filelist

    if (keywords) {
        filteredList = filelist.filter(file => {
            return file.title.includes(keywords)
        })
    } else {
        filteredList = filelist
    }

    return (
        <div className="filelist">
            {
                filteredList.map(file => {
                    return <FileItem key={file.id} fileinfo={file} />
                })
            }
        </div>
    )
}

function mapStateToProps(state) {
    return {
        filelist: state.filelist.intialState,
        keywords: state.filelist.keywords
    }
}

export default connect(mapStateToProps, null)(FileList)