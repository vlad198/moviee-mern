const express = require('express');
const connectDB = require('./config/db');
const RegisterRouter = require('./routers/RegisterRouter');
const LoginRouter = require('./routers/LoginRouter');

const app = express();

connectDB();

app.use(express.json({extended : true}));

app.use('/register',RegisterRouter);
app.use('/login',LoginRouter);

const PORT = process.env.PORT;

app.listen(PORT,() => console.log(`Server started at port ${PORT}`));
