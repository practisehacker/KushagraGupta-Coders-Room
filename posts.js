const express = require('express');
const router = express.Router();
const passport = require('passport');
const postsApi = require('../../../controller/api/v1/posts_api')


router.get('/',postsApi.index); 
router.delete('/:id',passport.authenticate('jwt',{session:false}),postsApi.destroy);
// session false will work to not generate session cookies
module.exports = router;

