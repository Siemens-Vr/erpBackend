const {Router } =  require('express')

const userRouter = Router()

const { login, signUp , profile} = require('../controllers/users')

const isAuthenticated = require('../middleware/isAuthenticated');
 
userRouter.post('/signup', signUp)
userRouter.post('/login', login)
userRouter.get('/profile',isAuthenticated,  profile)

module.exports = userRouter