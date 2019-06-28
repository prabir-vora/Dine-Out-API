const express = require('express')
const User = require('../model/user')
const userauth = require('../middleware/auth')
const router = new express.Router()
const getCoordinates = require('../googleAPI/googleGeocoding')

//Create User
router.post('/users', async (req, res) => {

    const address = req.body.address[0].mainAddress + ", " + req.body.address[0].city + ", " + req.body.address[0].state

    const user = new User(req.body)

    try {

        await user.save()

        const token = await user.generateAuthToken()

        res.status(201).send({ user, token})
    
    } catch (e) {
        res.status(400).send(e)
    }
})

//User log in
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()

        res.send( {user, token})

    } catch (e) {
        res.status(400).send()
    }
})

//User log out 
router.post('/users/logout', userauth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token 
        })

        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Get user info
router.get('/users/me', userauth, async (req, res) => {
    res.send(req.user)
})

//Update Name, password
router.patch('users/me', userauth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['firstName', 'lastName', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid Operation'})
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.send(req.user)

    } catch (e) {
        res.status(400).send(e)
    }
})


//Fetch Recently Viewed Restaurants for user 
router.get('/users/recentlyViewed', userauth, async (req, res) => {
    try {
        const recentlyViewedRestaurants = await req.user.populate('recentlyViewed')
        res.send( { recentlyViewedRestaurants })
    } catch (e) {
        res.status(500).send()
    }
})

//Fetch user reviews 
router.get('/users/reviews', userauth, async (req, res) => {
    const sort = {}

    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1 
    }

    try {
        const user = req.user
        await user.populate({
            path: 'reviews',
            populate: { path: 'restaurant' , select: '_id name'},
            options: {
                sort
            }
        }).execPopulate()
        res.send(user.reviews)
    } catch (e) {
        res.status(400).send()
    }
})


module.exports = router
 