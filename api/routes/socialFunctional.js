const {Router} = require('express')
const router = Router()
const funcController = require('../controllers/socialFunctional')
const auth = require('../middleware/auth')
const jwt = require('../middleware/token')

const multer = require('multer')
const storage  = multer.memoryStorage();
const upload = multer({storage:storage})


router.post('/addComment', jwt, auth, upload.single('file'), funcController.addComment)

router.post('/deleteComment', jwt, auth, funcController.deleteComment)

module.exports = router