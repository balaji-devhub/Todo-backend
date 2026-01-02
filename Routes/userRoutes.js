import express from 'express'
import User from '../Schema/userSchema.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const router = express.Router()

// --- REGISTER ROUTE ---
router.post('/register', async (request, response) => {
  try {
    const { username, useremail, password } = request.body

    if (!username || !useremail || !password) {
      return response.status(400).json({ message: 'All fields are required' })
    }

    // Matches your frontend: must be GREATER than 8 (so at least 9)
    if (password.length <= 8) {
      return response.status(400).json({ message: 'Password must be greater than 8 characters' })
    }

    const emailRegex = /^\S+@\S+\.\S+$/
    if (!emailRegex.test(useremail)) {
      return response.status(400).json({ message: 'Invalid email format' })
    }

    const existingUser = await User.findOne({ useremail })
    if (existingUser) {
      return response.status(400).json({ message: 'User already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      username,
      useremail,
      password: hashedPassword
    })

    response.status(201).json({
      message: 'User created Successfully',
      username: user.username,
      userId: user._id
    })
  } catch (error) {
    console.log(error.message)
    response.status(500).json({ error: error.message })
  }
})

// --- LOGIN ROUTE ---
// --- LOGIN ROUTE (Checking Username, Email, and Password) ---
router.post('/login', async (request, response) => {
  try {
    const { username, useremail, password } = request.body

    // 1. Validate all three inputs exist
    if (!username || !useremail || !password) {
      return response.status(400).json({
        message: 'Username, Email, and Password are all required'
      })
    }

    // 2. Find user matching BOTH username AND useremail
    const existingUser = await User.findOne({ username, useremail })

    if (!existingUser) {
      return response.status(404).json({
        message: 'User not found with these credentials'
      })
    }

    // 3. Compare the password with the hashed password in DB
    const isPasswordMatch = await bcrypt.compare(password, existingUser.password)

    if (!isPasswordMatch) {
      return response.status(401).json({
        message: 'Invalid password'
      })
    }

    // 4. Generate JWT
    const jwtToken = jwt.sign(
      {
        username: existingUser.username,
        useremail: existingUser.useremail,
        id: existingUser._id
      },
      process.env.JWT_SECRET || 'your_fallback_secret',
      { expiresIn: '24h' }
    )

    // 5. Success response
    return response.status(200).json({
      message: 'User login successfully ...',
      jwtToken,
      username: existingUser.username
    })
  } catch (error) {
    console.error(error)
    response.status(500).json({
      message: 'Server error during login'
    })
  }
})
export default router
