const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const { notFound, errorHandler } = require('./middlewares');
const logs = require('./api/logs');

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

app.use(morgan('common'));
app.use(helmet());
app.use(
	cors({
		origin: process.env.CORS_ORIGIN,
	})
);

app.use(express.json());

app.get('/', (req, res) => {
	res.json({
		message: 'Hello World!',
	});
});

app.use('/api/logs', logs);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 5000;
app.listen(port, () => {
	console.log(`Listening on port ${port}`);
});
