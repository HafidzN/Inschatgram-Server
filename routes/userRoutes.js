const express = require('express')
const loginRequired = require('../middlewares/loginRequired')
const userControllers = require('../controllers/userControllers')

const router = express.Router()

router.get('/getAllUsers', loginRequired, userControllers.getAllUsers)

router.get('/profile', loginRequired, userControllers.viewMyProfile)

router.get('/:userId', loginRequired, userControllers.viewUser)

router.put('/save', loginRequired, userControllers.save)

router.put('/unsave', loginRequired, userControllers.unsave)

router.put('/follow', loginRequired, userControllers.follow)

router.put('/unfollow', loginRequired, userControllers.unfollow)

router.put('/updatePhoto', loginRequired, userControllers.updatePhoto)

router.put('/removePhoto', loginRequired, userControllers.removePhoto)

router.put('/updateProfile', loginRequired, userControllers.updateProfile)

module.exports = router