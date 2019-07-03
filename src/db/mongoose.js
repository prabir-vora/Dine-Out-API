const mongoose = require('mongoose')

mongoose.connect(process.env.MongoDBURL, {
    useNewUrlParser: true,
    useCreateIndex: true
}, (error) => {
    if (error) {
        console.log(error)
    }
})