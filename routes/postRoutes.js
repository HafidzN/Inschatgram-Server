const express = require('express')
const { check } = require('express-validator')
const loginRequired = require('../middlewares/loginRequired')
const postControllers = require('../controllers/postControllers')

const router = express.Router()


router.get('/explore', loginRequired, postControllers.explore )

router.get('/myposts', loginRequired, postControllers.myPosts)

router.post('/create', 
[
    check('image').not().isEmpty(),
    check('createdAt').not().isEmpty()
],
loginRequired, postControllers.createPost)

router.put('/like', loginRequired, postControllers.like)

router.put('/dislike', loginRequired, postControllers.dislike)

router.put('/comment',
[
    check('text').not().isEmpty()
] 
,
loginRequired, postControllers.comment)

router.delete('/delete/:postId', loginRequired, postControllers.deletePost)

router.get('/followedposts', loginRequired, postControllers.getFollowedPosts)

router.get('/getcomments/:postId', loginRequired, postControllers.getPost)

router.delete('/deletecomment/:commentId', loginRequired, postControllers.deleteComment)

module.exports = router

//explore is term for getting feed/post from all users