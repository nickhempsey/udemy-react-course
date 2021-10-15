const API_KEY = "AIzaSyDwQTzfBl6SOMNboVRkOOGBBWmaM3AcX2g";

const HttpError = require("../models/http-error");
const axios = require("axios");

async function getCoordsForAddress(address) {
	const response = await axios.get(
		`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
			address
		)}&key=${API_KEY}`
	);

	const data = response.data;

	if (!data || data.status === "ZERO_RESULTS") {
		throw new HttpError("Could not find location for the address", 422);
	}

	const cooridinates = data.results[0].geometry.location;
	return cooridinates;
}

module.exports = getCoordsForAddress;
