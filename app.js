const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const Campground = require('./models/campground')
const Comment = require('./models/comment')
const User = require('./models/user')
const seedDB = require('./seeds')

// requiring routes
const commentRoutes = require('./routes/comments')
const campgroundRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/index')

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true }) 
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname+ '/public'))

//seedDB()  // seed the database


// PASSPORT CONFIGURATION
app.use(require('express-session')({
    secret: 'xiti rules!',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use(function(req, res, next){
    res.locals.currentUser = req.user
    next()
})

app.use('/', indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)


app.listen(3000, 'localhost', function() {
    console.log('FunCamp server has started, listening on port 3000, you camper!!!');
})