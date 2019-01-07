const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Campground = require('./models/campground')

mongoose.connect('mongodb://localhost:27017/yelp_camp', { useNewUrlParser: true }) 
app.use(bodyParser.urlencoded({extended: true}))
app.set('view engine', 'ejs')



// Campground.create(
//     {
//         name: 'Granite Hill', 
//         image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2498&q=80',
//         description: 'This is a huge granite hill, no bathrooms. No water, beautiful granite!'
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

// INDEX - Show all campgrounds
app.get('/campgrounds', function(req, res) {
    // get all campgrounds from DB
    Campground.find({}, function (err, allCampgrounds) {
        if (err) {
            console.log(err);
        } else {  
            res.render('index', {campgrounds: allCampgrounds})
        }         
    })
})

// NEW - Show form to create new campground
app.get('/campgrounds/new', function(req, res) {
    res.render('new.ejs')
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
    Campground.findById(req.params.id, function(err, foundCampground) {
        if (err) {
            console.log(err);
        } else {
            //render the show template with that playground
            res.render('show', {campground :foundCampground})
        }       
    })
    
    
})




app.listen(3000, 'localhost', function() {
    console.log('FunCamp server has started, listening on port 3000, you camper!!!');
})