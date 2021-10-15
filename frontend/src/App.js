import React, { useCallback, useState } from "react";
import {
	BrowserRouter as Router,
	Route,
	Redirect,
	Switch,
} from "react-router-dom";

import Users from "./user/pages/Users";
import NewPlace from "./places/pages/NewPlace";
import UserPlaces from "./places/pages/UserPlaces";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UpdatePlace from "./places/pages/UpdatePlace";
import Auth from "./places/pages/Auth";
import { AuthContext } from "./shared/context/auth-context";

const App = () => {
	const [isLoggedIn, setisLoggedin] = useState(false);

	const login = useCallback(() => {
		setisLoggedin(true);
	}, []);

	const logout = useCallback(() => {
		setisLoggedin(false);
	}, []);

	let routes;

	if (isLoggedIn) {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Users />
				</Route>
				<Route path="/:userId/places" exact>
					<UserPlaces />
				</Route>
				<Route path="/places/new" exact>
					<NewPlace />
				</Route>
				<Route path="/places/:placeId" exact>
					<UpdatePlace />
				</Route>
				<Redirect to="/" />
			</Switch>
		);
	} else {
		routes = (
			<Switch>
				<Route path="/" exact>
					<Users />
				</Route>
				<Route path="/:userId/places" exact>
					<UserPlaces />
				</Route>
				<Route path="/auth" exact>
					<Auth />
				</Route>
				<Redirect to="/auth" />
			</Switch>
		);
	}

	return (
		<AuthContext.Provider
			value={{ isLoggedIn: isLoggedIn, login: login, logout: logout }}
		>
			<Router>
				<MainNavigation />
				<main>{routes}</main>
			</Router>
		</AuthContext.Provider>
	);
};

export default App;