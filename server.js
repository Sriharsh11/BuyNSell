const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hbs = require('hbs');
//const ejs = require('ejs');
const engine = require('ejs-mate');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');
const expressValidator = require('express-validator');
const secret = require('./config/secret.js');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');
const flash = require('express-flash');
const cartTotal = require('./middlewares/middlewares.js');
var Product = require('./models/product.js');
// const multer = require('multer');
// const cloudinary = require('cloudinary');
// const cloudinaryStorage = require('multer-storage-cloudinary');
var app = express();
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('views','./views');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static('./public'))
//app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}));
app.use(cookieParser(secret.secretKey));
app.use(session({
  saveUninitialized : true,
  resave : true,
  secret : secret.secretKey,
  store : new MongoStore({url : secret.database , autoReconnect : true})
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req,res,next) => {
  res.locals.user = req.user;
  next();
});
app.use(function(req,res,next){
  Product.find({},function(err,product){
    if(err) return next(err);
    res.locals.product = product;
    next();
  });
});
app.use(flash());
app.use(morgan('dev'));
app.use(expressValidator());
app.use(cartTotal);
// cloudinary.config({
// cloud_name: 'dclftxahf',
// api_key: '163116744686492',
// api_secret: 'IPEjjDKUTT43pki0ozFB-gDLccU'
// });
// const storage = cloudinaryStorage({
// cloudinary: cloudinary,
// folder: "demo",
// allowedFormats: ["jpg", "png"],
// transformation: [{ width: 500, height: 500, crop: "limit" }]
// });
// const parser = multer({ storage: storage });
const mainRoutes = require('./routes/main.js');
const aboutRoute = require('./routes/about.js');
const adminRoutes = require('./routes/admin.js');
const customerRoutes = require('./routes/customer.js');
app.use(mainRoutes);
app.use(aboutRoute);
app.use(adminRoutes);
app.use(customerRoutes);

app.listen(secret.port,() => {
  console.log('listening at 2000');
});
