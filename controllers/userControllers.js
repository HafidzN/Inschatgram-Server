const httpError = require('../middlewares/httpError')
const User = require('../models/user')
const Post = require('../models/post')
const Story = require('../models/story')


const viewMyProfile = (req, res, next) => {
    const userId = req.user._id

    User.findOne({_id: userId})
    .select('-password')
    .populate('followers', '_id username fullname photo')
    .populate('following', '_id username fullname photo')
    .populate('saved', 'likes _id body image postedBy createdAt comments')
    .then(user => {
        Post.find({postedBy: userId})
        .populate('postedBy','_id username fullname photo')
        .populate('comments.postedBy','_id username')
        .sort({createdAt:-1})
        .exec((err, posts)=>{
            if(err){
                return next( new httpError(err, 422))
            }
            res.json({user, posts})
        })
    })
    .catch( err => {
        return res.json({message:'user not found'})
    })
}



const viewUser = (req, res, next) => {
    const userId = req.params.userId

    User.findOne({_id: userId})
    .select('-password -saved')
    .populate('followers', '_id username fullname photo')
    .populate('following', '_id username fullname photo')
    .then(user => {
        Post.find({postedBy: userId})
        .populate('postedBy','_id username fullname photo')
        .populate('comments.postedBy','_id username')
        .sort({createdAt:-1})
        .exec((err, posts)=>{
            if(err){
                return next( new httpError(err, 422))
            }
            Story.findOne({postedBy:userId})
            .then(hasStory=>{
               res.json({user, hasStory, posts})
            })
        })
    })
    .catch( err => {
        return res.json({message:'user not found'})
    })
}




const save = (req, res, next) => {
    Post.findOne(
        {_id: req.body.postId})
        .exec((err, post)=> {
        if(err){
            const error = new httpError(err, 404)
            return next (error)
        }

        User.findByIdAndUpdate(
            req.user._id,
            {$push : {saved : post}},
            {new: true}
        )
        .populate('saved', 'likes _id body image postedBy createdAt comments')
        .exec((err, result)=> {
            if(err){
                const error = new httpError(err, 422)
                return next (error)
            } else {
                res.json(result)
            }
        })
    })
}


const unsave = (req, res, next) => {
    Post.findOne(
        {_id: req.body.postId})
        .exec((err, post)=> {
        if(err){
            const error = new httpError(err, 404)
            return next (error)
        }

        User.findByIdAndUpdate(
            req.user._id,
            {$pull : {saved : post._id}},
            {new: true}
        )
        .populate('saved', 'likes _id body image postedBy createdAt comments')
        .exec((err, result)=> {
            if(err){
                const error = new httpError(err, 422)
                return next (error)
            } else {
                res.json(result)
            }
        })
    })
}



const follow = (req, res, next) => {
    User.findByIdAndUpdate(req.body.followId,
    {$push: {followers : req.user._id}},
    {new: true},
    (err, result) => {
        if (err) {
            return next (new httpError(err, 422))
        }
        User.findByIdAndUpdate(req.user._id,
        {$push: {following: req.body.followId}},
        {new: true},
        )
        .select('-password')
        .then( result => {
            res.json(result)
        })
        .catch(err => {
            return next(new httpError(err, 422))
        })
    }
    )
}



const unfollow = (req, res, next) => {
    User.findByIdAndUpdate(req.body.followId,
    {$pull: {followers : req.user._id}},
    {new: true},
    (err, result) => {
        if (err) {
            return next (new httpError(err, 422))
        }
        User.findByIdAndUpdate(req.user._id,
        {$pull: {following: req.body.followId}},
        {new: true},
        )
        .select('-password')
        .then( result => {
            res.json(result)
        })
        .catch(err => {
            return next(new httpError(err, 422))
        })
    }
    )
    .populate('followers','_id username fullname photo')
}

const getAllUsers =(req,res, next)=>{
    // let userPattern = new RegExp("^"+req.body.query)
    User.find()
    .select("_id email username photo")
    .then(users=>{
        res.json({users})
    }).catch(err=>{
        return next(new httpError(err, 500))
    })
}



const updatePhoto = (req, res, next) => {
    User.findByIdAndUpdate(
        req.user._id,
        {$set: {photo: req.body.photo}},
        {new : true},
        (err, result) => {
            if(err){
                return next(new httpError(err, 422))
            }
            res.json(result)
        }
    )
}




const removePhoto = (req, res, next) => {
    User.findByIdAndUpdate(
        req.user._id,
        {$set: {photo: 'https://res.cloudinary.com/smilj4npj4nic/image/upload/v1595920821/zifhcviu9y2kwecpuzxf.png'}},
        {new : true},
        (err, result) => {
            if(err){
                return next(new httpError(err, 422))
            }
            res.json(result)
        }
    )
}




const updateProfile = (req, res, next) => {
    User.findByIdAndUpdate(
        req.user._id,
        {$set: {bio: req.body.bio}},
        {new : true},
        (err, result) => {
            if (err){
                return next(new httpError(err, 422))
            }
            res.json(result)
        }
    )
}





exports.save        = save
exports.unsave      = unsave
exports.viewUser    = viewUser
exports.viewMyProfile = viewMyProfile
exports.follow      = follow
exports.unfollow    = unfollow
exports.getAllUsers = getAllUsers 
exports.updatePhoto = updatePhoto 
exports.removePhoto = removePhoto
exports.updateProfile = updateProfile