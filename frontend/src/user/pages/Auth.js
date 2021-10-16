import React, { useState, useContext } from "react";

import Input from "../../shared/components/FormElements/Input";
import {
	VALIDATOR_EMAIL,
	VALIDATOR_MINLENGTH,
	VALIDATOR_REQUIRE,
} from "../../shared/util/validators";
import { useForm } from "../../hooks/form-hooks";
import Button from "../../shared/components/FormElements/Button";
import Card from "../../shared/components/UIElements/Card";
import { AuthContext } from "../../shared/context/auth-context";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../hooks/http-hook";

import "./Auth.css";

const Auth = () => {
	const auth = useContext(AuthContext);

	const { isLoading, error, sendRequest, clearError } = useHttpClient();

	const [isLoginMode, setIsLoginMode] = useState(false);

	const [formState, inputHandler, setFormData] = useForm(
		{
			email: {
				value: "",
				isValid: false,
			},
			password: {
				value: "",
				isValid: false,
			},
		},
		false
	);

	const authSubmitHandler = async (event) => {
		event.preventDefault();

		if (isLoginMode) {
			try {
				const responseData = await sendRequest(
					"http://localhost:5000/api/users/login",
					"POST",
					JSON.stringify({
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{
						"Content-Type": "application/json",
					}
				);

				console.log(responseData);
				auth.login(responseData.user.id);
			} catch (err) {}
		} else {
			try {
				const responseData = await sendRequest(
					"http://localhost:5000/api/users/signup",
					"POST",
					JSON.stringify({
						name: formState.inputs.name.value,
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
					{
						"Content-Type": "application/json",
					}
				);

				auth.login(responseData.user.id);
			} catch (err) {}
		}
	};

	const switchModeHandler = () => {
		if (!isLoginMode) {
			setFormData(
				{
					...formState.inputs,
					name: undefined,
				},
				formState.inputs.email.isValid && formState.inputs.password.isValid
			);
		} else {
			setFormData(
				{
					...formState.inputs,
					name: {
						value: "",
						isValid: false,
					},
				},
				false
			);
		}
		setIsLoginMode((prevMode) => !prevMode);
	};

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			<Card>
				{isLoading && <LoadingSpinner asOverlay />}
				<h2>Login required</h2>
				<hr />
				<form onSubmit={authSubmitHandler}>
					{!isLoginMode && (
						<Input
							id="name"
							element="input"
							type="text"
							label="Name"
							validators={[VALIDATOR_REQUIRE()]}
							errorText="Please enter your name."
							onInput={inputHandler}
						/>
					)}
					<Input
						id="email"
						element="input"
						type="email"
						label="Email"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_EMAIL()]}
						errorText="Please enter a valid email."
						onInput={inputHandler}
					/>

					<Input
						id="password"
						element="input"
						type="password"
						label="Password"
						validators={[VALIDATOR_REQUIRE(), VALIDATOR_MINLENGTH(8)]}
						errorText="Please enter a valid email."
						onInput={inputHandler}
					/>
					<Button type="submit" disabled={!formState.isValid}>
						{isLoginMode ? "Login" : "Sign Up"}
					</Button>
				</form>
				<hr />
				<Button inverse onClick={switchModeHandler}>
					{isLoginMode ? "Sign Up" : "Log In"}
				</Button>
			</Card>
		</React.Fragment>
	);
};

export default Auth;
