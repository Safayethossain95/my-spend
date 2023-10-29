const registerValidator = require("../validators/registerValidator")
const loginValidator = require("../validators/loginValidator")
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const bcrypt = require('bcryptjs')
const {serverError,resourceError} = require('../utils/error')
module.exports = {
    login(req,res){

        let {email,password} = req.body
        let validate = loginValidator({email,password})

        if(!validate.isValid){
            res.status(400).json(validate.error)
        }

        User.findOne({email})
        .then(user => {
            if(!user){
                return resourceError(res,'User Not Found')
            }

            bcrypt.compare(password, user.password).then((err,res) => {
                if(err){
                    return serverError(res,err)
                }
                if(!res){                    
                    return resourceError(res,"Password Doesn\'t Match")
                }
                const token = jwt.sign({
                    _id: user._id,
                    name: user.name,
                    email: user.email
                },'secret', {expiresIn:'2h'})

                res.status(200).json({
                    message:"Login Successful",
                    token: `Bearer ${token}`
                }) 
            });

            // bcrypt.compare(password,user.password, function(err, result) {
            //     if(err){
            //         return serverError(res,err)
            //     }
            //     if(!result){                    
            //         // return resourceError(res,"Password Doesn\'t Match")

            //         return res.status(400).json({
            //             message : user.password
            //         })
            //     }
            //     const token = jwt.sign({
            //         _id: user._id,
            //         name: user.name,
            //         email: user.email
            //     },'secret', {expiresIn:'2h'})

            //     res.status(200).json({
            //         message:"Login Successful",
            //         token: `Bearer ${token}`
            //     })
            // });
        })
        // extract data from req
        // validate data
        // check for user availability
        // compare password
        // generate token and response back
    },

    register(req,res){
        let {name,email,password,confirmPassword} = req.body

        let validate = registerValidator({name,email,password,confirmPassword})

        if(!validate.isValid){
            res.status(400).json(validate.error)
        }else{
            User.findOne({email})
                .then(user => {
                    if(user){
                        return resourceError(res,"User Already Exists")
                    }

                    bcrypt.genSalt(10, function(err, salt) {
                        bcrypt.hash("B4c0/\/", salt, function(err, hash) {
                            if(err){
                                return res.status(500).json({
                                     message:"Server error occured"
                                 })
                             }
     
                             let user = new User({
                                 name,
                                 email,
                                 password:hash
                             })
                             
                             user.save()
                             .then(user => {
                                res.status(201).json({
                                    message:"User Created Successfully",
                                    user
                                })
                             })
                             .catch(err => serverError(res,err))
                        });
                    });

                    
                })
                .catch(error => {
                    console.log(error)
                    return res.status(500).json({
                        message:"server error occured"
                    })
                })
        }
    }
}