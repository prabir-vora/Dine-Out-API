const rp = require('request-promise')

const getTravelTime = function (user, restaurant) {

    return new Promise(function(resolve, reject) {

        const userLat = user.address[0].lat
        const userLng = user.address[0].lng 

        const restLat = restaurant.address.location.lat 
        const restLng = restaurant.address.location.lng 

        console.log({userLat, userLng})
        console.log({restLat, restLng})

        var options = {
            uri: "https://maps.googleapis.com/maps/api/distancematrix/json",
            qs: {
                origins: `${userLat},${userLng}`,
                destinations: `${restLat},${restLng}`,
                key: process.env.googleAPIKey
            },
            json: true
        } 

        rp(options).then((body) => {
        
            console.log(body.rows[0].elements[0])
            restaurant.distanceMatrix.distance = body.rows[0].elements[0].distance.text
            restaurant.distanceMatrix.duration = body.rows[0].elements[0].duration.text
            
            resolve(restaurant)
 
        }).catch((err) => {
            console.log(err)
            
            reject(err)
            
        })

    })


}

module.exports = getTravelTime