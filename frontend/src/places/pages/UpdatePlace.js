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
import { useHttpClient } from "../../hooks/http-hook";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import "./PlaceForm.css";

const UpdatePlace = (props) => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const { loadedPlace, setLoadedPlace } = useState(false);

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

	useEffect(() => {
		const fetchPlace = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/places/${placeId}`
				);

				console.log(responseData);
				setLoadedPlace(responseData.place);
				setFormData(
					{
						title: {
							value: responseData.place.title,
							isValid: true,
						},
						description: {
							value: responseData.place.description,
							isValid: true,
						},
					},
					true
				);
			} catch (err) {}
		};

		fetchPlace();
	}, [sendRequest, placeId, setFormData]);

	const placeUpdateSubmitHandler = (event) => {
		event.preventDefault();
		console.log(formState.inputs); // send this to the backend!
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner asOverlay />
				</div>
			)}
			{!isLoading && !loadedPlace && (
				<Card>
					<div class="center">Could not find the place.</div>
				</Card>
			)}
			{!isLoading && loadedPlace && (
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
			)}
		</React.Fragment>
	);
};

export default UpdatePlace;
