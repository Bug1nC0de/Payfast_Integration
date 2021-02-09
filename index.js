const express = require("express");
const connectDB = require("./utils/db");

const app = express();
connectDB();

app.post("/fastpay-payment-success", (req, res, next) => {
	// Payment Related Meta Data
	// Payment Success Webhook
	console.log(req.body);
	res.status(200);
});

//Check if we in production//
if (process.env.NODE_ENV === "production") {
	app.use(express.static("client/build"));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
	});
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Template App running on port ${PORT}`));
