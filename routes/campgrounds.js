/* eslint-disable semi */
/* eslint-disable no-console */
const express = require('express')
const router = express.Router()
const Campground = require('../models/campground')
const middleware = require('../middleware')

// INDEX - Show all campgrounds
router.get('/', function(req, res) {
    // get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err)
        } else {  
            res.render('campgrounds/index', {campgrounds: allCampgrounds, currentUser: req.user})
        }         
    })
})

// NEW - Show form to create new campground
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render('campgrounds/new')
})

//CREATE - Add new campground to DB
router.post('/', middleware.isLoggedIn, function(req, res) {
    
    const name = req.body.name
    const image = req.body.image
    const desc = req.body.description
    const author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {name: name, image: image, description: desc, author: author}
    
    // create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated) {
        if (err) {
            console.log(err)
        } else {
            console.log(newlyCreated)
            
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

// EDIT CAMPGROUND ROUTE
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render('campgrounds/edit', {campground: foundCampground})
    })
})


// UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds')
        } else {
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    })
    // redirect somewhere (show page)
})


// DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect('/campgrounds');
            console.log(err);
            
        } else {
            res.redirect('/campgrounds');
        }
    });
})



module.exports = router