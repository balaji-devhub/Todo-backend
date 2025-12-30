import mongoose from 'mongoose'

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Db connected Successfully')
  } catch (error) {
    console.log(error.message)
  }
}

export default dbConnection
