const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
const { model } = require('../models/user');

router.get('/', (req, res) => {
    res.render("landing");
});


//Auth Routes
router.get('/register',(req,res)=>{
    res.render("register"); 
})

router.post('/register',(req,res)=>{
    const userName = new User({username : req.body.username});
    User.register(userName,req.body.password,(err,user)=>{
        if(err){
            req.flash("error",err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,()=>{
            req.flash("success","Welcome To Wild Days Out "+user.username);
            res.redirect("/campgrounds");
        })
    })
})

router.get('/login',(req,res)=>{
    res.render("login");
})

router.post('/login',passport.authenticate("local",{
    successRedirect : "/campgrounds",
    failureRedirect : "/login"
}),(req,res)=>{
})

router.get('/logout',(req,res)=>{
    req.logout();
    req.flash("success","Logged You Out");
    res.redirect("/campgrounds");
})

function isLoggedIn(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","Please Login First");
    res.redirect("/login");
}

module.exports = router;