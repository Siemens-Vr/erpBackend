const {Router } =  require('express')

const userRouter = Router()

const { login, signUp , profile, getUsers, refreshToken} = require('../controllers/users')

// const isAuthenticated = require('../middleware/isAuthenticated');
 
userRouter.get('/', getUsers)
userRouter.post('/signup', signUp)
userRouter.post('/login', login)
userRouter.post('/refresh-token', refreshToken); 
userRouter.get('/profile',  profile)

module.exports = userRouter