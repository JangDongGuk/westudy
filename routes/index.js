require('dotenv').config()
const express = require('express');
const router = express.Router();
const redis = require('redis');

// const MODE = process.env.MODE;
// console.log('mode => ', MODE);


const redisInit = async() =>  {
  const redisClient = redis.createClient({'url': "redis://127.0.0.1:6379" });
  console.log(redisClient);
  await redisClient.connect();
}

redisInit();



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});



module.exports = router, redisInit;
