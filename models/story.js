const mongoose  = require('mongoose')

const storySchema = new mongoose.Schema({
    image    : { type: String, required: true},
    postedBy : { type: mongoose.Schema.Types.ObjectId, required: true, ref:'User'},
    createdAt: { type: String, required: true}    
})

module.exports = mongoose.model('Story', storySchema)