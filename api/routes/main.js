const {Router} = require('express')
const router = Router()
const mainController = require('../controllers/main')


router.get('/search', mainController.mainSearch)

router.get('/books/:id', mainController.searchBook)

module.exports = router

