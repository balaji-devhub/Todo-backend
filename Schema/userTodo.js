import mongoose from 'mongoose'

const todoSchema = new mongoose.Schema(
  {
    todoTitle: {
      type: String,
      required: [true, 'Todo title is required'],
      trim: true,
      minlength: [3, 'Todo must be at least 3 characters']
    },

    isCompleted: {
      type: Boolean,
      default: false
    },

    tag: {
      type: String,
      enum: ['IMPORTANT', 'EDUCATION', 'PERSONAL', 'LIFE', 'ALL'],
      default: 'ALL'
    },

    username: {
      type: String,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

const Todo = mongoose.model('Todo', todoSchema)
export default Todo
