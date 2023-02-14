const bcrypt = require('bcrypt');
const usersRouter = require('express').Router();
const User = require('../models/User');

usersRouter.get('/', (request, response) => {
    User
        .find({})
        .populate('notes')
        .then(allUsers => response.json(allUsers));
});

usersRouter.post('/', (request, response) => {
    const { name, username, password } = request.body;
    const saltRounds = 10;
    bcrypt
        .hash(password, saltRounds)
        .then(passwordHash => {
            const user = new User({
                name,
                username,
                passwordHash
            });
            user
                .save()
                .then(savedUser => response.json(savedUser));
        });
});

module.exports = usersRouter;