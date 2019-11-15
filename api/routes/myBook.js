const {Router} = require('express')
const router = Router()
const myBookController = require('../controllers/myBook')

const multer = require('multer')
const storage  = multer.memoryStorage();
const upload = multer({storage:storage})

router.get('/', myBookController.myBookPage)

router.get('/add', myBookController.addMyBookPage)

router.post('/add',upload.single('file'), myBookController.addMyBook)

router.get('/change/:id', myBookController.editMyBookPage)

router.post('/change',upload.single('file'), myBookController.editMyBook)

router.post('/remove', myBookController.removeMyBook)

module.exports = router