require('dotenv').config() //import dotenv and configuring to be able to use
const jwt = require('jsonwebtoken')
const {SECRET} = process.env //secret comes from .env file

module.exports = {
    isAuthenticated: (req, res, next) => {
        const headerToken = req.get('Authorization')

        if (!headerToken) { //if token is null send error status code
            console.log('ERROR IN auth middleware')
            res.sendStatus(401)
        }

        let token

        try {
            token = jwt.verify(headerToken, SECRET) //token is generated if jwt is verified
        } catch (err) {
            err.statusCode = 500
            throw err
        }

        if (!token) { // if token is not there, throw error
            const error = new Error('Not authenticated.')
            error.statusCode = 401
            throw error
        }

        next()
    }
}