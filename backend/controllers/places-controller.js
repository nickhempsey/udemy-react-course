const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const getCoordsForAddress = require("../util/location");

const HttpError = require("../models/http-error");

const Place = require("../models/place");
const User = require("../models/user");

const getPlaceById = async (req, res, next) => {
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId).exec();
	} catch (err) {
		return next(new HttpError("Something went wrong, please try again"));
	}

	if (!place || place.length === 0) {
		return next(
			new HttpError("could not find place for the provided id.", 404)
		);
	}

	res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
	const userId = req.params.uid;

	let places;

	try {
		places = await Place.find({ creator: userId });
	} catch (err) {
		return next(new HttpError("Something went wrong, please try again", 500));
	}

	if (!places || places.length === 0) {
		return next(
			new HttpError("could not find place for the provided user id.", 404)
		);
	}

	res.json({
		places: places.map((place) => place.toObject({ getters: true })),
	});
};

const createPlace = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError("Invalid inputs passed, check your data", 422)); // Next must be used with async functions
	}

	const { title, description, location, address, creator } = req.body;

	let coordinates;

	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		return next(error);
	}

	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		image:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
		creator,
	});

	let user;
	try {
		user = await User.findById(creator);
	} catch (err) {
		return next(
			new HttpError("Failed to create place, please try again.", 500)
		);
	}

	if (!user) {
		return next(new HttpError("Failed to find a user", 404));
	}

	try {
		const sess = await mongoose.startSession();

		sess.startTransaction();

		await createdPlace.save({ session: sess });

		user.places.push(createdPlace);
		await user.save({ session: sess });

		await sess.commitTransaction();
	} catch (err) {
		return next(new HttpError("Failed to create place, not sure why.", 500));
	}

	res.status(201).json(createdPlace);
};

const updatePlace = async (req, res, next) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return next(new HttpError("Invalid inputs passed, check your data", 422));
	}
	const { title, description } = req.body;
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId).exec();
	} catch (err) {
		return next(new HttpError("Something when wrong.", 500));
	}

	if (!place) {
		return next(
			new HttpError("could not find place for the provided id.", 404)
		);
	}

	place.title = title;
	place.description = description;

	try {
		await place.save();
	} catch (err) {
		return next(new HttpError("Could not update place", 500));
	}

	res.status(200).json({ place: place.toObject({ getters: true }) });
};

const deletePlace = async (req, res, next) => {
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId).populate("creator");
	} catch (err) {
		return next(
			new HttpError("Something when wrong trying to find the place.", 500)
		);
	}

	if (!place) {
		return next(new HttpError("No place was found.", 500));
	}

	console.log(place);

	try {
		const sess = await mongoose.startSession();

		sess.startTransaction();

		await place.remove({ session: sess });

		place.creator.places.pull(place);
		await place.creator.save({ session: sess });

		await sess.commitTransaction();
	} catch (err) {
		return next(
			new HttpError(
				"Something when wrong while trying to remove the place.",
				500
			)
		);
	}

	res.status(200).json({ message: "Deleted place." });
};

exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
