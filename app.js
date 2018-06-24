const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/order');
const userRoutes = require('./routes/user');
// middleware

mongoose.connect('mongodb://thanhtung:%40bietdoi2@cluster0-shard-00-00-soeib.mongodb.net:27017,cluster0-shard-00-01-soeib.mongodb.net:27017,cluster0-shard-00-02-soeib.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extend: false}));
app.use(bodyParser.json());


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});


app.use('/products', productRoutes);
app.use('/order', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) =>{
	const error = new Error('Not found');
	error.status = 404;
	next(error);
});
app.use((error, req, res, next) =>{
	res.status(error.status || 500);
	res.json({
		error: {
			message: error.message
		}
	})
});
module.exports = app;