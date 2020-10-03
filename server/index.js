const WebSocket = require("ws")
const http = require("http")
const cors = require("cors")
const express = require("express")

require("dotenv").config()
const app = express()
app.use(
    cors({
        origin: false,
    })
)

const port = process.env.PORT

const server = http.createServer(app)

const wss = new WebSocket.Server({ server })

wss.on("connection", (ws) => {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(
                JSON.stringify({
                    type: "cu",
                    connectedUsers: wss.clients.size,
                })
            )
        }
    })
    ws.on("message", (data) => {
        try {
            wss.clients.forEach((client) => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(
                        JSON.stringify({
                            type: "message",
                            ...JSON.parse(data),
                        })
                    )
                }
            })
        } catch (e) {}
    })
})

server.listen(port, () => {
    console.log(`🚀 started on port ${port} | ${new Date().toLocaleString()}`)
})
