const {Router} = require('express')
const router = Router()
const readLaterController = require('../controllers/readLater')
const auth = require('../middleware/auth')
const jwt = require('../middleware/token')

router.get('/',auth,jwt, readLaterController.readLaterPage)

router.post('/add',auth,jwt, readLaterController.readLaterAdd)

router.post('/remove',auth,jwt, readLaterController.readLaterRemove)


module.exports = router