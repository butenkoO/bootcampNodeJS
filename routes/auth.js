const {Router} = require('express')
const router = Router()
const authController = require('../controllers/auth')
const {registerValidators,loginValidators} = require('../middleware/validator')
const auth = require('../middleware/auth')
const jwt = require('../middleware/token')

router.get('/login',authController.loginPage)

router.post('/login',loginValidators, authController.loginAuth)

router.get('/logout',jwt,auth, authController.logOut)

router.post('/register', registerValidators ,authController.registerAuth)

router.get('/register/:token', registerValidators ,authController.registerToken)

router.get('/reset', authController.resetPage)

router.post('/reset', authController.reset)

router.get('/password/:token', authController.newPasswordPage)

router.post('/password', authController.newPassword)


module.exports = router
