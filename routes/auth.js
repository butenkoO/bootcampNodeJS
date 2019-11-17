const {Router} = require('express')
const router = Router()
const authController = require('../controllers/auth')
const {registerValidators,loginValidators,resetValidators,newPassValidators} = require('../middleware/validator')
const auth = require('../middleware/auth')
const jwt = require('../middleware/token')

router.get('/login',authController.loginPage)

router.post('/login',loginValidators, authController.loginAuth)

router.get('/logout',jwt,auth, authController.logOut)

router.post('/register', registerValidators ,authController.registerAuth)

router.get('/register/:token', registerValidators ,authController.registerToken)

router.get('/reset', authController.resetPage)

router.post('/reset',resetValidators, authController.reset)

router.get('/password/:token', authController.newPasswordPage)

router.post('/password',newPassValidators, authController.newPassword)


module.exports = router
