const {Router} = require('express')
const router = Router()
const authController = require('../controllers/auth')
const {registerValidators,loginValidators,resetValidators,newPassValidators} = require('../middleware/validator')
const auth = require('../middleware/auth')
const nonauth = require('../middleware/nonAuth')
const jwt = require('../middleware/token')

router.get('/login',nonauth,authController.loginPage)

router.post('/login',nonauth,loginValidators, authController.loginAuth)

router.get('/logout',jwt,auth, authController.logOut)

router.post('/register',nonauth, registerValidators ,authController.registerAuth)

router.get('/register/:token',nonauth, registerValidators ,authController.registerToken)

router.get('/reset',nonauth, authController.resetPage)

router.post('/reset',nonauth,resetValidators, authController.reset)

router.get('/password/:token',nonauth, authController.newPasswordPage)

router.post('/password',nonauth, newPassValidators, authController.newPassword)


module.exports = router
