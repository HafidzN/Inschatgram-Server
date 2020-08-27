const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullname      : { type: String, required: true},
    username  : { type: String, required: true},
    email     : { type: String, required:true, trim: true},
    password  : { type: String, required: true},
    photo     : { type: String, default:'https://res.cloudinary.com/smilj4npj4nic/image/upload/v1595920821/zifhcviu9y2kwecpuzxf.png'},
    website   : { type: String},
    bio       : { type: String},
    phone     : { type: String, trim: true},
    followers : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    following : [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
    saved     : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post'}],
    story     : { type: mongoose.Schema.Types.ObjectId, ref:'Story'}
})

module.exports = mongoose.model('User', userSchema)