const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true }) 
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

const Campground = mongoose.model('Campground', campgroundSchema)

Campground.create(
    {
        name: 'Granite Hill', 
        image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2498&q=80',
        description: 'This is a huge granite hill, no bathrooms. No water, beautiful granite!'
    }, 
    function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            console.log("newly created campground:");
            console.log(campground);
        }
})


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
            res.render('campgrounds', {campgrounds: allCampgrounds})
        }         
    })
})

// NEW - Show form to create new campground
app.get('/campgrounds/new', function(req, res) {
    res.render('new.ejs')
})

// CREATE - Add new campground to DB
app.post('/campgrounds', function(req, res) {
    const name = req.body.name
    const image = req.body.image
    const newCampground = {name: name, image: image}
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds')
        }
    })
})


app.get('/campgrounds/:id', function(req, res){
    //find the campground with provided ID
    //render the show template with that playground
    res.send('This will be the show page one day')
})




app.listen(3000, 'localhost', function() {
    console.log('FunCamp server has started, listening on port 3000, you camper!!!');
})