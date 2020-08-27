const {validationResult} = require('express-validator')
const httpError = require('../middlewares/httpError')
const Story = require('../models/story')
const User = require('../models/user')

const createStory = (req, res, next) => {
    const { image, createdAt } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()){
        return next (errors)
        }

    req.user.password = undefined

    const story = new Story({
        image,
        postedBy: req.user,
        createdAt
    })

    story.save().then((result)=> {
        User.findByIdAndUpdate(req.user._id,
        {$set: {story: result}},
        {new : true},
        (err, reslt) => {
            if(err){
                return next(new httpError(err, 422))
            }
            res.json({result})
        }
        )

    })
    .catch(error => {
        return next( new httpError('something went wrong, try again', 500))
    })
}


const deleteStory = (req, res, next) => {
    Story.deleteMany({postedBy : req.user._id})
    .then(result =>{

           User.findByIdAndUpdate(
                    req.user._id,
                    {$set: {story: null }},
                    {new : true},
                    (err, deleteResultInUser) => {
                        if(err){
                            return next(new httpError(err, 422))
                        }
                        // res.json(deleteResultInUser) //it should be used bcs it directly return users stata, but idont know why it is so slow
                    }
                )

            res.json(result)



    }).catch(err => {
            return next( new httpError(err, 422))                
        })
}






// const deleteStory = (req, res, next) => {
//     Story.findOne({_id : req.params.storyId})
//     .populate('postedBy', '_id ')
//     .exec((err, story)=> {
//         if(err || !story){
//             // console.log(err)
//             return next( new httpError(err, 422))
//         }
//         if (story.postedBy._id.toString() === req.user._id.toString()){
//             story.remove()
//             .then(result=> {

//                 User.findByIdAndUpdate(
//                     req.user._id,
//                     {$set: {story: null }},
//                     {new : true},
//                     (err, deleteResultInUser) => {
//                         if(err){
//                             return next(new httpError(err, 422))
//                         }
//                     }
//                 )

//                 res.json(result)
//             })
//             .catch(err => {
//                 return next( new httpError(err, 422))                
//             })
//         }
//     })
// }





const getFollowedStories = (req, res, next) => {
    Story.find({postedBy: {$in: req.user.following}})
    .populate('postedBy', '_id username photo')
    .exec((err, result)=>{
        if (err){
            return next(new httpError(err, 422))
        }
        res.json({followedStories: [...result]})
        
    })
}





const getAllStories = (req, res, next) => {
    Story.find()
    .select('-image -createdAt -_id')
    .populate('postedBy', '_id' )
    .then(stories => {
        res.json({stories})
    })
    .catch( err => {
        return next(new httpError(err, 422))
    })
}





exports.createStory        = createStory
exports.deleteStory        = deleteStory
exports.getFollowedStories = getFollowedStories
exports.getAllStories      = getAllStories