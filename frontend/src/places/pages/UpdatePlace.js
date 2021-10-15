import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useForm } from "../../hooks/form-hooks";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import {
	VALIDATOR_REQUIRE,
	VALIDATOR_MINLENGTH,
} from "../../shared/util/validators";

import "./PlaceForm.css";

const DUMMY_PLACES = [
	{
		id: "p1",
		title: "Empire State Building",
		description: "One of the most famous sky scrapers in the world!",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
		address: "20 W 34th St, New York, NY 10001",
		location: {
			lat: 40.7484405,
			lng: -73.9878584,
		},
		creator: "u1",
	},
	{
		id: "p2",
		title: "E S B",
		description: "One of the most famous sky scrapers in the world!",
		imageUrl:
			"https://upload.wikimedia.org/wikipedia/commons/thumb/d/df/NYC_Empire_State_Building.jpg/640px-NYC_Empire_State_Building.jpg",
		address: "20 W 34th St, New York, NY 10001",
		location: {
			lat: 40.7484405,
			lng: -73.9878584,
		},
		creator: "u2",
	},
];

const UpdatePlace = (props) => {
	const [isLoading, setIsLoading] = useState(true);

	const placeId = useParams().placeId;

	const [formState, inputHandler, setFormData] = useForm(
		{
			title: {
				value: "",
				isValid: false,
			},
			description: {
				value: "",
				isValid: false,
			},
		},
		false
	);

	const identifiedPlace = DUMMY_PLACES.find((p) => p.id === placeId);

	useEffect(() => {
		if (identifiedPlace) {
			setFormData(
				{
					title: {
						value: identifiedPlace.title,
						isValid: true,
					},
					description: {
						value: identifiedPlace.description,
						isValid: true,
					},
				},
				true
			);
			setIsLoading(false);
		}
	}, [setFormData, identifiedPlace]);

	const placeUpdateSubmitHandler = (event) => {
		event.preventDefault();
		console.log(formState.inputs); // send this to the backend!
	};

	if (!identifiedPlace) {
		return (
			<div classs="center">
				<Card>
					<h2>Could not find the place!</h2>
				</Card>
			</div>
		);
	}

	if (isLoading) {
		return <div classs="center">Loading...</div>;
	}

	return (
		<form className="place-form" onSubmit={placeUpdateSubmitHandler}>
			<Input
				id="title"
				element="input"
				type="text"
				label="Title"
				validators={[VALIDATOR_REQUIRE()]}
				errorText="Please enter a valid title"
				onInput={inputHandler}
				initialValue={formState.inputs.title.value}
				initialIsValid={formState.inputs.title.isValid}
			/>
			<Input
				id="description"
				element="inputarea"
				label="Description"
				validators={[VALIDATOR_MINLENGTH(5)]}
				errorText="Please enter a valid description"
				onInput={inputHandler}
				initialValue={formState.inputs.description.value}
				initialIsValid={formState.inputs.description.isValid}
			/>
			<Button type="submit" disabled={!formState.isValid}>
				Update Place
			</Button>
		</form>
	);
};

export default UpdatePlace;
