const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const protectedRoute = require('../middleware/protectedResources')
const PostModel = mongoose.model('postmodel')


router.get('/posts', protectedRoute,(req, res)=>{

    PostModel.find()
    .populate("author","_id fullName")
    .then(dbPosts=>{
        res.status(201).json({posts:dbPosts})
    })
    .catch(err=>console.log(err))
})
router.get('/myposts', protectedRoute,(req, res)=>{

    PostModel.find({author: req.dbUser._id})
    .populate("author","_id fullName")
    .then(dbPosts=>{
        res.status(201).json({posts:dbPosts})
    })
    .catch(err=>console.log(err))
})
router.post('/createpost',protectedRoute , (req, res)=>{
    const {title, body, image} = req.body
    if(!title || !body || !image){
        return res.status(400).json({error:"One or more mandatory field is empty"})
    }
    req.dbUser.password = undefined
    
    const post = new PostModel({title:title, body:body, image:image, author: req.dbUser})
    post.save()
    .then(dbPost=>{
        res.status(201).json({post:dbPost})
    })
    .catch(err=>console.log(err))
})

module.exports = router