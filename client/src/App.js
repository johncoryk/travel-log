import React, { useState, useEffect } from 'react';
import ReactMapGL, { Marker, Popup } from 'react-map-gl';

import { listLogEntries } from './API';
import LogEntryForm from './LogEntryForm';

const App = () => {
	const [logEntries, setLogEntries] = useState([]);
	const [showPopup, setShowPopup] = useState({});
	const [addEntryLocation, setAddEntryLocation] = useState(null);
	const [viewport, setViewport] = useState({
		width: '100vw',
		height: '100vh',
		latitude: 37.6,
		longitude: -95.665,
		zoom: 4,
	});

	const getEntries = async () => {
		const logEntries = await listLogEntries();
		setLogEntries(logEntries);
	};

	useEffect(() => {
		getEntries();
	}, []);

	const showAddMarkerPopup = e => {
		const [longitude, latitude] = e.lngLat;
		setAddEntryLocation({
			latitude,
			longitude,
		});
	};

	return (
		<ReactMapGL
			{...viewport}
			mapStyle='mapbox://styles/johncoryk/cka84wmx41qk21iquegkujpg5'
			mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
			onViewportChange={nextViewport => setViewport(nextViewport)}
			onDblClick={showAddMarkerPopup}
		>
			{logEntries.map(entry => (
				<React.Fragment key={entry._id}>
					<Marker latitude={entry.latitude} longitude={entry.longitude}>
						<div
							onClick={() =>
								setShowPopup({
									[entry._id]: true,
								})
							}
						>
							<svg
								className='mapMarker'
								style={{
									width: `${6 * viewport.zoom}px`,
									height: `${6 * viewport.zoom}px`,
								}}
								viewBox='0 0 24 24'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
								<circle cx='12' cy='10' r='3'></circle>
							</svg>
						</div>
					</Marker>
					{showPopup[entry._id] ? (
						<Popup
							latitude={entry.latitude}
							longitude={entry.longitude}
							dynamicPosition={true}
							closeButton={true}
							closeOnClick={false}
							onClose={() => setShowPopup({})}
							anchor='top'
						>
							<div className='popup'>
								<h3>{entry.title}</h3>
								<p>{entry.comments}</p>
								<i>
									<small>
										Visited on: {new Date(entry.visitDate).toLocaleDateString()}
									</small>
								</i>
							</div>
						</Popup>
					) : null}
				</React.Fragment>
			))}
			{addEntryLocation ? (
				<>
					<Marker
						latitude={addEntryLocation.latitude}
						longitude={addEntryLocation.longitude}
					>
						<div>
							<svg
								className='mapEntryMarker'
								style={{
									width: `${6 * viewport.zoom}px`,
									height: `${6 * viewport.zoom}px`,
								}}
								viewBox='0 0 24 24'
								strokeWidth='2'
								strokeLinecap='round'
								strokeLinejoin='round'
							>
								<path d='M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z'></path>
								<circle cx='12' cy='10' r='3'></circle>
							</svg>
						</div>
					</Marker>
					<Popup
						latitude={addEntryLocation.latitude}
						longitude={addEntryLocation.longitude}
						dynamicPosition={true}
						closeButton={true}
						closeOnClick={false}
						onClose={() => setAddEntryLocation(null)}
						anchor='top'
					>
						<div className='popup'>
							<LogEntryForm
								onClose={() => {
									setAddEntryLocation(null);
									getEntries();
								}}
								location={addEntryLocation}
							/>
						</div>
					</Popup>
				</>
			) : null}
		</ReactMapGL>
	);
};

export default App;
