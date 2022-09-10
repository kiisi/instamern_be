const jwt = require('jsonwebtoken')
const {JWT_SECRET} = require('../configs')
const mongoose = require('mongoose')
const UserModel = mongoose.model('usermodel')
module.exports = (req, res, next) =>{
    //authorization -> Bearer token
    const {authorization} = req.headers
    if(!authorization){
        return res.status(401).json({error: "User not logged in"})
    }
    const token = authorization.replace("Bearer ","")
    jwt.verify(token, JWT_SECRET, (error, payload)=>{
        if(error){
            return res.status(401).json({error: "User not logged in"})
        }
        const {_id} = payload;
        UserModel.findById(_id)
        .then(dbUser=>{
            req.dbUser = dbUser
            // forward the request to the next middleware or next route
            next();
        })
        .catch(err=>console.log(err))        
    })

}