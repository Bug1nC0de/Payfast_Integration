
const express = require('express');
const axios = require('axios')
const crypto = require('crypto')
const cors = require('cors')
// const connectDB = require('./utils/db');


const app = express();
app.use(cors())
app.use(express.json())
// connectDB();
const PORT = process.env.PORT || 5000;
app.get("/status-check",(req,res)=> res.send("OK") )

app.post("/get-payment-token",async (req,res,next)=>{
    console.log(req.body)
    const myData = {
        "merchant_id": "10798473",
        "merchant_key": "qtbv3djb4afpj",
        "email_address": req.body.email_address,
        "amount": parseFloat(req.body.amount).toString(),
        "item_name": req.body.item_name,

    };
    const generateSignature = (data, passPhrase = null) => {
        // Create parameter string
        let pfOutput = "";
        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                if (data[key] !== "") {
                    console.log(data[key])
                    pfOutput += `${key}=${encodeURIComponent(data[key].trim()).replace(/%20/g, " + ")}&`
                }
            }
        }

        // Remove last ampersand
        let getString = pfOutput.slice(0, -1);
        if (passPhrase !== null) {
            getString += `&passphrase=${encodeURIComponent(passPhrase.trim()).replace(/%20/g, "+")}`;
        }

        return crypto.createHash("md5").update(getString).digest("hex");
    };
    const dataToString = (dataArray) => {
        // Convert your data array to a string
        let pfParamString = "";
        for (let key in dataArray) {
            if (dataArray.hasOwnProperty(key)) {
                pfParamString += `${key}=${encodeURIComponent(dataArray[key].trim()).replace(/%20/g, "+")}&`;
            }
        }
        // Remove last ampersand
        return pfParamString.slice(0, -1);
    };

    const generatePaymentIdentifier = async (pfParamString) => {
        const result = await axios.post(`https://www.payfast.co.za/onsite/process`, pfParamString)
            .then((res) => {
                return res.data.uuid || null;
            })
            .catch((error) => {
                console.error(error.message)
            });
        return result;
    };

// Generate signature (see Custom Integration -> Step 2)
    myData["signature"] = generateSignature(myData);

// Convert the data array to a string
    const pfParamString = dataToString(myData);

// Generate payment identifier
    const identifier = await generatePaymentIdentifier(pfParamString);

    res.json({uuid:identifier})


})
app.post("/fastpay-payment-success",(req,res,next)=>{
    // Payment Related Meta Data
    // Payment Success Webhook
    console.log(req.body)
    res.status(200)
})
app.listen(PORT, () => console.log(`Template App running on port ${PORT}`));
