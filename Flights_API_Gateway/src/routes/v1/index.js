const express = require("express");
const userRoutes = require('./user-routes');
const router = express.Router();
router.use('/user',userRoutes);
router.get('/info',(req,res)=>{
    res.status(200).json({
        message:'API is live in API Gateway'
    })
})
module.exports = router;