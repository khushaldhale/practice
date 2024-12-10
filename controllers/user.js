const userModel = require("../models/user");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()


const signup = async (req, res) => {
	try {


		const { fname, lname, email, password } = req.body;

		if (!fname || !lname || !email || !password) {
			return res.status(404)
				.json({
					success: false,
					message: "kindly provide all details"
				})
		}

		const is_existing = await userModel.findOne({ email });
		if (is_existing) {
			return res.status(404)
				.json({
					success: false,
					message: 'you are already registered kindly login '
				})
		}
		const hashedPassword = await bcrypt.hash(password, 10)

		const response = await userModel.create({ fname, lname, email, password: hashedPassword })

		return res.status(200)
			.json({
				success: true,
				message: "user is registered succesfully",
				data: response
			})
	}
	catch (error) {
		console.log(error);
		return res.status(500)
			.json({
				success: false,
				message: "Internal error occured"
			})
	}
}

exports.login = async (req, res) => {
	try {

		const { email, password } = req.body
		if (!email || !password) {
			return res.status(404)
				.json({
					success: false,
					message: 'kindly provide all details'
				})
		}

		const is_existing = await userModel.findOne({ email });

		if (!is_existing) {
			return res.status(404)
				.json({
					success: false,
					message: " you are not registered yet"
				})
		}

		//  passwords are matched , generate a token now
		if (await bcrypt.compare(password, is_existing.password)) {
			const token = jwt.sign({
				_id: is_existing._id
			}, process.env.JWT_SECRET,
				{
					expiresIn: "24h"
				})

			return res.cookie("token", token, {
				httpOnly: true,
				secure: false,
				sameSite: "strict",
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
			})
				.status(200)
				.json({
					success: true,
					message: ' user is successfully logged in',
					data: is_existing,

				})
		}
		else {
			return res.status(404)
				.json({
					success: false,
					message: " password is incorrect"
				})
		}
	}
	catch (error) {
		console.log(error)
		return res.status(500)
			.json({
				success: false,
				message: "Internal error occured"
			})
	}
}

