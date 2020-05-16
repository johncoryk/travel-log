import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import { createLogEntry } from './API';

const LogEntryForm = ({ location, onClose }) => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const { register, handleSubmit } = useForm();

	const onSubmit = async data => {
		try {
			setLoading(true);
			data.latitude = location.latitude;
			data.longitude = location.longitude;
			const created = await createLogEntry(data);
			console.log(created);
			onClose();
		} catch (error) {
			console.log(error);
			setError(error.message);
			setLoading(false);
		}
	};

	return (
		<>
			{error && <h3 className='error'>{error}</h3>}
			<h3>Add your new log entry here:</h3>
			<form onSubmit={handleSubmit(onSubmit)} className='entryForm'>
				<label htmlFor='apiKey'>Password</label>
				<input type='password' name='apiKey' required ref={register} />
				<label htmlFor='title'>Title</label>
				<input name='title' required ref={register} />
				<label htmlFor='comments'>Comments</label>
				<textarea name='comments' rows={3} ref={register}></textarea>
				<label htmlFor='description'>Description</label>
				<textarea name='description' rows={3} ref={register}></textarea>
				<label htmlFor='image'>Image URL</label>
				<input name='image' ref={register} />
				<label htmlFor='visitDate'>Visit Date</label>
				<input name='visitDate' type='date' required ref={register} />
				<button disabled={loading} type='submit'>
					{loading ? 'Loading...' : 'Create Entry'}
				</button>
			</form>
		</>
	);
};

export default LogEntryForm;
