require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const bodyparser = require('body-parser');
const MongoStore = require('connect-mongodb-session')(session)
const helmet = require('helmet');
const compression = require('compression');

const helper = require('./middleware/authenticated');
const errorHandler = require('./middleware/error');

const mainRouter = require('./routes/main');
const favoriteRouter = require('./routes/favorite');
const authRouter = require('./routes/auth');
const functionalRouter = require('./routes/socialFunctional');
const yamlRouter = require('./routes/yaml');
const myBookRouter = require('./routes/myBook');
const readLaterRouter = require('./routes/readLater');
 
const app = express()

const store = new MongoStore({
    collection: 'sessions',
    uri: process.env.MONGODB_URL
  });

const hbs = exphbs.create({
    defaultLayout: 'main',
    extname: 'hbs',
    helpers: require('./helpers/hbs')
});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : true}));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store
}));
app.use(helper);
app.use(flash());
app.use(helmet());
app.use(compression());

app.use('/', mainRouter);
app.use('/auth', authRouter);
app.use('/favorite', favoriteRouter);
app.use('/func', functionalRouter);
app.use('/yaml', yamlRouter);
app.use('/mybook', myBookRouter);
app.use('/readlater', readLaterRouter);

app.use(errorHandler);

async function start(){
    await mongoose.connect(process.env.MONGODB_URL, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    });
    app.listen(process.env.PORT, ()=>{
        console.log('Server start on 3000 port + db')
    })
}
start()