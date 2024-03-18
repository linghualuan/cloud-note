import { useEffect, useRef } from "react"
const remote = window.require('@electron/remote')
const { Menu, MenuItem } = remote

const useContextMenu = (itemArr, targetSelector) => {
    const clickElement = useRef(null)

    useEffect(() => {
        const menu = new Menu()

        itemArr.forEach(item => [
            menu.append(new MenuItem(item))
        ])

        const handleContextMenu = (e) => {
            if (targetSelector.current?.contains(e.target)) {
                clickElement.current = e.target
                menu.popup({ window: remote.getCurrentWindow() })
            }
        }

        window.addEventListener('contextmenu', handleContextMenu)

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu)
        }
    })

    return clickElement
}

export default useContextMenu
