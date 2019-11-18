const {Router} = require('express')
const router = Router()
const authController = require('../controllers/auth')


router.post('/login', authController.loginAuth)

router.post('/register', authController.registerAuth)


module.exports = router
