const express = require("express");
const app = express();
require("dotenv").config()

app.use(express.json());

app.get("/", (req, res) => {
	return res.status(200)
		.json({
			success: true,
			message: "server is up and running "
		})
})


const dbconnect = require('./config/database');
dbconnect()

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
	console.log("server is listening at : ", PORT)
})