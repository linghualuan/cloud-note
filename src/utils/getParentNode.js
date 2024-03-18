const getParentNode = (node, parentClassName) => {
    let current = node

    while (current !== null) {
        if (current.classList.contains(parentClassName)) {
            return current
        }
        current = current.parentNode
    }

    return false
}

export default getParentNode