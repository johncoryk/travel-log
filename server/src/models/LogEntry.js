const mongoose = require('mongoose');

const { Schema } = mongoose;

const requiredNumber = {
	type: Number,
	required: true,
};

const logEntrySchema = new Schema(
	{
		title: {
			type: String,
			required: true,
		},
		description: String,
		comments: String,
		image: String,
		rating: {
			type: Number,
			min: 0,
			max: 10,
			defaut: 0,
		},
		latitude: {
			...requiredNumber,
			min: -89.9,
			max: 89.9,
		},
		longitude: {
			...requiredNumber,
			min: -179.9,
			max: 179.9,
		},
		visitDate: {
			required: true,
			type: Date,
			default: Date.now,
		},
	},
	{
		timestamps: true,
	}
);

const LogEntry = mongoose.model('LogEntry', logEntrySchema);

module.exports = LogEntry;
