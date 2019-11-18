const {Router} = require('express')
const router = Router()

const mainRouter = require('./main');
const favoriteRouter = require('./favorite');
const authRouter = require('./auth');
const functionalRouter = require('./socialFunctional');
const readLaterRouter = require('./readLater');

router.use('/', mainRouter);

router.use('/auth', authRouter);

router.use('/favorite', favoriteRouter);

router.use('/func', functionalRouter);

router.use('/readlater', readLaterRouter);


module.exports = router