import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, BaseEntity } from "typeorm"
import { ActiveStatus, Roles } from "../utils/types"
import { Chat } from "./chat.entity"
import { Message } from "./message.entity"

@Entity({name: 'user'})
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({nullable: false, unique: true})
  email: string

  @Column({nullable: false, unique: true})
  username: string

  @Column({nullable: false})
  password: string

  @Column({nullable: false, default: false})
  isBanned: boolean

  @Column({default: ActiveStatus.ONLINE})
  activeStatus: ActiveStatus

  @Column({default: Roles.USER})
  role: Roles

  @OneToMany(() => Message, (message) => message.user)
  messages: Message[]

  @ManyToMany(() => Chat, (chat) => chat.members)
  chats: Chat[]
}