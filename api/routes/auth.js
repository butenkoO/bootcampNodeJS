const {Router} = require('express')
const router = Router()
const authController = require('../controllers/auth')
const {registerValidators,loginValidators} = require('../middleware/validator')


router.get('/login',authController.loginPage)

router.post('/login',loginValidators, authController.loginAuth)

router.get('/logout',authController.logOut)

router.post('/register', registerValidators ,authController.registerAuth)

module.exports = router
