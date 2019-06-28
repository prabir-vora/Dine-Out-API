const rp = require('request-promise')

const getCoordinates = function(address, callback) {

    let modifiedAddress = address.replace(" ", "+")

    var options = {
        uri: "https://maps.googleapis.com/maps/api/geocode/json",
        qs: {
            address: modifiedAddress,
            key: process.env.googleAPIKey
        },
        json: true
    }

    rp(options).then((body) => {
        callback(undefined, body.results[0].geometry.location)
    }).catch((err) => {
        callback('unable to connect to google api', undefined)
    })
}

module.exports = getCoordinates
