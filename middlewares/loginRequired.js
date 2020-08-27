require('dotenv').config()

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const httpError = require('./httpError')
const User = require('../models/user')

module.exports = (req, res, next) => {
    const { authorization } = req.headers

    if(!authorization){
        return next( new httpError('you must be logged in',401))
        // return res.status(401).json({message: 'you must be logged in'})
    }

    const token = authorization.replace('Bearer ', '')
    jwt.verify(token, process.env.SECRET, (err, payload)=>{
        if (err){
            return res.status(401).json({message: 'you must be logged in'})
        }

        // const {userId, email} = payload

        User.findOne({_id: payload.userId})
        .then(userData =>{
            req.user = userData
            next()
            //fetching userData for req.user maybe take a while,
            //so make sure you put next() right after it ( still in the same code block)
        })
        //dont put next() here, your req.user might be get undefined
    })
}