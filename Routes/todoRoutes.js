import express, { request } from 'express'
import Todo from '../Schema/userTodo.js'
import jwt from 'jsonwebtoken'

const router = express.Router()

// prevent the un-auth logger
const logerEvent = (request, response, next) => {
  const authorization = request.headers.authorization

  if (!authorization) {
    return response.status(401).json({
      message: 'Token missing'
    })
  }

  const token = authorization.split(' ')[1]

  if (!token) {
    return response.status(401).json({
      message: 'Invalid token'
    })
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, decode) => {
    if (error) {
      return response.status(401).json({
        message: 'Invalid token'
      })
    }

    request.username = decode.username
    next()
  })
}

// Read the todos ...
router.get('/todo', logerEvent, async (request, response) => {
  try {
    const username = request.username
    const userTodos = await Todo.find({ username })
    response.json(userTodos)
  } catch (error) {
    response.status(500).json({ message: 'Server error' })
  }
})

// create the todo
router.post('/todo', logerEvent, async (request, response) => {
  try {
    const username = request.username
    const { todoTitle, tag, isCompleted } = request.body

    if (!todoTitle || !tag) {
      return response.status(400).json({
        message: 'Todo title and tag are required'
      })
    }

    await Todo.create({
      username,
      todoTitle,
      tag,
      isCompleted
    })

    response.status(201).json({
      message: 'Todo created successfully'
    })
  } catch (error) {
    response.status(500).json({ message: error.message })
  }
})

// delete the todo
router.delete('/todo/:id', logerEvent, async (request, response) => {
  try {
    const { id } = request.params
    const username = request.username

    const todo = await Todo.findOneAndDelete({ _id: id, username })

    if (!todo) {
      return response.json({
        message: 'Todo not found'
      })
    }

    response.json({
      message: 'Todo deleted successfully'
    })
  } catch (error) {
    console.log(error.message)
  }
})

// update todo
router.put('/todo/:id', logerEvent, async (request, response) => {
  try {
    const { id } = request.params
    const username = request.username

    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: id, username },
      { $set: request.body },
      { new: true, runValidators: true }
    )

    if (!updatedTodo) {
      return response.status(404).json({
        message: 'Todo not found'
      })
    }

    response.status(200).json({
      message: 'Todo updated successfully',
      updatedTodo
    })
  } catch (error) {
    response.status(500).json({
      message: 'Server error',
      error: error.message
    })
  }
})

export default router
