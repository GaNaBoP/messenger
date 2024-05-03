import { DataSource } from "typeorm";
import { User } from "./models/user.entity";
import { Message } from "./models/message.entity";
import { Chat } from "./models/chat.entity";
import "dotenv/config"

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  synchronize: true,
  entities: [User, Message, Chat]
})