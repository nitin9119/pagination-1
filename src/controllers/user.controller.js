const express = require('express');
const User = require('../models/users.model');
const sendMail = require('../utils/send-mail');
const adminMail = require("../utils/send-mail");
const router = express.Router();

router.post('/', async (req, res)=>{
    try{
        const user = await User.create(req.body);
        sendMail(
            "masai@school.com",
             req.body.email,
            `Welcome to ABC system ${req.body.first_name} ${req.body.last_name}`,
            `Hi ${req.body.first_name}, Please confirm your email address`,
            `<h1>Hi ${req.body.first_name}, Please confirm your email address</h1>`
        );

        const to_string = ["a@a.com","b@b.com","c@c.com","ravi@r.com","ram@r.com"];

        to_string.forEach((ele)=>{
            adminMail(
                "req.body.email",
                 ele,
                ` ${user.first_name} ${user.last_name} has registered with u`,
                `Please welcome ${user.first_name} ${user.last_name}`,
                `<h1>Please welcome ${user.first_name} ${user.last_name}</h1>`
            );
        })

        return res.status(201).json({user});
    }catch(e){
        return res.status(500).json({status:"failed",message: e.message});
    }
})

router.get("/", async (req, res) => {
    try{
        const page = +req.query.page || 1;
        const size = +req.query.size || 2;
        const skip = (page - 1) * size;
        const totalPages = Math.ceil(await User.find().countDocuments()/size);
        const users = await User.find().skip(skip).limit(size).lean().exec();
        return res.json({users,totalPages});
    }catch(e){
        return res.status(500).json({status:"failed",message: e.message});
    }    
});

module.exports= router;