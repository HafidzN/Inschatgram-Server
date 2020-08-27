const express = require('express')
const { check } = require('express-validator')

const authController = require('../controllers/authControllers')

const router = express.Router()

router.post('/signup', 
[
    check('fullname', 'Full Name must not be empty').not().isEmpty(),
    check('username', 'Username must not be empty').not().isEmpty(),
    check('email', 'Invalid email').normalizeEmail().isEmail(),
    check('password', 'Password must contain atleast 8 characters, an number, an uppercase, a lowercase, and a special character', ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,)
], authController.signUp)

router.post('/login',
[
    check('email').normalizeEmail().isEmail(),
    check('password', 'Password must contain atleast 8 characters, an number, an uppercase, a lowercase, and a special character', ).matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d@$.!%*#?&]/,)
],
authController.login
)

module.exports = router