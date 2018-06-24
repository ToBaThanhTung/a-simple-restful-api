const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Order = require('../model/order');
const Product = require('../model/products');
const checkAuth = require('../middleware/check-auth');


router.get('/', (req, res, next) =>{
	Order.find()
		.select("productId quantity _id")
		.populate('productId')
		.exec()
		.then(docs => {
			res.status(200).json({
				count: docs.length,
				orders: docs.map(doc => {
					return {
						_id: doc.id,
						product: doc.productId,
						quantity: doc.quantity,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/order' + doc._id
						}
					}
				})

			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});
 
router.post('/', (req, res, next) =>{
	Product.findById(req.body.productId)
		.then(product => {
			if(!product) {
				return res.status(404).json({
					message: "Product not found"
				});
			}
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				quantity: req.body.quantity,
				productId: req.body.productId
			});		
			return order.save();
		})
		.then(result =>{
			console.log(result);
			res.status(201).json({
				message: 'order stored',
				createdOrder: {
					_id: result.id,
					product: result.product,
					quantity: result.quantity
				},
				request: {
					type: 'GET',
					url: 'http://localhost:3000/order' + result.id
				}
			})	
		})		
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});	
		});						
});

router.get('/:orderId', (req, res, next) =>{
	Order.findById(req.params.orderId)
		.exec()
		.populate('productId')
		.then(order => {
			if(!order){
				return res.status(404).json({
					message: "order not found"
				});
			}
			res.status(200).json({
				order: order,
				request: {
					type: 'GET',
					url: 'http://localhost:3000/order' 
				}
			});
		})
		.catch(err => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
});


router.delete('/:orderId', checkAuth,  (req, res, next) =>{
	Order.findOneAndRemove({_id: req.params.orderId})
		.exec()
		.then(result =>{
			res.status(200).json({
				message: 'order deleted',
				request: {
					type: 'POST',
					url: 'http://localhost:3000/order',
					body: { productId: "ID", quantity: "Number"}
				}
			});
		})
		.catch(err => {
			res.status(500).json({
				error: err
			});
		});
});


module.exports = router;