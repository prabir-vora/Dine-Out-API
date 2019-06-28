const express = require('express')
const Restaurant = require('../model/restaurant')
const userauth = require('../middleware/auth')
const router = new express.Router()
const getTravelTime = require('../googleAPI/distanceMatrix')

router.post('/restaurant', async (req, res) => {
    const restaurant = new Restaurant( req.body )

    try {

        await restaurant.save()

        Restaurant.syncIndexes()

        res.status(201).send(restaurant)

    } catch (e) {
        res.status(400).send(e)
    }

})

//Fetch restaurants along with filters and sort based on location

router.get('/restaurants/location', userauth, async (req, res) => {

    var query = {}
    var sortBy = {}

    const city = req.query.city 
    const category = req.query.category

    if (!city) {
        throw new Error( {error: "Location argument missing"} )
    }

    if (category) {
        query = {
            'address.city' : city,
            category
        }
    } else {
        query = {
            'address.city' : city
        }
    }

    if (req.query.sortBy) {
        
        var sort = req.query.sortBy.split(":")
        if (sort[0] === "rating") {
            sort[0] = "averageRating.rating"
        }
        order = sort[1] === "desc" ? -1 : 1
        sortBy[sort[0]] = order 
        console.log(sortBy)
    }

    try {
        const restaurants = await Restaurant.find( query ).sort(sortBy)

        if (!restaurants) {
            throw new Error( {error: "No results Found"})
        }

        let modifiedRestaurants = []

        for (let i = 0; i < restaurants.length; i++) {
            const newRest = await getTravelTime(req.user, restaurants[i])
            modifiedRestaurants.push(newRest)
        }
        

        console.log(modifiedRestaurants)
        res.send(modifiedRestaurants)
    } catch (e) {
        res.status(400).send(e)
    }

})

//Fetching restaurant from id

router.get('/restaurant/:id', userauth, async (req, res) => {
    try {

        const restaurant = await Restaurant.findById(req.params.id) 
        
        if (!restaurant) {
            throw new Error( {error: "No match Found"})
        }

        restaurant.views = restaurant.views + 1

        restaurant.save()
        req.user.recentlyViewed.push( restaurant)

        await req.user.save()

        res.send(restaurant)

    } catch (e) {
        res.status(400).send(e)
    }
})

//Fetching all reviews for a restaurant 

router.get('/restaurant/:id/reviews', userauth, async (req, res) => {

    

    try {
        const restaurant = await Restaurant.findById( req.params.id )
        
        if (!restaurant) {
            throw new Error( {error: "no match found"})
        }

        console.log(restaurant)

        await restaurant.populate({
            path: 'reviews',
            populate: { path: 'owner', select: "_id rating text" }
        }).execPopulate()

        res.send(restaurant.reviews)

    } catch (e) {
        res.status(400).send(e)
    }
})



module.exports = router