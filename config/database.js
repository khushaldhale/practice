const mongoose = require('mongoose');
require("dotenv").config()

const dbconnect = () => {

	mongoose.connect(process.env.DATABASE_URL)
		.then((data) => {
			console.log("db connection is established : ", data.connection.host)
		})
		.catch((error) => {
			console.log(" db connection is refused : ", error)
		})
}

module.exports = dbconnect