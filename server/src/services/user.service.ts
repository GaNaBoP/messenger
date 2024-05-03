import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { ActiveStatus } from "../utils/types";
import { User } from "../models/user.entity";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
  async register(req: Request, res: Response) {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({message: "Incorrect data"})
    }

    const {email, username, password} = req.body
    try {
      const isUserExists = await User.findOneBy({email, username})

      if (isUserExists) {
        return res.json({message: "The user already exists"})
      }

      const hashedPassword = bcrypt.hashSync(password, 3) 

      const newUser = await User.save({email, username, password: hashedPassword})
      const token = jwt.sign({userId: newUser.id}, 'secret', {expiresIn: '24h'})
      return res.json({token})

    } catch (error) {
      return res.json({message: "An error has occurred"})
    }
  }

  async login(req: Request, res: Response) {

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({message: "Incorrect data"})
    }
    
    const {email, username, password} = req.body
    try {

      const user = await User.findOneBy({email, username})

      if (!user) {
        return res.json({message: "The user already exists"})
      }

      const isPasswordMatch = bcrypt.compareSync(password, user.password)

      if (!isPasswordMatch) {
        return res.json({message: "The passwords don't match"})
      }

      const token = jwt.sign({userId: user.id}, 'secret', {expiresIn: '24h'})
      return res.json({token})

    } catch (error) {
      return res.json({message: "An error has occurred"})
    }
  }

  async findUserByToken(token: string, membersRelations: boolean = false, messagesRelations: boolean = false): Promise<User | null> {
    try {
      const payload: any = jwt.verify(token, 'secret')
      const user = await User.findOne({where: {id: payload.userId}, relations: {chats: {members: membersRelations, messages: messagesRelations}}})
      return user
    } catch (error) {
      return null
    }
  }

  private async setActiveStatus(token: string, to: ActiveStatus) {
    const payload: any = jwt.verify(token, 'secret') 
    const user = await User.findOne({where: {id: payload.userId}})
    if (!user) return
    user.activeStatus = to
    user.save()
  }

  async setUserActiveStatusToOffline(token: string) {
    try {
      await this.setActiveStatus(token, ActiveStatus.OFFLINE)
    } catch (error) { }
  }

}

export default new UserService()