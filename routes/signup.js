const express = require('express');
const router = express.Router();
const redis = require('redis');
const redisClient = redis.createClient();
redisClient.connect();

const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');
const verifyToken = require('./jwt');


router.post ('/sing', async(req, res) => {
    try {   
           
        const data = req.body  

        const regexp_name = /^[가-힣a-zA-Z]+$/;  
        const regexp_nickname = /^[가-힣a-zA-Z]+$/; 
        const regexp_password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,15}/;  
        const regexp_phone = /^(010|011|016|017|018|019)\d{3,4}\d{4}$/;
        const regexp_email = /^(\w{1,20})+@(\w{1,20})+\.([a-zA-Z]{2,4}$)+$/;
                   
        if (!regexp_name.test(data["name"]) ||   
        !regexp_nickname.test(data["nickname"]) || 
        !regexp_password.test(data["password"]) ||
        !regexp_phone.test(data["phone"]) ||
        !regexp_email.test(data["email"]))
        
        {
            return res.status(401).json({ "message" : "INVALID_INPUT"});
        }
    
        const check1 = await User.findAll({where :{ user_nickname: data.nickname}})
        const check2 = await User.findAll({where :{ user_email: data.email}})
        const check3 = await User.findAll({where :{ user_phone: data.phone}})
        
        if (!(check1.length===0 || check2.length===0 || check3.length===0)) {
            return res.status(401).json({ "message":"already exist"});
        } 
        
        const salt = await bcrypt.genSalt(10)
          
        await User.create({
            user_name     : data.name,   
            user_nickname : data.nickname,
            user_password : await bcrypt.hashpw(data.password, salt),  
            user_email    : data.email,
            user_phone    : data.phone,
            user_salt     : salt
        })
            return res.status(201).json({ "message":"success"});
         
    }
    catch (err) {
        console.log(err.message)  
    }
});

router.post ('/login', async(req,res) => {
    try {
        const data = req.body
    
        const check1 = await User.findOne({where :{ user_nickname: data.nickname}})
      
        if (!check1) {
            return res.status(401).json({ "message":"not a member"});
        } 
    
        const check2 = bcrypt.compareSync(data.password, check1.get("user_password")); 
        
        if (!check2) {
            return res.status(401).json({ "message":"Password is incorrect"});
        }
        
        const salt = await bcrypt.genSalt(10)
        await User.update({ user_password : data.password(bcrypt.hash(data.password, salt))}, {where: {user_nickname: data.nickname}})
          
        const token = jwt.sign({user_nickname: data.nickname}, process.env.SECRET_KEY, { expiresIn: process.env.JWT_ACCESS_TIME}) 
        await redisClient.set(data.nickname, token)
            return res.status(201).json({ "message":"success" , token:token});
        }
    catch(err){
        console.log(err);
    }
});

router.post('/mail', async(req, res) => {
    try{

        let authNum = Math.floor((Math.random() * 1000000) + 1 );

        let transporter = nodemailer.createTransport({ //내가 주체가되어서 유저한테 메일보내는 계정 설정 구간
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASSWORD,
            },
        });

        let message = await transporter.sendMail({ // 유저한테 보내는 메일 내용
            from: process.env.NODEMAILER_USER,
            to: req.body.email,
            subject: "이메일 인증번호",
            text: String( authNum ),   
        });

        let checkmail = await new Object();
            checkmail.authNum = authNum;
        
        await res.send(checkmail);
        console.log(checkmail);
    }
    catch(err) {
        console.log(err);
    }
});

module.exports = router;