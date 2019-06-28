const express = require('express')
require('../src/db/mongoose')
const app = express()
const port = process.env.PORT 

const userRouter = require('../src/routers/user')
const restaurantRouter = require('../src/routers/restaurant')
const reviewRouter = require('../src/routers/review')

app.use(express.json())
app.use(userRouter)
app.use(restaurantRouter)
app.use(reviewRouter)
app.listen(port, () => {
    console.log('Server is up on ' + port)
})
