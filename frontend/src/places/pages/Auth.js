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

import "./Auth.css";

const Auth = () => {
	const auth = useContext(AuthContext);

	const [isLoginMode, setIsLoginMode] = useState(true);

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
		} else {
			try {
				const response = await fetch("http://localhost:5000/api/users/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						name: formState.inputs.name.value,
						email: formState.inputs.email.value,
						password: formState.inputs.password.value,
					}),
				});

				const responseData = await response.json();

				console.log(responseData);
			} catch (err) {}
		}
		auth.login();
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
		<Card>
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
	);
};

export default Auth;
