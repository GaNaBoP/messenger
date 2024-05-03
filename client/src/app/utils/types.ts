enum Roles {
  USER = "user",
  ADMIN = "admin"
}

export enum ActiveStatus {
  ONLINE="online",
  OFFLINE="offline"
} 

export interface IUser {
  id: number
  email: string
  username: string
  activeStatus: ActiveStatus
  role: Roles
}

export interface IChat {
  id: number
  members: IUser[]
}

export interface IMessage {
  id: number
  text: string
  createdAt: string
  updatedAt: string
  user: IUser
  isMyMessage: boolean
}