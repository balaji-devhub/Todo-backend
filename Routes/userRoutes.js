import express, { request } from 'express'
import User from '../Schema/userSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

router.post('/register', async (request, response) => {
  try {
    const { username, useremail, password } = request.body

    if (!username || !useremail || !password) {
      return response.json({
        message: 'All fields must br required'
      })
    }
    if (username.length < 3) {
      return response.json({
        message: 'username atleast three letters'
      })
    }

    if (password.length < 8) {
      return response.json({
        message: 'The password atleast 8 character'
      })
    }
    const emailRegex = /^\S+@\S+\.\S+$/

    if (!emailRegex.test(useremail)) {
      return response.status(400).json({
        message: 'Invalid email format'
      })
    }

    const existingUser = await User.findOne({ useremail })
    if (existingUser) {
      return response.json({
        message: 'User already registerd'
      })
    }
    const hasedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({ username, useremail, password: hasedPassword })

    response.json({
      message: 'User created Successfully',
      username,
      user: user._id
    })
  } catch (error) {
    console.log(error.message)
    response.json({ error: error.message })
  }
})

router.post('/login', async (request, response) => {
  try {
    const { useremail, password, username } = request.body

    if (!useremail || !password) {
      return response.status(400).json({
        message: 'Email and password are required'
      })
    }

    const existingUser = await User.findOne({ useremail })

    if (!existingUser) {
      return response.status(404).json({
        message: 'User not found'
      })
    }

    if (!bcrypt.compare(password, existingUser.password)) {
      return response.status(401).json({
        message: 'Invalid password'
      })
    }

    const jwtToken = jwt.sign({ username, useremail }, process.env.JWT_SECRET)

    return response.status(200).json({
      message: 'User login successfully ...',
      jwtToken
    })
  } catch (error) {
    response.status(500).json({
      message: 'Server error'
    })
  }
})

export default router
