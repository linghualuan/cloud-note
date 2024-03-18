import FileSearch from "../FileSearch/FileSearch"
import FileList from "../FileList/FileList"
import AsideFooter from "../AsideFooter/AsideFooter"
import './FileAside.scss'

const FileAside = () => {
    // const handleInputSearch = (data) => {
    //     console.log('search', data)
    // }

    return (
        <div className="fileasise">
            <div className='filesize-search'>
                <FileSearch title={'我的文档'} />
            </div>
            <div className='fileasise-list'>
                <FileList className='fileasise-list' />
            </div>
            <div className='fileasise-fooer'>
                <AsideFooter />
            </div>
        </div>
    )
}

export default FileAside