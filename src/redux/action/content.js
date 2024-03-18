import { SAVECURRENTCONTERNT } from '../contant'
// 保存当前编辑器的状态
export const saveCurrentContent = data => ({ type: SAVECURRENTCONTERNT, data })