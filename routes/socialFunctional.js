const {Router} = require('express')
const router = Router()
const funcController = require('../controllers/socialFunctional')
const auth = require('../middleware/auth')
const jwt = require('../middleware/token')
const multer = require('multer')
const storage  = multer.memoryStorage();
const upload = multer({storage:storage})


router.post('/addComment',jwt,auth, upload.single('file'), funcController.addComment)

router.post('/like',jwt,auth, funcController.like)

router.post('/dislike',jwt,auth, funcController.dislike)

module.exports = router