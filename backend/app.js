const { response } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const HttpError = require("./models/http-error");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

	next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
	const error = new HttpError("Could not find route", 404);
	throw error;
});

app.use((error, req, res, next) => {
	if (res.headerSent) {
		return next(error);
	}

	res
		.status(error.code || 500)
		.json({ message: error.message || "Unknown error occured" });
});

mongoose
	.connect(
		"mongodb+srv://nhemps311:RnwMIJ8oUkARZHBq@cluster0.r72qa.mongodb.net/mern?retryWrites=true&w=majority"
	)
	.then(() => {
		app.listen(5000);
	})
	.catch((error) => {
		console.log(error);
	});
