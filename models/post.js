const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    body     : { type: String},
    image    : { type: String, required: true},
    likes    : [{ type: mongoose.Schema.Types.ObjectId, ref:'User'}],
    comments : [{ text: String,
                  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}}],
    postedBy : { type: mongoose.Schema.Types.ObjectId, required: true, ref:'User'},
    createdAt: { type: String, required: true}
})

module.exports = mongoose.model('Post', postSchema)

// const save = (req, res, next) => {
//     User.saved.findOne(
//         {_id: req.body.postId})
//         .exec((err, existPost)=> {
//         if(err){
//             const error = new httpError(err, 422)
//             return next (error)
//         }
//          else {
//             if (existPost){
//                 return next (new httpError('the post is already saved '))
//             }

//          Post.findOne({_id: req.body.postId})
//          .exec((err, post)=> {
//              if (err){
//                 const error = new httpError(err, 422)
//                 return next (error)                 
//              }


//             User.findByIdAndUpdate(
//                 req.user._id,
//                 {$push : {saved : post}},
//                 {new: true}
//             )
//             .populate('saved', 'likes _id body image postedBy createdAt comments')
//             .exec((err, result)=> {
//                 if(err){
//                     const error = new httpError(err, 422)
//                     return next (error)
//                 } else {
//                     res.json(result)
//                 }
//             })



//          })

//          }


//     })
// }
