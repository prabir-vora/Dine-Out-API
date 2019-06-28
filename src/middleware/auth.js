const jwt = require('jsonwebtoken')
const User = require('../model/user')

const userauth = async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, process.env.JWT_Secret)
        const user = await User.findOne( { _id: decoded._id, "tokens.token" : token})

        if (!user) {
            throw new Error()
        }

        req.token = token
        req.user = user
        next()

    } catch (e) {
        res.status(400).send({error: 'Please Authenticate'})
    }

}

module.exports = userauth