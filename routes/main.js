const {Router} = require('express')
const router = Router()
const mainController = require('../controllers/main')
const {searchValidators} = require('../middleware/validator')

router.get('/', mainController.mainPage)

router.get('/search',searchValidators, mainController.mainSearch)

router.get('/books/:id', mainController.searchBook)

module.exports = router

