const mongoose = require('mongoose')


const inventorySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true

    },
    expiry_time:{
        type:String
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    quantity:{
        type:Number,
        required:true
    },
    manufacturing_time:{
        type:String,
        required:true
    },
    image:{
         type:String,
         required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
})

const Inventory = mongoose.model('Inventory',inventorySchema)

module.exports = Inventory