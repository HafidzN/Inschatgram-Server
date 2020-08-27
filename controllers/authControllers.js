require('dotenv').config()

const { validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const httpError = require('../middlewares/httpError')

const signUp = async ( req, res, next) => {
    const { fullname, username, email, password } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        next(new httpError(errors, 422))
    }
    
    let existingUser, existingUsername
    try {
        existingUser = await User.findOne({email: email})
    } catch (err) {
        return next (new httpError('email is already used, try another'))
    }

    try {
        existingUsername = await User.findOne({username: username})
    } catch (err) {
        return next (new httpError('username is already used, try another'))
    }

    if (existingUser){
        return next (new httpError('user is already exist, try using different email'))
    }

    if  (existingUsername){
        return next (new httpError('username is already exist'))
    }

    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
        fullname,
        username,
        email,
        password: hashedPassword
    })

    try {
        await newUser.save()
    } catch (error) {
        console.log(error)
        return next(new httpError('fail to create a new account, try again', 500))
    }

    res.status(201).json({ user: newUser})
}


const login = (req, res, next) => {
    const {email, password} = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        throw new httpError('Check your input value again')
    }

    User.findOne({email: email})
    .populate('followers', '_id username fullname')
    .populate('following', '_id username fullname')
    .populate('saved', 'body image likes comments postedBy createdAt')
    .populate('story', '_id image createdAt postedBy')
    .then(existingUser=>{
        if(!existingUser){
            return next (new httpError('Invalid email/password', 422))
        }
        bcrypt.compare(password, existingUser.password)
        .then(isMatch => {
            if (isMatch){
                const token = jwt.sign(
                    { userId: existingUser._id, email: existingUser.email},
                    process.env.SECRET,
                    { expiresIn: '5h'}
                )

                const {_id, username, fullname, email, photo, followers, following, saved, story} = existingUser
                res.json({token, user: {_id, fullname, username, email, photo, followers, following, saved, story}})
            } else {
                return next(new httpError('Invalid credential', 422))
            }
        })
        .catch(err=>{
            return next(err, 500)
        })
    })

}

exports.signUp = signUp 
exports.login = login