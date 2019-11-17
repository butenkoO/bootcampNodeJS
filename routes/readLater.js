const {Router} = require('express')
const router = Router()
const readLaterController = require('../controllers/readLater')


router.get('/', readLaterController.readLaterPage)

router.post('/add', readLaterController.readLaterAdd)

router.post('/remove', readLaterController.readLaterRemove)

router.post('/check', readLaterController.readLaterCheck)

module.exports = router