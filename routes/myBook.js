const {Router} = require('express')
const router = Router()
const myBookController = require('../controllers/myBook')
const auth = require('../middleware/auth')
const jwt = require('../middleware/token')
const multer = require('multer')
const storage  = multer.memoryStorage();
const upload = multer({storage:storage})

router.get('/',jwt,auth, myBookController.myBookPage)

router.get('/add',jwt,auth, myBookController.addMyBookPage)

router.post('/add',jwt,auth,upload.single('file'), myBookController.addMyBook)

router.get('/change/:id',jwt,auth, myBookController.editMyBookPage)

router.post('/change',jwt,auth,upload.single('file'), myBookController.editMyBook)

router.post('/remove',jwt,auth, myBookController.removeMyBook)

module.exports = router