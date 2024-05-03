import { BaseEntity, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Message } from "./message.entity";
import { User } from "./user.entity";

@Entity({name: 'chat'})
export class Chat extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @OneToMany(() => Message, (message) => message.chat)
  messages: Message[]

  @ManyToMany(() => User, (member) => member.chats, {cascade: true})
  @JoinTable()
  members: User[]
}