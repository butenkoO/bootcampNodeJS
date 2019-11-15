const {Router} = require('express')
const router = Router()
const YAML = require('yamljs')
const swaggerUI = require('swagger-ui-express')
const swaggerDocument = YAML.load('./swagger.yaml')
const auth = require('../middleware/auth')
const jwt = require('../middleware/token')

router.use('/docs', swaggerUI.serve)
router.get('/docs',jwt,auth, swaggerUI.setup(swaggerDocument))

module.exports = router