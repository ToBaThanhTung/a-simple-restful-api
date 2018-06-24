const jwt = require('jsonwebtoken');


module.exports = (req, res, next) =>{
	try {
		const token = req.headers.authorization.split(" ")[1];
		console.log("token", token);
		const decoded = jwt.verify(token, 'secret');
		req.userData = decoded;
		next();
	} catch(err) {
		res.status(401).json({
			message: 'Auth failed'
		});
	}
};