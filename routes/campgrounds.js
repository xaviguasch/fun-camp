const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')

// INDEX - Show all campgrounds
router.get('/', function(req, res) {
    // get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {  
            res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user})
        }         
    })
})

// NEW - Show form to create new campground
router.get('/new', function(req, res) {
    res.render('campgrounds/new')
})

//CREATE - Add new campground to DB
router.post('/', function(req, res) {
    
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
router.get('/:id', function(req, res){
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

module.exports = router