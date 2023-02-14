const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const config = require('../utils/config');
const User = require('../models/User');

loginRouter.post('/', (request, response) => {
    const { username, password } = request.body;
    User
        .findOne({username})    
        .then(user => {
            if (user === null) {
                return response.status(401).json({ error: 'invalid username' })
            };
            bcrypt
                .compare(password, user.passwordHash)
                .then(result => {
                    if (!result) {
                        return response.status(401).json({ error: 'invalid password' });
                    };
                    const userForToken = {
                        username: user.username,
                        id: user._id
                    };
                    const token = jwt.sign(userForToken, config.JWT_SECRET);
                    response.json({
                        token,
                        name: user.name,
                        username: user.username
                    });
                });
        });
});

module.exports = loginRouter;