const API_URL =
	window.location.hostname === 'localhost'
		? 'http://localhost:5000'
		: 'https://travel-log-jck.now.sh/';

export async function listLogEntries() {
	const response = await fetch(`${API_URL}/api/logs`);
	return response.json();
}

export async function createLogEntry(entry) {
	const apiKey = entry.apiKey;
	delete entry.apiKey;
	const response = await fetch(`${API_URL}/api/logs`, {
		method: 'POST',
		mode: 'cors',
		cache: 'no-cache',
		headers: {
			'content-type': 'application/json',
			'X-API-KEY': apiKey,
		},
		body: JSON.stringify(entry),
	});
	let json;
	if (response.headers.get('content-type').includes('text/html')) {
		const message = await response.text();
		json = {
			message,
		};
	} else {
		json = await response.json();
	}
	if (response.ok) {
		return json;
	}
	const error = new Error(json.message);
	error.response = json;
	throw error;
}
