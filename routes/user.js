const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get('/', (req, res, next) =>{
	User.find()
		.exec()
		.then(result => {
			res.status(200).json(result);
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});

router.post('/signup', (req, res, next) =>{
	User.find({email: req.body.email})
		.exec()
		.then(user => {
			if(user.length >= 1){
				return res.status(500).json({
					message: "email exists"
				});
			}
			else {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					if(err){
						return res.status(500).json({
							error: err
						});
					}
					else {
						const user = new User({
							_id: new mongoose.Types.ObjectId(),
							email: req.body.email,
							password: hash 			
						});
							
						user
						 .save()
						 .then(result => {
							console.log('create new user', user);
							 res.status(201).json({
							 	message: 'User created'
							 });
						 })
						 .catch(err => {
							console.log(err);
							res.status(500).json({
							 	error: err
							 });
						 });
					}			
				});
			}
		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});


router.post('/login', (req, res, next) =>{
	User.find({email: req.body.email})
		.exec()
		.then(user =>{
			if(user.length < 1){
				return res.status(401).json({
					message: "Auth failed"
				});
			}
			bcrypt.compare(req.body.password, user[0].password, (err, result) => {
				if(err){
					return res.status(401).json({
						message: "Auth failed"
					});
				}
				if(result){
					const token = jwt.sign(
						{	
							email: user[0].email,
							password: user[0].password
						}, 
						'secret',
						{ expiresIn: '1h'}
					);
					return res.status(200).json({
						message: "Auth successful",
						token: token
					});
				}
				return res.status(401).json({
					message: "Auth failed"
				});
			});

		})
		.catch(err =>{
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});

router.delete('/:userId', (req, res, next) =>{
	User.findOneAndRemove({_id: req.params.userId})
		.exec()
		.then(result =>{
			res.status(200).json({
				message: 'deleted user'
			});
		})
		.catch(err =>{
			res.status(500).json({
				error: err
			});
		});
});

	
module.exports = router;