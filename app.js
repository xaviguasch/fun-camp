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
    image: String
})

const Campground = mongoose.model('Campground', campgroundSchema)

// Campground.create(
//     {
//         name: 'Granite Hill', 
//         image: 'https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104491f6c57da0efb1bc_340.jpg'

//     }, 
//     function (err, campground) {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log("newly created campground:");
//             console.log(campground);
//         }
// })


app.get('/', function(req, res) {
    res.render('landing')
})

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

app.get('/campgrounds/new', function(req, res) {
    res.render('new.ejs')
})

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

app.listen(3000, 'localhost', function() {
    console.log('FunCamp server has started, listening on port 3000, you camper!!!');
})