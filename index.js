const express = require('express');
const connectDB = require('./utils/db');


const app = express();
connectDB();
const PORT = process.env.PORT || 5000;
app.post("/fastpay-payment-success",(req,res,next)=>{
    // Payment Related Meta Data
    // Payment Success Webhook
    console.log(req.body)
    res.status(200)
})
app.listen(PORT, () => console.log(`Template App running on port ${PORT}`));
