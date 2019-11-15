const {Router} = require('express')
const router = Router()
const funcController = require('../controllers/socialFunctional')

const multer = require('multer')
const storage  = multer.memoryStorage();
const upload = multer({storage:storage})


router.post('/addComment',upload.single('file'), funcController.addComment)

router.post('/like', funcController.like)

router.post('/dislike', funcController.dislike)

module.exports = router