const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const UserModel = mongoose.model('usermodel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../configs')


const protectedRoute = require('../middleware/protectedResources')

router.get('/', (req, res)=>{
    res.send("Welcome to the mern course!")
})

router.get('/secured', protectedRoute, (req, res)=>{
    res.send("Welcome secured route")
})

router.post('/login', (req, res)=>{
    const {email, password} = req.body
    if(!email || !password){
        return res.status(400).json({error:"One or more mandatory field"})
    }
    UserModel.findOne({email:email})
    .then((dbUser)=>{
        if(!dbUser){// user not found
            return res.status(400).json({error:"User does not exist"})
        }
        bcrypt.compare(password, dbUser.password)
        .then((didMatch)=>{
            if(didMatch){
                //create and send a token
                const jwtToken = jwt.sign({_id:dbUser._id}, JWT_SECRET)
                const {_id, fullName, email} = dbUser
                
                res.json({token:jwtToken, userInfo:{_id, fullName, email}})
            }
            else{
                return res.status(400).json({error:"Invalid credentials"})
            }
        }).catch(err=>console.log(err))
    }).catch(err=>console.log(err))
})
router.post('/register',(req, res)=>{
    
    const {fullName, email, password} = req.body
    if(!fullName || !email || !password){
        return res.status(400).json({error: "One or more mandatory field is empty"})
    }

    //avoid duplicate users
    UserModel.findOne({email:email})
    .then((dbUser)=>{
        if(dbUser){
            return res.status(500).json({error:"User with email already email"})
        }
        bcrypt.hash(password, 16)
        .then(hashedPassword =>{
            const user = new UserModel({fullName, email, password:hashedPassword})
            user.save()
            .then(user=>{
                res.status(201).json({result:"User registered successfully"})
            })
            .catch(err=>console.log(err))    
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
})

module.exports = router