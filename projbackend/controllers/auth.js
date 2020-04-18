const User = require("../models/user");
const { check, validationResult } = require('express-validator');
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

exports.signup = function(req,res){

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }
    const user = new User(req.body);
    user.save((err,user)=>{
        if(err){
            console.log(`There is some Error while creating User:${err}`);
            return res.status(400).json({
                err:"NOT able to save user in DB"
            });
        }
        return res.json({
            name:user.name,
            lastname:user.lastname,
            email:user.email,
            id: user._id
        });
    });
};

exports.signin = function(req,res){
    const {email,password} = req.body;
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error: errors.array()[0].msg
        });
    }

    User.findOne({email},function(err,user){
        if(err || !user){
            return res.status(400).json({
                error: "User email does not exist!"
            })
        }

        if(!user.authenticate(password)){
            return res.status(401).json({
                error: "Email and Password do not match"
            });
        }
        // create token
        const token = jwt.sign({_id: user._id}, process.env.SECRET);

        // put token in cookie
        res.cookie("token",token,{expire: new Date()+ 9999});
      
        // send response to frontend
        const {_id,name,email,role} = user;

        return res.json({token, user:{_id,name,email,role}});
    });

}



exports.signout = function(req,res){
    // clear cookie
    res.clearCookie("token");
    return res.json({
        message:"User Signout Successfully!!!"
    });
};

