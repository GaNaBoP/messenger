import { CreateChatData, GetMemberData, ChatMessageData } from "../utils/types";
import { Chat } from "../models/chat.entity";
import { User } from "../models/user.entity";
import { Message } from "../models/message.entity";
import UserService from "./user.service";

class ChatService {
  private checkIsChatExists(user1: User, user2: User): boolean {
    let isChatExists = false
    user1.chats.forEach((chat) => {
      chat.members.forEach((member) => {
        if (member.id === user2.id) {
          isChatExists = true
        }
      })
    })
    return isChatExists
  }

  async createChat(data: CreateChatData): Promise<Chat | null> {
    const invitedUser = await User.findOne({where: {id: data.invitedUserId}})
    const me = await UserService.findUserByToken(data.token, true)
    const newChat = new Chat()
    if (invitedUser && me && !this.checkIsChatExists(me, invitedUser)) { 
      newChat.members = [me, invitedUser]
      const chat = await newChat.save()
      return chat
    }
    return null
  }

  async getUserChats(token: string): Promise<Chat[] | null> {
    const me = await UserService.findUserByToken(token, true)
    if (!me) return null
    for (let i = 0; i < me.chats.length; i++) {
      me.chats[i].members = me.chats[i].members.filter((member) => member.id !== me.id)
    }
    return me.chats
  }
 
  async getMember(data: GetMemberData) {
    const me = await UserService.findUserByToken(data.token, true)
    const chat = await Chat.findOne({where: {id: data.chatId}, relations: {members: true}})
    if (!me || !chat) return 
    const member = chat.members.find((user) => user.id !== me.id)
    return member
  }

  async addChatMessage(data: ChatMessageData): Promise<void> {
    const me = await UserService.findUserByToken(data.token, false, true)
    const chat = await Chat.findOne({where: {id: data.chatId}, relations: {messages: true}})
    if (!me || !chat) return
    const newMessage = new Message()
    newMessage.text = data.message
    newMessage.user = me
    newMessage.chat = chat
    chat.messages.push(newMessage)
    await newMessage.save()
    await chat.save()
  }
}

export default new ChatService()