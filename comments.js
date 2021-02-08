const express = require('express');
const router = express.Router();
const passport = require('passport');


const commentsController = require('../controller/comments_controller');


router.post('/create',passport.checkAuthentcation, commentsController.create);

router.get('/destroy/:id',passport.checkAuthentcation, commentsController.destroy); 
  
module.exports= router;