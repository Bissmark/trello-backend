const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect(process.env.DATABASE_URL);

mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());

app.use('/users', require('./routes/users'));
app.use('/lists', require('./routes/lists'));
app.use('/cards', require('./routes/cards'));
app.use('/boards', require('./routes/boards'));

const port = process.env.PORT || 3001;

app.listen(port, function () {
    console.log(`Express running on http://localhost:${ port }`);
});
