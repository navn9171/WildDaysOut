const express = require('express');
const router = express.Router();
const Campgrounds = require('../models/campground');

router.get('/campgrounds', (req, res) => {
    Campgrounds.find({},(err,allCampgrounds)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index", { campgrounds: allCampgrounds, currentUser: req.user });
        }
    });
});

router.post('/campgrounds',isLoggedIn, (req, res) => {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id : req.user._id,
        username : req.user.username
    }
    var newCampground = {name:name,image:image,description:description,author:author};
    Campgrounds.create(newCampground,(err,newlyCreated)=>{
        if(err){
            console.log(err);
        }
        else{
            // console.log(newlyCreated);
            res.redirect('/campgrounds');
        }
    });
});

router.get('/campgrounds/new',isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get('/campgrounds/:id',(req,res)=>{
    Campgrounds.findById(req.params.id).populate("comments").exec((err,foundCampground)=>{
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show",{campgrounds:foundCampground});
        }
    })
}); 

//edit
router.get('/campgrounds/:id/edit',checkCampgroundOwnership,(req,res)=>{
        Campgrounds.findById(req.params.id,(err,foundCampground)=>{
            res.render("campgrounds/edit",{campgrounds : foundCampground });
         }) 
})

//update
router.put('/campgrounds/:id',checkCampgroundOwnership,(req,res)=>{
    //find and update the correct campground and redirect to some page
    Campgrounds.findByIdAndUpdate(req.params.id,req.body.campgrounds,(err,updatedCampground)=>{
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    })
})
//destroy campground
router.delete('/campgrounds/:id',checkCampgroundOwnership,(req,res)=>{
    Campgrounds.findByIdAndRemove(req.params.id,(err)=>{
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    })
})

function checkCampgroundOwnership(req,res,next){
    if(req.isAuthenticated()){
        Campgrounds.findById(req.params.id,(err,foundCampground)=>{
            if(err){
                req.flash("error","Campground Not Found");
                res.redirect("back");
            }
            // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }
            else{
                req.flash("error","You Don't Have Permission To Do That");
                res.redirect("back");
            }
        })
    }
    else{
        req.flash("error","Please Login First");
        res.redirect("back");
    }
}

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First");
    res.redirect("/login");
}
module.exports = router;