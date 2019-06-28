const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true 
    },
    text: {
        type: String,
        required: true
    },
    peopleLiked: [{
        type: String,
        enum: ['Service', 'Taste', 'Ambience']
    }],
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'User'
    }, 
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
        ref: 'Restaurant'
    }
}, {
    timestamps: true
})

const Review = mongoose.model('Review', reviewSchema)

module.exports = Review