import styles from "./styles/chat.sass"

export default class ChatWidget {
    rootNode = null
    ws = null

    constructor() {
        this.init()
    }

    init() {
        this.renderRoot()
        this.wsConnect()
    }

    wsConnect() {
        this.ws = new WebSocket("wss://chat.devourer.ru/ws")

        this.ws.onopen = (e) => {
            console.log(e)
        }

        this.ws.onclose = (e) => {
            console.log(e)
        }

        this.ws.onmessage = (e) => {
            console.log(JSON.parse(e.data))
        }
    }

    renderRoot() {
        if (!this.rootNode) {
            this.rootNode = document.createElement("div")
            this.rootNode.classList.add(styles.chat)
            document.body.appendChild(this.rootNode)
        }
    }
}
