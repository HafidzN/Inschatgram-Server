const express = require('express')
const { check } = require('express-validator')
const loginRequired = require('../middlewares/loginRequired')
const storyControllers = require('../controllers/storyControllers')

const router = express.Router()

router.get('/explore', loginRequired, storyControllers.getAllStories)

router.get('/followedstories', loginRequired, storyControllers.getFollowedStories)

router.post('/create', 
[
    check('image').not().isEmpty(),
    check('createdAt').not().isEmpty()
],
loginRequired, storyControllers.createStory)


router.delete('/delete/:storyId', loginRequired, storyControllers.deleteStory)






module.exports = router