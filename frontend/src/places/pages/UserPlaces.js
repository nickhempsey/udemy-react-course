import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useHttpClient } from "../../hooks/http-hook";

import PlaceList from "../components/PlaceList";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

const UserPlaces = () => {
	const { isLoading, error, sendRequest, clearError } = useHttpClient();
	const [loadedUserPlaces, setLoadedUserPlaces] = useState(false);
	const userId = useParams().userId;

	useEffect(() => {
		const fetchPlaces = async () => {
			try {
				const responseData = await sendRequest(
					`http://localhost:5000/api/places/user/${userId}`
				);
				console.log(responseData);
				setLoadedUserPlaces(responseData.places);
			} catch (err) {}
		};

		fetchPlaces();
	}, [sendRequest, userId]);

	return (
		<React.Fragment>
			<ErrorModal error={error} onClear={clearError} />
			{isLoading && (
				<div className="center">
					<LoadingSpinner asOverlay />
				</div>
			)}
			{!isLoading && loadedUserPlaces && <PlaceList items={loadedUserPlaces} />}
		</React.Fragment>
	);
};

export default UserPlaces;
