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

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true }) 
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')
app.use(express.static(__dirname+ '/public'))
seedDB()


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



app.get('/', function(req, res) {
    res.render('landing')
})

// INDEX - Show all campgrounds
app.get('/campgrounds', function(req, res) {
    // get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {  
            res.render('campgrounds/index', {campgrounds: allCampgrounds})
        }         
    })
})

// NEW - Show form to create new campground
app.get('/campgrounds/new', function(req, res) {
    res.render('campgrounds/new')
})

//CREATE - Add new campground to DB
app.post('/campgrounds', function(req, res) {
    const name = req.body.name
    const image = req.body.image
    const desc = req.body.description
    const newCampground = {name: name, image: image, description: desc}
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds')
        }
    })
})

// SHOW - Shows more info about one campground
app.get('/campgrounds/:id', function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            console.log(foundCampground);
            
            //render the show template with that playground
            res.render('campgrounds/show', {campground :foundCampground})
        }       
    })    
})


// ===================
// COMMENTS ROUTES
// ===================


app.get('/campgrounds/:id/comments/new', function(req, res){
    // find campground by id
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
        } else {
            res.render('comments/new', {campground: campground})
        }
    })
})

app.post('/campgrounds/:id/comments', function(req, res){
    // lookup campground using ID
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect('/campgrounds')
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect(`/campgrounds/${campground._id}`)
                }
            })
        }
    })
})




// ================
// AUTH ROUTES
// ================

// show register form
app.get('/register', function(req, res){
    res.render('register')
})

// handle sign up logic
app.post('/register', function(req, res){
    const newUser = new User({username: req.body.username})
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err)
            return res.render('register')
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/campgrounds')
        })
    })
})


// show login form
// show login form
app.get("/login", function(req, res){
   res.render("login"); 
});
// handling login logic
app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});




app.listen(3000, 'localhost', function() {
    console.log('FunCamp server has started, listening on port 3000, you camper!!!');
})