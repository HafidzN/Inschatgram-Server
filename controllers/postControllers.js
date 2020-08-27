const {validationResult} = require('express-validator')
const httpError = require('../middlewares/httpError')
const Post = require('../models/post')
const User = require('../models/user')

const explore = (req, res, next) => {
    const posts = Post.find()
    .populate('postedBy','_id username fullname photo story')
    .populate('comments.postedBy','_id username photo')
    .sort({createdAt:-1})
    .then(posts =>{
        res.json({posts})
    })
    .catch(err =>{
        return next(new httpError(`couldn't retrieve post`, 500))
    })
}

//your pure return value of each post only display objectid for its postedBy,
//so we need to 'populate' it with all details we need to know and pass them as the second params 

const createPost = (req, res, next) => {
    const { body, image, createdAt } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        return next (errors)
    }

    req.user.password = undefined

    const post = new Post({
        body,
        image,
        postedBy: req.user,
        createdAt
    })

    post.save().then((result)=> {
        res.json({ post: result})
    })
    .catch(error => {
        return next( new httpError('something went wrong, try again', 500))
    })
} 

const myPosts = (req, res, next ) => {
    const myPost = Post.find({postedBy: req.user._id})
    .populate('postedBy', '_id username fullname')
    .sort({createdAt:-1})
    .then(myposts => {
        return res.json({myposts})
    })
    .catch( err => {
        return next (new httpError(`couldn't retrieve post`, 500))
    })
}


const like = (req, res, next ) => {
    console.log(req.body.postId)
    Post.findByIdAndUpdate( 
        req.body.postId, 
        { $push: { likes: req.user._id} },
        { new : true }
    )
    .populate("postedBy","_id username fullname photo")
    .populate("comments.postedBy","_id username photo")    
    .exec((err, result) => {
        console.log(result)
        if(err){
            const error = new httpError(err, 422)
            return next(error)
        } else {
            res.json(result)
        }
    })
}


const dislike = (req, res, next) => {
    Post.findByIdAndUpdate(
        req.body.postId,
        {$pull : {likes : req.user._id}},
        {new: true}
    )
    .populate("postedBy","_id username fullname photo") //Bro, ur doing a PUT REQUEST, actually ur changing JUST A LITTLE PIECE of a set data (from User Schema),
    .populate("comments.postedBy","_id username photo") //so you have to return in AS SIMILAR AS POSSIBLE with your MAIN DATA'S SHAPE
    .exec((err, result) =>{                       //or ull got some domino silly failuree/error in your frontend didUpdate
        if(err){
            const error = new httpError(err, 422)
            return next(error)
        } else {
            res.json(result)
        }
    })
}



const comment = (req,res)=>{
    const comment = {
        text:req.body.text,
        postedBy: req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId,{
        $push:{comments:comment}
    },{
        new:true
    })
    .populate("comments.postedBy","_id username photo")
    .populate("postedBy","_id username photo")
    .exec((err,result)=>{
        if(err){
            const error = new httpError(err, 422)
            return next(error)
        }else{
            res.json(result)
        }
    })
} 




const deletePost = (req, res, next) => {
    Post.findOne({_id : req.params.postId})
    .populate('postedBy', '_id')
    .exec((err, post)=> {
        if(err || !post){
            return next( new httpError(err, 422))
        }
        if (post.postedBy._id.toString() === req.user._id.toString()){
            post.remove()
            .then(result=> {
                res.json(result)
            })
            .catch(err => {
                return next( new httpError(err, 422))                
            })
        }
    })
}


const getFollowedPosts = (req, res, next) => {
    Post.find({postedBy: {$in: req.user.following}})
    .populate('postedBy', '_id username photo story')
    .populate('comments.postedBy','_id username photo')
    .populate('likes', '_id username fullname photo')
    .exec((err, result)=>{
        if (err){
            return next(new httpError(err, 422))
        }
        Post.find({postedBy: req.user._id})
        .populate('postedBy', '_id username photo')
        .populate('comments.postedBy','_id username photo')
        .populate('likes', '_id username fullname photo')
        .then(myposts=> {
            res.json({followedPosts: [...result, ...myposts]})
        })
        .catch(err=>{
        return next(new httpError(err, 422))
    })
    })
}


const getPost = (req, res, next) => {
    Post.findOne({_id : req.params.postId})
    .populate('postedBy', '_id username photo')
    .populate('comments.postedBy','_id username photo')
    .populate('likes', '_id username fullname photo')
    .then(( result)=> {
        res.json(result)
    })
    .catch(err => {
        return next(new httpError(err, 422))
    })
}





const deleteComment = (req,res, next)=> { 
    const commentId = req.params.commentId

    console.log(req.body.postId, req.params.commentId)
    
    Post.findByIdAndUpdate(
        req.body.postId ,
        { $pull : {comments: {_id: commentId}}},
        { new: true}
    )
    .populate('postedBy', '_id username photo')
    .populate('comments.postedBy','_id username photo')
    .populate('likes', '_id username fullname photo')
    .then( result=> {
        console.log(result)
        return res.json(result)
    })
    .catch( err => {
        return next(new httpError(err, 422))
    })

}







exports.explore    = explore
exports.createPost = createPost
exports.myPosts    = myPosts
exports.like       = like
exports.dislike    = dislike
exports.comment    = comment
exports.deletePost = deletePost
exports.getFollowedPosts = getFollowedPosts
exports.getPost    = getPost
exports.deleteComment = deleteComment