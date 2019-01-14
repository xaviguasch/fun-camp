const Campground = require('../models/campground')
const Comment = require('../models/comment')


// all the middleware goes here
const middlewareObj = {}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            if(err){
                res.redirect('back')
            } else {
                // does the user own the campground?
                if(foundCampground.author.id.equals(req.user._id)){
                    next()
                } else {
                    res.redirect('back')
                }
            }
        })
    } else {
        res.redirect('back')
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect('back')
            } else {
                // does the user own the comment?
                if(foundComment.author.id.equals(req.user._id)){
                    next()
                } else {
                    res.redirect('back')
                }
            }
        })
    } else {
        res.redirect('back')
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    req.flash('error', 'Please Login First!')
    res.redirect('/login')
}


module.exports = middlewareObj