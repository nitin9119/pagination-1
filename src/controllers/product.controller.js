const express = require('express');
const Product = require('../models/product.model')
const sendMail = require('../utils/send-mail');
const router = express.Router();

router.post('/', async (req, res)=>{
    try{
        const to_string = ["a@a.com","b@b.com","c@c.com","d@d.com","e@e.com"];
        const product = await Product.create(req.body);        
        to_string.forEach((ele)=>{
            sendMail(
                "a@a.com",
                 ele,
                `resgistration of product name ${req.body.name}`,
                `Congratulation registration of product ${req.body.name} is succesfull.`,
                `<h1>Congratulation registration of product ${req.body.name} is succesfull.</h1>`
            );    
        })
        return res.status(201).json({product});
    }catch(e){
        return res.status(500).json({status:"failed",message: e.message});
    }
})
router.get("/", async (req, res) => {
    try{
        const page = +req.query.page || 1;
        const size = +req.query.size || 2;
        const skip = (page - 1) * size;
        const totalPages = Math.ceil(await Product.find().countDocuments()/size);
        const products = await Product.find().skip(skip).limit(size).lean().exec();
        return res.json({products,totalPages});
    }catch(e){
        return res.status(500).json({status:"failed",message: e.message});
    }    
});

module.exports= router;