require('dotenv').config();

const mongoose = require('mongoose');

const url = process.env.DATABASE;

const connectDB = async () => {
    try {
        await mongoose.connect(url, { useUnifiedTopology: true, useFindAndModify: false, useNewUrlParser: true, useCreateIndex: true });
        console.log('Connected to MongoDB');
    } catch (err) {
        console.log(err.message);
    }
}

module.exports = connectDB;