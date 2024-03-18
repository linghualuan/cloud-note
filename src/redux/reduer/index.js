import { combineReducers } from 'redux'
import filelist from './filelist'
import content from './content'

export default combineReducers({
    filelist, content,
})