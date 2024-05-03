export enum Roles {
  USER = "user",
  ADMIN = "admin"
}

export enum ActiveStatus {
  ONLINE="online",
  OFFLINE="offline"
} 

export interface CreateChatData {
  token: string
  invitedUserId: number
}

export interface SearchUserData {
  token: string
  search: string
}

export interface GetMemberData {
  token: string
  chatId: number
}

export interface ChatMessageData {
  token: string
  chatId: number
  message: string
}

export interface GetChatMessagesData {
  token: string
  chatId: number
}

export interface DeleteMessageData {
  token: string
  msgId: number
  chatId: number
}