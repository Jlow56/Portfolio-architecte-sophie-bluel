const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
	try {

		const authHeader = req.headers.authorization

		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({
				error: 'Authentication failed'
			})
		}

		const token = authHeader.split(' ')[1]

		const decodedToken = jwt.verify(
			token,
			process.env.TOKEN_SECRET,
			{
				algorithms: ['HS256']
			}
		)

		req.auth = {
			userId: decodedToken.userId
		}

		next()

	} catch (error) {
		return res.status(401).json({
			error: 'Invalid token'
		})
	}
}
