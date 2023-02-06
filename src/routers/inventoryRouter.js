const express = require('express')
const router = new express.Router()
const Inventory = require('../models/inventoryModel')
const auth = require('../middleware/auth')
const multer = require('multer')
const fs = require('fs')


//create inventory
router.post('/items',auth,async (req,res)=>{
    const inventory = new Inventory(
        {
        name:req.body.name,
        expiry_time: new Date(req.body.expiry_time).toLocaleString('en-US',{timeZone:'CST'}),
        category: req.body.category,
        quantity: req.body.quantity,
        manufacturing_time: new Date().toLocaleString('en-US',{timeZone:'CST'}),
        image: req.body.image,
        owner:req.user._id
    }
    )

    try{
        await inventory.save()
        res.status(201).send({message:"Successful Insertion",inventory})
    }
    catch(e)
    {
        res.status(400).send(e)
    }

})

const upload = multer({
    dest:'images'
})

// upload inventory image
router.post('/items/image',auth,upload.single('image'),(req,res) => {
        
    res.status(201).send("image successfully save")
})


// get inventory image
router.get('/items/:id/image',auth,async(req,res) => {
    try{
            const inventory = await Inventory.findById({_id:req.params.id ,owner: req.user._id})
            if(!inventory)
            {  
                return res.status(404).send()
            } 
            const image = fs.readFileSync(inventory.image)
            res.set('Content-Type', 'image/jpg');
            res.send(image)
    }
    catch(e)
    {
        res.status(500).send(e)
    }
       
})


// get inventory
router.get('/items',auth,async (req,res)=>{
    const name = req.query.name
    const category = req.query.category
    const match = {}
    if(name)
    {
        match.name = name
    }
    else if(category)
    {
        match.category = category
    }
    try{
            // if(name !== undefined)
            // {
            //     var inventory = await Inventory.find({name})
            // }
            // else if(category !== undefined)
            // {
            //     var inventory = await Inventory.find({category})
            // }
            
            // if(inventory.length === 0)
            //     {
            //         return res.status(404).send()
            //     }
            // const ex_time = new Date(inventory[0].expiry_time)
            // const cu_time = new Date()
          
            // if(ex_time.getTime()-cu_time.getTime() >= 0)
            // {
            //     return res.send({inventory,is_expired:false})
            // }
            await req.user.populate({
                path:'items',
                match
            })
            const filterItems = []
            req.user.items.map((item) => {
                     
                const ex_time = new Date(item.expiry_time)
                const cu_time = new Date()
                
                if(ex_time.getTime()-cu_time.getTime() >= 0)
                {
                    return filterItems.push({item,is_expired:false})
                }
                
                filterItems.push({item,is_expired:true})
           })
           res.status(200).send(filterItems)
           
    }

    catch(e)
    {
          res.status(500).send(e)
    }
})


// update inventory
router.patch('/items/:id',auth,async (req,res)=>{
        
        const updates = Object.keys(req.body)
        const allowedUpdates = ['name','expiry_time','quantity','category','image']
        const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

        if(!isValidOperation)
        {
            return res.status(400).send({error: "Invalid updates!"})
        }
        try{             
                const inventory = await Inventory.findById({_id:req.params.id ,owner: req.user._id})
                
                if(!inventory)
                {  
                    return res.status(404).send()
                } 
                 
                updates.forEach((update)=>inventory[update]=req.body[update])
                await inventory.save()
                res.status(200).send(inventory) 
        }
        catch(e)
        {
            res.status(500).send(e)
        }     

})


// delete inventory
router.delete('/items/:id',auth,async (req,res)=> {
         
    try{
       
        const inventory = await Inventory.findByIdAndDelete({_id:req.params.id ,owner: req.user._id})
        
        if(!inventory)
        {  
            return res.status(404).send()
        } 
        console.log(inventory.image)
        const imagePath = inventory.image

        fs.unlink(imagePath, (err) => {
            if (err) {
              return console.log({ message: 'Error deleting image' });
            }
            return console.log({ message: 'Image deleted successfully' });
          });

        res.status(200).send(inventory)      
        
    }
    catch(e)
    {
        res.status(500).send(e)
    }

})

module.exports = router
