const express = require('express')
const Review = require('../model/review')
const Restaurant = require('../model/restaurant')
const userauth = require('../middleware/auth')
const router = new express.Router()

router.post('/restaurant/:id/addReview', userauth, async (req, res) => {

    

    
    //const review = new Review( req.body )

    try {

        const restId = req.params.id 

        const restaurant = await Restaurant.findById(restId)  

        if (!restaurant) {
            throw new Error()
        }

        const reviewObj = {
            rating: req.body.rating,
            text: req.body.text,
            peopleLiked: req.body.peopleLiked,
            author: req.user._id,
            restaurant: restId
        }

        const review = new Review(reviewObj)
        await review.save()

        //Update Restaurant Rating 
        const ratingTotal = restaurant.averageRating.rating * restaurant.averageRating.count
        const newTotal = ratingTotal + req.body.rating 
        restaurant.averageRating.count = restaurant.averageRating.count + 1
        restaurant.averageRating.rating = newTotal / restaurant.averageRating.count

        await restaurant.save()

        
        res.status(201).send(review)

    } catch (e) {

        res.status(400).send(e)
    }

})

module.exports = router