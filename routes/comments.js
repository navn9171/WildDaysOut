const express = require('express');
const router = express.Router();
const Campgrounds = require('../models/campground');
const Comment = require('../models/comment');

router.get('/campgrounds/:id/comments/new',isLoggedIn,(req,res)=>{
    Campgrounds.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campgrounds:campground});
        }
    })
})

router.post('/campgrounds/:id/comments',isLoggedIn,(req,res)=>{
    Campgrounds.findById(req.params.id,(err,campground)=>{
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            Comment.create(req.body.comment,(err,comment)=>{
                if(err){
                    console.log(err);
                }
                else{
                    comment.author.id = req.user._id;                      
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    //console.log(comment);
                    res.redirect('/campgrounds/'+campground._id);
                }
            })
        }
    })
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;