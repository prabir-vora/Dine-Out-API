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



const getTravelTimeRecursive = async function(user, restaurantsArray, callback) {

    function iterate(index) {
        if (index == restaurantsArray.length) {
            return callback()
        }

        const userLat = user.address[0].lat
        const userLng = user.address[0].lng

        const restLat = restaurantsArray[index].address.location.lat 
        const restLng = restaurantsArray[index].address.location.lng 

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
            restaurantsArray[index].distanceMatrix.distance = body.rows[0].elements[0].distance.text
            restaurantsArray[index].distanceMatrix.duration = body.rows[0].elements[0].duration.text
            
            iterate(index + 1)
 
        }).catch((err) => {
            console.log(err)

            callback(err)
        })

    }

    iterate(0)
}

const getTravelTimeParralel = function(user, restaurantsArray, callback) {

    // let completed = 0, hasErrors = false 

    // function done(err) {
    //     if(err) {
    //         hasErrors = true;
    //         return callback(err);
    //     }

    //     if(++completed === links.length && !hasErrors) {
    //         return callback();
    //     }
    // }

    restaurantsArray.forEach(restaurant => {
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
            
            callback()
 
        }).catch((err) => {
            console.log(err)
            
            callback(err)
            
        })
    });
}

module.exports = { getTravelTime,
    getTravelTimeRecursive,
getTravelTimeParralel }
