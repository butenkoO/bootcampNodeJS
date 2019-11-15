const {Router} = require('express')
const router = Router()
const favoriteController = require('../controllers/favorite')
const auth = require('../middleware/auth')
const jwt = require('../middleware/token')

router.get('/',jwt,auth, favoriteController.favoritePage)

router.post('/add',jwt, auth, favoriteController.addToFavorite)

router.post('/remove',jwt, auth, favoriteController.removeBookPage)

router.get('/:id',jwt, auth, favoriteController.favoriteBookPage)

module.exports = router
