import { 
  CreateChatData, GetMemberData, 
  SearchUserData, ChatMessageData, GetChatMessagesData, 
  DeleteMessageData, ActiveStatus 
} from './src/utils/types'
import { Server, Socket } from 'socket.io'
import { AppDataSource } from './src/data-source'
import { User } from './src/models/user.entity'
import { Chat } from './src/models/chat.entity'
import { Message } from './src/models/message.entity'
import UserService from './src/services/user.service'
import ChatService from './src/services/chat.service'
import express from 'express'
import http from 'http'
import cors from 'cors'
import router from './src/router'
import 'dotenv/config'
import { Like } from 'typeorm'

const app = express()
const server = http.createServer(app)


app.use(cors())
app.use(express.json())
app.use(router)

const wss = new Server(server, {
  cors: {origin: '*'}
})

wss.on('connection', (ws: Socket) => {
  
  ws.on('search', async (data: SearchUserData) => {
    const me = await UserService.findUserByToken(data.token)
    if (!me) return
    const users = await User.find({where: {username: Like(`${data.search}%`)}})
    ws.emit('users found', users.filter((user) => user.id != me.id))
  })

  ws.on('connecting to my chats', async (token: string) => {
    const me = await UserService.findUserByToken(token, true)
    if (!me) return
    me.chats.forEach((chat) => {
      ws.join(`${chat.id}`)
    })
    me.activeStatus = ActiveStatus.ONLINE
    await me.save()
  })

  ws.on('create chat', async (data: CreateChatData) => {
    const chat = await ChatService.createChat(data)
    if (chat) {
      const myChats = await ChatService.getUserChats(data.token)
      ws.emit('get my chats', myChats)
      ws.join(`${chat.id}`)
    }
  })

  ws.on('get my chats', async (token: string) => {
    const myChats = await ChatService.getUserChats(token)
    if (myChats) 
      ws.emit('get my chats', myChats)
  })

  ws.on('get member', async (data: GetMemberData) => {
    const member = await ChatService.getMember(data)
    ws.emit('get member', member)
  })

  ws.on('chat message', async (data: ChatMessageData) => {
    await ChatService.addChatMessage(data)
    sendMessages(data.chatId, data.token)
  })

  ws.on('get messages', async (data: GetChatMessagesData) => {
    sendMessages(data.chatId, data.token)
  })

  ws.on('delete message', async (data: DeleteMessageData) => {
    await Message.delete({id: data.msgId})
    sendMessages(data.chatId, data.token)
  })

  ws.on('user disconnect', async (token: string) => {
    await UserService.setUserActiveStatusToOffline(token)
  })
})

async function sendMessages(chatId: number, token: string) {
  const me = await UserService.findUserByToken(token)
  const room = await Chat.findOne({where: {id: chatId}, relations: {messages: {user: true}}, order: {messages: {id: 'ASC'}}})
  if (!me || !room) return
  wss.to(`${room.id}`).emit('get messages', room.messages.map((message) => {
    return {...message, isMyMessage: message.user.username === me.username}
  }))
}

function start() {
  try {
    server.listen(process.env.PORT, () => {
      AppDataSource.initialize()
    })
  } catch (e) {
    console.log(e)
  }
}

start()