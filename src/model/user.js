const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true
    }, 
    lastName: {
        type: String,
        required: true,
        trim: true 
    },
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('email is not valid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7
    },
    address: [{
        addressType: {
            type: String,
            default: "Other",
            trim: true
        },
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
        lat: {
                type: Number
        },
        lng: {
            type: Number
        }
    }], 
    avatar: {
        type: Buffer
    },
    recentlyViewed: [{
        restaurant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Restaurant'
        }
    }], 
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

userSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'author'
})

userSchema.pre('save', async function (next) {
    const user = this 

    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

userSchema.methods.generateAuthToken = async function () {
    const user = this 
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_Secret)

    user.tokens = user.tokens.concat({token})
    await user.save()

    return token 
}

userSchema.methods.addLocation = async function (lat, lng) {
    const user = this
    user.address[0].lat = lat
    user.address[0].lng = lng
    
    await user.save()
}

userSchema.statics.findByCredentials = async function (email, password) {
    const user = await User.findOne( { email } )

    if (!user) {
        throw new Error('Unable to login')
    } 

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
        throw new Error('Unable to Login')
    }
    
    return user
}


const User = mongoose.model('User', userSchema)

module.exports = User 