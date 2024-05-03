import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { Chat } from "./chat.entity";

@Entity({name: 'message'})
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column({nullable: false})
  text: string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date

  @ManyToOne(() => User, (user) => user.messages, {onDelete: 'CASCADE'})
  user: User

  @ManyToOne(() => Chat, (chat) => chat.messages, {onDelete: 'CASCADE'})
  chat: Chat
}