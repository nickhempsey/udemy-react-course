const { validationResult } = require("express-validator");

const HttpError = require("../models/http-error");
const User = require("../models/user");

const getUsers = async (req, res, next) => {
	let users;
	try {
		users = await User.find({}, "-password");
	} catch (err) {
		return next(new HttpError("Something went wrong", 500));
	}

	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
};

const userLogIn = async (req, res, next) => {
	const { email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		return next(new HttpError("Something went wrong", 500));
	}

	if (!existingUser || existingUser.password !== password) {
		return next(new HttpError("Could not log you in.", 401));
	}

	res.status(200).json({
		message: "logged in!",
		user: existingUser.toObject({ getters: true }),
	});
};

const userSignUp = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError("Invalid inputs passed, check your data", 422));
	}

	const { name, email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		return next(new HttpError("Something went wrong", 500));
	}

	if (existingUser) {
		return next(new HttpError("User exists already, please login.", 422));
	}

	const createdUser = new User({
		name,
		email,
		image: "https://via.placeholder.com/150",
		password,
		places: [],
	});

	try {
		await createdUser.save();
	} catch (err) {
		return next(new HttpError("Sign up failed", 500));
	}
	res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

exports.getUsers = getUsers;
exports.userSignUp = userSignUp;
exports.userLogIn = userLogIn;
