import { Router } from 'express'
import { body } from 'express-validator'
import UserService from './services/user.service'

const router = Router()

const validators = [body('email').isEmail(), body('username').isLength({min: 5}), body('password').isLength({min: 5})]

router.post('/register', ...validators, UserService.register)
router.post('/login', ...validators, UserService.login)

export default router