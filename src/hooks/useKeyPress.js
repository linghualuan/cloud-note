import { useEffect, useState } from "react"

const useKeyPress = (dom, targetKeyCode) => {
    const [keyPressed, setKeyPressed] = useState(false)
    console.log(dom)

    function keyUpHandler({ keyCode }) {
        if (targetKeyCode === keyCode) {
            setKeyPressed(false)
        }
    }

    function keyDownHanlder({ keyCode }) {
        if (targetKeyCode === keyCode) {
            setKeyPressed(true)
        }
    }

    useEffect(() => {
        if (dom) {
            dom.addEventListener('keyup', keyUpHandler)
            dom.addEventListener('keydown', keyDownHanlder)
        }

        return () => {
            if (dom) {
                dom.removeEventListener('keyup', keyUpHandler)
                dom.removeEventListener('keydown', keyDownHanlder)
            }
        }
    }, [])

    return keyPressed
}

export default useKeyPress