import { SAVECURRENTCONTERNT } from '../contant'

const initalState = {
    currentContent: ''
}

function reducer(preState = initalState, action) {
    const { type, data } = action
    switch (type) {
        case SAVECURRENTCONTERNT:
            return { currentContent: data }
        default:
            return preState
    }
}

export default reducer