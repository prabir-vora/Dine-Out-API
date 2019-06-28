const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: [{
        type: String,
        enum: ['Italian', 'Indian', 'Thai', 'Chinese', 'Japanese', 'Greek', 'Burgers', 'Pizza', 'Middle Eastern', 'American'],
        required: true
    }],
    address: {
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
        }
    }, 
    menu: [{
        name: {
            type: String,
            required: true,
            trim: true    
        },
        price: {
            type: Number,
            required: true,
            trim: true 
        },
        description: {
            type: String
        },
        picture: {
            type: Buffer
        },
        category: [{
            type: String,
            enum: ['Veg', 'Non Veg', 'Gluten Free', 'Chef Special']
        }]
    }],
    placeholderImage: {
        type: Buffer
    },
    averageRating: {
        rating: {
            type: Number,
            min: 0,                
            max: 5,
            default: 0
        },
        count: {
            type: Number,
            default: 0           
        }
    },
    timing: {
        open: {
            type: String
        },
        close: {
            type: String
        }
    },
    averageCost: {
        type: Number
    },
    views: {
        type: Number,
        default: 0
    },
    distanceMatrix: {
        distance: String,
        duration: String
    }
})

restaurantSchema.index({ "address.city" : 1 })

restaurantSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'restaurant'
})

const Restaurant = mongoose.model('Restaurant', restaurantSchema)

module.exports = Restaurant