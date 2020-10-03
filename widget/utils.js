export const random = (from, to) => {
    if (!to) {
        ;[from, to] = [0, from]
    }
    to -= from
    return Math.floor(Math.random() * to + from)
}

export const randomFromArray = (arr) => arr[random(arr.length)]
