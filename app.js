const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))

app.set('view engine', 'ejs')

const campgrounds = [
    {name: 'Salmon Creek', image: 'https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f6c57da0efb1bc_340.jpg'},
    {name: 'Granite Hill', image: 'https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104491f6c57da0efb1bc_340.jpg'},
    {name: 'Mountain Goats Rest', image: 'https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f6c57da0efb1bc_340.jpg'},
    {name: 'Salmon Creek', image: 'https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f6c57da0efb1bc_340.jpg'},
    {name: 'Granite Hill', image: 'https://pixabay.com/get/e834b5062cf4033ed1584d05fb1d4e97e07ee3d21cac104491f6c57da0efb1bc_340.jpg'},
    {name: 'Mountain Goats Rest', image: 'https://pixabay.com/get/e83db40e28fd033ed1584d05fb1d4e97e07ee3d21cac104491f6c57da0efb1bc_340.jpg'}
]

app.get('/', function(req, res) {
    res.render('landing')
})

app.get('/campgrounds', function(req, res) {
 

    res.render('campgrounds', {campgrounds: campgrounds})
})

app.get('/campgrounds/new', function(req, res) {
    res.render('new.ejs')
})

app.post('/campgrounds', function(req, res) {
    const name = req.body.name
    const image = req.body.image
    const newCampground = {name: name, image: image}
    campgrounds.push(newCampground)

    res.redirect('/campgrounds')
})

app.listen(3000, 'localhost', function() {
    console.log('FunCamp server has started, listening on port 3000, you camper!!!');
})