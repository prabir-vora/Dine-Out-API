const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    mainAddress: {
        type: String,
        required: true, 
        trim: true
    }, 
    optionalAddress: {
        type: String,
        trim: true
    },
    zipCode: {
        type: Number,
        required: true,
        trim: true 
    },
    city: {
        type: String, 
        required: true,
    },
    state: String,
    location: {
        lat: {
            type: Number
        },
        lng: {
            type: Number
        }
    },
    restaurantsNearBy: [{
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant',
            required: true 
        },
        distanceMatrix: {
            distance: String,
            duration: String 
        }
    }], 
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})