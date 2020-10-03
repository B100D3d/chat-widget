import styles from "./styles/chat.sass"
import { random, randomFromArray } from "./utils"

const wsUrl =
    process.env.PRODUCTION === "true"
        ? "wss://chat.devourer.ru/ws"
        : "ws://localhost:3000"

const nicknames = [
    "Неизвестный Енот",
    "Неизвестный Мангуст",
    "Неизвестный Ёж",
    "Неизвестный Лис",
    "Неизвестный крот",
    "Неизвестный бурундук",
]

export default class ChatWidget {
    rootNode = null
    chatNode = null
    inputNode = null
    usersCountNode = null
    ws = null
    nickname = null

    constructor() {
        this.nickname = this.getRandomNickname()
        this.init()
    }

    init() {
        this.render()
        this.wsConnect()
    }

    wsConnect() {
        this.ws = new WebSocket(wsUrl)

        this.ws.onopen = (e) => {
            console.log(e)
        }

        this.ws.onclose = (e) => {
            if (e.code === 1006 && !e.wasClean) {
                this.ws = new WebSocket(wsUrl)
            }
            console.log(e)
        }

        this.ws.onmessage = (e) => {
            try {
                const data = JSON.parse(e.data)
                if (data.type === "cu" && data.connectedUsers) {
                    this.setUsersCount(data.connectedUsers)
                } else if (
                    (data.type = "message" && data.message && data.nickname)
                ) {
                    this.addMessage(data)
                }
            } catch (e) {
                console.log(e)
            }
        }

        this.ws.onerror = (e) => {
            console.log(e)
        }
    }

    sendMessage = () => {
        const message = this.inputNode?.value?.trim()
        if (message) {
            this.ws.send(
                JSON.stringify({
                    nickname: this.nickname,
                    message: message,
                })
            )
            this.addOwnMessage(message)
            this.inputNode.value = ""
        }
    }

    addMessage({ message, nickname, own }) {
        const li = document.createElement("li")
        li.classList.add(styles.message)
        if (own) li.classList.add(styles["message--right"])

        const messageTextSpan = document.createElement("span")
        messageTextSpan.innerText = message

        const nicknameSpan = document.createElement("span")
        nicknameSpan.classList.add(styles.nickname)
        nicknameSpan.innerText = nickname

        li.appendChild(messageTextSpan)
        li.appendChild(nicknameSpan)
        if (this.chatNode.firstChild) {
            this.chatNode.insertBefore(li, this.chatNode.firstChild)
        } else {
            this.chatNode.appendChild(li)
        }
    }

    addOwnMessage(message) {
        this.addMessage({ message, nickname: this.nickname, own: true })
    }

    setUsersCount(count) {
        if (this.usersCountNode) {
            this.usersCountNode.innerText = `${count} online`
        }
    }

    getRandomNickname() {
        return randomFromArray(nicknames) + ` #${random(200)}`
    }

    toggleChatVisible = () => this.rootNode.classList.toggle(styles.show)

    renderRoot() {
        const chat = document.createElement("div")
        chat.classList.add(styles.chat, styles.show)
        document.body.appendChild(chat)
        this.rootNode = chat
        return this
    }

    renderHeader() {
        const header = document.createElement("div")
        header.classList.add(styles.header)

        const usersCount = document.createElement("span")
        usersCount.classList.add(styles.users)
        this.usersCountNode = usersCount

        const toggleShow = document.createElement("span")
        toggleShow.classList.add(styles.toggleShow)
        toggleShow.innerHTML = ">"
        toggleShow.addEventListener("click", this.toggleChatVisible)

        header.appendChild(toggleShow)
        header.appendChild(usersCount)

        this.rootNode.appendChild(header)
        return this
    }

    renderChat() {
        const chat = document.createElement("ul")
        chat.classList.add(styles.chatList)
        this.chatNode = chat
        this.rootNode.appendChild(chat)
        return this
    }

    renderInputs() {
        const inputContainer = document.createElement("div")
        inputContainer.classList.add(styles.inputContainer)

        const input = document.createElement("input")
        input.placeholder = "Сообщение"
        input.addEventListener("keypress", (e) => {
            if (e.key === "Enter") this.sendMessage()
        })
        this.inputNode = input

        const sendButton = document.createElement("button")
        sendButton.addEventListener("click", this.sendMessage)

        inputContainer.appendChild(input)
        inputContainer.appendChild(sendButton)
        this.rootNode.appendChild(inputContainer)
        return this
    }

    render() {
        if (this.rootNode) {
            this.rootNode.parentNode?.removeChild(this.rootNode)
        }
        this.renderRoot().renderHeader().renderChat().renderInputs()
    }
}
