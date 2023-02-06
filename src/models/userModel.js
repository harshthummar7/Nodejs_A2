const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Inventory = require('../models/inventoryModel')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true

    },
    password:{
        type:String,
        required:true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes("password"))
            {
                throw Error("This is not valid password")
            }
        }
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value)
        {
            if(!validator.isEmail(value))
            {
                throw Error("Email is not valid")
            }
        }

    },
    age:{
        type:Number,
        default:0
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
},{
    timestamps:true
})



userSchema.virtual('items',{
    ref:'Inventory',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email,password) => {

        const user = await User.findOne({email})
        if(!user)
        {
             throw new Error('Unable to login!')
            
            
        }
        
        const isMatch = await bcrypt.compare(password,user.password)

        if(!isMatch) 
        {
           throw new Error('Unable to login!')
        }

        return user


}


userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password'))
    {
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

userSchema.pre('remove',async function(next){
    const user = this
    await Inventory.deleteMany({owner:user._id})
    next()
})


const User = mongoose.model('User',userSchema)

module.exports = User