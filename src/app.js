const express = require('express')
require('./db/mongoos')
const inventoryRouter = require('./routers/inventoryRouter')
const userRouter = require('./routers/userRouter')
// const fileUpload = require('express-fileupload')

const app = express()

// app.use(fileUpload)
app.use(express.json())
app.use(inventoryRouter)
app.use(userRouter)

module.exports = app