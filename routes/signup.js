const express = require('express');
const router = express.Router();

const bcrypt = require('bcrypt');
const jwt    = require('jsonwebtoken');

const User = require('../models/user');


router.post ('/', async (req, res) => {
    try {   
           
        const data = req.body  

        const regexp_name = /^[가-힣a-zA-Z]+$/;  
        const regexp_nickname = /^[가-힣a-zA-Z]+$/;
        const regexp_password = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,15}/;  
        const regexp_phone = /^(010|011|016|017|018|019)-\d{4}-\d{4}$/;
        const regexp_email = /^(\w{1,20})+@(\w{1,20})+\.([a-zA-Z]{2,4}$)+$/;
                   
        if (!regexp_name.test(data["name"]) ||   
        !regexp_nickname.test(data["nickname"]) || 
        !regexp_password.test(data["password"]) ||
        !regexp_phone.test(data["phone"]) ||
        !regexp_email.test(data["email"]))
        
        {
            return res.status(400).send({"message" : "INVALID_INPUT"});
        }  
    
        const check1 = await User.findAll({where :{ user_nickname: data.nickname}})
        const check2 = await User.findAll({where :{ user_email: data.email}})
        const check3 = await User.findAll({where :{ user_phone: data.phone}})
        
        if (!(check1.length==0 || check2.length==0 || check3.length==0)) {
            return res.status(400).send({"message":"already exist"});
        }

        await User.create({
            user_name     : data.name,   
            user_nickname : data.nickname,
            user_password : bcrypt.hashSync(data.password, 10),
            user_email    : data.email,
            user_phone    : data.phone,
             
        });
        
        return res.status(200).send({"message":"success"});    
             
    }
    catch (err) {
        console.log(err.message)  
    }
});

router.post('/login', async (req,res) => {
    try {
        const data = req.body
    
        const check1 = await User.findOne({where :{ user_nickname: data.nickname}})
      
        if (!check1) {
            return res.status(400).send({"님은":"회원아니다"});
        } 
    
        const check2 = bcrypt.compareSync(data.password, check1.get("user_password")); 
        
        if (!check2) {
            return res.status(400).send({"비밀번호":"올바르지않음"});
        }
    
        const token = jwt.sign({user_nickname: data.nickname}, 'secretToken') 
        
            return res.status(200).send({ "로그인":"성공" , user_nickname:token})
               
        }
    catch(err){
        console.log(err);
    }
});

module.exports = router;


