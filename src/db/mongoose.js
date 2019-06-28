const mongoose = require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/dine-out-api', {
    useNewUrlParser: true,
    useCreateIndex: true
}, (error) => {
    if (error) {
        console.log(error)
    }
})