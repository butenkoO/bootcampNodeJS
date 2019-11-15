const {Router} = require('express')
const router = Router()
const favoriteController = require('../controllers/favorite')
const auth = require('../middleware/auth')

router.get('/', auth, favoriteController.favoritePage)

router.post('/add', auth, favoriteController.addToFavorite)

router.post('/remove', auth, favoriteController.removeBookPage)

router.get('/:id', auth, favoriteController.favoriteBookPage)

module.exports = router
